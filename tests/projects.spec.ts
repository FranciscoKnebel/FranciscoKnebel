import { expect, test } from '@playwright/test';

for (const locale of [
  { path: '/', repo: 'Repository', live: 'Live site', projects: 'View projects' },
  { path: '/pt/', repo: 'Repositório', live: 'Site', projects: 'Ver projetos' },
]) {
  test(`project actions are labeled and usable on mobile in ${locale.path}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(locale.path);
    await page.getByRole('link', { name: locale.projects, exact: true }).click();
    for (const article of await page.locator('#projects article').all()) {
      await expect(article.getByRole('heading').getByRole('link')).toHaveAttribute(
        'href',
        /\/projects\/.+\/$/,
      );
      const title = await article.getByRole('heading').innerText();
      const actions = article
        .getByRole('link')
        .filter({ hasText: new RegExp(`^(${locale.repo}|${locale.live})$`) });
      expect(await actions.count()).toBeGreaterThan(0);
      for (const action of await actions.all()) {
        await expect(action).toHaveAttribute('aria-label', `${await action.innerText()}: ${title}`);
        const box = await action.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
        expect(box?.width).toBeGreaterThanOrEqual(44);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      320,
    );
  });
}
