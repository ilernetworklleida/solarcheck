import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {pages, SITE_URL} from '../src/site.js';

const dist = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', dist), 'utf8');

const escape = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

function render(path, meta) {
  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;
  const image = `${SITE_URL}${meta.image || '/images/workshop-privacy.webp'}`;
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\/>/, `<meta name="description" content="${escape(meta.description)}"/>`)
    .replace(/<link rel="canonical" href="[^"]*"\/>/, `<link rel="canonical" href="${canonical}"/>`)
    .replace(/<meta property="og:title" content="[^"]*"\/>/, `<meta property="og:title" content="${escape(meta.title)}"/>`)
    .replace(/<meta property="og:description" content="[^"]*"\/>/, `<meta property="og:description" content="${escape(meta.description)}"/>`)
    .replace(/<meta property="og:url" content="[^"]*"\/>/, `<meta property="og:url" content="${canonical}"/>`)
    .replace(/<meta property="og:image" content="[^"]*"\/>/, `<meta property="og:image" content="${image}"/>`)
    .replace(/<meta name="twitter:title" content="[^"]*"\/>/, `<meta name="twitter:title" content="${escape(meta.title)}"/>`)
    .replace(/<meta name="twitter:description" content="[^"]*"\/>/, `<meta name="twitter:description" content="${escape(meta.description)}"/>`);
}

for (const [path, meta] of Object.entries(pages)) {
  const html = render(path, meta);
  if (path === '/') {
    await writeFile(new URL('index.html', dist), html);
    continue;
  }
  const relative = path.replace(/^\/+|\/+$/g, '');
  const directory = new URL(`${relative}/`, dist);
  await mkdir(directory, {recursive: true});
  await writeFile(new URL('index.html', directory), html);
}

const notFound = template
  .replace(/<title>[^<]*<\/title>/, '<title>Página no encontrada | Solarcheck Lleida</title>')
  .replace(/<meta name="robots" content="[^"]*"\/>/, '<meta name="robots" content="noindex,follow"/>');
await writeFile(new URL('404.html', dist), notFound);

console.log(`Generated ${Object.keys(pages).length} static route entry points plus 404.html.`);
