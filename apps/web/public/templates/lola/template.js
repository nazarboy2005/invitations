(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function buildFlowers() {
    const svg = $('#intro-flowers');
    if (!svg) return [];
    const NS = 'http://www.w3.org/2000/svg';
    const palette = ['#e07a5f', '#c8414b', '#f2c6c2', '#fff9f3', '#df9388', '#ce5d63'];
    const flowers = [];
    const total = 11;
    for (let i = 0; i < total; i++) {
      const x = 15 + i * 40 + (i % 2 ? -5 : 4);
      const h = 112 + ((i * 47) % 104);
      const sway = (i % 2 ? 1 : -1) * (2.4 + (i % 4) * .75);
      const group = document.createElementNS(NS, 'g');
      group.setAttribute('class', 'intro-flower');
      group.style.setProperty('--bx', `${x}px`);
      group.setAttribute('transform', `translate(${x} 280)`);
      const curve = i % 2 ? 13 : -12;
      const stem = document.createElementNS(NS, 'path');
      stem.setAttribute('class', 'intro-stem');
      stem.setAttribute('d', `M0 0 C${curve} -${h * .36} ${-curve} -${h * .72} 0 -${h}`);
      stem.setAttribute('pathLength', '1');
      group.append(stem);
      const left = document.createElementNS(NS, 'path');
      left.setAttribute('class', 'intro-leaf leaf-left');
      left.setAttribute('d', `M0 -${h * .25} C-22 -${h * .35} -29 -${h * .24} -5 -${h * .18} C-1 -${h * .2} 0 -${h * .22} 0 -${h * .25}Z`);
      const right = document.createElementNS(NS, 'path');
      right.setAttribute('class', 'intro-leaf leaf-right');
      right.setAttribute('d', `M0 -${h * .44} C23 -${h * .56} 29 -${h * .45} 4 -${h * .37} C1 -${h * .4} 0 -${h * .42} 0 -${h * .44}Z`);
      group.append(left, right);
      const bloom = document.createElementNS(NS, 'g');
      bloom.setAttribute('class', 'intro-bloom');
      bloom.setAttribute('transform', `translate(0 -${h})`);
      const color = palette[(i * 3) % palette.length];
      const count = 5 + (i % 2);
      for (let j = 0; j < count; j++) {
        const petal = document.createElementNS(NS, 'path');
        petal.setAttribute('class', 'intro-petal');
        petal.setAttribute('fill', color);
        const angle = (360 / count) * j;
        petal.setAttribute('d', 'M0 1 C-9 -7 -8 -20 0 -25 C8 -20 9 -7 0 1Z');
        petal.setAttribute('transform', `rotate(${angle}) scale(.08)`);
        bloom.append(petal);
      }
      const center = document.createElementNS(NS, 'circle');
      center.setAttribute('class', 'intro-center');
      center.setAttribute('r', '3');
      center.setAttribute('cy', '-2');
      bloom.append(center);
      group.append(bloom);
      svg.append(group);
      flowers.push({ group, stem, leaves: [left, right], bloom, sway, x, h });
    }
    return flowers;
  }

  function makePetals() {
    const scene = $('.intro');
    const colors = ['#e07a5f', '#c8414b', '#f2c6c2', '#fff9f3'];
    for (let i = 0; i < 30; i++) {
      const petal = document.createElement('i');
      petal.className = 'loose-petal';
      petal.style.setProperty('--petal-color', colors[i % colors.length]);
      petal.style.setProperty('--px', `${(i * 37) % 100}%`);
      scene.append(petal);
    }
  }

  function setFlowersTimeline(flowers, tl) {
    flowers.forEach((flower, i) => {
      const delay = i * .105 + (i % 3) * .035;
      tl.fromTo(flower.group, { opacity: 0 }, { opacity: 1, duration: .26, ease: 'power1.out' }, delay);
      tl.fromTo(flower.stem, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .85 + (i % 3) * .1, ease: 'power2.out' }, delay);
      tl.fromTo(flower.leaves[0], { scale: 0, rotation: -45 }, { scale: 1, rotation: -8, duration: .46, ease: 'back.out(1.4)' }, delay + .38);
      tl.fromTo(flower.leaves[1], { scale: 0, rotation: 44 }, { scale: 1, rotation: 8, duration: .48, ease: 'back.out(1.35)' }, delay + .5);
      tl.fromTo(flower.bloom, { scale: .12, opacity: .65 }, { scale: 1, opacity: 1, duration: .56, ease: 'back.out(1.6)' }, delay + .7);
      $$('.intro-petal', flower.bloom).forEach((petal, j) => {
        const angle = (360 / flower.bloom.childElementCount) * j;
        tl.to(petal, { attr: { transform: `rotate(${angle}) scale(1)` }, duration: .48, ease: 'back.out(1.45)' }, delay + .74 + j * .018);
      });
      if (!window.Marhamat?.reducedMotion) {
        tl.to(flower.group, { rotation: flower.sway, duration: 1.1 + (i % 3) * .13, yoyo: true, repeat: -1, ease: 'sine.inOut' }, 1.4 + i * .055);
      }
    });
  }

  function reveal() {
    const intro = $('#intro');
    const button = $('#open-invitation');
    if (!intro || !button) return;
    const flowers = buildFlowers();
    makePetals();
    const reduced = !!window.Marhamat?.reducedMotion || window.Marhamat?.tier === 'lite';
    const gsap = window.gsap;
    let actTwo = null;
    let opened = false;
    const finish = () => {
      if (opened) return;
      opened = true;
      if (actTwo) actTwo.progress(1);
      window.clearTimeout(finish.timer);
      document.documentElement.classList.remove('is-locked');
      document.body.classList.remove('is-opening');
      document.body.classList.add('is-open');
      intro.setAttribute('aria-hidden', 'true');
      intro.hidden = true;
      $('#hero')?.scrollIntoView({ block: 'start', behavior: 'auto' });
    };
    const bloomFallback = () => {
      flowers.forEach(({ group }, i) => {
        setTimeout(() => { group.style.transition = 'opacity .2s, transform .8s ease'; group.style.opacity = 1; group.style.transformOrigin = '50% 100%'; group.style.transform = 'translateY(0)'; }, i * 75);
      });
      const copy = $('.intro__copy'), oval = $('.intro__oval');
      setTimeout(() => { copy.style.transition = 'opacity .5s, transform .5s'; copy.style.opacity = 1; copy.style.transform = 'none'; oval.style.opacity = 1; oval.style.transform = 'translateX(-50%) scale(1)'; }, 750);
    };
    if (gsap) {
      if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
      const arrival = gsap.timeline({ defaults: { ease: 'power3.out' } });
      arrival.fromTo('.intro__oval', { scale: .9, opacity: 0 }, { scale: 1, opacity: 1, duration: .95 }, .04);
      setFlowersTimeline(flowers, arrival);
      arrival.fromTo('.intro__copy', { y: 13, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, 1.15);
      arrival.fromTo(button, { y: 9, opacity: 0 }, { y: 0, opacity: 1, duration: .5 }, 1.9);
      if (reduced) arrival.timeScale(1.7);
    } else bloomFallback();

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      if (opened) return;
      if (window.Marhamat?.open) window.Marhamat.open();
      if (reduced) { finish(); return; }
      document.body.classList.add('is-opening');
      const flowersAtCenter = flowers.slice().sort((a, b) => Math.abs(a.x - 215) - Math.abs(b.x - 215));
      if (gsap) {
        actTwo = gsap.timeline({ onComplete: finish });
        flowersAtCenter.forEach(({ group }, i) => {
          actTwo.to(group, { rotation: i % 2 ? 24 : -24, transformOrigin: '50% 100%', duration: .75, ease: 'power2.inOut' }, i * .018);
          actTwo.to(group, { y: 82, opacity: 0, duration: 1.05, ease: 'power2.in' }, .75 + i * .014);
        });
        actTwo.to('.intro__oval', { scale: 8, opacity: 0, duration: 1.45, ease: 'power3.inOut' }, .55);
        actTwo.to('.intro__copy', { scale: .9, y: -13, opacity: 0, duration: .55 }, .15);
        $$('.loose-petal').forEach((petal, i) => {
          actTwo.fromTo(petal, { x: `${(i % 5) * 8 - 16}px`, y: '5vh', rotation: 0, scale: .55, opacity: 0 }, { x: `${Math.sin(i * 1.7) * 80}px`, y: `${-35 - (i % 6) * 15}vh`, rotation: (i % 2 ? 1 : -1) * (280 + i * 9), scale: .8 + (i % 4) * .12, opacity: .8, duration: 1.65, ease: 'sine.out' }, .12 + i * .012);
        });
      } else {
        intro.classList.add('is-fading');
        window.setTimeout(finish, 1200);
      }
      finish.timer = window.setTimeout(finish, 2900);
    });
    intro.addEventListener('click', () => { if (document.body.classList.contains('is-opening')) finish(); });
  }

  function scrollChoreography() {
    const api = window.Marhamat;
    if (!api || api.reducedMotion || api.tier === 'lite') {
      $$('[data-section]').forEach(section => section.classList.add('is-revealed'));
      return;
    }
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      $$('[data-section]').forEach(section => {
        gsap.fromTo(section, { opacity: .58, y: 16 }, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 88%', once: true } });
      });
      gsap.to('.program-stem path', { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.program-section', start: 'top 72%', end: 'bottom 65%', scrub: .7 } });
      gsap.to('.hero__bouquet', { yPercent: 7, rotation: 1.6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
      gsap.to('.stitch-frame path', { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.napkin', start: 'top 83%', end: 'bottom 55%', scrub: .65 } });
      gsap.to('.footer', { '--footer-glow-opacity': .42, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: .7 } });
    } else {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          if (entry.target.matches('.program-section')) entry.target.classList.add('is-stem-grown');
          if (entry.target.matches('.napkin')) entry.target.classList.add('is-sewn');
        }
      }), { threshold: .14 });
      $$('[data-section],.napkin').forEach(section => observer.observe(section));
      $$('.wish-card').forEach(card => observer.observe(card));
      const flowerObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }), { threshold: .3 });
      const watchWishes = () => $$('.wish-card[data-generated]').forEach(card => flowerObserver.observe(card));
      api.on('ready', watchWishes); api.on('wish', watchWishes); watchWishes();
    }
    const bloomObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-bloomed'); bloomObserver.unobserve(entry.target); }
    }), { threshold: .55 });
    const watchProgram = () => $$('.program__item[data-generated]').forEach(item => bloomObserver.observe(item));
    api.on('ready', watchProgram); watchProgram();

    const napkinObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-sewn'); }), { threshold: .25 });
    $$('.napkin').forEach(item => napkinObserver.observe(item));
    const wishObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }), { threshold: .25 });
    const watchWishes = () => $$('.wish-card[data-generated]').forEach(card => wishObserver.observe(card));
    api.on('ready', watchWishes); api.on('wish', watchWishes); watchWishes();
  }

  function giftModal() {
    const modal = $('#sandiq-modal'), open = $('#sandiq-trigger'), close = $('.modal-close', modal);
    if (!modal || !open) return;
    let previous = null;
    const hide = () => { modal.hidden = true; modal.classList.remove('is-opened'); document.body.classList.remove('lightbox-open'); previous?.focus(); };
    open.addEventListener('click', () => { previous = document.activeElement; modal.hidden = false; document.body.classList.add('lightbox-open'); requestAnimationFrame(() => modal.classList.add('is-opened')); close?.focus(); });
    close?.addEventListener('click', hide);
    modal.addEventListener('click', event => { if (event.target === modal) hide(); });
    document.addEventListener('keydown', event => { if (!modal.hidden && event.key === 'Escape') hide(); });
  }

  function ambience() {
    const host = $('.hero-petals');
    const api = window.Marhamat;
    if (!host || api?.reducedMotion || api?.tier === 'lite') return;
    for (let i = 0; i < 9; i++) {
      const p = document.createElement('i');
      p.className = 'petal-drift';
      p.style.setProperty('--x', `${(i * 23 + 7) % 98}%`);
      p.style.setProperty('--delay', `${-i * 1.7}s`);
      p.style.setProperty('--dur', `${8 + (i % 4) * 2}s`);
      host.append(p);
    }
    document.addEventListener('visibilitychange', () => { host.style.display = document.hidden ? 'none' : ''; });
  }

  function rsvpBloom() {
    const api = window.Marhamat;
    if (!api?.on) return;
    api.on('rsvp', answer => {
      if (answer?.status !== 'yes' || api.reducedMotion) return;
      const flower = $('.success-tulip');
      if (flower?.animate) flower.animate([{ transform: 'scale(.45) rotate(-20deg)', opacity: .3 }, { transform: 'scale(1.18) rotate(8deg)', opacity: 1 }, { transform: 'scale(1) rotate(0)' }], { duration: 800, easing: 'cubic-bezier(.2,.8,.2,1)' });
      const section = $('#rsvp');
      if (section && api.tier !== 'lite') {
        for (let i = 0; i < 16; i++) {
          const petal = document.createElement('i'); petal.className = 'rsvp-petal';
          petal.style.setProperty('--rot', `${(i % 2 ? 1 : -1) * (120 + i * 22)}deg`);
          petal.style.setProperty('--tx', `${Math.sin(i * 2) * 70}px`);
          section.append(petal); window.setTimeout(() => petal.remove(), 1900);
        }
      }
    });
  }

  function init() {
    reveal();
    giftModal();
    ambience();
    rsvpBloom();
    if (window.Marhamat?.on) window.Marhamat.on('ready', scrollChoreography);
    else scrollChoreography();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
