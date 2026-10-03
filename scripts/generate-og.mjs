import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ui = JSON.parse(readFileSync(path.join(root, 'src/data/ui.json'), 'utf8'));

const escapeXml = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const fontStack = 'Liberation Sans, DejaVu Sans, Arial, sans-serif';

function buildSvg(lang) {
  const { role, degree } = ui[lang].hero;
  const line = escapeXml(`${role} & ${degree}`);
  const lineSize = line.length > 55 ? 30 : 36;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0f172a"/>
  <rect width="1200" height="10" fill="#6366f1"/>
  <text x="80" y="300" font-family="${fontStack}" font-size="84" font-weight="700" fill="#f8fafc">Francisco Knebel</text>
  <text x="80" y="380" font-family="${fontStack}" font-size="${lineSize}" fill="#cbd5e1">${line}</text>
  <text x="80" y="460" font-family="${fontStack}" font-size="28" fill="#818cf8">franciscoknebel.com</text>
</svg>`;
}

const targets = [
  { lang: 'en', file: 'public/og-image.png' },
  { lang: 'pt', file: 'public/og-image.pt.png' },
];

for (const { lang, file } of targets) {
  const output = path.join(root, file);
  await sharp(Buffer.from(buildSvg(lang)))
    .png()
    .toFile(output);
  console.log(`generated ${file}`);
}
