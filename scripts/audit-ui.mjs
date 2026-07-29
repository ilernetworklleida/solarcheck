import {writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const cdpBase = process.env.CDP_URL || 'http://127.0.0.1:9223';
const targets = await fetch(`${cdpBase}/json/list`).then(response => response.json());
const target = targets.find(item => item.type === 'page');
if (!target) throw new Error('No browser page found in the CDP endpoint.');

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
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function command(method, params = {}) {
  const id = ++sequence;
  socket.send(JSON.stringify({id, method, params}));
  return new Promise((resolve, reject) => pending.set(id, {resolve, reject}));
}

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function evaluate(expression) {
  const response = await command('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true});
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || 'Evaluation failed');
  return response.result.value;
}

async function waitFor(expression, timeout = 6000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(expression)) return;
    await wait(80);
  }
  throw new Error(`Timeout waiting for: ${expression}`);
}

async function navigate(url) {
  await command('Page.navigate', {url});
  await waitFor(`document.readyState === 'complete' && Boolean(document.querySelector('.site-header'))`);
  await wait(180);
}

async function viewport(width, height, mobile = false) {
  await command('Emulation.setDeviceMetricsOverride', {width, height, deviceScaleFactor: 1, mobile});
}

async function screenshot(name) {
  const response = await command('Page.captureScreenshot', {format: 'png', captureBeyondViewport: false, fromSurface: true});
  const destination = join(tmpdir(), name);
  await writeFile(destination, Buffer.from(response.data, 'base64'));
  return destination;
}

async function moveMouse(x, y) {
  await command('Input.dispatchMouseEvent', {type: 'mouseMoved', x, y});
}

await command('Page.enable');
await command('Runtime.enable');

const result = {desktop: {}, mobile: {}, screenshots: []};

await viewport(1440, 1000);
await navigate('http://127.0.0.1:4173/');
result.desktop.initial = await evaluate(`(() => ({
  h1: document.querySelector('h1')?.innerText,
  h1Count: document.querySelectorAll('h1').length,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  logoLoaded: document.querySelector('.brand img')?.naturalWidth === 390,
  headerHasInicio: [...document.querySelectorAll('.desktop-nav a')].some(a => a.textContent.trim() === 'Inicio'),
  brokenImages: [...document.images].filter(img => img.complete && !img.naturalWidth).length
}))()`);
await evaluate(`localStorage.setItem('solarcheck-cookie-choice', 'essential'); location.reload(); true`);
await waitFor(`document.readyState === 'complete' && Boolean(document.querySelector('.home-hero'))`);
await wait(180);
result.screenshots.push(await screenshot('solarcheck-hero-slide-1-desktop.png'));

const trigger = await evaluate(`(() => { const r=document.querySelector('[aria-controls="solutions-menu"]').getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,bottom:r.bottom}; })()`);
await moveMouse(trigger.x, trigger.y);
await wait(100);
const menu = await evaluate(`(() => { const el=document.querySelector('#solutions-menu'); const r=el.getBoundingClientRect(); return {open:el.classList.contains('open'),top:r.top,left:r.left,width:r.width}; })()`);
const menuStates = [];
for (let step = 0; step <= 9; step += 1) {
  const y = trigger.bottom - 2 + ((menu.top + 28) - (trigger.bottom - 2)) * (step / 9);
  await moveMouse(trigger.x, y);
  await wait(38);
  menuStates.push(await evaluate(`document.querySelector('#solutions-menu').classList.contains('open')`));
}
const firstService = await evaluate(`(() => { const r=document.querySelector('#solutions-menu .mega-service').getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; })()`);
await moveMouse(firstService.x, firstService.y);
await command('Input.dispatchMouseEvent', {type: 'mousePressed', x: firstService.x, y: firstService.y, button: 'left', clickCount: 1});
await command('Input.dispatchMouseEvent', {type: 'mouseReleased', x: firstService.x, y: firstService.y, button: 'left', clickCount: 1});
await waitFor(`location.pathname === '/laminas-solares-coche/'`);
result.desktop.megaMenu = {opened: menu.open, remainedOpenAcrossBridge: menuStates.every(Boolean), clickedDestination: await evaluate('location.pathname')};

