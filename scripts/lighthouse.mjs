#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

function resolveChromiumPath() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const platform = process.platform;
  let cacheRoot;
  if (platform === 'darwin') {
    cacheRoot = path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
  } else if (platform === 'linux') {
    cacheRoot = path.join(os.homedir(), '.cache', 'ms-playwright');
  } else if (platform === 'win32') {
    cacheRoot = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright');
  } else {
    return null;
  }

  if (!existsSync(cacheRoot)) return null;

  const chromiumDirs = readdirSync(cacheRoot)
    .filter((n) => /^chromium-\d+$/.test(n))
    .sort((a, b) => parseInt(b.split('-')[1], 10) - parseInt(a.split('-')[1], 10));

  const macCandidates = [
    ['chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'],
    ['chrome-mac', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'],
  ];
  const linuxCandidates = [['chrome-linux', 'chrome']];
  const winCandidates = [['chrome-win', 'chrome.exe']];

  const candidates =
    platform === 'darwin' ? macCandidates : platform === 'linux' ? linuxCandidates : winCandidates;

  for (const dir of chromiumDirs) {
    for (const parts of candidates) {
      const candidate = path.join(cacheRoot, dir, ...parts);
      if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
    }
  }
  return null;
}

const chromePath = resolveChromiumPath();

if (!chromePath) {
  console.error('lighthouse wrapper: could not locate a Chrome/Chromium binary.');
  console.error('Install one of:');
  console.error('  - Google Chrome (https://www.google.com/chrome/)');
  console.error('  - Playwright-managed Chromium: npx playwright install chromium');
  process.exit(1);
}

const passthroughArgs = process.argv.slice(2);
const lhciArgs = passthroughArgs.length > 0 ? passthroughArgs : ['autorun'];

const result = spawnSync('npx', ['lhci', ...lhciArgs], {
  stdio: 'inherit',
  env: { ...process.env, CHROME_PATH: chromePath },
});

process.exit(result.status ?? 1);
