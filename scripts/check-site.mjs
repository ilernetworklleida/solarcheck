import {access, readFile} from 'node:fs/promises';
import {pages} from '../src/site.js';

const failures = [];
const dist = new URL('../dist/', import.meta.url);

for (const [path, meta] of Object.entries(pages)) {
  const relative = path === '/' ? 'index.html' : `${path.replace(/^\/+|\/+$/g, '')}/index.html`;
  const file = new URL(relative, dist);
  try {
    await access(file);
    const html = await readFile(file, 'utf8');
    if (!html.includes(`<title>${meta.title}</title>`)) failures.push(`${path}: title estático incorrecto`);
    if (!html.includes(meta.description)) failures.push(`${path}: descripción estática ausente`);
    if (!html.includes(`href="https://solarcheck.proposta.cat${path}"`)) failures.push(`${path}: canonical incorrecto`);
  } catch {
    failures.push(`${path}: no existe ${relative}`);
  }
}

for (const file of ['robots.txt', 'sitemap.xml', 'site.webmanifest', 'favicon.svg', '404.html']) {
  try { await access(new URL(file, dist)); } catch { failures.push(`Falta ${file} en dist`); }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`OK: ${Object.keys(pages).length} rutas con title, description y canonical; archivos técnicos presentes.`);
