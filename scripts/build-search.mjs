import * as pagefind from 'pagefind';
import { readdirSync, readFileSync } from 'node:fs';
const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`],
  );
try {
  for (const lang of ['en', 'pt']) {
    const created = await pagefind.createIndex({ rootSelector: 'main', forceLanguage: lang });
    if (!created.index || created.errors?.length) throw new Error(JSON.stringify(created.errors));
    const { index } = created;
    let count = 0;
    for (const file of files('dist').filter((file) => file.endsWith('.html'))) {
      const html = readFileSync(file, 'utf8');
      const url = file.slice(4).replace(/index\.html$/, '');
      if (
        (url.startsWith('/pt/') ? 'pt' : 'en') !== lang ||
        /content="noindex"|http-equiv="refresh"/.test(html) ||
        url.endsWith('/search/')
      )
        continue;
      const result = await index.addHTMLFile({ url, content: html });
      if (result.errors?.length) throw new Error(JSON.stringify(result.errors));
      count++;
    }
    const result = await index.writeFiles({ outputPath: `dist/pagefind/${lang}` });
    if (result.errors?.length) throw new Error(JSON.stringify(result.errors));
    console.log(`Search ${lang}: ${count} pages`);
    await index.deleteIndex();
  }
} finally {
  await pagefind.close();
}
