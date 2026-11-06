/* Shared-contract/service adapter. No provider runtime, sample data, or persistence. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  let context='';
  let state, language = 'uz-Latn', data, busy = false, version = 0, result = '', userPaused = false, attempted = false, playPending = false;
  const audio = $('#bgMusic'), music = $('#taklifla-music-btn');
  const text = (s,v) => { const e = $(s); if(e) e.textContent = v || ''; };
  const l = () => window.UCHRASHUV_COPY[language];
  const safeUrl = value => typeof value === 'string' && (/^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value)) ? value : '';
  const show = (s, value) => { $(s).hidden = !value; };
  const closed = () => !state.rsvpEnabled || !!(state.rsvpDeadline && new Intl.DateTimeFormat('en-CA',{timeZone:state.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()) > state.rsvpDeadline);
  const status = key => {$('#reply-status').dataset.statusKey=key;text('#reply-status',key?l()[key]:'');};
  function fitName() {
    const e = $('.cover-recipient'); e.style.removeProperty('--recipient-size');
    let size = parseFloat(getComputedStyle(e).fontSize);
    while ((e.scrollWidth > e.clientWidth + 1 || e.getBoundingClientRect().height > 150) && size > 24) e.style.setProperty('--recipient-size', --size + 'px');
  }
  function musicLabel() {
    text('.taklifla-music-label', audio.paused ? l().music : l().pause);
    music.setAttribute('aria-label', audio.paused ? l().music : l().pause);
    music.setAttribute('aria-pressed', String(!audio.paused));
    music.classList.toggle('playing',!audio.paused);
  }
  function renderConfirmation() {
    text('.confirm-eye', state.preview ? l().preview : l().accepted);
    text('.confirm-script', result === 'no' ? l().no : l().yay);
    show('.confirm-msg', result !== 'no'); show('.confirm-meta',result !== 'no');
    text('.cm-pre',l().pre); text('.cm-mid',l().mid); text('.cm-post',l().post);
    text('.cm-date', data.date); text('.cm-venue',data.venue.name);
    text('.cm-time',data.time); text('.cm-day',data.weekday);
    text('.confirm-cta > span:first-child',l().map);
    const query = [data.venue.name,data.venue.address].filter(Boolean).join(' ');
    const map = safeUrl(data.venue.mapUrl) || (query ? 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query) : '');
    show('#confirm-cta', !!map && result !== 'no');
    if(map) $('#confirm-cta').href = map; else $('#confirm-cta').removeAttribute('href');
    $('#confirm').setAttribute('aria-label',state.preview ? l().preview : l().accepted);
  }
  function render() {
    data = state.variants[language];
    document.documentElement.lang = language; document.title = data.title || 'Uchrashuv maktubi';
    document.body.classList.toggle('reduce-motion',!!state.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches);
    text('.cover-mono',l().invitation); text('.cover-line .nm',data.sender); text('.cl-text',l().ask);
    text('.cover-recipient',data.recipient); text('.seal-mono',[...data.sender][0] || '');
    text('.pill > span:first-child',l().open); text('.cover-hint',l().hint); $('#cover').setAttribute('aria-label',l().open);
    text('.lt-eye', data.eventLabel || l().letter);
    const to = $('.lt-to'); to.replaceChildren();
    if(data.greeting) to.textContent = data.greeting;
    else { const b = document.createElement('b'); b.textContent = data.recipient; to.append(b, document.createTextNode(l().to)); }
    text('.q-1',l().q1); text('.q2-text',data.message || l().q2); $('.question').classList.toggle('authored',!!data.message);
    show('.q-mark',!data.message); text('.q-sign b',data.sender);
    text('.prop-cell:nth-child(1) .prop-label',l().date); text('.prop-cell:nth-child(3) .prop-label',l().time); text('.prop-cell.full .prop-label',l().place);
    text('.prop-cell:nth-child(1) .prop-val b',[data.date,data.weekday].filter(Boolean).join(', ')); text('.prop-cell:nth-child(3) .prop-val b',data.time);
    text('.prop-cell.full .prop-val',data.venue.name); text('.prop-sub',data.venue.address);
    show('.prop-cell.full',!!(data.venue.name || data.venue.address));
    text('.yes-btn > span:first-child',l().yes);
    const no = $('#no-btn'); const old = no.textContent;
    const index = Object.values(window.UCHRASHUV_COPY).flatMap(c => [c.stages.indexOf(old)]).find(i => i >= 0) || 0;
    no.textContent = l().stages[index];
    const footer = $('.footer-mark'); [...footer.childNodes].filter(n => n.nodeType === 3).forEach(n => n.remove()); footer.prepend(document.createTextNode(data.sender+' ')); text('.fm-text',l().love);
    const disabled = closed(); show('#yes-btn',!disabled); show('#no-area',!disabled);
    if(disabled)status('closed');else{const key=$('#reply-status').dataset.statusKey;status(key==='closed'?'':key||'');}
    text('.taklifla-lang-current',({'uz-Latn':'Uz','uz-Cyrl':'Уз',en:'En',ru:'Ru'})[language]);
    $('.taklifla-lang-switch').setAttribute('aria-label',l().language);
    $$('[data-lang]').forEach(e => { e.hidden = !state.enabledLocales.includes(e.dataset.lang); e.classList.toggle('active',e.dataset.lang === language); e.setAttribute('aria-checked',String(e.dataset.lang === language)); });
    show('.taklifla-lang-switch',state.enabledLocales.length > 1);
    const src = state.music.enabled ? safeUrl(state.music.url) : '';
    if((audio.getAttribute('src') || '') !== src) { audio.pause(); audio.removeAttribute('src'); if(src) audio.src = src; userPaused = false; attempted = false; }
    audio.muted=!!state.silentPlayback;music.hidden = !src || state.silentPlayback;if(state.silentPlayback)audio.pause();musicLabel(); renderConfirmation();
    delete document.body.dataset.pending;document.documentElement.removeAttribute('data-awaiting-data');document.documentElement.dataset.ready='true';
    requestAnimationFrame(fitName); document.fonts.ready.then(fitName);
  }
  async function play() {
    if(music.hidden || userPaused || playPending) return;
    playPending = true;
    try { await audio.play(); attempted = true; } catch { music.setAttribute('aria-label',l().musicError); }
    finally { playPending = false; musicLabel(); }
  }
  window.uchrashuvOpened = () => { if(state && !userPaused && !attempted && !(state.preview && state.silentPlayback)) void play(); };
  music.addEventListener('click',() => { if(!audio.paused) { userPaused = true; audio.pause(); } else { userPaused = false; void play(); } });
  document.addEventListener('pointerdown',e => { if(state && !state.preview && !attempted && !userPaused && !$('#cover').classList.contains('open') === false && !music.contains(e.target)) void play(); });
  audio.addEventListener('play',musicLabel); audio.addEventListener('pause',musicLabel);
  window.addEventListener('pagehide',() => audio.pause());
  window.uchrashuvReply = async response => {
    if(!state || busy || $('#confirm').classList.contains('show')) return false;
    if(closed()) { status('closed'); return false; }
    result = response;
    if(state.preview) { renderConfirmation(); status('preview'); }
    else {
      if(!data.recipient.trim() || data.recipient.trim().length > 100 || !state.invitationId) { status('missing'); return false; }
      const requestVersion = version;
      busy = true; $('#yes-btn').disabled = true; $('#no-btn').disabled = true; status('sending');
      try {
        const reply = await fetch('/api/public/invitations/'+encodeURIComponent(state.invitationId)+'/rsvp', { method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ name:data.recipient.trim(), status:response, partySize:response === 'yes' ? 1 : 0, note:'', guestToken:state.guestToken || undefined }) });
        const body = await reply.json();
        if(!reply.ok || body.ok !== true) throw new Error('RSVP failed');
        if(requestVersion !== version) return false;
        status(''); renderConfirmation();
      } catch { if(requestVersion === version) status('error'); return false; }
      finally { if(requestVersion===version){busy = false; $('#yes-btn').disabled = false; $('#no-btn').disabled = false;} }
    }
    // Reduced-motion No is an actual decline; the playful normal-motion surrender remains Yes.
    if(response === 'no') { $('#confirm').classList.add('show'); $('#confirm').setAttribute('aria-hidden','false'); $('#confirm').inert = false; $('#letter').inert = true; $('#confirm').focus({preventScroll:true}); }
    return true;
  };
  function menu(open) { $('.taklifla-lang-switch').classList.toggle('open',open); $('.taklifla-lang-toggle').setAttribute('aria-expanded',String(open)); }
  $('.taklifla-lang-toggle').addEventListener('click',e => { e.stopPropagation(); menu(!$('.taklifla-lang-switch').classList.contains('open')); });
  $('.taklifla-lang-menu').addEventListener('click',e => { const b = e.target.closest('[data-lang]'); if(!b || !state?.enabledLocales.includes(b.dataset.lang)) return; language = b.dataset.lang; render(); menu(false); $('.taklifla-lang-toggle').focus(); });
  document.addEventListener('click',e => { if(!$('.taklifla-lang-switch').contains(e.target)) menu(false); });
  document.addEventListener('keydown',e => {
    if(e.key === 'Escape') {
      if($('.taklifla-lang-switch').classList.contains('open')) { menu(false); $('.taklifla-lang-toggle').focus(); }
      if($('#confirm').classList.contains('show')) { $('#confirm').classList.remove('show'); $('#confirm').setAttribute('aria-hidden','true'); $('#confirm').inert = true; $('#letter').inert = false; $('#yes-btn').focus({preventScroll:true}); }
    }
    if(e.key === 'Tab' && $('#confirm').classList.contains('show')) { e.preventDefault(); ($('#confirm-cta').hidden ? $('#confirm') : $('#confirm-cta')).focus({preventScroll:true}); }
  });
  window.addEventListener('message',e => {
    if(e.origin !== location.origin || e.source !== parent || e.data?.type !== 'taklifla-uchrashuv:update') return;
    const next = e.data.payload;
    if(!next?.variants || !Array.isArray(next.enabledLocales) || !next.enabledLocales.length || next.enabledLocales.some(k => !window.UCHRASHUV_COPY[k] || !next.variants[k])) return;
    const key=[next.invitationId,next.guestToken,next.preview].join(':');if(key!==context){context=key;version++;busy=false;result='';status('');$('#confirm').classList.remove('show');$('#confirm').inert=true;$('#confirm').setAttribute('aria-hidden','true');$('#letter').inert=!$('#cover').classList.contains('open');}
    state = next; language = state.enabledLocales.includes(state.locale) ? state.locale : state.enabledLocales[0]; render();
  });
  parent.postMessage({type:'uchrashuv:ready'},location.origin);
  window.addEventListener('resize',fitName);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',() => { if(state) render(); });
})();
