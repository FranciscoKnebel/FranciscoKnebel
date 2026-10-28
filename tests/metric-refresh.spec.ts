import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
test('GitHub outage preserves the last valid public snapshot', () => {
  const before = readFileSync('src/data/github-snapshot.json', 'utf8');
  const run = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      "globalThis.fetch=async()=>{throw new Error('offline')};await import('./scripts/refresh-github-snapshot.mjs')",
    ],
    { cwd: process.cwd(), env: { ...process.env, REFRESH_GITHUB_METRICS: '1' }, encoding: 'utf8' },
  );
  expect(run.status).toBe(0);
  expect(readFileSync('src/data/github-snapshot.json', 'utf8')).toBe(before);
  expect(run.stderr).toContain('using the last committed snapshot');
});
