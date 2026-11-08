// Platform data/API adapter. Template markup, scoped styles and motion stay in their packages.
export async function mount(id, motion) {
  const host = document.getElementById('invitation');
  const base = `/templates/${id}`;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).get('qaReducedMotion') === '1';
  document.documentElement.classList.toggle('e-reduced', reduced);
  const [html, dictionaries] = await Promise.all([
    fetch(`${base}/template.html`).then(check).then(r => r.text()),
    fetch(`${base}/source/labels.json`).then(check).then(r => r.json()),
  ]);
  function check(r) { if (!r.ok) throw Error(`Template resource ${r.status}`); return r; }
  host.innerHTML = html;
  const root = host.firstElementChild;
  root.dataset.eTemplate = id;
  root.setAttribute('aria-busy', 'false');
  const q = s => root.querySelector(s), qa = s => [...root.querySelectorAll(s)];
  const el = (tag, cls = '', text = '') => { const e = document.createElement(tag); e.className = cls; e.textContent = text; return e; };
  const put = (s, value) => qa(s).forEach(e => { e.textContent = value ?? ''; });
  const read = (obj, key) => key.split('.').reduce((v, k) => v?.[k], obj);
  const show = (s, yes) => qa(s).forEach(e => { e.hidden = !yes; });
  const safe = value => { if (!value) return ''; try { const url = new URL(value, location.origin); return ['http:', 'https:', 'tel:', 'mailto:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };
  let data = {}, opened = false, timer, galleryKey = '', contactKey = '', calendarKey = '', updateVersion = 0;
  let dictionary, words;
  const ui = {
    uz: { rsvp: 'Ishtirokingizni tasdiqlang', name: 'Ism va familiya', yes: 'Ha, kelaman', no: 'Kela olmayman', phone: 'Telefon (ixtiyoriy)', wish: 'Tilagingiz', send: 'Javobni yuborish', thanks: 'Rahmat!', pending: 'Rahmat! Tilagingiz tasdiqlangach ko‘rinadi.', error: 'Yuborilmadi. Qayta urinib ko‘ring.', preview: 'Ko‘rish rejimi. Javob yuborilmadi.', copy: 'Raqamni nusxalash', copied: 'Nusxalandi', calendar: 'Taqvimga qo‘shish', wishes: 'Tilaklar', play: 'Musiqani yoqish', pause: 'Pauza', gallery: 'Suratlar', close: 'Yopish', previous: 'Oldingi surat', next: 'Keyingi surat' },
    'uz-Cyrl': { rsvp: 'Иштирокингизни тасдиқланг', name: 'Исм ва фамилия', yes: 'Ҳа, келаман', no: 'Кела олмайман', phone: 'Телефон (ихтиёрий)', wish: 'Тилагингиз', send: 'Жавобни юбориш', thanks: 'Раҳмат!', pending: 'Раҳмат! Тилагингиз тасдиқлангач кўринади.', error: 'Юборилмади. Қайта уриниб кўринг.', preview: 'Кўриш режими. Жавоб юборилмади.', copy: 'Рақамни нусхалаш', copied: 'Нусхаланди', calendar: 'Тақвимга қўшиш', wishes: 'Тилаклар', play: 'Мусиқани ёқиш', pause: 'Пауза', gallery: 'Суратлар', close: 'Ёпиш', previous: 'Олдинги сурат', next: 'Кейинги сурат' },
    en: { rsvp: 'Confirm your attendance', name: 'Full name', yes: 'I will attend', no: 'I cannot attend', phone: 'Phone (optional)', wish: 'Your wish', send: 'Send response', thanks: 'Thank you!', pending: 'Thank you! Your wish will appear after approval.', error: 'Could not send. Please try again.', preview: 'Preview only. No response was sent.', copy: 'Copy card number', copied: 'Copied', calendar: 'Add to calendar', wishes: 'Wishes', play: 'Play music', pause: 'Pause music', gallery: 'Photos', close: 'Close', previous: 'Previous photo', next: 'Next photo' },
    ru: { rsvp: 'Подтвердите участие', name: 'Имя и фамилия', yes: 'Приду', no: 'Не смогу', phone: 'Телефон (необязательно)', wish: 'Пожелание', send: 'Отправить ответ', thanks: 'Спасибо!', pending: 'Спасибо! Пожелание появится после одобрения.', error: 'Не удалось отправить. Попробуйте снова.', preview: 'Предпросмотр. Ответ не отправлен.', copy: 'Скопировать номер карты', copied: 'Скопировано', calendar: 'Добавить в календарь', wishes: 'Пожелания', play: 'Включить музыку', pause: 'Приостановить музыку', gallery: 'Фотографии', close: 'Закрыть', previous: 'Предыдущее фото', next: 'Следующее фото' },
  };
  const locale = () => data.locale === 'uz' ? 'uz-Latn' : data.locale || 'uz-Latn';
  const labelLocale = () => locale() === 'uz-Latn' ? 'uz' : locale() === 'uz-Cyrl' ? 'oz' : locale();
  const state = { get data() { return data; }, get opened() { return opened; }, reduced, root, q, qa };
  const controls = el('nav', 'e-languages'); controls.setAttribute('aria-label', 'Language'); root.append(controls);
  const audio = document.createElement('audio'); audio.loop = true; audio.preload = 'none'; audio.id = 'e-audio';
  const musicButton = el('button', 'e-music', '♪'); musicButton.type = 'button'; root.append(audio, musicButton);
  let audioSrc = '', guestPaused = false, attempted = false;
  const syncMusic = () => { const playing = !audio.paused; musicButton.textContent = playing ? '❚❚' : '♪'; musicButton.setAttribute('aria-pressed', String(playing)); musicButton.setAttribute('aria-label', playing ? words?.pause || '' : words?.play || ''); };
  ['play', 'pause', 'error', 'ended'].forEach(name => audio.addEventListener(name, syncMusic));
  async function play() { if (!audioSrc || data.silentPlayback || guestPaused) return; attempted = true; try { await audio.play(); } catch {} }
  musicButton.onclick = async () => { if (audio.paused) { guestPaused = false; await play(); } else { guestPaused = true; audio.pause(); } syncMusic(); };
  root.addEventListener('pointerup', () => { if (opened && audio.paused && !guestPaused && !data.silentPlayback) play(); }, { passive: true });

  const intro = q('.section-intro,.section-xatna-intro');
  const locked = qa('[inert]');
  if (id === 'islomiy') qa('section:not(.section-hero),.quote-block').forEach(section => { section.inert = true; locked.push(section); });
  document.documentElement.classList.add('e-opening');
  function finish() {
    if (opened) return;
    opened = true; root.dataset.opened = 'true';
    document.documentElement.classList.remove('e-opening');
    locked.forEach(e => { e.inert = false; e.removeAttribute('aria-hidden'); });
    qa('.e-program,.e-wishes').forEach(e => { e.inert = false; });
    q('.section-hero')?.classList.add('section-hero--ready', 'section-hero--show');
    const target = q('.section-hero,.section-cover');
    target?.setAttribute('tabindex', '-1'); target?.focus({ preventScroll: true });
    reveal();
    root.dispatchEvent(new CustomEvent('e:opened'));
  }
  const motionApi = motion(Object.assign(state, { finish, play }));
  let starting = false;
  const open = () => { if (starting || opened) return; starting = true; play(); motionApi.open(); };
  const opener = q('.section-intro__seal-button,.section-intro__button,.section-xatna-intro__button') || intro;
  opener?.addEventListener('click', open);
  intro?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  document.addEventListener('keydown', event => {
    if (opened || event.key !== 'Tab') return;
    const targets = [...(intro?.querySelectorAll('button:not([disabled]),[tabindex="0"]') || []), ...controls.querySelectorAll('button')].filter(e => e.getClientRects().length);
    if (opener?.matches('[tabindex="0"]') && !targets.includes(opener)) targets.unshift(opener);
    if (!targets.length) return;
    const index = targets.indexOf(document.activeElement);
    event.preventDefault(); targets[index < 0 ? (event.shiftKey ? targets.length - 1 : 0) : (index + (event.shiftKey ? -1 : 1) + targets.length) % targets.length].focus({ preventScroll: true });
  });
  qa('.section-hero__scroll-cue,.section-hero__scroll,.section-cover__scroll').forEach(e => e.addEventListener('click', () => q('.section-invitation,.section-child,.section-couple')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })));
  let revealObserver;
  const revealed = new WeakSet();
  function reveal() {
    if (!opened) return;
    revealObserver ??= new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const e = entry.target;
      const delay = Math.max(0, Number(e.dataset.delay || e.dataset.aosDelay || 0));
      if (e.dataset.aosDuration) e.style.transitionDuration = `${e.dataset.aosDuration}ms`;
      setTimeout(() => e.classList.add('visible', 'is-visible', 'aos-animate', 'is-revealed'), reduced ? 0 : delay);
      revealObserver.unobserve(e);
    }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    qa('.fade-reveal,.bloom-reveal,.slide-reveal,.editorial-reveal,[data-reveal],[data-reveal-stagger],[data-stagger-item],[data-aos]').forEach(e => {
      e.style.setProperty('--editorial-delay', `${Number(e.dataset.delay || 0)}ms`);
      if (revealed.has(e)) return; revealed.add(e);
      if (reduced) e.classList.add('visible', 'is-visible', 'aos-animate', 'is-revealed'); else revealObserver.observe(e);
    });
  }

  // Calendar cells are cloned from the original component, retaining its SVGs and Vue scope attributes.
  const grid = q('.calendar-card__days,.section-calendar__grid,.section-calendar__calendar');
  const cellSelector = id === 'zaytun' ? '.calendar-card__day' : id === 'oq-qora-lavha' ? '.section-calendar__day' : '.section-calendar__cell';
  const selectedClass = id === 'zaytun' ? 'calendar-card__day--active' : id === 'oq-qora-lavha' ? 'section-calendar__day--selected' : id === 'xatna' ? 'is-event' : 'is-wedding';
  const activePrototype = grid?.querySelector(`.${selectedClass}`)?.cloneNode(true);
  const normalPrototype = [...(grid?.querySelectorAll(`${cellSelector}:not(.${selectedClass}):not(.is-inactive):not(.calendar-card__day--empty)`) || [])].at(-1)?.cloneNode(true);
  function calendar() {
    const date = data.date || {}, key = JSON.stringify([date.year, date.monthNumber, date.day]);
    const weekdays = dictionary.common.ui.weekdays || [];
    const headings = qa('.calendar-card__weekdays > span,.section-calendar__weekdays > span,.section-calendar__weekday');
    // Olive's footer weekday is separate from the seven column headings.
    headings.slice(0, 7).forEach((e, i) => { e.textContent = weekdays[i] || ''; });
    if (!grid || key === calendarKey || !activePrototype || !normalPrototype) return;
    calendarKey = key;
    grid.querySelectorAll(cellSelector).forEach(e => e.remove());
    if (!(date.year && date.monthNumber && date.day)) return;
    const year = Number(date.year), month = Number(date.monthNumber), day = Number(date.day);
    const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
    const length = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const previousLength = new Date(Date.UTC(year, month - 1, 0)).getUTCDate();
    const total = Math.ceil((offset + length) / 7) * 7;
    for (let index = 0; index < total; index++) {
      const number = index - offset + 1, inactive = number < 1 || number > length;
      const value = number < 1 ? previousLength + number : number > length ? number - length : number;
      const active = !inactive && number === day;
      const cell = (active ? activePrototype : normalPrototype).cloneNode(true);
      cell.classList.remove('is-lit', 'is-current', 'is-revealed', 'calendar-card__day--lit', 'calendar-card__day--revealed');
      cell.classList.toggle(selectedClass, active); cell.classList.toggle('is-inactive', inactive);
      if (id === 'zaytun') { cell.textContent = inactive ? '' : String(value); cell.classList.toggle('calendar-card__day--empty', inactive); }
      else {
        let text = cell.querySelector('.section-calendar__num,span');
        if (!text) { text = el('span'); [...cell.attributes].filter(a => a.name.startsWith('data-v-')).forEach(a => text.setAttribute(a.name, '')); cell.prepend(text); }
        text.textContent = inactive && id === 'oq-qora-lavha' ? '' : String(value);
        if (id === 'xatna' && !inactive && number <= day && !cell.querySelector('.section-calendar__trail-star')) {
          const star = el('span', 'section-calendar__trail-star', '✦'); star.setAttribute('aria-hidden', 'true');
          [...cell.attributes].filter(a => a.name.startsWith('data-v-')).forEach(a => star.setAttribute(a.name, '')); cell.append(star);
        }
      }
      if (active) cell.setAttribute('aria-current', 'date'); else cell.removeAttribute('aria-current');
      grid.append(cell);
    }
    motionApi.calendar?.(grid, cellSelector, selectedClass);
  }
  const calendarFooter = id === 'oq-qora-lavha' ? q('.section-calendar__footer') : null;
  let calendarLink = q('.section-calendar__add');
  if (!calendarLink && calendarFooter) { calendarLink = document.createElement('a'); for (const attr of calendarFooter.attributes) calendarLink.setAttribute(attr.name, attr.value); calendarLink.append(...calendarFooter.childNodes); calendarFooter.replaceWith(calendarLink); }
  calendarLink ||= el('a', 'e-calendar');
  if (!calendarLink.isConnected) (q('.section-details,.section-datetime,.section-calendar') || root).append(calendarLink);
  let calendarObjectUrl;
  function calendarDownload() {
    if (!calendarFooter) calendarLink.textContent = words.calendar;
    calendarLink.setAttribute('aria-label', words.calendar);
    const start = Date.parse(data.dateTime || ''); calendarLink.hidden = !Number.isFinite(start);
    if (!Number.isFinite(start)) return;
    if (calendarObjectUrl) URL.revokeObjectURL(calendarObjectUrl);
    const format = ms => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    const escape = s => String(s || '').replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    calendarObjectUrl = URL.createObjectURL(new Blob([`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Fotiha//Invitation//EN\r\nBEGIN:VEVENT\r\nUID:${escape(data.invitationId || id)}@fotiha.uz\r\nDTSTAMP:${format(Date.now())}\r\nDTSTART:${format(start)}\r\nDTEND:${format(start + 7200000)}\r\nSUMMARY:${escape(data.title || [data.groom, data.bride].filter(Boolean).join(' & '))}\r\nLOCATION:${escape([data.venue?.name, data.venue?.address].filter(Boolean).join(', '))}\r\nDESCRIPTION:${escape(data.message)}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`], { type: 'text/calendar;charset=utf-8' }));
    calendarLink.href = calendarObjectUrl; calendarLink.download = 'invitation.ics';
  }
  const program = el('section', 'e-program'); program.dataset.section = 'program';
  program.inert = !opened;
  (q('.section-details,.section-datetime,.section-calendar') || root).after(program);
  function renderProgram() {
    program.replaceChildren(); program.hidden = !data.program?.length;
    if (program.hidden) return;
    program.append(el('h2', '', data.programHeading));
    const list = el('ol');
    data.program.forEach(item => { const row = el('li'); row.dataset.itemId = item.id; row.append(el('time', '', item.time), el('span', '', item.title)); list.append(row); }); program.append(list);
  }
  const gallery = q('.section-gallery,.section-child-gallery');
  const galleryContainer = q('.section-gallery__trail,.section-gallery__track,.section-gallery__collage,.section-gallery__grid,.section-child-gallery__grid');
  const gallerySamples = galleryContainer ? [...galleryContainer.children].map(e => e.cloneNode(true)) : [];
  let activePhotos = [];
  function renderGallery() {
    const photos = (data.gallery || []).filter(p => safe(p.src)), key = JSON.stringify(photos);
    if (gallery) gallery.hidden = !photos.length;
    galleryContainer?.querySelectorAll('[role=button]').forEach((item, index) => item.setAttribute('aria-label', `${words.gallery} ${index + 1} / ${photos.length}`));
    if (!galleryContainer || key === galleryKey) return;
    galleryKey = key; activePhotos = photos; galleryContainer.replaceChildren();
    photos.forEach((photo, index) => {
      const item = (gallerySamples[index % gallerySamples.length] || el('figure')).cloneNode(true);
      const image = item.querySelector('img') || document.createElement('img');
      image.src = safe(photo.src); image.alt = photo.alt || photo.caption || ''; image.loading = 'lazy';
      if (!image.isConnected && !item.contains(image)) item.prepend(image);
      item.dataset.itemId = photo.id || String(index); item.tabIndex = 0; item.setAttribute('role', 'button'); item.setAttribute('aria-label', `${words.gallery} ${index + 1} / ${photos.length}`);
      const caption = item.querySelector('figcaption'); if (caption) caption.textContent = photo.caption || `${String(index + 1).padStart(2, '0')}`;
      item.onclick = () => lightbox(index); item.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lightbox(index); } };
      galleryContainer.append(item);
    });
  }
  const dialog = document.createElement('dialog'); dialog.className = 'e-lightbox';
  const close = el('button', '', '×'), previous = el('button', '', '←'), next = el('button', '', '→'), photo = document.createElement('img'), caption = el('p');
  [close, previous, next].forEach(b => b.type = 'button'); dialog.append(close, previous, photo, next, caption); root.append(dialog);
  let photoIndex = 0, swipeX, returnFocus;
  function syncPhoto() { const item = activePhotos[photoIndex]; if (!item) return; photo.src = safe(item.src); photo.alt = item.alt || item.caption || ''; caption.textContent = item.caption || `${photoIndex + 1} / ${activePhotos.length}`; close.setAttribute('aria-label', words.close); previous.setAttribute('aria-label', words.previous); next.setAttribute('aria-label', words.next); }
  function lightbox(index) { photoIndex = index; returnFocus = document.activeElement; syncPhoto(); dialog.showModal(); close.focus(); }
  function movePhoto(step) { photoIndex = (photoIndex + step + activePhotos.length) % activePhotos.length; syncPhoto(); }
  close.onclick = () => dialog.close(); previous.onclick = () => movePhoto(-1); next.onclick = () => movePhoto(1);
  dialog.addEventListener('close', () => returnFocus?.focus({ preventScroll: true }));
  dialog.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') movePhoto(-1); if (e.key === 'ArrowRight') movePhoto(1); });
  dialog.addEventListener('pointerdown', e => { swipeX = e.clientX; });
  dialog.addEventListener('pointerup', e => { if (Math.abs(e.clientX - swipeX) > 55) movePhoto(e.clientX < swipeX ? 1 : -1); });
  const contact = q('.section-contact,.section-final__contacts');
  const contactList = q('.section-contact__list,.section-contact__panel,.section-final__contacts');
  const contactSample = contactList?.querySelector('a,.section-contact__row,.section-row')?.cloneNode(true);
  function contacts() {
    const items = (data.contacts || []).filter(c => safe(c.href)), key = JSON.stringify(items);
    if (contact) contact.hidden = !items.length;
    if (!contactList || key === contactKey) return; contactKey = key;
    // Retain the original envelope/corner artwork in the panel.
    contactList.querySelectorAll('a,.section-contact__row,.section-row,.section-contact__divider,.section-row__divider').forEach(e => e.remove());
    items.forEach(item => {
      const card = contactSample?.cloneNode(true) || el('a', 'e-contact');
      const link = card.matches('a') ? card : card.querySelector('a') || document.createElement('a');
      link.href = safe(item.href); link.rel = 'noopener noreferrer';
      card.setAttribute('aria-label', `${item.label || item.type}: ${item.value}`);
      const title = card.querySelector('small,.section-contact__name,.section-contact__label,.section-row__type');
      const value = card.querySelector('strong,.section-contact__val,.section-row__value');
      if (title) title.textContent = item.label || item.type; if (value) value.textContent = item.value;
      if (!title && !value) link.textContent = `${item.label || ''} ${item.value}`;
      if (link !== card && !card.contains(link)) card.append(link);
      contactList.append(card);
    });
  }
  function venue() {
    const v = data.venue || {}, present = !!(v.name || v.address || v.mapUrl || (v.lat != null && v.lng != null));
    const section = q('.section-venue,.section-xatna-venue,.section-location'); if (!section) return; section.hidden = !present;
    const map = section.querySelector('iframe');
    if (map) { const src = v.lat != null && v.lng != null ? `/maps/venue?latitude=${Number(v.lat)}&longitude=${Number(v.lng)}` : ''; if (src && map.getAttribute('src') !== src) map.src = src; if (!src) map.removeAttribute('src'); map.hidden = !src; map.title = dictionary.common.ui.mapTitle; }
    const href = safe(v.mapUrl) || (v.lat != null && v.lng != null ? `https://yandex.uz/maps/?ll=${v.lng},${v.lat}&pt=${v.lng},${v.lat}&z=16` : '');
    section.querySelectorAll('a').forEach(link => { link.hidden = !href; if (href) link.href = href; else link.removeAttribute('href'); });
  }
  const gift = q('.section-payment,.section-card,.section-gift');
  function renderGift() {
    if (!gift) return; gift.hidden = !(data.toyona?.enabled && (data.toyona.cardNumber || data.toyona.cardHolder));
    const copy = gift.querySelector('button'); if (!copy) return;
    copy.setAttribute('aria-label', words.copy);
    let text = copy.querySelector('span:not([aria-hidden="true"])'); if (!text) { text = el('span'); copy.append(text); } text.textContent = words.copy;
    copy.onclick = async () => { try { await navigator.clipboard.writeText(data.toyona.cardNumber || ''); text.textContent = words.copied; } catch { text.textContent = data.toyona.cardNumber || ''; } };
  }
  const form = q('.section-rsvp form');
  const formSection = q('.section-rsvp');
  if (formSection) formSection.dataset.section = 'rsvp';
  const notice = q('.section-rsvp__notice,.section-rsvp__status') || el('p', 'section-rsvp__notice');
  if (formSection && !notice.isConnected) formSection.append(notice);
  notice.setAttribute('role', 'status'); notice.setAttribute('aria-live', 'polite');
  const wishes = el('section', 'e-wishes'); wishes.dataset.section = 'wishes';
  wishes.inert = !opened;
  formSection?.after(wishes);
  let attendanceEnabled = false, wishesKey = '';
  function configureForm() {
    const labels = { rsvpTitle: words.rsvp, rsvpDescription: data.message, rsvpName: words.name, rsvpAttendance: words.rsvp, rsvpYes: words.yes, rsvpNo: words.no, rsvpPhone: words.phone, rsvpWish: words.wish };
    Object.entries(labels).forEach(([key, value]) => put(`[data-editable-id="${key}"]`, value));
    put('.section-rsvp__legend', words.rsvp);
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: data.timezone || 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    attendanceEnabled = !!data.rsvp?.enabled && !(data.rsvp.deadline && data.rsvp.deadline < today);
    if (formSection) formSection.hidden = !(attendanceEnabled || data.wishesEnabled);
    if (!form) return;
    const radios = [...form.querySelectorAll('input[type="radio"]')];
    radios.forEach((radio, i) => { radio.name = 'status'; radio.value = i === 0 ? 'yes' : 'no'; radio.required = attendanceEnabled; });
    form.querySelectorAll('fieldset').forEach(e => { e.hidden = !attendanceEnabled; });
    const inputs = [...form.querySelectorAll('input:not([type="radio"])')];
    inputs.forEach((input, i) => { input.name = i === 0 ? 'name' : 'phone'; input.maxLength = i === 0 ? 120 : 24; input.required = i === 0; if (i > 0) input.closest('label').hidden = !attendanceEnabled; if (!input.dataset.bound) { if (i === 0) input.value = data.guestName || ''; input.dataset.bound = 'true'; } });
    const wish = form.querySelector('textarea'); if (wish) { wish.name = 'wish'; wish.maxLength = 500; wish.required = !attendanceEnabled && !!data.wishesEnabled; wish.closest('label').hidden = !data.wishesEnabled; }
    const submit = form.querySelector('button[type="submit"],button:not([type])');
    if (submit) { const label = submit.querySelector('span') || submit; label.textContent = words.send; submit.disabled = false; }
    if (data.preview && !notice.textContent.trim()) notice.textContent = words.preview;
    form.querySelectorAll('[disabled]').forEach(e => { e.disabled = false; });
    formSection.querySelectorAll('.section-rsvp__preview-note').forEach(e => { e.hidden = !data.preview; e.textContent = words.preview; });
  }
  if (form) form.onsubmit = async event => {
    event.preventDefault(); if (data.preview) { notice.textContent = words.preview; return; }
    const values = new FormData(form), name = String(values.get('name') || '').trim(), status = String(values.get('status') || ''), phone = String(values.get('phone') || '').trim(), wish = String(values.get('wish') || '').trim();
    if (!name || (attendanceEnabled && !status) || (!attendanceEnabled && !wish)) { notice.textContent = words.error; return; }
    const submit = form.querySelector('button[type="submit"],button:not([type])'); submit.disabled = true; form.setAttribute('aria-busy', 'true');
    try {
      const api = data.apiBase || `/api/public/invitations/${encodeURIComponent(data.invitationId)}`;
      if (attendanceEnabled) await check(await fetch(`${api}/rsvp`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, status, partySize: status === 'yes' ? 1 : 0, note: phone ? `${words.phone}: ${phone}` : '', guestToken: data.guestToken || undefined }) }));
      if (wish && data.wishesEnabled) await check(await fetch(`${api}/wishes`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, message: wish, guestToken: data.guestToken || undefined }) }));
      notice.textContent = wish && data.wishesEnabled ? words.pending : words.thanks; form.reset();
    } catch { notice.textContent = words.error; } finally { submit.disabled = false; form.setAttribute('aria-busy', 'false'); }
  };
  async function renderWishes(version) {
    wishes.hidden = !data.wishesEnabled; if (wishes.hidden) return;
    const key = JSON.stringify([data.preview, data.apiBase, data.invitationId, data.wishes]);
    if (key === wishesKey) return; wishesKey = key;
    let list = data.preview ? data.wishes || [] : [];
    if (!data.preview) try { const result = await fetch(`${data.apiBase || `/api/public/invitations/${encodeURIComponent(data.invitationId)}`}/wishes`).then(check).then(r => r.json()); list = result.wishes || []; } catch {}
    if (key !== wishesKey) return;
    wishes.replaceChildren(el('h2', '', words.wishes));
    list.forEach(w => { const item = el('article'); item.append(el('h3', '', w.name), el('p', '', w.message || w.text)); wishes.append(item); });
    wishes.hidden = !list.length;
  }
  function countdown() {
    const value = Math.max(0, Math.floor((Date.parse(data.dateTime || '') - Date.now()) / 1000));
    const values = Number.isFinite(value) ? [Math.floor(value / 86400), Math.floor(value / 3600) % 24, Math.floor(value / 60) % 60, value % 60] : ['—', '—', '—', '—'];
    qa('.section-countdown__number,.section-countdown__value,.section-countdown__item > .section-item__number,.section-countdown__item > strong,.section-countdown__item > b,.section-calendar__countdown-grid strong').forEach((e, i) => { e.textContent = String(values[i % 4]).padStart(i % 4 ? 2 : 1, '0'); });
  }
  const ambientObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting && opened && !reduced) video.play().catch(() => {}); else video.pause();
  }), { threshold: .05 });
  qa('.section-animation video').forEach(video => { video.muted = true; video.loop = true; video.poster = `${base}/source/current/assets/video-end.jpg`; ambientObserver.observe(video); });
  function fitNames() {
    qa('[data-e-field="groom"],[data-e-field="bride"],[data-e-field="child"]').forEach(name => {
      if (name.hidden) return;
      name.style.removeProperty('font-size'); name.style.removeProperty('line-height'); name.style.whiteSpace = 'nowrap'; name.style.overflowWrap = 'normal';
      const available = Math.min(name.parentElement.clientWidth, root.clientWidth - 48);
      const range = document.createRange(); range.selectNodeContents(name);
      const width = range.getBoundingClientRect().width, size = parseFloat(getComputedStyle(name).fontSize);
      if (width > available && available > 0) name.style.fontSize = `${Math.max(20, Math.floor(size * available / width))}px`;
      if (width * 20 / size > available) { name.style.whiteSpace = 'normal'; name.style.overflowWrap = 'anywhere'; name.style.lineHeight = '1.5'; }
    });
  }
  let lastWidth = 0;
  new ResizeObserver(entries => { const width = entries[0].contentRect.width; if (width !== lastWidth) { lastWidth = width; requestAnimationFrame(fitNames); } }).observe(root);
  document.fonts.ready.then(fitNames);
  async function update(next) {
    data = next || {}; const version = ++updateVersion;
    words = ui[locale()] || ui.uz; dictionary = dictionaries[labelLocale()] || dictionaries.uz;
    document.documentElement.lang = locale();
    qa('[data-e-label]').forEach(e => { const text = read(dictionary, e.dataset.eLabel); if (typeof text === 'string') e.textContent = text; });
    const people = [data.groom, data.bride].filter(Boolean);
    const computed = { ...data, empty: '', date: { ...data.date, monthYear: [data.date?.month, data.date?.year].filter(Boolean).join(', ') }, pair: people.join(' & '), child: (data.people || [data.groom, data.bride]).filter(Boolean).join(' & '), groomInitial: data.groom?.trim()[0] || '', brideInitial: data.bride?.trim()[0] || '', initials: people.map(p => p.trim()[0]).join('&'), hostInitial: data.hosts?.trim()[0] || '', deadline: data.rsvp?.deadline || '' };
    qa('[data-e-field]').forEach(e => { const value = read(computed, e.dataset.eField); e.textContent = value ?? ''; e.hidden = !value; });
    q('.section-hero__date')?.setAttribute('aria-label', data.date?.long || '');
    // The source animates each greeting character. Build the same letter spans from authored content.
    motionApi.text?.();
    controls.replaceChildren(); controls.hidden = (data.languages || []).length < 2;
    (data.languages || []).forEach(code => { const button = el('button', '', ({ uz: 'UZ', 'uz-Latn': 'UZ', 'uz-Cyrl': 'ЎЗ', en: 'EN', ru: 'RU' })[code] || code); button.type = 'button'; button.setAttribute('aria-pressed', String(code === data.locale)); button.onclick = () => parent.postMessage({ type: `${id}:language`, locale: code }, location.origin); controls.append(button); });
    calendar(); calendarDownload(); renderProgram(); renderGallery(); contacts(); venue(); renderGift(); configureForm(); renderWishes(version);
    if (id === 'oq-qora-lavha') {
      put('.section-invitation__monogram span:first-child', computed.groomInitial); put('.section-invitation__monogram span:last-child', computed.brideInitial);
      put('.section-calendar__date-card time', [data.date?.short, data.date?.time].filter(Boolean).join(' / '));
      const stamp = qa('.section-final__seal span'), numbers = [data.date?.day, data.date?.monthNumber, String(data.date?.year || '').slice(-2)];
      stamp.forEach((span, index) => { span.textContent = String(numbers[index] || '').padStart(2, '0'); });
      put('.section-invitation__footer > span:first-child', [dictionary.specific.invitation?.caseLabel, data.date?.short].filter(Boolean).join(' '));
    }
    const music = typeof data.music === 'string' ? data.music : data.music?.url;
    const nextSrc = safe(music); if (audioSrc !== nextSrc) { audioSrc = nextSrc; attempted = false; if (nextSrc) audio.src = nextSrc; else { audio.pause(); audio.removeAttribute('src'); } }
    musicButton.hidden = !audioSrc; syncMusic(); if (opened && !data.catalogPreview && !data.catalogMusic && !attempted) play();
    clearInterval(timer); countdown(); timer = setInterval(countdown, 1000);
    reveal(); root.dispatchEvent(new CustomEvent('e:updated'));
    requestAnimationFrame(fitNames);
  }
  window.addEventListener('message', event => { if (event.origin === location.origin && event.source === parent && event.data?.type === `${id}:update`) update(event.data.payload); });
  let initial = {}; try { initial = JSON.parse(window.name || '{}'); } catch {}
  await update(initial);
  if (reduced) { motionApi.skip?.(); finish(); }
  document.body.style.visibility = 'visible';
  parent.postMessage({ type: `${id}:ready` }, location.origin);
}
