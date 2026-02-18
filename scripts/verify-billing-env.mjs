#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const EXPECTED_PRODUCT_ID = 'prod_TxJIELH1qRihyq';
const EXPECTED_PRICE_ID = 'price_1SzOg2Fs5YLnaPiWrFezCPyh';
const REQUIRED_KEYS = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_PRO',
  'NEXT_PUBLIC_APP_URL',
];

const WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_failed',
  'invoice.payment_succeeded',
  'invoice.paid',
];

function loadEnvFile(fileName) {
  const fullPath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(fullPath)) return;

  const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/g);
  for (const line of lines) {
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile('.env.local');

const configuredProduct = process.env.STRIPE_PRODUCT_PRO || EXPECTED_PRODUCT_ID;
const configuredPrice = process.env.STRIPE_PRICE_PRO || EXPECTED_PRICE_ID;

const missing = REQUIRED_KEYS.filter((key) => {
  const value = process.env[key];
  return !value || /placeholder|replace_with/i.test(value);
});

const productMatch = configuredProduct === EXPECTED_PRODUCT_ID;
const priceMatch = configuredPrice === EXPECTED_PRICE_ID;

console.log('Billing environment verification');
console.log('--------------------------------');
for (const key of REQUIRED_KEYS) {
  const value = process.env[key];
  const ok = Boolean(value && !/placeholder|replace_with/i.test(value));
  console.log(`${ok ? 'OK  ' : 'MISS'} ${key}`);
}
console.log(`${productMatch ? 'OK  ' : 'WARN'} STRIPE_PRODUCT_PRO=${configuredProduct}`);
console.log(`${priceMatch ? 'OK  ' : 'WARN'} STRIPE_PRICE_PRO=${configuredPrice}`);
console.log('');
console.log('Webhook endpoint: /api/stripe/webhook');
console.log('Required webhook events:');
for (const eventName of WEBHOOK_EVENTS) {
  console.log(`  - ${eventName}`);
}

if (missing.length > 0 || !productMatch || !priceMatch) {
  console.error('');
  console.error('Billing verification failed.');
  process.exit(1);
}

console.log('');
console.log('Billing verification passed.');
