// Genera la version del logotipo para fondo oscuro a partir del original.
//
//   node scripts/logo-negative.mjs
//
// El logo de Solarcheck es un PNG indexado: "SOLAR" y el simbolo van en azul marino y
// "CHECK" en azul claro. Sobre la cabecera azul el azul marino desaparece, asi que aqui
// se reescribe SOLO LA PALETA (los colores oscuros pasan a blanco) y se conserva el azul
// claro de la marca. Al no tocar los pixeles no hay recompresion ni perdida de calidad.
import {readFile, writeFile} from 'node:fs/promises';
import {crc32} from 'node:zlib';

const source = new URL('../src/assets/logo.png', import.meta.url);
const target = new URL('../src/assets/logo-negative.png', import.meta.url);
const LUMA_LIMIT = 100;   // por debajo de esto se considera "azul marino" y pasa a blanco

const png = await readFile(source);
if (png.subarray(0, 8).toString('binary') !== '\x89PNG\r\n\x1a\n') throw new Error('El origen no es un PNG.');

const chunks = [];
for (let position = 8; position < png.length;) {
  const length = png.readUInt32BE(position);
  const type = png.subarray(position + 4, position + 8).toString('latin1');
  chunks.push({type, body: Buffer.from(png.subarray(position + 8, position + 8 + length))});
  position += 12 + length;
  if (type === 'IEND') break;
}

const palette = chunks.find(chunk => chunk.type === 'PLTE');
if (!palette) throw new Error('El logo no es un PNG indexado: revisa el fichero de origen.');

let lightened = 0;
for (let index = 0; index < palette.body.length; index += 3) {
  const [r, g, b] = [palette.body[index], palette.body[index + 1], palette.body[index + 2]];
  if (0.299 * r + 0.587 * g + 0.114 * b >= LUMA_LIMIT) continue;
  palette.body.writeUInt8(255, index);
  palette.body.writeUInt8(255, index + 1);
  palette.body.writeUInt8(255, index + 2);
  lightened += 1;
}

const parts = [png.subarray(0, 8)];
for (const {type, body} of chunks) {
  const header = Buffer.alloc(4);
  header.writeUInt32BE(body.length);
  const typed = Buffer.concat([Buffer.from(type, 'latin1'), body]);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(typed));
  parts.push(header, typed, checksum);
}
await writeFile(target, Buffer.concat(parts));
console.log(`logo-negative.png generado: ${lightened} colores de la paleta pasados a blanco.`);
