import { expect, test } from '@playwright/test';

test('content remains readable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/pt/');
  for (const id of [
    'about',
    'experience',
    'research',
    'projects',
    'community',
    'stats',
    'contact',
  ]) {
    const section = page.locator(`#${id}`);
    await expect(section).toBeVisible();
    const invisible = await section
      .locator('*')
      .evaluateAll((elements) =>
        elements.some((element) => getComputedStyle(element).opacity === '0'),
      );
    expect(invisible).toBe(false);
  }
  await context.close();
});

test('content remains readable when the animation API fails', async ({ page }) => {
  await page.addInitScript(() => {
    window.IntersectionObserver = class {
      constructor() {
        throw new Error('Simulated observer failure');
      }
    } as unknown as typeof IntersectionObserver;
  });
  await page.goto('/');
  await expect(page.locator('#about h1')).toHaveCSS('opacity', '1');
  await expect(page.locator('#projects article').first()).toHaveCSS('opacity', '1');
});

for (const width of [320, 390, 640, 768, 1024]) {
  test(`Portuguese navigation and content fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/pt/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
    const button = page.getByRole('button', { name: 'Abrir e fechar o menu' });
    if (width < 1024) {
      await expect(button).toBeVisible();
      await button.click();
      await expect(page.locator('#mobile-menu')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(button).toBeFocused();
      await expect(page.locator('#mobile-menu')).toBeHidden();
    } else {
      await expect(button).toBeHidden();
      await expect(page.locator('nav a[href="#projects"]')).toBeVisible();
    }
    if (width < 768) {
      const columns = await page
        .locator('#stats .grid')
        .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
      expect(columns).toBe(width < 640 ? 1 : 2);
    }
  });
}

test('Portuguese home link keeps language and anchors clear the header', async ({ page }) => {
  await page.goto('/pt/');
  await page.getByRole('link', { name: 'Francisco Knebel', exact: true }).click();
  await expect(page).toHaveURL(/\/pt\/$/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('nav a[href="#projects"]').click();
  const top = await page
    .locator('#projects')
    .evaluate((element) => element.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(56);
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
});
