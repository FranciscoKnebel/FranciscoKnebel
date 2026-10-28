import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
for (const lang of ['en', 'pt']) {
  test(`CV ${lang} includes experience and a real downloadable PDF`, async ({ page, request }) => {
    await page.goto(`${lang === 'pt' ? '/pt' : ''}/cv/`);
    await expect(page.locator('h1')).toHaveText('Francisco Paiva Knebel');
    await expect(page.locator('main')).toContainText('Dawntech');
    const response = await request.get(`/cv/francisco-knebel-${lang}.pdf`);
    expect(response.ok()).toBe(true);
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
    const pdf = readFileSync(`public/cv/francisco-knebel-${lang}.pdf`, 'latin1');
    expect(pdf.match(/\/Type \/Page\b/g)).toHaveLength(2);
  });
}
