// Auditoria de contraste WCAG AA sobre las rutas ya construidas (usa el Chrome abierto en CDP).
const cdpBase = process.env.CDP_URL || 'http://127.0.0.1:9223';
const base = process.env.SITE_URL || 'http://127.0.0.1:4173';
const targets = await fetch(`${cdpBase}/json/list`).then(r => r.json());
const target = targets.find(item => item.type === 'page');
const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
let sequence = 0;
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, {once: true});
  socket.addEventListener('error', reject, {once: true});
});
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const {resolve, reject} = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
});
const command = (method, params = {}) => {
  const id = ++sequence;
  socket.send(JSON.stringify({id, method, params}));
  return new Promise((resolve, reject) => pending.set(id, {resolve, reject}));
};
const wait = ms => new Promise(r => setTimeout(r, ms));
const evaluate = async expression => {
  const response = await command('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true});
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
};

const CHECK = `(() => {
  const parse = value => {
    const match = value.match(/rgba?\\(([^)]+)\\)/);
    if (!match) return null;
    const parts = match[1].split(',').map(Number);
    return {r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1};
  };
  const lum = ({r, g, b}) => {
    const channel = value => {
      const v = value / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  const results = [];
  for (const node of document.querySelectorAll('body *')) {
    const text = [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent.trim()).join('');
    if (!text) continue;
    const rect = node.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;
    const style = getComputedStyle(node);
    if (style.visibility === 'hidden' || style.opacity === '0') continue;
    const color = parse(style.color);
    if (!color || color.a < 0.9) continue;
    // Fondo efectivo: se sube por los ancestros hasta encontrar un color solido.
    let background = null, element = node, hasImage = false;
    while (element && element !== document.documentElement) {
      const current = getComputedStyle(element);
      if (current.backgroundImage !== 'none') { hasImage = true; break; }
      const candidate = parse(current.backgroundColor);
      if (candidate && candidate.a >= 0.95) { background = candidate; break; }
      if (candidate && candidate.a > 0.05) { hasImage = true; break; }  // velos translucidos: no se puede afirmar
      element = element.parentElement;
    }
    if (hasImage || !background) continue;   // sobre foto o degradado no se juzga por codigo
    const size = parseFloat(style.fontSize);
    const weight = parseInt(style.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const needed = large ? 3 : 4.5;
    const value = ratio(color, background);
    if (value < needed) {
      results.push({
        text: text.slice(0, 42),
        selector: node.tagName.toLowerCase() + (typeof node.className === 'string' && node.className ? '.' + node.className.trim().split(/\\s+/).join('.') : ''),
        color: style.color, background: 'rgb(' + background.r + ',' + background.g + ',' + background.b + ')',
        size, weight, ratio: Math.round(value * 100) / 100, needed
      });
    }
  }
  return results;
})()`;

const routes = ['/', '/servicios/', '/laminas-solares-coche/', '/laminas-edificios/', '/clearshield-ppf/', '/trabajos/', '/empresa/', '/preguntas-frecuentes/', '/contacto/', '/presupuesto/', '/aviso-legal/', '/privacidad/', '/cookies/'];
await command('Page.enable');
await command('Runtime.enable');
await command('Emulation.setDeviceMetricsOverride', {width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false});
const seen = new Map();
for (const route of routes) {
  await command('Page.navigate', {url: base + route});
  await wait(1400);
  const findings = await evaluate(CHECK);
  for (const finding of findings) {
    const key = finding.selector + '|' + finding.color + '|' + finding.background;
    if (!seen.has(key)) seen.set(key, {...finding, routes: []});
    seen.get(key).routes.push(route);
  }
}
const list = [...seen.values()].sort((a, b) => a.ratio - b.ratio);
console.log(JSON.stringify(list, null, 1));
socket.close();
