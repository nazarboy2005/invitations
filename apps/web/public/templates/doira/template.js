/* Doira: three guest strokes, a percussion performance, then the courtyard opens.
   The timeline owns the reveal; additional taps never jump over its scenes. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const M = window.Marhamat, gsap = window.gsap;
  if (!M) return;
  const data = M.data, intro = $('#intro'), button = $('#open-invitation'), drum = $('#drum'), hero = $('#hero');
  const reduced = M.reducedMotion, lite = () => M.tier === 'lite';
  const localized = (uz, ru, en) => M.lang === 'ru' ? ru : M.lang === 'en' ? en : uz;
  let surface, effects, art, taps = 0, phase = 'loading', opened = false, master, arrival, idle, scrollReady = false, waveIndex = 0;
  let lastTap = 0, resizeTimer;
  const names = [data.groom || '', data.bride || ''];
  const letters = names.map(n => Array.from(n.trim())[0] || '');
  const cyrillic = names.some(n => /[\u0400-\u04ff]/.test(n));
  const scriptFont = cyrillic ? 'Georgia, serif' : '"Great Vibes", Georgia, serif';
  const sound = window.DoiraSound, audioToggle = $('#doira-audio');
  const heroParts = '.hero__copy,.hero__kicker,.hero__name,.hero__date,.hero__when,.hero__greeting,.hero__cue';
  function silenceSong() {
    const audio = $('audio[data-music]');
    if (audio) { audio.pause(); audio.removeAttribute('src'); audio.load(); }
    // This invitation's soundtrack is the drum performance, including in the demo.
    data.music = '';
  }
  function writeNames() {
    const ns = 'http://www.w3.org/2000/svg';
    const vals = [names[0], names[0] && names[1] ? '&' : '', names[1]];
    $$('.hero__name').forEach((holder, i) => {
      holder.hidden = !vals[i];
      $('svg', holder)?.remove();
      const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', i === 1 ? '0 0 120 130' : '0 0 500 130'); svg.setAttribute('aria-hidden', 'true');
      ['name-stroke', 'name-fill'].forEach(cls => {
        const text = document.createElementNS(ns, 'text'); text.textContent = vals[i]; text.setAttribute('class', cls);
        text.setAttribute('x', i === 1 ? '60' : '250'); text.setAttribute('y', '104'); text.setAttribute('text-anchor', 'middle'); text.setAttribute('font-family', scriptFont); text.setAttribute('font-size', '124'); svg.append(text);
      });
      holder.append(svg);
      const texts = [...svg.querySelectorAll('text')];
      const size = Math.min(124, 124 * 450 / Math.max(1, texts[0].getBBox().width));
      texts.forEach(t => t.setAttribute('font-size', String(size)));
    });
  }
  function makeScore() {
    const ns = 'http://www.w3.org/2000/svg', group = $('.score__marks');
    for (let i = 0; i < 48; i++) {
      const a = i / 48 * Math.PI * 2, length = i % 4 === 0 ? 11 : 4;
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', 300 + Math.cos(a) * 286); line.setAttribute('y1', 300 + Math.sin(a) * 286);
      line.setAttribute('x2', 300 + Math.cos(a) * (286 + length)); line.setAttribute('y2', 300 + Math.sin(a) * (286 + length)); group.append(line);
    }
    for (let i = 0; i < 8; i++) {
      const path = document.createElementNS(ns, 'path'); path.setAttribute('d', 'M300 21Q286 9 300 0Q314 9 300 21M300 21V34'); path.setAttribute('transform', `rotate(${i * 45} 300 300)`); group.append(path);
    }
  }
  function setupDrum() {
    const width = drum.getBoundingClientRect().width;
    art = window.DoiraDrum.render({ px: Math.min(600, Math.round((width || 300) * Math.min(devicePixelRatio || 1, 2))), letters, font: scriptFont });
    surface = window.DoiraDrum.skin($('.drum__skin'), art);
    const mini = window.DoiraDrum.render({ px: 160, letters, font: scriptFont }).color.toDataURL('image/webp', .88);
    $$('.mini-drum').forEach(img => { img.src = mini; });
    effects = new window.DoiraEffects($('.fx'), lite() || reduced);
    if (!reduced && !opened) effects.start();
  }
  function status(uz, ru, en) { $('.intro__hint-text').textContent = localized(uz, ru, en); }
  function arrive() {
    phase = 'waiting'; intro.dataset.phase = phase; button.disabled = false; button.setAttribute('aria-label', localized('Doirani uch marta chaling', 'Трижды ударьте в дойру', 'Tap the doira three times'));
    if (!gsap || reduced) return;
    arrival = gsap.timeline({ defaults: { ease: 'power3.out' } });
    arrival.fromTo('.curtain', {filter:'brightness(.4)'}, {filter:'brightness(1)',duration:2.7}, 0)
      .fromTo('.intro__frame', {opacity:0}, {opacity:1,duration:2}, .2)
      .fromTo('.drum', {opacity:0,y:32,scale:.87,rotationX:16,rotationY:-14,rotationZ:-8}, {opacity:1,y:0,scale:1,rotationX:0,rotationY:0,rotationZ:0,duration:2.2,ease:'expo.out'}, .35)
      .fromTo('.drum__score', {opacity:0,scale:.9}, {opacity:.32,scale:1,duration:2}, .7)
      .fromTo('.intro__kicker', {opacity:0,y:10}, {opacity:1,y:0,duration:1.2}, .55)
      .fromTo('.intro__title', {opacity:0,y:14}, {opacity:1,y:0,duration:1.5}, .8)
      .fromTo('.intro__greeting', {opacity:0,y:8}, {opacity:1,y:0,duration:1}, 1.15)
      .fromTo('.intro__hint', {opacity:0,y:12}, {opacity:1,y:0,duration:1.2}, 1.6);
    idle = gsap.to('.drum__skin', {y:-3,duration:2.8,repeat:-1,yoyo:true,ease:'sine.inOut',delay:2.5});
  }
  function beat(kind, power = 1, x = .5, y = .5, scatter = false) {
    if (!surface) return;
    if (!reduced) surface.hit(x, y, power); sound?.[kind](0, power * .8); sound?.jingle(.012, scatter ? 5 : 3, .5 * power);
    if (!reduced) {
      const r = drum.getBoundingClientRect(), box = intro.getBoundingClientRect();
      effects.burst(r.left - box.left + r.width / 2, r.top - box.top + r.height / 2, r.width * .42, power, scatter);
      if (gsap) {
        gsap.fromTo('.drum__face', {scale: .98 - power * .012, rotationZ: kind === 'tak' ? -.65 : .4}, {scale:1,rotationZ:0,duration:.42,ease:'elastic.out(1,.5)',overwrite:true});
        const wave = $$('.drum__wave')[waveIndex++ % 3];
        gsap.fromTo(wave, {scale:.94,opacity:.4}, {scale:1.6 + power * .2,opacity:0,duration:1.25,ease:'power2.out',overwrite:true});
        gsap.fromTo('.intro__spotlight', {opacity:.95}, {opacity:.45,duration:.65,overwrite:true});
      }
    }
    try { navigator.vibrate?.(kind === 'dum' ? 18 : 9); } catch (_) {}
  }
  function tap(event) {
    if (phase !== 'waiting' || !surface) return;
    const now = performance.now(); if (now - lastTap < 135) return; lastTap = now;
    sound?.unlock(); audioToggle.classList.add('is-playing');
    if (arrival?.isActive()) { arrival.progress(1); arrival.kill(); }
    const r = surface.canvas.getBoundingClientRect();
    const pointer = event.detail !== 0;
    const x = pointer ? Math.max(.1, Math.min(.9, (event.clientX - r.left) / r.width)) : .5;
    const y = pointer ? Math.max(.1, Math.min(.9, (event.clientY - r.top) / r.height)) : .5;
    beat(taps === 1 ? 'tak' : 'dum', 1, x, y, taps === 2);
    $$('.intro__beats span')[taps].classList.add('is-hit'); taps++;
    $('.drum__touch').hidden = true;
    surface.set('glow', .04 + taps * .055);
    status(taps === 1 ? 'Yana ikki zarb…' : 'Yana bir zarb…', taps === 1 ? 'Ещё два удара…' : 'Ещё один удар…', taps === 1 ? 'Two more beats…' : 'One more beat…');
    button.setAttribute('aria-label', localized(`Yana ${3-taps} marta chaling`, `Ещё ${3-taps} удара`, `${3-taps} more beats`));
    if (taps === 3) open();
  }
  function revealNames(tl, at) {
    tl.set('.hero__copy', {opacity:1}, at)
      .fromTo('.hero__kicker', {opacity:0,y:12}, {opacity:1,y:0,duration:1.1}, at)
      .fromTo('.hero__date,.hero__when,.hero__greeting', {opacity:0,y:10}, {opacity:1,y:0,duration:1.2,stagger:.15}, at + 2.25)
      .fromTo('.hero__cue', {opacity:0,y:8}, {opacity:1,y:0,duration:1.2}, at + 3.1);
    $$('.hero__name svg').forEach((svg, i) => {
      const time = at + .2 + i * .62;
      tl.fromTo($('.name-stroke', svg), {clipPath:'inset(0 100% 0 0)',opacity:1}, {clipPath:'inset(0 0% 0 0)',opacity:.8,duration:1.65,ease:'power1.inOut'}, time)
        .fromTo($('.name-fill', svg), {clipPath:'inset(0 100% 0 0)'}, {clipPath:'inset(0 0% 0 0)',duration:1.8,ease:'power1.inOut'}, time + .2);
    });
  }
  function open() {
    if (phase !== 'waiting') return;
    phase = 'performing'; intro.dataset.phase = phase; $('.mh-lang')?.classList.add('is-hidden'); button.disabled = true; idle?.kill(); arrival?.kill();
    silenceSong(); sound?.unlock(); surface.live(!reduced); $('.drum__touch').hidden = true;
    status('Oqshom boshlanmoqda…', 'Вечер начинается…', 'The evening begins…');
    if (!gsap || reduced) { finish(); return; }
    master = gsap.timeline({onComplete:finish,defaults:{ease:'power2.inOut'}});
    master.to('.intro__hint', {opacity:0,y:12,duration:.7}, .9)
      .to('.intro__top', {opacity:0,y:-22,duration:1.1}, 2.3)
      .to('.drum__score', {opacity:.9,scale:1.08,duration:2.2}, 1.2)
      .fromTo('.score__draw', {strokeDashoffset:1}, {strokeDashoffset:0,duration:3.1,stagger:.3,ease:'power1.inOut'}, .7)
      .to('.drum__halo', {opacity:1,scale:1.22,duration:2.2}, 1.7)
      .to('.drum__glow', {opacity:.8,duration:2.5}, 1.5)
      .fromTo('.intro__interlude', {opacity:0,y:15}, {opacity:1,y:0,duration:1.5}, 3.5)
      .to('.intro__interlude', {opacity:0,y:-12,duration:1}, 6.3)
      .to('.intro__seam', {opacity:1,boxShadow:'0 0 45px 12px #fbd29b88',duration:1.8}, 3.7)
      .call(() => {beat('dum',1.25,.5,.5,true); effects.part();}, null, 5.55)
      .to('.curtain--left', {xPercent:-103,rotationY:12,duration:3.9,ease:'power2.inOut'}, 5.6)
      .to('.curtain--right', {xPercent:103,rotationY:-12,duration:3.9,ease:'power2.inOut'}, 5.6)
      .to('.intro__seam,.intro__frame', {opacity:0,duration:1.1}, 6)
      .to('.intro__shade', {opacity:0,duration:2.4}, 6.4)
      .to('.drum', {y:-34,scale:.83,rotationX:9,rotationY:-15,rotationZ:-6,duration:1.9}, 5.9)
      .to('.drum', {y:-65,scale:.56,opacity:0,duration:1.7,ease:'power2.in'}, 7.15)
      .to('.intro__spotlight', {opacity:0,duration:1.5}, 7.5)
      .to('.intro__courtyard', {scale:1,filter:'brightness(1)',duration:4,ease:'power2.out'}, 8)
      .fromTo('.scene', {scale:1.16}, {scale:1,duration:4,ease:'power2.out'}, 8)
      .call(() => window.DoiraScene?.start(), null, 8.8)
      .to('.intro', {opacity:0,duration:2.4}, 9.2)
      .to('.fx', {opacity:0,duration:2}, 9.2);
    // A composed doira phrase: bass, dry rim strokes, a short roll, then a final bass.
    [[.45,'tak',.65],[.77,'tak',.75],[1.17,'dum',1],[1.79,'tak',.7],[2.1,'tak',.82],[2.42,'dum',1.05],[3.02,'tak',.68],[3.26,'tak',.72],[3.5,'tak',.8],[3.74,'dum',1.15],[4.32,'tak',.72],[4.5,'tak',.75],[4.67,'tak',.85],[4.82,'tak',.65],[4.97,'tak',.95]].forEach(([at,kind,power],i) => {
      master.call(() => {beat(kind,power,.42 + (i%3)*.08,.44 + (i%2)*.12,i%4===0);surface.set('glow',.16 + i*.012);}, null, at);
    });
    revealNames(master, 10.15);
    master.call(() => {}, null, 14.8); // Hold the completed invitation before unlocking scroll.
  }
  function finish() {
    if (opened) return;
    opened = true; $('.mh-lang')?.classList.add('is-hidden'); phase = 'opened'; intro.dataset.phase = phase; master?.kill(); arrival?.kill(); idle?.kill();
    if (gsap) {
      gsap.set(heroParts, {opacity:1,clearProps:'transform'});
      gsap.set('.hero__name text', {clipPath:'inset(0 0 0 0)'});
      gsap.set('.scene', {scale:1});
    } else { $$(heroParts).forEach(el => {el.style.opacity=1;}); }
    surface?.live(false); surface?.set('glow',0); effects?.stop(); effects?.clear();
    intro.hidden = true; intro.setAttribute('aria-hidden','true'); button.disabled = true;
    silenceSong(); M.open(); document.documentElement.classList.remove('is-locked'); document.body.classList.add('is-open');
    audioToggle.classList.remove('is-playing'); window.DoiraScene?.start();
    if (!scrollReady) { setupScroll(); scrollReady = true; }
    window.ScrollTrigger?.refresh(); $('.hero__names').focus({preventScroll:true});
  }
  function replay() {
    window.scrollTo({top:0,behavior:'instant'}); document.documentElement.classList.add('is-locked');
    document.body.classList.remove('is-open'); $('.mh-lang')?.classList.remove('is-hidden'); opened = false; taps = 0; lastTap = 0; phase = 'waiting';
    master?.kill(); arrival?.kill(); idle?.kill(); intro.hidden = false; intro.removeAttribute('aria-hidden'); intro.dataset.phase = phase;
    const reset = '.intro,.intro__top,.intro__hint,.intro__interlude,.curtain,.intro__shade,.intro__seam,.intro__spotlight,.intro__frame,.intro__courtyard,.drum,.drum__face,.drum__halo,.drum__score,.drum__skin,.drum__glow,.drum__wave,.fx,.score__draw';
    if (gsap) {gsap.killTweensOf(reset);gsap.set(reset,{clearProps:'all'});gsap.set('.hero__copy,.hero__cue',{opacity:0});}
    else intro.style.opacity = 1;
    $$('.intro__beats span').forEach(el => el.classList.remove('is-hit')); $('.drum__touch').hidden = false;
    status('Doirani uch marta chaling','Трижды ударьте в дойру','Tap the doira three times');
    surface?.set('glow',0); surface?.set('flash',0); effects?.resize(); if (!reduced) effects?.start();
    window.DoiraScene?.stop(); arrive(); button.focus({preventScroll:true});
  }

  function setupScroll() {
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.scene__poster', {yPercent:5,scale:1.06,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.6}});
    gsap.to('.rings i', {rotation:i=>i%2?-18:18,ease:'none',scrollTrigger:{trigger:'.rings',start:'top bottom',end:'bottom top',scrub:.6}});
    const items = $$('.program__item');
    gsap.to('.timeline__fill', {scaleY:1,ease:'none',scrollTrigger:{trigger:'.timeline',start:'top 75%',end:'bottom 55%',scrub:.5,
      onUpdate(self) {items.forEach((item,i) => item.classList.toggle('is-lit',self.progress >= (i + 1) / items.length));}
    }});
    const entrances = [
      ['.letter','.section--letter',{opacity:0,rotationX:-18,scaleY:.94,transformPerspective:800,duration:1}],
      ['.date-card','.section--date',{opacity:0,scale:.9,rotation:-1.5,duration:.9,ease:'back.out(1.2)'}],
      ['.program__item','.section--program',{opacity:0,x:i=>i%2?-20:20,stagger:.1,duration:.65}],
      ['.venue__photo','.section--venue',{opacity:0,clipPath:'inset(0 0 100% 0 round 18px)',duration:1.1}],
      ['.dresscode','.section--dress',{opacity:0,scale:.94,rotationY:8,duration:.8}],
      ['.gallery__item','.section--gallery',{opacity:0,x:55,rotation:2,stagger:.12,duration:.8}],
      ['.rsvp-card','.section--rsvp',{opacity:0,y:38,scale:.96,duration:1}],
      ['.wishes__item','.section--wishes',{opacity:0,y:22,rotation:i=>i%2?1.4:-1.4,stagger:.1,duration:.7}],
      ['.gift','.section--toyona',{opacity:0,y:22,rotation:-2,duration:.8}],
      ['.contacts li','.section--contacts',{opacity:0,x:-20,stagger:.1,duration:.6}]
    ];
    entrances.forEach(([target,trigger,vars]) => {
      if ($(target)) gsap.from(target,{ease:'power2.out',...vars,scrollTrigger:{trigger,start:'top 80%',once:true}});
    });
  }

  function init() {
    if (!intro || !button) return;
    silenceSong(); makeScore();
    document.title = names.filter(Boolean).join(' & ') + ' — Doira';
    const fonts = document.fonts ? Promise.race([Promise.all([document.fonts.load('124px "Great Vibes"'), document.fonts.load('16px "Playfair Display"')]), new Promise(r => setTimeout(r,1800))]) : Promise.resolve();
    fonts.catch(() => {}).then(() => {writeNames();setupDrum();if (!opened) arrive();});
    button.addEventListener('click',tap);
    $('#skip-intro').addEventListener('click',() => {sound?.unlock();finish();});
    $('#replay-intro').addEventListener('click',replay);
    audioToggle.addEventListener('click', () => {
      sound?.unlock(); const muted = !sound?.muted; sound?.setMuted(muted);
      audioToggle.setAttribute('aria-pressed',String(!muted));
      audioToggle.setAttribute('aria-label',muted ? localized('Ovozni yoqish','Включить звук','Enable sound') : localized('Ovozni o‘chirish','Выключить звук','Mute sound'));
      if (!muted && phase === 'opened') {sound?.dum(0,.55);sound?.jingle(.04,3,.3);}
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {master?.pause();arrival?.pause();idle?.pause();effects?.stop();sound?.suspend();}
      else {master?.resume();arrival?.resume();idle?.resume();if (phase !== 'opened' && !reduced) effects?.start();if (phase === 'performing') sound?.unlock();}
    });
    addEventListener('resize',() => {
      clearTimeout(resizeTimer);resizeTimer=setTimeout(() => {effects?.resize();window.DoiraScene?.resize();window.ScrollTrigger?.refresh();},180);
    },{passive:true});
    M.on('rsvp',answer => {if(answer?.status==='yes'){sound?.dum(0,.5);sound?.jingle(.08,5,.4);}});
    // Useful for a review without exposing rendering internals to the guest.
    window.Doira = {get phase(){return phase;},get taps(){return taps;},get duration(){return master?.duration()||0;},get webgl(){return !!surface?.gl;}};
  }
  M.on('ready',init);
})();
