import { test, expect } from '@playwright/test';

const BREAKPOINTS = [
  { name: '375',  width: 375,  height: 800 },
  { name: '768',  width: 768,  height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

test.describe('visual regression baseline (Phase H)', () => {
  for (const bp of BREAKPOINTS) {
    test(`home @ ${bp.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Give any post-load animations a moment to settle.
      await page.waitForTimeout(300);
      await expect(page).toHaveScreenshot(`home-${bp.name}.png`, {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});
