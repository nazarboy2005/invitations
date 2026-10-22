import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { TEMPLATES } from '@taklifnoma/contracts';

const root = process.cwd();
const dir = path.join(root, 'apps/web/public/templates/taklifnomachi-12');
const html = readFileSync(path.join(dir, 'index.html'), 'utf8');
const adapter = readFileSync(path.join(dir, 'adapter.js'), 'utf8');
const source = readFileSync(path.join(dir, 'source/demo/12/index.html'), 'utf8');

test('demo 12 stays unpublished and joins the Marxaba renderer', () => {
  const template = TEMPLATES.find((entry) => entry.id === 'taklifnomachi-12');
  assert.ok(template);
  assert.equal(template.published, false);
  assert.equal(template.previewImage, '/templates/taklifnomachi-12/source/templates/12/assets/hero.png');
  assert.match(readFileSync(path.join(root, 'apps/web/src/templates/marxaba/index.ts'), 'utf8'), /"taklifnomachi-12"/);
  assert.match(readFileSync(path.join(root, 'packages/database/migrations/0099_register_taklifnomachi_12.sql'), 'utf8'), /published\)\s*VALUES\s*\([^\n]+false/i);
});

test('captured source is preserved and production references local captured assets', () => {
  assert.match(source, /Bekzod/);
  assert.ok(existsSync(path.join(dir, 'source/templates/12/assets/0521.mp4')));
  assert.ok(existsSync(path.join(dir, 'source/templates/12/assets/hero.png')));
  assert.ok(existsSync(path.join(dir, 'source/templates/12/css/style.css')));
  assert.ok(existsSync(path.join(dir, 'source/fonts.gstatic.com/s/')));
  assert.match(html, /source\/templates\/12\/css\/style\.css/);
  assert.match(html, /adapter\.css/);
  assert.match(html, /adapter\.js/);
  assert.doesNotMatch(html + adapter, /Bekzod|Munisa|2026|demo.?12|cloudflare|webhook|action="https?:/i);
  assert.doesNotMatch(html + adapter, /fonts\.googleapis\.com|fonts\.gstatic\.com/i);
  assert.match(html, /source\/templates\/12\/assets\//);
});

test('adapter maps live fields and routes RSVP and wishes to public invitation APIs', () => {
  for (const field of ['groom', 'bride', 'greeting', 'message', 'dateTime', 'venue', 'program', 'gallery', 'contacts', 'music', 'catalogPreview', 'toyona']) assert.match(adapter, new RegExp(`data\\.${field}`));
  assert.match(adapter, /\/rsvp/);
  assert.match(adapter, /\/wishes/);
  assert.match(adapter, /guestToken/);
  assert.match(adapter, /marxaba:update/);
  assert.match(adapter, /selectedIndex === 2/);
  assert.match(adapter, /!data\.catalogPreview/);
});
