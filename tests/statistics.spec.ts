import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
test('native statistics use a dated public snapshot without SVG dependencies', async ({ page }) => {
  const snapshot = JSON.parse(readFileSync('src/data/github-snapshot.json', 'utf8'));
  await page.goto('/pt/');
  await expect(page.locator('#stats img')).toHaveCount(0);
  if (snapshot.profile) {
    await expect(page.locator('#stats')).toContainText(String(snapshot.profile.repositories));
    await page.locator('#stats summary').click();
    await expect(page.locator('#stats')).toContainText('não um calendário completo');
  }
  expect(readFileSync('dist/index.html', 'utf8')).not.toContain('raw.githubusercontent.com');
});
