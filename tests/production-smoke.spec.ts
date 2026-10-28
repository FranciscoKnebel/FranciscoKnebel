import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
test('post-deploy smoke check validates the built site without changing it', () => {
  const output = execFileSync(process.execPath, ['scripts/verify-production.mjs'], {
    env: { ...process.env, PUBLIC_SITE_URL: 'http://127.0.0.1:4322', EXPECTED_REVISION: '' },
    encoding: 'utf8',
    timeout: 30000,
  });
  expect(output).toContain('Verified 18 pages');
});
