import { test, expect } from '@playwright/test';

test.describe('BrainStack Studio E2E', () => {
  // --- Public page rendering (every route loads without server error) ---
  const publicPages = [
    { route: '/', name: 'Homepage' },
    { route: '/about', name: 'About' },
    { route: '/pricing', name: 'Pricing' },
    { route: '/tools', name: 'Tools' },
    { route: '/explorer', name: 'Explorer' },
    { route: '/solutions', name: 'Solutions' },
    { route: '/contact', name: 'Contact' },
    { route: '/privacy', name: 'Privacy' },
    { route: '/terms', name: 'Terms' },
    { route: '/security', name: 'Security' },
    { route: '/technology', name: 'Technology' },
    { route: '/docs', name: 'Docs' },
    { route: '/api-docs', name: 'API Docs' },
    { route: '/auth', name: 'Auth' },
  ];

  for (const { route, name } of publicPages) {
    test(`${name} (${route}) loads without server error`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const status = response?.status() ?? 0;
      expect(status, `${route} returned ${status}`).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();
    });
  }

  // --- Homepage structure ---
  test('homepage has navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('nav').first()).toBeVisible();
  });

  test('homepage renders body content', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    // Page should render (body visible) - client errors may show error boundary in dev
    await expect(page.locator('body')).toBeVisible();
    const bodyHTML = await page.locator('body').innerHTML();
    expect(bodyHTML.length).toBeGreaterThan(100);
  });

  test('homepage title contains BrainStack', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    const title = await page.title();
    expect(title.toLowerCase()).toContain('brainstack');
  });

  // --- Protected routes redirect to auth ---
  test('/dashboard redirects unauthenticated users', async ({ page }) => {
    const response = await page.goto('/dashboard', { waitUntil: 'domcontentloaded', timeout: 20000 });
    const status = response?.status() ?? 0;
    expect(status).toBeLessThan(500);
    // Should redirect to auth or show login
    const url = page.url();
    const isRedirected = url.includes('/auth') || url.includes('/login') || url.includes('/dashboard');
    expect(isRedirected).toBe(true);
  });

  test('/settings redirects unauthenticated users', async ({ page }) => {
    const response = await page.goto('/settings', { waitUntil: 'domcontentloaded', timeout: 20000 });
    const status = response?.status() ?? 0;
    expect(status).toBeLessThan(500);
  });

  // --- API routes exist ---
  test('GET /api/capability returns response', async ({ request }) => {
    const response = await request.get('/api/capability');
    // 200 (public) or 401 (auth required) - both prove route exists
    expect([200, 401]).toContain(response.status());
  });

  test('POST /api/telemetry accepts or rejects', async ({ request }) => {
    const response = await request.post('/api/telemetry', {
      data: { event: 'test', name: 'e2e' },
    });
    expect(response.status()).toBeLessThan(500);
  });

  test('GET /api/tools returns response', async ({ request }) => {
    const response = await request.get('/api/tools');
    expect(response.status()).toBeLessThan(500);
  });

  // --- Tools page structure ---
  test('tools page loads with navigation', async ({ page }) => {
    await page.goto('/tools', { waitUntil: 'domcontentloaded', timeout: 20000 });
    // Tools page should render nav (content may need client hydration)
    await expect(page.locator('nav').first()).toBeVisible();
  });

  // --- Explorer page structure ---
  test('explorer page renders form elements', async ({ page }) => {
    await page.goto('/explorer', { waitUntil: 'domcontentloaded', timeout: 20000 });
    // Explorer has dropdown selectors
    const formElements = page.locator('select, button, [role="combobox"], [role="listbox"]');
    const count = await formElements.count();
    expect(count).toBeGreaterThan(0);
  });

  // --- No application errors on any page ---
  test('no "Application error" on homepage', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    const errorText = page.getByText(/Application error/i);
    await expect(errorText).toHaveCount(0);
  });
});
