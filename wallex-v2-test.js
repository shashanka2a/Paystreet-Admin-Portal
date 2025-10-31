#!/usr/bin/env node

// Wallex v2 API Test Script
// Usage: node wallex-v2-test.js
// Uses correct v2 API endpoints with Bearer token authentication

const fs = require('fs')
const path = require('path')

function loadEnvFile(filename) {
  const p = path.join(__dirname, filename)
  if (!fs.existsSync(p)) return {}
  const raw = fs.readFileSync(p, 'utf8')
  const out = {}
  raw.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) out[m[1].trim()] = m[2].trim()
  })
  return out
}

const envDotEnv = loadEnvFile('.env')
const envLocal = loadEnvFile('.env.local')
const getEnv = (k, d='') => process.env[k] || envDotEnv[k] || envLocal[k] || d

const BASE_URL = getEnv('REACT_APP_WALLEX_BASE_URL', getEnv('NEXT_PUBLIC_WALLEX_BASE_URL', 'https://api.wallex.asia'))
const API_KEY = getEnv('REACT_APP_WALLEX_API_KEY', getEnv('NEXT_PUBLIC_WALLEX_API_KEY', ''))
const ACCESS_KEY_ID = getEnv('REACT_APP_WALLEX_ACCESS_KEY_ID', getEnv('NEXT_PUBLIC_WALLEX_ACCESS_KEY_ID', ''))
const SECRET_ACCESS_KEY = getEnv('REACT_APP_WALLEX_SECRET_ACCESS_KEY', getEnv('NEXT_PUBLIC_WALLEX_SECRET_ACCESS_KEY', ''))

function redact(v, keep = 8) {
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

async function authenticate() {
  try {
    console.log('🔐 Authenticating with Wallex v2 API...')
    
    const response = await fetchWithTimeout(`${BASE_URL}/v2/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': API_KEY
      },
      body: JSON.stringify({
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
      })
    }, 15000)
    
    if (!response.ok) {
      console.error('❌ Authentication failed:', response.status, response.data)
      throw new Error(`Authentication failed: ${response.status}`)
    }
    
    const token = response.data?.token || response.data?.accessToken
    console.log('✅ Authentication successful')
    console.log('Token:', token ? redact(token) : 'No token in response')
    return token
  } catch (error) {
    console.error('❌ Authentication error:', error.message)
    throw error
  }
}

async function testEndpoint(path, token) {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }, 15000)
    
    if (response.ok) {
      console.log(`✅ GET ${path}: ${response.status} ${response.statusText || 'OK'}`)
      const data = typeof response.data === 'string' ? {} : response.data
      if (data && typeof data === 'object') {
        console.log(`   Response keys: ${Object.keys(data).join(', ')}`)
      }
      return response.data
    } else {
      console.log(`❌ GET ${path}: ${response.status} ${response.statusText || 'FAIL'}`)
      console.log('   Error details:', typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
      return null
    }
  } catch (error) {
    console.log(`❌ GET ${path}: Error - ${error.message}`)
    return null
  }
}

async function main() {
  console.log('🚀 Wallex v2 API Test')
  console.log('Base URL:', BASE_URL)
  console.log('API Key:', API_KEY ? redact(API_KEY) : '(missing)')
  console.log('Access Key ID:', ACCESS_KEY_ID ? redact(ACCESS_KEY_ID) : '(missing)')
  console.log('Secret Access Key:', SECRET_ACCESS_KEY ? redact(SECRET_ACCESS_KEY) : '(missing)')
  console.log('')
  
  if (!API_KEY || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    console.log('❌ Missing required environment variables')
    process.exit(1)
  }

  try {
    const token = await authenticate()
    console.log('')

    console.log('🧪 Testing v2 API endpoints...')
    await testEndpoint('/v2/balances', token)
    await testEndpoint('/v2/beneficiaries', token)
    await testEndpoint('/v2/payments', token)

    // Collections accounts may require permissions
    await testEndpoint('/v2/collections/accounts', token)

    console.log('')
    console.log('🎉 Wallex v2 API test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

main().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})
