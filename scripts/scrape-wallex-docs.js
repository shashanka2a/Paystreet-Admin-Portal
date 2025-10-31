#!/usr/bin/env node

// Headless browser scraper for Wallex docs using puppeteer (managed Chromium)
// Usage: node scripts/scrape-wallex-docs.js

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function delay(ms) { return new Promise(res => setTimeout(res, ms)) }

async function scrapeRoutes(baseUrl, routes) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-crash-reporter',
      '--no-service-autorun',
      '--password-store=basic',
      '--use-mock-keychain',
    ],
    userDataDir: path.join(process.cwd(), '.puppeteer-profile'),
    defaultViewport: { width: 1280, height: 900 },
  })

  const page = await browser.newPage()
  const results = []

  for (const route of routes) {
    const url = `${baseUrl}${route}`
    console.log(`→ Navigating to ${url}`)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
    await delay(1000)

    const data = await page.evaluate(() => ({
      title: document.title,
      text: document.body.innerText?.trim() || '',
      html: document.documentElement.outerHTML,
    }))

    results.push({ route, url, ...data })
  }

  await browser.close()
  const outPath = path.join(process.cwd(), 'scraped_data.json')
  await fs.writeFile(outPath, JSON.stringify(results, null, 2), 'utf8')
  console.log(`✅ Scrape complete! Data written to ${outPath}`)
}

const baseUrl = 'https://docs.wallex.asia/docs'
const routes = [
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

scrapeRoutes(baseUrl, routes).catch((err) => {
  console.error(err)
  process.exit(1)
})
