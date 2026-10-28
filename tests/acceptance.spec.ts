import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const dist = (file: string) => readFileSync(path.join(process.cwd(), 'dist', file), 'utf8');

test.describe('aceitação', () => {
  test('troca de idioma mantém a página atual', async ({ page }) => {
    await page.goto('/case-studies/mural-de-bolsas/');
    await page.getByRole('link', { name: 'Português (PT)' }).first().click();
    await expect(page).toHaveURL(/\/pt\/case-studies\/mural-de-bolsas\/$/);
    await expect(page.locator('h1')).toHaveText('Mural de Bolsas UFRGS');

    await page.getByRole('link', { name: 'English (EN)' }).first().click();
    await expect(page).toHaveURL(/\/case-studies\/mural-de-bolsas\/$/);
  });

  test('busca de publicações ignora acentos', async ({ page }) => {
    await page.goto('/publications/');
    const items = page.locator('article[data-publication]:visible');

    await expect(items).toHaveCount(6);
    await page.locator('#pub-search').fill('avaliacao');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText('Avaliação');
    await expect(page.locator('#pub-count')).toContainText('1');

    await page.locator('#pub-search').fill('');
    await expect(items).toHaveCount(6);
  });

  test('skip link é o primeiro foco e aponta para o main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('href', '#main');
    await expect(focused).toBeVisible();
    await expect(page.locator('main#main')).toHaveCount(1);
  });

  test('Escape fecha o aviso de idioma', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'pt-BR' });
    const page = await context.newPage();
    await page.goto('/');

    const notice = page.locator('#language-notice');
    await expect(notice).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(notice).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('language-choice')))
      .toBe('en');

    await context.close();
  });

  test('Escape adia o consentimento sem carregar analytics', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('#analytics-consent');
    await expect(banner).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(banner).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => sessionStorage.getItem('analytics-consent-postponed')))
      .toBe('1');
    await expect
      .poll(() => page.evaluate(() => Boolean(document.getElementById('ga-script'))))
      .toBe(false);
  });

  test('native statistics stay readable in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('#stats')).toBeVisible();
    await expect(page.locator('#stats img')).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'View GitHub profile', exact: true }),
    ).toContainText('View GitHub profile');
  });
});

test.describe('artefatos do build', () => {
  test('og:image por idioma e robots.txt', () => {
    expect(dist('index.html')).toContain('og-image.png');
    expect(dist('pt/index.html')).toContain('og-image.pt.png');
    expect(dist('robots.txt')).toContain('Sitemap: https://franciscoknebel.com/sitemap-index.xml');
  });

  test('sitemap cobre as páginas e exclui os redirects', () => {
    const sitemap = dist('sitemap-0.xml');
    expect(sitemap).toContain('https://franciscoknebel.com/case-studies/mural-de-bolsas/');
    expect(sitemap).toContain('https://franciscoknebel.com/pt/publications/');
    expect(sitemap).not.toContain('<loc>https://franciscoknebel.com/projects/</loc>');
  });

  test('published case studies are indexed and contain reviewed content', () => {
    for (const language of ['', 'pt/']) {
      for (const slug of ['mural-de-bolsas', 'jems3', 'digital-twins']) {
        const html = dist(`${language}case-studies/${slug}/index.html`);
        expect(html).not.toContain('<meta name="robots" content="noindex">');
        expect(html).not.toContain('This case study is being written');
        expect(html).not.toContain('Este caso de estudo está em preparação');
      }
      expect(dist(`${language}case-studies/index.html`)).not.toContain('Coming soon');
      expect(dist(`${language}case-studies/index.html`)).not.toContain('Em breve');
    }
  });

  test('badges de publicação usam os tons com contraste aprovado', () => {
    const page = dist('publications/index.html');
    expect(page).toContain('text-emerald-700');
    expect(page).toContain('text-amber-700');
    expect(page).not.toContain('text-emerald-600');
    expect(page).not.toContain('text-amber-600');
  });
});
