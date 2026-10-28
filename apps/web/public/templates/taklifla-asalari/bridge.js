/* Platform binding only; source markup/CSS/animation live separately. */
(() => {
  'use strict';
  let state, data, language, approved = [], generation = 0, hasPlayed = false, userPaused = false, pendingPlay = false;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const audio = $('#bgm'), music = $('#musicBtn');
  const text = (selector, value) => { const el = $(selector); if (el) el.textContent = value || ''; };
  const show = (selector, visible) => { const el = $(selector); if (el) el.hidden = !visible; };
  const labels = {
    'uz-Latn': { lang: 'Til', music: 'Musiqa', birthday: 'Tug‘ilgan kuning muborak', wishes: 'uchun tilak qoldiring', name: 'Ismingiz', message: 'Tug‘ilgan kun tilagi, kichik she’r yoki salom…', send: 'Tilak yuborish ☀', empty: 'Birinchi bo‘lib tilak qoldiring ✿', preview: 'Bu namuna. Tilak yuborilmadi.', success: 'Tilagingiz yuborildi. Tasdiqlangach ko‘rinadi.', error: 'Tilak yuborilmadi. Qayta urinib ko‘ring.', loading: 'Yuborilmoqda…', days: ['Kun','Soat','Daqiqa','Soniya'], welcome: 'uchun', arrive: 'Boshlanish vaqti', footer: 'Mehr bilan tayyorlandi.', feedError: 'Tilaklarni yuklab bo‘lmadi.' },
    'uz-Cyrl': { lang: 'Тил', music: 'Мусиқа', birthday: 'Туғилган кунинг муборак', wishes: 'учун тилак қолдиринг', name: 'Исмингиз', message: 'Туғилган кун тилаги, кичик шеър ёки салом…', send: 'Тилак юбориш ☀', empty: 'Биринчи бўлиб тилак қолдиринг ✿', preview: 'Бу намуна. Тилак юборилмади.', success: 'Тилагингиз юборилди. Тасдиқлангач кўринади.', error: 'Тилак юборилмади. Қайта уриниб кўринг.', loading: 'Юборилмоқда…', days: ['Кун','Соат','Дақиқа','Сония'], welcome: 'учун', arrive: 'Бошланиш вақти', footer: 'Меҳр билан тайёрланди.', feedError: 'Тилакларни юклаб бўлмади.' },
    en: { lang: 'Language', music: 'Music', birthday: 'Happy birthday', wishes: 'Leave a wish for', name: 'Your name', message: 'A birthday wish, a tiny poem, a hello…', send: 'Send Sunshine ☀', empty: 'Be the first to leave a wish ✿', preview: 'This is a preview. No wish was sent.', success: 'Your wish was sent and will appear after approval.', error: 'Your wish was not sent. Please try again.', loading: 'Sending…', days: ['Days','Hours','Minutes','Seconds'], welcome: 'For', arrive: 'Start time', footer: 'Made with warmth.', feedError: 'Wishes could not be loaded.' },
    ru: { lang: 'Язык', music: 'Музыка', birthday: 'С днём рождения', wishes: 'Оставьте пожелание для', name: 'Ваше имя', message: 'Поздравление, маленький стих или просто привет…', send: 'Отправить лучик ☀', empty: 'Оставьте пожелание первым ✿', preview: 'Это образец. Пожелание не отправлено.', success: 'Пожелание отправлено и появится после одобрения.', error: 'Не удалось отправить пожелание. Повторите попытку.', loading: 'Отправка…', days: ['Дни','Часы','Минуты','Секунды'], welcome: 'Для', arrive: 'Начало', footer: 'Создано с теплом.', feedError: 'Не удалось загрузить пожелания.' },
  };
  const wording = () => labels[language] || labels['uz-Latn'];
  function feed(list, error = false) {
    const target = $('#wishFeed'); target.replaceChildren();
    if (!list.length) { const el = document.createElement('div'); el.className = 'empty'; el.textContent = error ? wording().feedError : wording().empty; target.append(el); }
    for (const item of list) {
      const el = document.createElement('div'); el.className = 'wish';
      const who = document.createElement('div'); who.className = 'who'; who.textContent = item.name;
      if (item.submittedAt) { const when = document.createElement('span'); when.className = 'when'; when.textContent = ' · ' + new Intl.DateTimeFormat(language === 'uz-Cyrl' ? 'uz-Cyrl-UZ' : language, { month: 'short', day: 'numeric' }).format(new Date(item.submittedAt)); who.append(when); }
      const message = document.createElement('div'); message.className = 'msg'; message.textContent = item.message || item.text || '';
      el.append(who, message); target.append(el);
    }
  }
  function fitName() {
    const el = $('.hero h1.name'); el.style.fontSize = '';
    let size = parseFloat(getComputedStyle(el).fontSize);
    while ((el.scrollWidth > el.clientWidth + 1 || el.clientHeight > innerHeight * .24) && size > 26) el.style.fontSize = --size + 'px';
  }
  function render() {
    data = state.variants[language]; const l = wording();
    document.documentElement.lang = language; document.title = data.title || data.child || 'Asalari';
    for (const [selector, value] of Object.entries(window.ASALARI_COPY[language])) {
      if (selector === '.venue .map-btn') { const el = $(selector); [...el.childNodes].filter(n => n.nodeType === 3).forEach(n => n.remove()); el.append(document.createTextNode(value)); }
      else text(selector, value);
    }
    text('.splash .top-line', data.greeting || window.ASALARI_COPY[language]['.splash .top-line']);
    text('.splash h1', data.title || data.child || data.eventLabel);
    text('.splash p.lede', data.message); text('.hero .pre', language === 'en' && data.age ? `Happy ${data.age}${data.age % 10 === 1 && data.age % 100 !== 11 ? 'st' : data.age % 10 === 2 && data.age % 100 !== 12 ? 'nd' : data.age % 10 === 3 && data.age % 100 !== 13 ? 'rd' : 'th'} birthday` : language === 'ru' && data.age ? `С ${data.age}-летием` : language.startsWith('uz') ? l.birthday.toLocaleLowerCase() : l.birthday);
    text('.hero h1.name', data.child); $('.hero h1.name').dataset.text = data.child;
    text('.splash .monogram', [...data.child][0]?.toUpperCase() || ''); text('.foot .mono', [...data.child][0]?.toUpperCase() || '');
    show('.age-pill', Number.isInteger(data.age) && data.age > 0);
    if (data.age) {
      const ageWords = language === 'uz-Cyrl' ? ['энди', 'ёшда'] : language === 'uz-Latn' ? ['endi', 'yoshda'] : language === 'ru' ? ['исполняется', 'лет'] : ['turning', 'this year'];
      const parts = $$('.age-pill span'); parts[0].textContent = ageWords[0]; parts[1].textContent = ageWords[1];
      text('.age-pill b', String(data.age));
    }
    text('.hero .date', data.date.hero); text('.invite h2', data.title);
    text('.invite .name-mini', language.startsWith('uz') ? `${data.child} ${l.welcome}` : `${l.welcome} ${data.child}`);
    text('.invite p', data.message);
    const spans = $$('.invite .when span'); [data.date.weekday, '', data.date.long, '', data.date.time].forEach((v,i) => spans[i].textContent = v);
    show('.invite .when', !!data.target); show('.countdown', !!data.target);
    text('.timeline h2', data.programHeading || window.ASALARI_COPY[language]['.timeline h2']);
    show('.timeline .sub', false); show('.timeline', data.program.length > 0);
    const timeline = $('.tl'); timeline.replaceChildren();
    for (const item of data.program) {
      const row = document.createElement('div'); row.className = 'tl-item reveal'; row.dataset.id = item.id;
      const marker = document.createElement('div'); marker.className = 'marker'; marker.textContent = item.time;
      const plate = document.createElement('div'); plate.className = 'plate';
      const title = document.createElement('h3'); title.textContent = item.title;
      const desc = document.createElement('p'); desc.textContent = item.description; desc.hidden = !item.description;
      plate.append(title,desc); row.append(marker,plate); timeline.append(row); io.observe(row);
    }
    text('.venue h2', data.venue.name); text('.venue p', data.venue.address);
    show('.venue', !!(data.venue.name || data.venue.address || data.venue.mapUrl));
    const map = $('.map-btn'); map.hidden = !/^https?:\/\//i.test(data.venue.mapUrl);
    if (!map.hidden) map.href = data.venue.mapUrl; else map.removeAttribute('href');
    const dress = data.dressCode; show('.info li:nth-of-type(1)', dress.enabled && !!(dress.style || dress.text || dress.note || dress.colors.length));
    text('.info li:nth-of-type(1) span', [dress.style,dress.text,dress.note,dress.colors.join(' · ')].filter(Boolean).join('\n'));
    text('.info li:nth-of-type(2) b', l.arrive); text('.info li:nth-of-type(2) span', data.date.time); show('.info li:nth-of-type(2)', !!data.date.time);
    show('.wishes', state.wishesEnabled); text('.wishes h2', language.startsWith('uz') ? `${data.child} ${l.wishes}` : `${l.wishes} ${data.child}`);
    $('#wName').placeholder = l.name; $('#wName').setAttribute('aria-label', l.name); $('#wMsg').placeholder = l.message; $('#wMsg').setAttribute('aria-label', l.message);
    text('#wishForm button', l.send); text('.wish-status','');
    $$('.countdown .cell .l').forEach((el,i) => el.textContent = l.days[i]);
    text('.foot .date', data.date.long); text('.foot .line', data.hosts || l.footer);
    $('.taklifla-lang-switch').setAttribute('aria-label',l.lang);
    text('.taklifla-lang-current', ({'uz-Latn':'Uz','uz-Cyrl':'Уз',en:'En',ru:'Ru'})[language]);
    $$('[data-lang]').forEach(el => { el.hidden = !state.enabledLocales.includes(el.dataset.lang); el.classList.toggle('active',el.dataset.lang === language); el.setAttribute('aria-checked',String(el.dataset.lang === language)); });
    show('.taklifla-lang-switch',state.enabledLocales.length > 1);
    music.setAttribute('aria-label',l.music); feed(state.preview ? data.wishes : approved);
    document.body.classList.toggle('reduce-motion', state.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches);
    delete document.body.dataset.pending; tick(); requestAnimationFrame(fitName); document.fonts.ready.then(fitName);
  }
  function tick() {
    if (!data) return;
    let diff = Math.max(0,(data.target || Date.now())-Date.now());
    [86400000,3600000,60000,1000].forEach((n,i) => { const value = Math.floor(diff/n); diff -= value*n; $$('#cd .n')[i].textContent = String(value).padStart(2,'0'); });
  }
  setInterval(tick,1000);
  async function play() {
    if (!state?.music.enabled || !state.music.url || state.silentPlayback || userPaused || pendingPlay) return;
    pendingPlay = true;
    try { await audio.play(); hasPlayed = true; music.classList.add('playing'); music.setAttribute('aria-pressed','true'); } catch { /* Browser policy: keep manual control available. */ }
    finally { pendingPlay = false; }
  }
  music.addEventListener('click', () => { if (audio.paused) { userPaused=false; play(); } else { userPaused=true; audio.pause(); music.classList.remove('playing'); music.setAttribute('aria-pressed','false'); } });
  $('#openBtn').addEventListener('click',() => { if (!hasPlayed) play(); if (document.body.classList.contains('reduce-motion')) { document.documentElement.style.scrollBehavior='auto'; setTimeout(() => $('.hero').scrollIntoView({behavior:'instant'}),65); } });
  document.addEventListener('pointerdown', () => { if (!hasPlayed) play(); });
  const status = document.createElement('div'); status.className = 'wish-status'; status.setAttribute('role','status'); $('#wishForm').append(status);
  $('#wishForm').addEventListener('submit',async e => {
    e.preventDefault(); const l=wording();
    if (state.preview) { status.textContent=l.preview; return; }
    if (!state.wishesEnabled) return;
    const button=$('#wishForm button'); button.disabled=true; status.textContent=l.loading;
    const captured=state;
    try {
      const response=await fetch(`/api/public/invitations/${encodeURIComponent(captured.invitationId)}/wishes`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:$('#wName').value.trim(),message:$('#wMsg').value.trim(),guestToken:captured.guestToken || undefined})});
      if (!response.ok || !(await response.json()).ok) throw Error('wish');
      if (captured===state) { status.textContent=wording().success; $('#wishForm').reset(); }
    } catch { if (captured===state) status.textContent=wording().error; }
    finally { button.disabled=false; }
  });
  const sw=$('.taklifla-lang-switch'), toggle=$('.taklifla-lang-toggle');
  function menu(open) { sw.classList.toggle('open',open); toggle.setAttribute('aria-expanded',String(open)); }
  toggle.addEventListener('click',() => menu(!sw.classList.contains('open')));
  $$('[data-lang]').forEach(el => el.addEventListener('click',() => { language=el.dataset.lang; render(); menu(false); toggle.focus(); }));
  document.addEventListener('click',e => { if (!sw.contains(e.target)) menu(false); });
  document.addEventListener('keydown',e => { if (e.key==='Escape') { menu(false); toggle.focus(); } });
  async function update(payload) {
    const previous=state; const changed = !previous || previous.invitationId!==payload.invitationId;
    state=payload; language=payload.locale in payload.variants ? payload.locale : payload.enabledLocales[0];
    if (changed) { approved=[]; $('#wishForm').reset(); document.body.classList.add('locked'); scrollTo(0,0); }
    render();
    const url=state.music.enabled ? state.music.url : '';
    if ((audio.getAttribute('src') || '') !== url) { audio.pause(); music.classList.remove('playing'); music.setAttribute('aria-pressed','false'); audio.removeAttribute('src'); hasPlayed=false; userPaused=false; if (url) audio.src=url; }
    music.hidden=!url || state.silentPlayback;
    if (state.silentPlayback || !url) audio.pause(); else play();
    const sequence=++generation;
    if (!state.preview && state.wishesEnabled) {
      try { const response=await fetch(`/api/public/invitations/${encodeURIComponent(state.invitationId)}/wishes`,{cache:'no-store'}); if (!response.ok) throw Error('feed'); const result=await response.json(); if (sequence===generation) { approved=Array.isArray(result.wishes) ? result.wishes : []; feed(approved); } }
      catch { if (sequence===generation) feed([],true); }
    }
  }
  window.addEventListener('message', e => { if (e.origin!==location.origin || e.source!==parent || e.data?.type!=='taklifla-asalari:update') return; update(e.data.payload); });
  addEventListener('resize',fitName);
})();
