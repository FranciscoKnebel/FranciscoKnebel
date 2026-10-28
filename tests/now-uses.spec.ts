import { expect, test } from '@playwright/test';
test('personal pages preserve language and use documented project technologies', async ({
  page,
}) => {
  await page.goto('/pt/uses/');
  await expect(page.locator('main')).toContainText('Astro');
  await page.getByRole('link', { name: 'English (EN)' }).first().click();
  await expect(page).toHaveURL(/\/uses\/$/);
  await page.goto('/pt/now/');
  await expect(page.locator('main')).toContainText('Dawntech');
  await expect(page.locator('time')).toHaveAttribute('datetime', '2026-10-28');
});
