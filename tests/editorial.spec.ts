import { expect, test } from '@playwright/test';

test('Dawntech roles share an employer without implying a job change', async ({ page }) => {
  await page.goto('/pt/');
  const employer = page
    .locator('#experience article')
    .filter({ has: page.getByRole('heading', { name: 'Dawntech Inc.', exact: true }) });
  await expect(employer).toHaveCount(1);
  await expect(employer.getByRole('heading', { level: 4 })).toHaveCount(2);
  await expect(employer).toContainText('Responsabilidades atuais');
  await expect(page.locator('#experience')).toContainText(
    'dissertação de mestrado foi concluída em 2024',
  );
});

test('preprint is labeled separately and has no invented university field in BibTeX', async ({
  page,
  request,
}) => {
  await page.goto('/publications/');
  await page.locator('#pub-type').selectOption('Preprint');
  await expect(page.locator('article[data-publication]:visible')).toHaveCount(1);
  await expect(page.locator('article[data-publication]:visible')).toContainText(
    'A Cloud-Fog Computing Architecture',
  );
  const response = await request.get('/publications.bib');
  const bib = await response.text();
  const entry = bib
    .split(/(?=@\w+\{)/)
    .find((value) => value.includes('A Cloud-Fog Computing Architecture'));
  expect(entry).toContain('@misc{');
  expect(entry).toContain('arXiv:2012.06118');
  expect(entry).not.toContain('school =');
});
