import { expect, test } from '@playwright/test';
import { jsonLd } from '../src/lib/structured-data';
test('publications and project pages expose truthful content types', async ({ page }) => {
  await page.goto('/publications/');
  const list = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts
        .map((script) => JSON.parse(script.textContent!))
        .find((value) => value['@type'] === 'ItemList'),
    );
  expect(list.numberOfItems).toBe(6);
  expect(
    list.itemListElement.filter(
      (entry: { item: Record<string, unknown> }) => entry.item['@type'] === 'Thesis',
    ),
  ).toHaveLength(2);
  expect(
    list.itemListElement.some(
      (entry: { item: Record<string, unknown> }) => entry.item.creativeWorkStatus === 'Preprint',
    ),
  ).toBe(true);
  await page.goto('/projects/gnome-provider-limits/');
  const project = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts
        .map((script) => JSON.parse(script.textContent!))
        .find((value) => value['@type'] === 'SoftwareSourceCode'),
    );
  expect(project.codeRepository).toBe('https://github.com/FranciscoKnebel/gnome-provider-limits');
});
test('JSON-LD text cannot terminate the script element', () => {
  const encoded = jsonLd({ name: '</script><script>alert(1)</script>' });
  expect(encoded).not.toContain('<');
  expect(JSON.parse(encoded).name).toContain('</script>');
});
