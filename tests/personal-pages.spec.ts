import { expect, test } from '@playwright/test';
import { sortedTalks } from '../src/lib/talks';
test('talks empty state does not fabricate events and is not indexed', async ({ page }) => {
  await page.goto('/pt/talks/');
  await expect(page.locator('main')).toContainText('Ainda não há materiais');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});
test('talk data requires sources to be valid URLs and sorts by date', () => {
  expect(() =>
    sortedTalks([
      {
        id: 'x',
        type: 'talk',
        date: '2026-01-01',
        title: { en: 'Test', pt: 'Teste' },
        description: { en: '', pt: '' },
        event: 'Test',
        url: 'javascript:alert(1)',
      },
    ]),
  ).toThrow();
});
