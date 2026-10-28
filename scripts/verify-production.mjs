const base = process.env.PUBLIC_SITE_URL || 'https://franciscoknebel.com';
const expected = process.env.EXPECTED_REVISION;
async function get(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response;
}
if (expected) {
  let matched = false;
  for (let attempt = 0; attempt < 8; attempt++) {
    const html = await (await get('/')).text();
    if (html.includes(`name="build-revision" content="${expected}"`)) {
      matched = true;
      break;
    }
    if (attempt < 7) await new Promise((resolve) => setTimeout(resolve, 15000));
  }
  if (!matched) throw new Error('The expected revision is not published yet');
}
const routes = [
  '/',
  '/pt/',
  '/privacy/',
  '/pt/privacidade/',
  '/cv/',
  '/pt/cv/',
  '/search/',
  '/pt/search/',
  '/talks/',
  '/pt/talks/',
  '/now/',
  '/pt/now/',
  '/uses/',
  '/pt/uses/',
  '/publications/',
  '/pt/publications/',
  '/case-studies/',
  '/pt/case-studies/',
];
await Promise.all(
  routes.map(async (route) => {
    const html = await (await get(route)).text();
    const lang = route.startsWith('/pt/') ? 'pt' : 'en';
    if (!html.includes(`<html lang="${lang}"`) || !html.includes('id="main"'))
      throw new Error(`${route}: missing language or main content`);
  }),
);
for (const lang of ['en', 'pt']) {
  const pdf = Buffer.from(await (await get(`/cv/francisco-knebel-${lang}.pdf`)).arrayBuffer());
  if (pdf.subarray(0, 5).toString() !== '%PDF-') throw new Error(`Invalid ${lang} CV`);
  await get(`/pagefind/${lang}/pagefind.js`);
  const png = Buffer.from(
    await (await get(lang === 'pt' ? '/og-image.pt.png' : '/og-image.png')).arrayBuffer(),
  );
  if (
    png.subarray(1, 4).toString() !== 'PNG' ||
    png.readUInt32BE(16) !== 1200 ||
    png.readUInt32BE(20) !== 630
  )
    throw new Error(`Invalid ${lang} sharing image`);
}
const sitemap = await (await get('/sitemap-0.xml')).text();
if (!sitemap.includes('/pt/privacidade/') || sitemap.includes('/pt/privacy/'))
  throw new Error('Privacy sitemap routes are incorrect');
console.log(
  `Verified ${routes.length} pages, PDF downloads, search bundles, sharing images and sitemap.`,
);
