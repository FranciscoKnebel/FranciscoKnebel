import { readdirSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const htmlFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? htmlFiles(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`],
  );
const routes = htmlFiles('dist')
  .filter(
    (file) =>
      file.endsWith('.html') && !readFileSync(file, 'utf8').includes('http-equiv="refresh"'),
  )
  .map((file) => file.slice(4).replace(/index\.html$/, ''));

test('all built pages have working skip links and fit narrow viewports', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 320, height: 900 });
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('h1'), route).toHaveCount(1);
    await expect(page.locator('main#main'), route).toHaveCount(1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      route,
    ).toBeLessThanOrEqual(320);
    const broken = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute('href')!)
          .filter(
            (href) =>
              href.length > 1 && !document.getElementById(decodeURIComponent(href.slice(1))),
          ),
      );
    expect(broken, route).toEqual([]);
  }
});

test('analytics can be revoked after acceptance and remain disabled on the next page', async ({
  page,
}) => {
  await page.route('https://www.googletagmanager.com/**', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: '' }),
  );
  await page.goto('/');
  await page.locator('#analytics-accept').click();
  await expect
    .poll(() => page.evaluate(() => Boolean(document.getElementById('ga-script'))))
    .toBe(true);
  await page.locator('#analytics-settings').click();
  await page.locator('#analytics-decline').click();
  await expect.poll(() => page.evaluate(() => window['ga-disable-G-80D0XB0GGG'])).toBe(true);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('analytics-consent')))
    .toBe('denied');
  await page.goto('/publications/');
  await expect(page.locator('#ga-script')).toHaveCount(0);
  await expect(page.locator('#analytics-consent')).toBeHidden();
});

test('blocked storage leaves language and consent controls usable', async ({ page }) => {
  await page.addInitScript(() => {
    for (const name of ['localStorage', 'sessionStorage']) {
      Object.defineProperty(window, name, {
        configurable: true,
        get() {
          throw new DOMException('Storage blocked', 'SecurityError');
        },
      });
    }
  });
  await page.goto('/');
  await expect(page.locator('#analytics-consent')).toBeVisible();
  await page.locator('#analytics-decline').click();
  await expect(page.locator('#analytics-consent')).toBeHidden();
  await page.locator('#analytics-settings').click();
  await expect(page.locator('#analytics-consent')).toBeVisible();
  await page.getByRole('link', { name: 'Português (PT)' }).first().click();
  await expect(page).toHaveURL(/\/pt\/$/);
});
