#!/usr/bin/env node

// Wallex API test script
// Usage: node wallex-test.js
// Reads credentials from .env (preferred), .env.local, or process.env

const fs = require('fs')
const path = require('path')

function loadDotEnvFile(filename) {
  const envPath = path.join(process.cwd(), filename)
  if (!fs.existsSync(envPath)) return {}
  const raw = fs.readFileSync(envPath, 'utf8')
  const lines = raw.split(/\r?\n/)
  const out = {}
  for (const line of lines) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) out[m[1].trim()] = m[2].trim()
  }
  return out
}

const envFromDotEnv = loadDotEnvFile('.env')
const envFromDotEnvLocal = loadDotEnvFile('.env.local')
const getEnv = (k, def = '') => process.env[k] || envFromDotEnv[k] || envFromDotEnvLocal[k] || def

const BASE_URL = getEnv('REACT_APP_WALLEX_BASE_URL', getEnv('NEXT_PUBLIC_WALLEX_BASE_URL', 'https://api.wallex.asia'))
const API_KEY = getEnv('REACT_APP_WALLEX_API_KEY', getEnv('NEXT_PUBLIC_WALLEX_API_KEY', ''))
const ACCESS_KEY_ID = getEnv('REACT_APP_WALLEX_ACCESS_KEY_ID', getEnv('NEXT_PUBLIC_WALLEX_ACCESS_KEY_ID', ''))
const SECRET_ACCESS_KEY = getEnv('REACT_APP_WALLEX_SECRET_ACCESS_KEY', getEnv('NEXT_PUBLIC_WALLEX_SECRET_ACCESS_KEY', ''))
const TX_PATH = getEnv('WALLEX_TRANSACTIONS_PATH', '/v2/payments')

function redact(v, keep = 6) {
  if (!v) return ''
  if (v.length <= keep) return '*'.repeat(v.length)
  return v.slice(0, keep) + '...' + '*'.repeat(Math.max(0, v.length - keep - 3))
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    const contentType = res.headers.get('content-type') || ''
    let data
    if (contentType.includes('application/json')) {
      data = await res.json()
    } else {
      data = await res.text()
    }
    return { ok: res.ok, status: res.status, statusText: res.statusText, data }
  } catch (e) {
    return { ok: false, status: undefined, statusText: 'ERROR', data: e.message || String(e) }
  } finally {
    clearTimeout(id)
  }
}

async function tryGet(pathname, headers = {}) {
  return fetchWithTimeout(BASE_URL + pathname, { method: 'GET', headers }, 20000)
}

async function tryPost(pathname, body, headers = {}) {
  return fetchWithTimeout(
    BASE_URL + pathname,
    { method: 'POST', headers, body: JSON.stringify(body) },
    20000
  )
}

async function authenticateV2() {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Api-Key': API_KEY,
  }
  const body = { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY }
  const r = await tryPost('/v2/authenticate', body, headers)
  if (!r.ok) throw new Error(`Auth failed: ${r.status} ${typeof r.data === 'string' ? r.data : JSON.stringify(r.data)}`)
  const d = typeof r.data === 'string' ? {} : r.data
  return d.token || d.accessToken
}

async function testCollections(token) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Api-Key': API_KEY,
    'Authorization': `Bearer ${token}`,
  }
  const qs = 'pagination[page]=1&pagination[limit]=20'
  const r = await tryGet(`/v2/collections/accounts?${qs}`, headers)
  if (r.ok) {
    console.log(`✅ [GET /v2/collections/accounts] ->`, r.status, 'OK')
    const d = typeof r.data === 'string' ? {} : r.data
    const rows = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []
    console.log('   count:', rows.length)
  } else {
    const body = typeof r.data === 'string' ? r.data : JSON.stringify(r.data)
    if (r.status === 400 && body.includes('NOT_AUTHORIZED')) {
      console.log('ℹ️  /v2/collections/accounts requires additional permissions. Skipping.')
    } else {
      console.log('❌ [GET /v2/collections/accounts] ->', r.status, r.statusText)
      console.log('   details:', body)
    }
  }
}

async function testTransactions(token) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Api-Key': API_KEY,
    'Authorization': `Bearer ${token}`,
  }
  const candidates = [TX_PATH]
  for (const p of candidates) {
    const url = p.includes('?') ? p : `${p}?limit=10`
    const r = await tryGet(url, headers)
    if (r.ok) {
      console.log(`✅ [GET ${url}] ->`, r.status, 'OK')
      return true
    }
    if (r.status === 404) {
      console.log(`↪︎  ${url} not found (404), trying next candidate`)
      continue
    }
    console.log(`❌ [GET ${url}] ->`, r.status, r.statusText)
    console.log('   details:', typeof r.data === 'string' ? r.data : JSON.stringify(r.data))
    break
  }
  console.log('⚠️  No working transactions endpoint discovered. Set WALLEX_TRANSACTIONS_PATH in .env to override.')
  return false
}

async function main() {
  console.log('Wallex v2 test start')
  console.log('Base URL:', BASE_URL)
  console.log('X-Api-Key:', API_KEY ? redact(API_KEY) : '(none)')
  console.log('AccessKeyId:', ACCESS_KEY_ID ? redact(ACCESS_KEY_ID) : '(none)')
  console.log('SecretAccessKey:', SECRET_ACCESS_KEY ? redact(SECRET_ACCESS_KEY) : '(none)')

  if (!API_KEY || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    console.log('Missing credentials. Please set API key, accessKeyId, and secretAccessKey.')
    process.exit(1)
  }

  let token = ''
  try {
    token = await authenticateV2()
    console.log('✅ Authenticated via /v2/authenticate:', token ? redact(token) : '(no token)')
  } catch (e) {
    console.error('❌ Authentication error:', e.message)
    process.exit(1)
  }

  await testCollections(token)
  await testTransactions(token)

  console.log('Wallex test done')
}

main().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})
