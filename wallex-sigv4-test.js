// Wallex SigV4 test script (Node.js)
// Usage: node wallex-sigv4-test.js

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const https = require('https')

function loadEnvFile(name) {
  const p = path.join(__dirname, name)
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

const BASE_URL = getEnv('REACT_APP_WALLEX_BASE_URL', getEnv('NEXT_PUBLIC_WALLEX_BASE_URL', 'https://api-sg.wallex.plus'))
const API_KEY = getEnv('REACT_APP_WALLEX_API_KEY', getEnv('NEXT_PUBLIC_WALLEX_API_KEY', ''))
const ACCESS_KEY_ID = getEnv('REACT_APP_WALLEX_ACCESS_KEY_ID', getEnv('NEXT_PUBLIC_WALLEX_ACCESS_KEY_ID', ''))
const SECRET_ACCESS_KEY = getEnv('REACT_APP_WALLEX_SECRET_ACCESS_KEY', getEnv('NEXT_PUBLIC_WALLEX_SECRET_ACCESS_KEY', ''))
const REGION = getEnv('REACT_APP_WALLEX_REGION', 'ap-southeast-1')
const SERVICE = 'execute-api'

function hmac(key, data) {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest()
}

function sha256Hex(data) {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex')
}

function getSignatureKey(secret, dateStamp, region, service) {
  const kDate = hmac('AWS4' + secret, dateStamp)
  const kRegion = hmac(kDate, region)
  const kService = hmac(kRegion, service)
  const kSigning = hmac(kService, 'aws4_request')
  return kSigning
}

function sign(method, urlString, headers = {}, body = '') {
  const url = new URL(urlString)
  const t = new Date()
  const amzDate = t.toISOString().replace(/[-:]/g, '').replace(/\..+/, '') + 'Z'
  const dateStamp = amzDate.slice(0, 8)

  const host = url.host
  const queryParams = Array.from(url.searchParams.entries()).sort(([a],[b]) => a<b?-1:a>b?1:0)
  const canonicalQuery = queryParams.map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')

  const baseHeaders = {
    host,
    'x-amz-date': amzDate,
    ...Object.fromEntries(Object.entries(headers).map(([k,v]) => [k.toLowerCase(), String(v)])),
  }
  if (API_KEY) baseHeaders['x-api-key'] = API_KEY

  const signedHeaderKeys = Object.keys(baseHeaders).sort()
  const canonicalHeaders = signedHeaderKeys.map((k) => `${k}:${baseHeaders[k]}`).join('\n') + '\n'
  const signedHeaders = signedHeaderKeys.join(';')
  const payloadHash = sha256Hex(body || '')
  const canonicalRequest = [
    method.toUpperCase(),
    url.pathname || '/',
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')

  const algorithm = 'AWS4-HMAC-SHA256'
  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n')

  const signingKey = getSignatureKey(SECRET_ACCESS_KEY, dateStamp, REGION, SERVICE)
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign, 'utf8').digest('hex')
  const authorization = `${algorithm} Credential=${ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return { headers: { ...baseHeaders, Authorization: authorization } }
}

function httpRequest(method, url, headers, body) {
  return new Promise((resolve) => {
    const u = new URL(url)
    const opts = {
      method,
      protocol: u.protocol,
      hostname: u.hostname,
      path: u.pathname + (u.search || ''),
      headers,
    }
    const req = https.request(opts, (res) => {
      let data = ''
      res.on('data', (d) => (data += d))
      res.on('end', () => resolve({ status: res.statusCode, data }))
    })
    req.on('error', (e) => resolve({ status: 0, data: e.message }))
    if (body) req.write(body)
    req.end()
  })
}

async function testSignedGet(pathname) {
  const url = BASE_URL + pathname
  const { headers } = sign('GET', url, { Accept: 'application/json' })
  const res = await httpRequest('GET', url, headers)
  console.log(`[GET ${pathname}] ->`, res.status, res.data?.slice(0, 200))
}

async function main() {
  console.log('Wallex SigV4 test')
  console.log('Base URL:', BASE_URL)
  if (!API_KEY || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    console.log('Missing env values for API_KEY/ACCESS_KEY_ID/SECRET_ACCESS_KEY')
    process.exit(1)
  }
  await testSignedGet('/wallets/v1/balances')
  await testSignedGet('/users/v1/accounts')
  await testSignedGet('/conversions/v1/quote')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})





