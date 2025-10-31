#!/usr/bin/env node

// Lightweight Wallex docs scraper (no headless browser)
// Usage: node scripts/scrape-wallex-docs-fetch.js

const fs = await import('fs/promises')

const BASE_URL = 'https://docs.wallex.asia/docs'

const ROUTES = [
  '/intro',
  '/api/authentication/authenticate',
  '/api/authentication/logout',
  '/api-docs/users',
  '/api/users/sign-up',
  '/api/users/users-listing',
  '/api/users/user-retrieve',
  '/api/users/user-detail-retrieve',
  '/api/users/user-detail-update',
  '/api/users/company-retrieve',
  '/api/users/company-update',
  '/api/users/customer-due-diligence-retrieve',
  '/api/users/customer-due-diligence-update',
  '/api/users/entity-types-listing',
  '/api/users/products-usage-listing',
  '/api/users/document-create',
  '/api/users/document-retrieve',
  '/api/users/document-delete',
  '/api/users/documents-listing',
  '/api/users/user-screening',
  '/api/users/user-webhook',
  '/api/currencies/currency-rates',
  '/api/currencies/currencies-listing',
  '/api/balances/balances-listing',
  '/api/balances/balance-retrieve-by-currency',
  '/api/balances/balance-retrieve-by-id',
  '/api/balances/balances-history-listing',
  '/api/funding/funding-retrieve',
  '/api/funding/funding-listing',
  '/api/funding/funding-webhook',
  '/api/deductions/deduction-retrieve',
  '/api/deductions/deductions-listing',
  '/api/deductions/deduction-webhook',
  '/api-docs/collections',
  '/api/collections/collection-account-create',
  '/api/collections/collection-account-retrieve',
  '/api/collections/collection-accounts-listing',
  '/api/collections/collection-account-webhook',
  '/api/collections-request/purpose-codes-listing',
  '/api/collections-request/collection-request-create',
  '/api/collections-request/collection-request-paid',
  '/api/collections-request/collection-request-cancel',
  '/api/collections-request/collection-request-retrieve',
  '/api/collections-request/collections-request-listing',
  '/api/collections-request/collection-request-webhook',
  '/api/collections/supported-currencies',
  '/api/collections/collection-upload-url',
  '/api/collections/collection-retrieve',
  '/api/collections/collections-listing',
  '/api/collections/collection-webhook',
  '/api-docs/conversions',
  '/api/conversions/conversion-quote',
  '/api/conversions/conversion-create',
  '/api/conversions/conversion-fund',
  '/api/conversions/conversion-retrieve',
  '/api/conversions/conversions-listing',
  '/api/conversions/conversion-webhook',
  '/api/beneficiaries/beneficiary-requirement',
  '/api/beneficiaries/beneficiary-validation',
  '/api/beneficiaries/beneficiary-create',
  '/api/beneficiaries/beneficiary-retrieve',
  '/api/beneficiaries/beneficiary-delete',
  '/api/beneficiaries/beneficiaries-listing',
  '/api/beneficiaries/china-banks-listing',
  '/api/beneficiaries/states-listing',
  '/api/beneficiaries/cities-listing',
  '/api/beneficiaries/swift-validation',
  '/api-docs/payments',
  '/api/payments/payment-channels',
  '/api/payments/purpose-of-transfer',
  '/api/payments/payment-quote',
  '/api/payments/payment-upload-url',
  '/api/payments/payment-create',
  '/api/payments/payment-fund',
  '/api/payments/payment-retrieve',
  '/api/payments/payments-listing',
  '/api/payments/payment-docs',
  '/api/payments/payment-webhook',
  '/api-docs/webhooks',
  '/api/webhooks/webhook-update',
  '/api/webhooks/webhook-retrieve',
  '/api/utils/business-types-listing',
  '/api/utils/file-upload',
]

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return m ? decodeEntities(m[1].trim()) : ''
}

function stripTags(html) {
  // remove scripts/styles
  html = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  // convert breaks/headings to newlines
  html = html.replace(/<(?:br|p|div|h[1-6]|li|section|article)\b[^>]*>/gi, '\n')
  // remove all tags
  html = html.replace(/<[^>]+>/g, ' ')
  // collapse whitespace
  return decodeEntities(html).replace(/\s+/g, ' ').trim()
}

function decodeEntities(text) {
  const map = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" }
  return text.replace(/&(amp|lt|gt|quot|#39);/g, (m) => map[m] || m)
}

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'PaystreetDocsScraper/1.0',
      'Accept': 'text/html,application/xhtml+xml',
    },
  })
  const html = await res.text()
  return { status: res.status, html }
}

async function main() {
  const results = []
  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`
    console.log(`→ Fetching ${url}`)
    try {
      const { status, html } = await fetchPage(url)
      if (status >= 200 && status < 300) {
        const title = extractTitle(html)
        const text = stripTags(html)
        results.push({ route, url, title, text })
      } else {
        results.push({ route, url, error: `HTTP ${status}` })
      }
    } catch (e) {
      results.push({ route, url, error: e.message })
    }
    await sleep(300) // be polite
  }
  await fs.writeFile('scraped_data.json', JSON.stringify(results, null, 2), 'utf8')
  console.log('✅ Scrape complete! Data written to scraped_data.json')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


