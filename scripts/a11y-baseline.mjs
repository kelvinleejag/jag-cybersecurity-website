#!/usr/bin/env node
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';

const PORT = 3005;
const URL = `http://localhost:${PORT}/`;

const server = spawn('npx', ['serve', 'out', '-p', String(PORT), '-L'], { stdio: 'ignore' });
process.on('exit', () => server.kill());

async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {}
    await wait(200);
  }
  throw new Error(`Server did not respond at ${url}`);
}

await waitForServer(URL);

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
await page.goto(URL);
await page.waitForLoadState('networkidle');

const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  .analyze();

console.log('');
console.log('=== axe-core baseline (WCAG 2.0/2.1/2.2 A+AA) ===');
console.log(`URL              : ${URL}`);
console.log(`Violations total : ${results.violations.length}`);
console.log(`Nodes affected   : ${results.violations.reduce((n, v) => n + v.nodes.length, 0)}`);
console.log(`Passes           : ${results.passes.length}`);
console.log(`Incomplete       : ${results.incomplete.length}`);
console.log('');
console.log('By rule:');
console.log('Impact     Rule ID                              Nodes  Description');
console.log('---------  -----------------------------------  -----  ---------------------------------------------');
results.violations
  .sort((a, b) => {
    const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
    return (order[a.impact] ?? 9) - (order[b.impact] ?? 9);
  })
  .forEach((v) => {
    console.log(
      (v.impact ?? '?').padEnd(10),
      v.id.padEnd(36),
      String(v.nodes.length).padEnd(6),
      (v.help ?? '').slice(0, 50),
    );
  });
console.log('');
console.log('First affected node per rule:');
results.violations.forEach((v) => {
  console.log(`  [${v.id}] ${v.nodes[0]?.target?.join(' ') ?? ''}`);
  console.log(`           ${(v.nodes[0]?.html ?? '').slice(0, 110)}`);
});

await browser.close();
server.kill();
process.exit(0);
