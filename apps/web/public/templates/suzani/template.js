(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const intro = $('#intro'), openButton = $('#open-invitation');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let opened = false, dustFrame = 0, dustOnscreen = true;

  function animateArrival() {
    if (reduced.matches) {
      $('.sun-stitches').style.strokeDashoffset = '0';
      $('.intro-medallion').style.opacity = '1';
      $('.intro__caption').style.opacity = '1'; $('.intro__date').style.opacity = '1'; $('.open-tag').style.opacity = '1';
      $('.needle-tip').style.opacity = '0';
      return;
    }
    const path = $('.sun-stitches');
    const length = path.getTotalLength();
    path.style.strokeDasharray = '2 7';
    path.style.strokeDashoffset = String(length);
    $('.needle-tip').style.opacity = '1';
    const start = performance.now(), duration = window.Marhamat?.tier === 'lite' ? 1300 : 1800;
    function frame(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      path.style.strokeDashoffset = String(length * (1 - eased));
      const pt = path.getPointAtLength(length * eased);
      $('.needle-tip').setAttribute('cx', pt.x); $('.needle-tip').setAttribute('cy', pt.y);
      if (p > .55) $('.intro-medallion').style.opacity = String(Math.min(1, (p - .55) / .4));
      $('.intro__caption').style.opacity = String(Math.min(1, p / .28));
      $('.intro__date').style.opacity = String(Math.max(0, Math.min(1, (p - .32) / .3)));
      $('.open-tag').style.opacity = String(Math.max(0, Math.min(1, (p - .74) / .2)));
      if (p < 1) requestAnimationFrame(frame); else $('.needle-tip').style.opacity = '0';
    }
    requestAnimationFrame(frame);
  }
  function openFilm() {
    if (opened) { intro.classList.add('is-done'); return; }
    opened = true; intro.classList.add('is-unfolding');
    window.Marhamat?.open();
    const lite = window.Marhamat?.tier === 'lite' || reduced.matches;
    const duration = lite ? 650 : 2400;
    document.body.classList.add('is-opening');
    const finish = () => {
      intro.classList.add('is-done'); document.body.classList.remove('is-opening'); document.body.classList.add('is-open');
      $('.page').classList.add('page-open');
      window.scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' });
      setTimeout(() => window.ScrollTrigger?.refresh?.(), 150);
    };
    if (window.gsap && !reduced.matches) {
      gsap.timeline({ onComplete: finish }).to('.intro__hoop', { scale: 1.45, rotation: 4, opacity: 0, duration: duration / 1000, ease: 'power3.inOut' }, 0)
        .to('.intro__linen', { scale: 1.35, duration: duration / 1000, ease: 'expo.inOut' }, 0)
        .to('.open-tag', { y: 34, opacity: 0, duration: .45, ease: 'power2.in' }, 0)
        .fromTo('.hero__seal', { scale: .7, rotate: -12, opacity: .2 }, { scale: 1, rotate: 0, opacity: 1, duration: .8, ease: 'back.out(1.2)', immediateRender: false }, duration / 1000 - .65)
        .fromTo('.hero__names', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: .55, ease: 'power3.out', immediateRender: false }, duration / 1000 - .24);
    } else setTimeout(finish, duration);
  }
  openButton.addEventListener('click', openFilm);
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !opened) openFilm(); });

  function setupMotion() {
    const lite = window.Marhamat?.tier === 'lite', sections = $$('[data-section]');
    if (reduced.matches) { sections.forEach(s => s.classList.add('is-visible')); return; }
    sections.forEach((section, i) => { if (i) section.classList.add('reveal'); });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible'); observer.unobserve(entry.target);
      const card = entry.target.querySelector('.gallery__item'); if (card) card.classList.add('sewn-in');
    }), { threshold: .12 });
    sections.forEach(s => observer.observe(s));
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      const edge = $('.edge-thread__line'), len = edge.getTotalLength();
      edge.style.strokeDasharray = `${len} ${len}`; edge.style.strokeDashoffset = len;
      gsap.to(edge, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.page', start: 'top top', end: 'bottom bottom', scrub: lite ? 1.4 : .65 } });
      const vine = $$('.vine path');
      vine.forEach(path => { const n = path.getTotalLength(); path.style.strokeDasharray = `${n} ${n}`; path.style.strokeDashoffset = n; });
      gsap.to(vine, { strokeDashoffset: 0, ease: 'none', stagger: .12, scrollTrigger: { trigger: '.program-section', start: 'top 75%', end: 'bottom 35%', scrub: true } });
      gsap.fromTo('.hero__art', { scale: 1.1, y: 16 }, { scale: 1, y: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      $$('.stitched-title').forEach(title => gsap.fromTo(title, { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', ease: 'none', scrollTrigger: { trigger: title, start: 'top 86%', end: 'top 55%', scrub: true } }));
    } else {
      const line = $('.edge-thread__line'); line.style.strokeDashoffset = '0';
      $$('.vine path').forEach(p => p.style.strokeDashoffset = '0');
    }
  }

  function setupHatch() {
    const canvas = $('.satin-hatch'), ctx = canvas.getContext('2d'), hero = $('.hero');
    let progress = 0, raf = 0;
    if (window.Marhamat?.tier === 'lite' || reduced.matches) { canvas.hidden = true; return; }
    function resize() { const dpr = Math.min(devicePixelRatio || 1, window.Marhamat?.tier === 'lite' ? 1.5 : 2); canvas.width = hero.clientWidth * dpr; canvas.height = hero.clientHeight * dpr; canvas.style.width = '100%'; canvas.style.height = '100%'; ctx.setTransform(dpr,0,0,dpr,0,0); draw(); }
    function draw() {
      const w = hero.clientWidth, h = hero.clientHeight; ctx.clearRect(0,0,w,h); if (reduced.matches) return;
      const count = Math.floor((w + h) / 11 * Math.max(.05, progress));
      ctx.save(); ctx.beginPath(); ctx.arc(w/2,h*.38,Math.min(w*.35,160),0,Math.PI*2); ctx.clip();
      for (let i=0;i<count;i++) { let x=(i*11)%(w+80)-40, y=(i*29)%(h+40)-20; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+18,y-18); ctx.strokeStyle=i%5===0?'rgba(217,154,43,.42)':i%3===0?'rgba(36,48,94,.24)':'rgba(168,38,43,.22)'; ctx.lineWidth=1.1; ctx.stroke(); }
      ctx.restore();
    }
    function reveal() { const start=performance.now(), duration=window.Marhamat?.tier==='lite'?300:1900; function tick(now){progress=Math.min(1,(now-start)/duration);draw();if(progress<1)raf=requestAnimationFrame(tick);} cancelAnimationFrame(raf);raf=requestAnimationFrame(tick); }
    window.addEventListener('resize',resize,{passive:true}); resize(); window.Marhamat?.on('open',reveal);
  }
  function setupDust() {
    const canvas = $('.stitch-dust'), ctx = canvas.getContext('2d'); let particles=[], w=0,h=0,visible=true;
    const resize=()=>{const dpr=Math.min(devicePixelRatio||1,window.Marhamat?.tier==='lite'?1.5:2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);const n=reduced.matches?0:window.Marhamat?.tier==='lite'?15:48;particles=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.5+.3,v:.15+Math.random()*.35,p:Math.random()*6.28}));};
    function draw(){if(!visible||document.hidden){dustFrame=0;return;}ctx.clearRect(0,0,w,h);particles.forEach(p=>{p.y-=p.v;p.p+=.015;if(p.y<0)p.y=h;ctx.fillStyle=`rgba(168,38,43,${.14+Math.sin(p.p)*.12})`;ctx.fillRect(p.x+Math.sin(p.p)*2,p.y,p.r,p.r*2);});dustFrame=requestAnimationFrame(draw);}
    const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible&&!dustFrame&&!document.hidden)dustFrame=requestAnimationFrame(draw);});io.observe($('.page'));
    document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(dustFrame);dustFrame=0}else if(visible&&!dustFrame)dustFrame=requestAnimationFrame(draw)});addEventListener('resize',resize,{passive:true});resize();window.Marhamat?.on('open',()=>{if(visible&&!dustFrame)dustFrame=requestAnimationFrame(draw)});
  }
  function sequins() {
    const canvas=$('.sequins'); if(!canvas)return; const ctx=canvas.getContext('2d'); let bits=[];
    window.Marhamat?.on('rsvp',answer=>{if(answer.status!=='yes'||reduced.matches)return;const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);bits=Array.from({length:window.Marhamat?.tier==='lite'?12:28},()=>({x:rect.width/2+(Math.random()-.5)*100,y:rect.height*.3,vx:(Math.random()-.5)*3,vy:-2-Math.random()*3,r:2+Math.random()*2,life:1}));let frame;function tick(){ctx.clearRect(0,0,rect.width,rect.height);bits=bits.filter(b=>b.life>0);bits.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.vy+=.12;b.life-=.012;ctx.fillStyle=`rgba(217,154,43,${b.life})`;ctx.fillRect(b.x,b.y,b.r,b.r*1.5)});if(bits.length)frame=requestAnimationFrame(tick);else cancelAnimationFrame(frame)}tick();});
  }
  function init(){animateArrival();setupMotion();setupHatch();setupDust();sequins();window.Marhamat?.on('open',()=>{const audio=$('[data-music]'),button=$('[data-music-toggle]');if(!audio||!button)return;const hideBroken=()=>{if(audio.error)button.hidden=true};audio.addEventListener('error',()=>setTimeout(hideBroken,0));setTimeout(hideBroken,500);});}
  if(window.Marhamat) window.Marhamat.on('ready',init); else document.addEventListener('DOMContentLoaded',init,{once:true});
})();
