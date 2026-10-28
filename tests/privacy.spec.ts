import { expect, test } from '@playwright/test';
test('privacy navigation preserves the localized slug and opens preferences', async ({ page }) => {
  await page.goto('/privacy/');
  await page.getByRole('link', { name: 'Português (PT)' }).first().click();
  await expect(page).toHaveURL(/\/pt\/privacidade\/$/);
  await page.locator('#analytics-decline').click();
  await page.getByRole('button', { name: 'Alterar preferência de analytics' }).click();
  await expect(page.locator('#analytics-consent')).toBeVisible();
});
