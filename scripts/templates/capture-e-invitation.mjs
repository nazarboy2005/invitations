import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../../apps/web/package.json', import.meta.url));
const { chromium } = require('playwright');
const ids = ['olive-manor-edition', 'islamic-edition', 'monochrome-editorial-edition', 'xatna-edition'];
const roots = ['.olive-manor-edition', '.islamic-edition', '.section-editorial', '.xatna-edition'];
const browser = await chromium.launch({ headless: true });
for (const [i, id] of ids.entries()) {
  const dir = path.resolve(`apps/web/public/templates/${id}/source/current`);
  await fs.mkdir(dir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const responses = [];
  page.on('response', r => responses.push(r));
  const body = async r => r.body().catch(async () => Buffer.from(await (await fetch(r.url())).arrayBuffer()));
  await page.goto(`https://e-invitation.uz/demo/${id}/`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator(roots[i]).waitFor();
  await page.waitForTimeout(1500);
  const html = await page.locator(roots[i]).evaluate(el => el.outerHTML);
  await fs.writeFile(path.join(dir, 'rendered-reference.html'), html);
  await page.screenshot({ path: `D:/Projects/Fotiha/output/${id}-reference-opening.png` });
  const records = [];
  const writes = new Map();
  async function save(url, body) {
    const u = new URL(url);
    const name = u.hostname === 'assets.e-invitation.uz' ? `assets/${path.basename(u.pathname)}`
      : u.hostname === 'fonts.gstatic.com' ? `fonts/${path.basename(u.pathname)}` : path.basename(u.pathname);
    if (writes.has(url)) return writes.get(url);
    const task = (async () => {
      body ??= Buffer.from(await (await fetch(url)).arrayBuffer());
      await fs.mkdir(path.dirname(path.join(dir, name)), { recursive: true });
      await fs.writeFile(path.join(dir, name), body);
      records.push({ url, file: name, sha256: crypto.createHash('sha256').update(body).digest('hex') });
      return `/templates/${id}/source/current/${name}`;
    })();
    writes.set(url, task);
    return task;
  }
  let fonts = '';
  for (const r of responses) {
    if (r.status() !== 200) continue;
    const url = r.url();
    if (url.includes('assets.e-invitation.uz/') && url.includes(`/${id}/`)) await save(url, await body(r));
    if (url.includes('fonts.gstatic.com/')) await save(url, await body(r));
    if (url.includes('fonts.googleapis.com/')) fonts += '\n' + (await body(r)).toString();
    if (url.includes('/_nuxt/') && url.endsWith('.css') && (url.includes('InvitationEdition.') || url.includes(['OliveManorEdition.', 'IslamicEdition.', 'MonochromeEditorialEdition.', 'XatnaEdition.'][i]))) {
      await fs.writeFile(path.join(dir, url.includes('InvitationEdition.') ? 'invitation.css' : 'template.css'), await body(r));
      records.push({ url, file: url.includes('InvitationEdition.') ? 'invitation.css' : 'template.css', sha256: crypto.createHash('sha256').update(await body(r)).digest('hex') });
    }
    if (url.includes('/_nuxt/') && url.endsWith('.js')) {
      const text = (await body(r)).toString();
      if (text.includes(`__name:"${['OliveManorEdition', 'IslamicEdition', 'MonochromeEditorialEdition', 'XatnaEdition'][i]}"`)) {
        await fs.writeFile(path.join(dir, 'template.module.js'), text);
        records.push({ url, file: 'template.module.js', sha256: crypto.createHash('sha256').update(text).digest('hex') });
      }
    }
  }
  for (const match of fonts.matchAll(/url\((https:\/\/[^)]+)\)/g)) fonts = fonts.replaceAll(match[1], await save(match[1]));
  await fs.writeFile(path.join(dir, 'fonts.css'), fonts);
  const htmlUrls = [...new Set([...html.matchAll(/https:\/\/assets\.e-invitation\.uz\/[^"'\s)]+/g)].map(m => m[0]))];
  for (const url of htmlUrls) {
    if (url.includes(`/${id}/`)) {
      const res = await fetch(url);
      if (res.ok) await save(url, Buffer.from(await res.arrayBuffer()));
      else records.push({ url, status: res.status() });
    }
  }
  await fs.writeFile(path.join(dir, 'provenance.json'), JSON.stringify({ captured: new Date().toISOString(), reference: page.url(), files: records }, null, 2));
  console.log(JSON.stringify({ id, nodes: await page.locator(roots[i]).locator('*').count(), assets: records.length }));
  await page.close();
}
await browser.close();
