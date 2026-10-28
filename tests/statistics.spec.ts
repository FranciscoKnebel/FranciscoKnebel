import { readFileSync, existsSync } from 'node:fs';
import { expect, test } from '@playwright/test';

test('statistics disclosure is usable by keyboard and calendar reserves its actual ratio', async ({
  page,
}) => {
  await page.goto('/pt/');
  const section = page.locator('#stats');
  const details = section.locator('details');
  await expect(details).not.toHaveAttribute('open');
  await details.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await expect(details.locator('img')).toBeVisible();
  const image = section.locator('picture img');
  const svg = readFileSync('profile-3d-contrib/profile-gitblock.svg', 'utf8');
  const dimensions = svg.match(/<svg[^>]*width="(\d+)" height="(\d+)"/);
  expect(dimensions).not.toBeNull();
  await expect(image).toHaveAttribute('width', dimensions![1]);
  await expect(image).toHaveAttribute('height', dimensions![2]);
});

test('build excludes the retired full-history calendar and uses local images', () => {
  expect(existsSync('dist/metrics.plugin.calendar.svg')).toBe(false);
  expect(readFileSync('dist/index.html', 'utf8')).not.toContain('raw.githubusercontent.com');
});
