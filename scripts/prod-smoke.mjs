#!/usr/bin/env node

const baseUrl = (process.env.BSS_PROD_URL || 'https://brainstackstudio.com').replace(/\/$/, '');
const runLeadMutationCanary = process.env.BSS_RUN_LEAD_CANARY === '1';

let failed = false;

async function checkGet(name, path, expectedStatus = 200) {
  const url = `${baseUrl}${path}`;
  try {
    const response = await fetch(url, { redirect: 'follow' });
    if (response.status !== expectedStatus) {
      console.error(`FAIL: ${name} ${url} -> HTTP ${response.status} (expected ${expectedStatus})`);
      failed = true;
      return;
    }
    console.log(`OK  : ${name} ${url} -> HTTP ${response.status}`);
  } catch (error) {
    console.error(`FAIL: ${name} ${url} -> ${error instanceof Error ? error.message : String(error)}`);
    failed = true;
  }
}

async function checkPost(name, path, body, expectedStatus, requiredSubstring) {
  const url = `${baseUrl}${path}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'follow',
    });
    const text = await response.text();
    if (response.status !== expectedStatus) {
      console.error(`FAIL: ${name} ${url} -> HTTP ${response.status} (expected ${expectedStatus})`);
      console.error(`      body: ${text.slice(0, 240)}`);
      failed = true;
      return;
    }
    if (requiredSubstring && !text.includes(requiredSubstring)) {
      console.error(`FAIL: ${name} ${url} -> missing body marker '${requiredSubstring}'`);
      console.error(`      body: ${text.slice(0, 240)}`);
      failed = true;
      return;
    }
    console.log(`OK  : ${name} ${url} -> HTTP ${response.status}`);
  } catch (error) {
    console.error(`FAIL: ${name} ${url} -> ${error instanceof Error ? error.message : String(error)}`);
    failed = true;
  }
}

async function run() {
  console.log(`BSS production smoke base URL: ${baseUrl}`);

  await checkGet('Root', '');
  await checkGet('Sitemap', '/sitemap.xml');
  await checkGet('Robots', '/robots.txt');
  await checkGet('Pricing API', '/api/pricing');

  await checkPost(
    'Checkout unauth guardrail',
    '/api/checkout',
    { plan: 'pro' },
    401,
    'authRedirect'
  );

  await checkPost(
    'Lead validation guardrail',
    '/api/lead',
    { email: 'canary@example.com' },
    400,
    'Missing required fields'
  );

  if (runLeadMutationCanary) {
    const ts = new Date().toISOString().replace(/[-:.]/g, '');
    await checkPost(
      'Lead mutation canary',
      '/api/lead',
      {
        name: 'Prod Canary',
        email: `prod-canary+${ts}@example.com`,
        company: 'BrainOps QA',
        industry: 'Software',
        role: 'Ops Lead',
        painPoint: 'Workflow latency',
        budget: '100k',
        message: `Automated BSS prod smoke canary ${ts}`,
      },
      200,
      '"status":"ok"'
    );
  } else {
    console.log('SKIP: Lead mutation canary (set BSS_RUN_LEAD_CANARY=1 to enable)');
  }

  if (failed) {
    console.error('BSS prod smoke FAILED');
    process.exit(1);
  }

  console.log('BSS prod smoke PASSED');
}

run();
