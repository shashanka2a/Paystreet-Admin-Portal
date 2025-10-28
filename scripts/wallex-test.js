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

const BASE_URL = getEnv('REACT_APP_WALLEX_BASE_URL', getEnv('NEXT_PUBLIC_WALLEX_BASE_URL', 'https://api-sg.wallex.plus'))
const API_KEY = getEnv('REACT_APP_WALLEX_API_KEY', getEnv('NEXT_PUBLIC_WALLEX_API_KEY', ''))
const ACCESS_KEY_ID = getEnv('REACT_APP_WALLEX_ACCESS_KEY_ID', getEnv('NEXT_PUBLIC_WALLEX_ACCESS_KEY_ID', ''))
const SECRET_ACCESS_KEY = getEnv('REACT_APP_WALLEX_SECRET_ACCESS_KEY', getEnv('NEXT_PUBLIC_WALLEX_SECRET_ACCESS_KEY', ''))

function redact(v, keep = 6) {
  if (!v) return ''
  if (v.length <= keep) return '*'.repeat(v.length)
  return v.slice(0, keep) + '...' + '*'.repeat(Math.max(0, v.length - keep - 3))
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
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
    return { ok: res.ok, status: res.status, data }
  } catch (e) {
    return { ok: false, status: undefined, data: e.message || String(e) }
  } finally {
    clearTimeout(id)
  }
}

async function tryGet(pathname, headers = {}) {
  return fetchWithTimeout(BASE_URL + pathname, { method: 'GET', headers }, 15000)
}

async function tryPost(pathname, body, headers = {}) {
  return fetchWithTimeout(
    BASE_URL + pathname,
    { method: 'POST', headers, body: JSON.stringify(body) },
    15000
  )
}

async function main() {
  console.log('Wallex test start')
  console.log('Base URL:', BASE_URL)
  console.log('X-Api-Key:', API_KEY ? redact(API_KEY) : '(none)')
  console.log('AccessKeyId:', ACCESS_KEY_ID ? redact(ACCESS_KEY_ID) : '(none)')
  console.log('SecretAccessKey:', SECRET_ACCESS_KEY ? redact(SECRET_ACCESS_KEY) : '(none)')

  const commonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  if (API_KEY) commonHeaders['X-Api-Key'] = API_KEY

  // 1) Try simple public/status-like endpoints
  const candidates = ['/v1/status', '/status', '/v1/ping', '/ping', '/v1/health', '/health', '/v1/version', '/version']
  for (const p of candidates) {
    const r = await tryGet(p, commonHeaders)
    console.log(`[GET ${p}] ->`, r.status, r.ok ? 'OK' : 'FAIL')
    if (!r.ok && r.data) console.log('  details:', typeof r.data === 'string' ? r.data : JSON.stringify(r.data))
  }

  // Try with X-Api-Key in different header names
  const apiKeyHeaders = [
    { ...commonHeaders, 'X-Api-Key': API_KEY },
    { ...commonHeaders, 'X-API-Key': API_KEY },
    { ...commonHeaders, 'Authorization': `Bearer ${API_KEY}` },
    { ...commonHeaders, 'Authorization': `ApiKey ${API_KEY}` },
    { ...commonHeaders, 'X-Auth-Token': API_KEY },
  ]
  
  for (const headers of apiKeyHeaders) {
    const r = await tryGet('/v1/status', headers)
    console.log(`[GET /v1/status with ${Object.keys(headers).filter(k => k !== 'Accept' && k !== 'Content-Type').join(',')}] ->`, r.status, r.ok ? 'OK' : 'FAIL')
    if (r.ok) {
      console.log('  SUCCESS! Found working auth method')
      break
    }
  }

  // 2) Try Wallex authentication endpoint as per official docs
  const authEndpoint = '/users/v1/authenticate'
  const authBody = { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY }
  const authHeaders = {
    ...commonHeaders,
    'X-Api-Key': API_KEY
  }
  let token = ''
  if (ACCESS_KEY_ID && SECRET_ACCESS_KEY && API_KEY) {
    const r = await tryPost(authEndpoint, authBody, authHeaders)
    console.log(`[POST ${authEndpoint}] ->`, r.status, r.ok ? 'OK' : 'FAIL')
    if (!r.ok && r.data) console.log('  details:', typeof r.data === 'string' ? r.data : JSON.stringify(r.data))
    if (r.ok) {
      const d = typeof r.data === 'string' ? {} : r.data
      token = d?.token || d?.access_token || d?.accessToken
      console.log('  SUCCESS! Received token:', token ? redact(token) : 'No token in response')
    }
  } else {
    console.log('Missing credentials for authentication')
  }

  if (token) {
    console.log('Testing protected endpoints with token...')
    const protectedHeaders = { 
      ...commonHeaders, 
      'X-Api-Key': API_KEY,
      'Authorization': `Bearer ${token}` 
    }
    const protectedCandidates = ['/users/v1/balances', '/users/v1/accounts', '/users/v1/rates', '/collections/v1', '/payments/v1']
    for (const p of protectedCandidates) {
      const r = await tryGet(p, protectedHeaders)
      console.log(`[GET ${p} with token] ->`, r.status, r.ok ? 'OK' : 'FAIL')
      if (!r.ok && r.data) console.log('  details:', typeof r.data === 'string' ? r.data : JSON.stringify(r.data))
      else if (r.ok) {
        const d = typeof r.data === 'string' ? { body: r.data } : r.data
        console.log('  keys:', Object.keys(d || {}))
      }
    }
  } else {
    console.log('No token obtained. Check credentials and try again.')
  }

  console.log('Wallex test done')
}

main().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})
