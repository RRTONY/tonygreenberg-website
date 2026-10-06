import { chromium } from '/Users/dharmketsavani/.npm/_npx/ac56acf9ae97d38a/node_modules/playwright/index.mjs';
import fs from 'fs';
const routes = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome' });
async function grab(base, r) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  let status;
  try {
    const resp = await p.goto(base + r, { waitUntil: 'domcontentloaded', timeout: 45000 }); status = resp?.status();
    await p.waitForTimeout(5000);
    for (let i = 0; i < 25; i++) { await p.mouse.wheel(0, 900); await p.waitForTimeout(200); }
    await p.waitForTimeout(1500);
    const d = await p.evaluate(() => {
      const root = document.querySelector('main') || document.body;
      return {
        url: location.href,
        title: document.title,
        heads: [...root.querySelectorAll('h1,h2,h3,h4')].map(h => h.tagName + ': ' + h.innerText.trim().replace(/\s+/g, ' ')),
        imgs: [...root.querySelectorAll('img')].map(i => (i.alt || '') + ' | ' + i.currentSrc.slice(0, 120)),
        buttons: [...root.querySelectorAll('button,input,select,textarea')].map(x => x.tagName + ':' + (x.innerText || x.placeholder || x.type || '').trim().slice(0, 50)),
        text: root.innerText,
      };
    });
    d.status = status;
    await p.screenshot({ path: `${base.includes('localhost') ? 'ours' : 'live'}${r.replaceAll('/', '_')}.png`, fullPage: false });
    return d;
  } catch (e) { return { error: String(e), status }; } finally { await p.close(); }
}
for (const r of routes) {
  const [live, ours] = await Promise.all([grab('https://tonygreenberg.com', r), grab('http://localhost:3000', r)]);
  fs.writeFileSync(`cmp${r.replaceAll('/', '_')}.json`, JSON.stringify({ live, ours }, null, 1));
  console.log(r, 'live', live.status, live.url, (live.text||'').length, '| ours', ours.status, ours.url, (ours.text||'').length, live.error||'', ours.error||'');
}
await b.close();
