import { test, expect } from '@playwright/test';

test.describe('homepage smoke', () => {
  test('renders without console errors and hits the expected landmarks', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/JAG/i);
    await expect(page.locator('main, [role="main"]')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);

    expect.soft(consoleErrors, consoleErrors.join('\n')).toEqual([]);
  });
});

test.describe('no console errors', () => {
  test('home loads cleanly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    expect(errors, JSON.stringify(errors, null, 2)).toEqual([]);
  });
});
