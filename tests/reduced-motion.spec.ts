import { test, expect } from '@playwright/test';

test.describe('prefers-reduced-motion', () => {
  test('home page renders fully and stays static with reduced motion', async ({ page }) => {
    // Apply reduced-motion emulation explicitly per-page (test.use() reducedMotion
    // is not honoured reliably in @playwright/test 1.60 with our webServer config;
    // page.emulateMedia is the canonical per-page primitive).
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hero headline visible immediately (no fade-in delay).
    const hero = page.getByRole('heading', { level: 1 });
    await expect(hero).toBeVisible();
    await expect(hero).toContainText('Agentic AI Cybersecurity');

    // ProofBar counters show final values, not 0.
    const proof = page.getByText('113', { exact: false }).first();
    await expect(proof).toBeVisible();

    // Footer reachable.
    await expect(page.locator('footer')).toBeVisible();

    // Computed animation-duration on a fade element should be effectively zero
    // under prefers-reduced-motion (globals.css blanket short-circuits to 0.01ms).
    const dur = await page.evaluate(() => {
      const el = document.querySelector('.animate-fade-in-up');
      if (!el) return { state: 'no-fade-elements' as const };
      const cs = getComputedStyle(el);
      // animationDuration may be a comma-separated list; the smallest must be near zero.
      const raw = cs.animationDuration || '0s';
      const parts = raw.split(',').map((s) => s.trim());
      // Parse to ms; treat anything ≤ 1ms as "effectively zero".
      const toMs = (v: string) => {
        if (v.endsWith('ms')) return parseFloat(v);
        if (v.endsWith('s')) return parseFloat(v) * 1000;
        return Number.POSITIVE_INFINITY;
      };
      const maxMs = Math.max(...parts.map(toMs));
      return { state: 'measured' as const, raw, maxMs };
    });
    if (dur.state === 'measured') {
      expect(dur.maxMs).toBeLessThanOrEqual(1);
    } else {
      expect(dur.state).toBe('no-fade-elements');
    }
  });
});
