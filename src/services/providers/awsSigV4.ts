// Minimal AWS Signature V4 signer for browser (uses Web Crypto API)
// Designed for API Gateway execute-api service

export interface SigV4Config {
  accessKeyId: string
  secretAccessKey: string
  region: string // e.g. 'ap-southeast-1'
  service?: string // default 'execute-api'
}

export interface SignableRequest {
  method: string
  url: string // absolute URL
  headers: Record<string, string>
  body?: string
}

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let out = ''
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0')
  }
  return out
}

async function sha256(content: string): Promise<string> {
  const enc = new TextEncoder()
  const data = enc.encode(content)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return toHex(hash)
}

async function hmacSha256(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key instanceof Uint8Array ? key : new Uint8Array(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  return await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data))
}

async function getSignatureKey(secret: string, dateStamp: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate = await hmacSha256(new TextEncoder().encode('AWS4' + secret), dateStamp)
  const kRegion = await hmacSha256(kDate, region)
  const kService = await hmacSha256(kRegion, service)
  const kSigning = await hmacSha256(kService, 'aws4_request')
  return kSigning
}

function buildCanonicalQueryString(url: URL): string {
  const params = Array.from(url.searchParams.entries())
  params.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  return params
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

function normalizeHeaders(headers: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(headers)) {
    if (v === undefined || v === null) continue
    out[k.toLowerCase()] = String(v).trim()
  }
  return out
}

export async function signRequestSigV4(req: SignableRequest, cfg: SigV4Config): Promise<Record<string, string>> {
  const service = cfg.service || 'execute-api'
  const urlObj = new URL(req.url)
  const now = new Date()
  const amzDate = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '') + 'Z' // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8) // YYYYMMDD

  const headers = normalizeHeaders({
    host: urlObj.host,
    'x-amz-date': amzDate,
    ...req.headers,
  })

  // Ensure host and x-amz-date are present
  headers['host'] = urlObj.host
  headers['x-amz-date'] = amzDate

  const signedHeaderKeys = Object.keys(headers).sort()
  const signedHeaders = signedHeaderKeys.join(';')
  const canonicalHeaders = signedHeaderKeys.map((k) => `${k}:${headers[k]}`).join('\n') + '\n'

  // For API Gateway, UNSIGNED-PAYLOAD is acceptable
  const payloadHash = await sha256(req.body ?? '')

  const canonicalQueryString = buildCanonicalQueryString(urlObj)
  const canonicalRequest = [
    req.method.toUpperCase(),
    urlObj.pathname || '/',
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')

  const algorithm = 'AWS4-HMAC-SHA256'
  const credentialScope = `${dateStamp}/${cfg.region}/${service}/aws4_request`
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    await sha256(canonicalRequest),
  ].join('\n')

  const signingKey = await getSignatureKey(cfg.secretAccessKey, dateStamp, cfg.region, service)
  const signature = toHex(await hmacSha256(signingKey, stringToSign))

  const authorizationHeader = `${algorithm} Credential=${cfg.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return {
    ...headers,
    Authorization: authorizationHeader,
  }
}





