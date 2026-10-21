/* Marhamat invite codec: invitation data <-> compact JSON <-> LZ-compressed URL-safe string.
   Works in the browser (window.MarhamatCodec, needs window.LZString) and in Node (module.exports). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./vendor/lz-string.min.js'));
  else root.MarhamatCodec = factory(root.LZString);
})(typeof self !== 'undefined' ? self : this, function (LZ) {
  'use strict';
  const str = v => (v == null ? '' : String(v));
  const clean = obj => { Object.keys(obj).forEach(k => { const v = obj[k]; if (v === '' || v == null || (Array.isArray(v) && !v.length)) delete obj[k]; }); return obj; };

  // Full invitation (as used by core / templates) -> compact form
  function pack(d) {
    const c = {
      v: 2, t: d.template, l: d.defaultLang, k: d.kind, e: d.eventType,
      g: d.groom, b: d.bride, c: d.extras && d.extras.celebrant, mo: d.monogram,
      gr: d.greeting, pg: d.personalGreetingTemplate, m: d.message, h: d.hosts, hl: d.hostsLabel,
      d: str(d.dateTime).replace(/:00\+05:00$/, ''),
      vn: d.venue && d.venue.name, va: d.venue && d.venue.address,
      vp: d.venue && d.venue.photo,
      vl: d.venue && d.venue.lat != null && d.venue.lng != null ? [+(+d.venue.lat).toFixed(6), +(+d.venue.lng).toFixed(6)] : undefined,
      p: (d.program || []).filter(x => x && (x.time || x.title)).map(x => [str(x.time), str(x.title)]),
      f: d.footer, mu: d.music === '' ? 0 : ((/shared\/music\/([a-z0-9-]{1,40})\.mp3$/.exec(String(d.music || '')) || [])[1] || undefined)
    };
    if (Array.isArray(d.languages)) c.la = d.languages.filter(x => ['uz','ru','en'].includes(x));
    if (d.i18n && typeof d.i18n === 'object') {
      c.x = {};
      Object.keys(d.i18n).filter(lang => ['uz','ru','en'].includes(lang) && d.i18n[lang] && typeof d.i18n[lang] === 'object').forEach(lang => {
        const x = d.i18n[lang], v = {};
        [['e','eventType'],['g','groom'],['b','bride'],['c','celebrant'],['gr','greeting'],['pg','personalGreetingTemplate'],['m','message'],['h','hosts'],['hl','hostsLabel'],['f','footer']].forEach(([short,key]) => { if (x[key] != null) v[short] = key === 'hosts' && x[key] === '' ? 0 : x[key]; });
        if (x.venue) v.v = [x.venue.name || '', x.venue.address || ''];
        if (Array.isArray(x.program)) v.p = x.program.map(item => [str(item.time), str(item.title)]);
        if (x.dressCode) v.dc = [str(x.dressCode.style), str(x.dressCode.text), str(x.dressCode.note), (x.dressCode.colors || []).map(color => [str(color.name), str(color.hex)])];
        if (x.toyona) v.ty = str(x.toyona.note);
        if (Array.isArray(x.extras && x.extras.story || x.story)) v.s = (x.extras && x.extras.story || x.story).map(item => [str(item.title), str(item.text)]);
        if (x.music) v.mu = x.music;
        clean(v); if (Object.keys(v).length) c.x[lang] = v;
      });
      if (!Object.keys(c.x).length) delete c.x;
    }
    if (d.rsvp) c.r = [d.rsvp.enabled === false ? 0 : 1, str(d.rsvp.deadline), +d.rsvp.maxPartySize || 10];
    if (Array.isArray(d.gallery) && d.gallery.length) c.ga = d.gallery.slice(0, 12).map(item => typeof item === 'string' ? item : [str(item.src), str(item.thumb), str(item.alt), str(item.focus)]);
    if (d.dressCode && (d.dressCode.style || d.dressCode.text)) c.dc = [str(d.dressCode.style), str(d.dressCode.text), str(d.dressCode.note), (d.dressCode.colors || []).map(x => [str(x.name), str(x.hex)])];
    if (d.toyona && d.toyona.enabled !== false && d.toyona.cardNumber) c.ty = [str(d.toyona.note), str(d.toyona.bank), str(d.toyona.cardNumber), str(d.toyona.cardHolder)];
    const phone = (d.contacts || []).find(x => x.type === 'phone'), tg = (d.contacts || []).find(x => x.type === 'telegram');
    if (phone || tg) c.ct = [phone ? str(phone.value) : '', tg ? str(tg.value) : ''];
    if (d.extras && Array.isArray(d.extras.story) && d.extras.story.length) c.s = d.extras.story.map(x => [str(x.title), str(x.text)]);
    return clean(c);
  }

  // Compact -> full invitation (only fields that were provided)
  function unpack(c) {
    if (!c || typeof c !== 'object') return null;
    if (c.v != null && ![1, 2].includes(+c.v)) return null;
    const lang = ['uz', 'ru', 'en'].includes(c.l) ? c.l : 'uz';
    const d = { template: c.t, defaultLang: lang, kind: c.k, extras: {} };
    if (Array.isArray(c.la)) d.languages = Array.from(new Set(c.la.filter(x => ['uz','ru','en'].includes(x))));
    const set = (key, val) => { if (val != null && val !== '') d[key] = String(val).slice(0, 1200); };
    set('eventType', c.e); set('groom', c.g); set('bride', c.b); set('monogram', c.mo);
    set('greeting', c.gr); set('personalGreetingTemplate', c.pg); set('message', c.m);
    set('hosts', c.h); set('hostsLabel', c.hl); set('footer', c.f);
    if (c.c) d.extras.celebrant = String(c.c).slice(0, 80);
    if (c.d && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(c.d)) d.dateTime = c.d + ':00+05:00';
    d.venue = {};
    if (c.vn) d.venue.name = String(c.vn).slice(0, 160);
    if (c.va) d.venue.address = String(c.va).slice(0, 300);
    if (c.vp) d.venue.photo = String(c.vp).slice(0, 1000);
    if (Array.isArray(c.vl) && isFinite(c.vl[0]) && isFinite(c.vl[1])) { d.venue.lat = +c.vl[0]; d.venue.lng = +c.vl[1]; }
    if (Array.isArray(c.p)) d.program = c.p.slice(0, 20).map(x => ({ time: String(x[0] || '').slice(0, 10), title: String(x[1] || '').slice(0, 160) }));
    if (Array.isArray(c.ga)) d.gallery = c.ga.slice(0, 12).map(x => Array.isArray(x) ? { src: String(x[0] || '').slice(0, 1000), thumb: String(x[1] || '').slice(0, 1000), alt: String(x[2] || '').slice(0, 180), focus: /^\d{1,3}%\s+\d{1,3}%$/.test(x[3] || '') ? x[3] : '50% 50%' } : String(x || '').slice(0, 1000));
    if (Array.isArray(c.r)) d.rsvp = { enabled: c.r[0] !== 0, deadline: /^\d{4}-\d{2}-\d{2}$/.test(c.r[1]) ? c.r[1] : '', maxPartySize: Math.max(1, Math.min(30, +c.r[2] || 10)) };
    if (Array.isArray(c.dc)) d.dressCode = { style: String(c.dc[0] || ''), text: String(c.dc[1] || ''), note: String(c.dc[2] || ''), colors: (c.dc[3] || []).slice(0, 8).map(x => ({ name: String(x[0] || '').slice(0, 40), hex: /^#[0-9a-f]{3,8}$/i.test(x[1]) ? x[1] : '#cccccc' })) };
    d.toyona = Array.isArray(c.ty) ? { enabled: true, note: String(c.ty[0] || ''), bank: String(c.ty[1] || ''), cardNumber: String(c.ty[2] || '').slice(0, 40), cardHolder: String(c.ty[3] || '').slice(0, 80) } : { enabled: false };
    d.contacts = [];
    if (Array.isArray(c.ct)) {
      if (c.ct[0]) d.contacts.push({ type: 'phone', value: String(c.ct[0]).slice(0, 40) });
      if (c.ct[1]) d.contacts.push({ type: 'telegram', value: '@' + String(c.ct[1]).replace(/^@/, '').replace(/[^\w]/g, '').slice(0, 40) });
    }
    if (Array.isArray(c.s)) d.extras.story = c.s.slice(0, 6).map(x => ({ title: String(x[0] || ''), text: String(x[1] || '') }));
    if (c.mu === 0) d.music = '';
    if (typeof c.mu === 'string' && /^[a-z0-9-]{1,40}$/.test(c.mu)) d.music = `../../shared/music/${c.mu}.mp3`;
    if (c.mu === 1) d.music = undefined;
    if (c.x && typeof c.x === 'object') {
      d.i18n = {};
      Object.keys(c.x).filter(code => ['uz','ru','en'].includes(code)).forEach(code => {
        const x = c.x[code] || {}, v = {};
        [['e','eventType'],['g','groom'],['b','bride'],['c','celebrant'],['gr','greeting'],['pg','personalGreetingTemplate'],['m','message'],['h','hosts'],['hl','hostsLabel'],['f','footer']].forEach(([short,key]) => { if (x[short] != null) v[key] = short === 'h' && x[short] === 0 ? '' : String(x[short]).slice(0,1200); });
        if (Array.isArray(x.v)) v.venue = { name: String(x.v[0] || '').slice(0,160), address: String(x.v[1] || '').slice(0,300) };
        if (Array.isArray(x.p)) v.program = x.p.slice(0,20).map(item => ({ time: String(item[0] || '').slice(0,10), title: String(item[1] || '').slice(0,160) }));
        if (Array.isArray(x.dc)) v.dressCode = { style: String(x.dc[0] || '').slice(0,80), text: String(x.dc[1] || '').slice(0,500), note: String(x.dc[2] || '').slice(0,240), colors: (x.dc[3] || []).slice(0,8).map(color => ({ name: String(color[0] || '').slice(0,40), hex: /^#[0-9a-f]{3,8}$/i.test(color[1]) ? color[1] : '#cccccc' })) };
        if (typeof x.ty === 'string') v.toyona = { note: x.ty.slice(0,120) };
        if (Array.isArray(x.s)) v.extras = { story: x.s.slice(0,6).map(item => ({ title: String(item[0] || '').slice(0,100), text: String(item[1] || '').slice(0,500) })) };
        if (typeof x.mu === 'string' && x.mu.length < 300) v.music = x.mu;
        if (Object.keys(v).length) d.i18n[code] = v;
      });
    }
    return d;
  }

  function encode(data) { return LZ.compressToEncodedURIComponent(JSON.stringify(pack(data))); }
  function decode(text) {
    if (!text) return null;
    try { return unpack(JSON.parse(LZ.decompressFromEncodedURIComponent(String(text)))); } catch (_) { return null; }
  }
  return { pack, unpack, encode, decode };
});