await navigate('http://127.0.0.1:4173/');
const centerTrigger = await evaluate(`(() => { const r=document.querySelector('[aria-controls="center-menu"]').getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,bottom:r.bottom}; })()`);
await moveMouse(centerTrigger.x, centerTrigger.y);
await wait(100);
const centerMenu = await evaluate(`(() => { const el=document.querySelector('#center-menu'); const r=el.getBoundingClientRect(); return {open:el.classList.contains('open'),top:r.top}; })()`);
const centerStates = [];
for (let step = 0; step <= 7; step += 1) {
  const y = centerTrigger.bottom - 2 + ((centerMenu.top + 18) - (centerTrigger.bottom - 2)) * (step / 7);
  await moveMouse(centerTrigger.x, y);
  await wait(38);
  centerStates.push(await evaluate(`document.querySelector('#center-menu').classList.contains('open')`));
}
result.desktop.centerMenu = {opened: centerMenu.open, remainedOpenAcrossBridge: centerStates.every(Boolean)};

await navigate('http://127.0.0.1:4173/');
for (const index of [1, 2]) {
  await evaluate(`document.querySelectorAll('.hero-slide-tabs button')[${index}].click()`);
  await wait(220);
  result.desktop[`slide${index + 1}`] = await evaluate(`(() => ({h1:document.querySelector('h1')?.innerText, stage:document.querySelector('.hero-stage')?.className, brokenImages:[...document.images].filter(img=>img.complete&&!img.naturalWidth).length}))()`);
  result.screenshots.push(await screenshot(`solarcheck-hero-slide-${index + 1}-desktop.png`));
}

await viewport(390, 844, true);
await navigate('http://127.0.0.1:4173/');
result.mobile.initial = await evaluate(`(() => ({
  h1Count: document.querySelectorAll('h1').length,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  logo: (()=>{const r=document.querySelector('.brand-mark').getBoundingClientRect();return {width:r.width,height:r.height,loaded:document.querySelector('.brand img').naturalWidth===390}})(),
  stage: (()=>{const r=document.querySelector('.hero-stage').getBoundingClientRect();return {width:r.width,height:r.height}})(),
  brokenImages: [...document.images].filter(img => img.complete && !img.naturalWidth).length
}))()`);
result.screenshots.push(await screenshot('solarcheck-hero-mobile.png'));

for (const index of [1, 2]) {
  await evaluate(`document.querySelectorAll('.hero-slide-tabs button')[${index}].click()`);
  await wait(340);
  result.mobile[`slide${index + 1}`] = await evaluate(`(() => ({
    h1: document.querySelector('h1')?.innerText,
    stage: (() => { const r = document.querySelector('.hero-stage').getBoundingClientRect(); return {width:r.width,height:r.height,top:r.top}; })(),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    brokenImages: [...document.images].filter(img => img.complete && !img.naturalWidth).length
  }))()`);
  await evaluate(`document.querySelector('.hero-stage').scrollIntoView({block:'center'}); true`);
  await wait(180);
  result.screenshots.push(await screenshot(`solarcheck-hero-slide-${index + 1}-mobile.png`));
}

await navigate('http://127.0.0.1:4173/');
await evaluate(`document.querySelector('.menu-toggle').click()`);
await wait(380);
result.mobile.menu = await evaluate(`(() => ({open:document.querySelector('.mobile-panel').classList.contains('open'), hasInicio:[...document.querySelectorAll('.mobile-panel nav a')].some(a=>a.textContent.trim().startsWith('Inicio')), links:document.querySelectorAll('.mobile-panel nav a').length}))()`);
result.screenshots.push(await screenshot('solarcheck-menu-mobile.png'));

const routes = [
  '/',
  '/servicios/',
  '/laminas-solares-coche/',
  '/laminas-edificios/',
  '/clearshield-ppf/',
  '/trabajos/',
  '/empresa/',
  '/preguntas-frecuentes/',
  '/contacto/',
  '/presupuesto/',
  '/privacidad/',
  '/cookies/',
  '/aviso-legal/',
];

result.routes = {};
for (const route of routes) {
  await navigate(`http://127.0.0.1:4173${route}`);
  result.routes[route] = await evaluate(`(() => {
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    return {
    title: document.title,
    h1Count: document.querySelectorAll('h1').length,
    overflow,
    overflowElements: overflow > 0 ? [...document.querySelectorAll('body *')].map(element => {
      const rect = element.getBoundingClientRect();
      return {element, rect};
    }).filter(({rect}) => rect.right > document.documentElement.clientWidth + .5 || rect.left < -.5)
      .slice(0, 8)
      .map(({element, rect}) => ({
        node: element.tagName.toLowerCase(),
        className: typeof element.className === 'string' ? element.className : '',
        left: Math.round(rect.left * 10) / 10,
        right: Math.round(rect.right * 10) / 10,
        width: Math.round(rect.width * 10) / 10
      })) : [],
    brokenImages: [...document.images].filter(img => img.complete && !img.naturalWidth).length,
    logoHomeLink: document.querySelector('.brand')?.getAttribute('href') === '/'
  }})()`);
}

console.log(JSON.stringify(result, null, 2));
socket.close();
