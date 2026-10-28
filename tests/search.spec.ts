import { expect, test } from '@playwright/test';
test('local search returns Portuguese pages and handles no results and reset', async ({ page }) => {
  await page.goto('/pt/search/');
  await page.locator('#site-query').fill('gêmeos');
  await expect(page.locator('#search-results li').first()).toBeVisible();
  for (const link of await page.locator('#search-results a').all())
    await expect(link).toHaveAttribute('href', /^\/pt\//);
  await page.locator('#site-query').fill('zzzzunfindableqv921');
  await expect(page.locator('#search-status')).toHaveText('Nenhum resultado encontrado.');
  await page.getByRole('button', { name: 'Limpar', exact: true }).click();
  await expect(page.locator('#site-query')).toHaveValue('');
});
