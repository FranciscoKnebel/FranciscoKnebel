import { PDFDocument } from 'pdfkit';
import { createWriteStream, mkdirSync } from 'node:fs';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { cvData } from '../src/lib/cv-data.mjs';
mkdirSync('public/cv', { recursive: true });
for (const lang of ['en', 'pt']) {
  const d = cvData(lang);
  const pt = lang === 'pt';
  const output = createWriteStream(`public/cv/francisco-knebel-${lang}.pdf`);
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 42, bottom: 42, left: 46, right: 46 },
    bufferPages: true,
    info: {
      Title: `${d.name} | ${pt ? 'Currículo' : 'Curriculum vitae'}`,
      Author: d.name,
      CreationDate: new Date('2026-10-28T00:00:00Z'),
      ModDate: new Date('2026-10-28T00:00:00Z'),
    },
  });
  doc.registerFont(
    'Body',
    fileURLToPath(
      import.meta.resolve('@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff'),
    ),
  );
  doc.registerFont(
    'Bold',
    fileURLToPath(
      import.meta.resolve('@fontsource/noto-sans/files/noto-sans-latin-700-normal.woff'),
    ),
  );
  doc.pipe(output);
  const heading = (text) => {
    doc.moveDown(0.5).font('Bold').fontSize(12).fillColor('#3730a3').text(text.normalize('NFC'));
    doc.moveDown(0.35);
  };
  const paragraph = (text, options = {}) => {
    doc
      .font('Body')
      .fontSize(10)
      .fillColor('#334155')
      .text(text.normalize('NFC'), { lineGap: 2, ...options });
  };
  const title = (text) =>
    doc.font('Bold').fontSize(10).fillColor('#0f172a').text(text.normalize('NFC'));
  doc.font('Bold').fontSize(24).fillColor('#0f172a').text(d.name);
  paragraph(d.role);
  doc.moveDown(0.4);
  paragraph(`${d.email}  |  franciscoknebel.com`);
  doc.moveDown(0.4);
  paragraph(d.summary);
  heading(pt ? 'Formação' : 'Education');
  for (const item of d.education) paragraph(item);
  heading(pt ? 'Experiência' : 'Experience');
  for (const entry of d.experiences) {
    title(`${entry.role} | ${entry.company}`);
    paragraph(entry.period);
    paragraph(entry.description);
    doc.moveDown(0.6);
  }
  doc.addPage();
  doc.font('Bold').fontSize(18).fillColor('#0f172a').text(d.name);
  heading(pt ? 'Projetos selecionados' : 'Selected projects');
  for (const project of d.projects) {
    title(project.title);
    paragraph(project.description);
    paragraph(project.repo || project.url || d.website, {
      link: project.repo || project.url || d.website,
    });
    doc.moveDown(0.6);
  }
  heading(pt ? 'Publicações' : 'Publications');
  for (const publication of d.publications) {
    title(publication.title);
    paragraph(`${publication.year} | ${publication.venue}`);
    doc.moveDown(0.5);
  }
  paragraph(
    pt
      ? 'Referências completas e versões dos trabalhos: franciscoknebel.com/pt/publications/'
      : 'Full references and versions: franciscoknebel.com/publications/',
    { link: `${d.website}${pt ? '/pt' : ''}/publications/` },
  );
  const pages = doc.bufferedPageRange();
  for (let index = 0; index < pages.count; index++) {
    doc.switchToPage(index);
    doc.page.margins.bottom = 0;
    doc
      .fontSize(8)
      .fillColor('#64748b')
      .text(`${index + 1} / ${pages.count}`, 46, doc.page.height - 30, {
        width: doc.page.width - 92,
        align: 'right',
        lineBreak: false,
      });
  }
  doc.end();
  await once(output, 'finish');
  console.log(`CV ${lang}: ${pages.count} pages`);
}
