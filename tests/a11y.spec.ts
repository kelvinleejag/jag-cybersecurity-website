import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('accessibility', () => {
  test('homepage has zero WCAG 2.0/2.1/2.2 A+AA violations', async ({ page }) => {
    // Snap all animations to their end state so axe checks the actual
    // reading experience (final composed colors), not transient mid-fade
    // contrast that no human ever sees as static text.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect.soft(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
});
