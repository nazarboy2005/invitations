(() => {
  'use strict';
  const $ = (s, scope = document) => scope.querySelector(s);
  const $$ = (s, scope = document) => Array.from(scope.querySelectorAll(s));
  const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', cyrillic = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯ';
  const randomGlyph = () => Math.random() > .5 ? latin[Math.floor(Math.random() * latin.length)] : cyrillic[Math.floor(Math.random() * cyrillic.length)];
  let opened = false, opening = false;

  function splitLetters(node) {
    const value = (node.textContent || '').trim().toLocaleUpperCase('uz-Latn');
    node.replaceChildren(...Array.from(value).map(letter => {
      const span = document.createElement('span'); span.className = 'glyph'; span.textContent = letter; return span;
    }));
    return $$('.glyph', node);
  }
  function introFilm() {
    const intro = $('.intro'), names = $$('.decode-name', intro), button = $('#open-invitation');
    if (!intro || !button) return;
    const glyphs = names.map(splitLetters);
    const amp = document.createElement('span'); amp.className = 'intro__amp'; amp.textContent = '&';
    amp.style.cssText = 'font:italic 400 .4em/.8 Playfair Display,Georgia,serif;color:#8C1C13;display:block;margin:-.02em 0';
    names[0].after(amp);
    function decipher(group, delay) {
      group.forEach((glyph, index) => {
        const end = glyph.textContent;
        let count = 0;
        const begin = performance.now() + delay + index * 62;
        function tick(now) {
          if (now < begin) { requestAnimationFrame(tick); return; }
          count++;
          if (count < 5) { glyph.textContent = randomGlyph(); requestAnimationFrame(tick); }
          else glyph.textContent = end;
        }
        requestAnimationFrame(tick);
      });
    }
    const issue = $('.intro__issue'), greeting = $('.intro__greeting'), rule = $('.intro__rule'), folio = $('.intro__folio');
    const lite = window.Marhamat?.tier === 'lite' || window.Marhamat?.reducedMotion;
    const goPaper = () => { intro.classList.add('is-paper'); intro.style.color = '#111'; };
    if (window.gsap && !lite) {
      const tl = gsap.timeline({delay:.08});
      tl.to(greeting,{opacity:1,duration:.25}).to(issue,{opacity:1,duration:.2},.25)
        .add(() => { decipher(glyphs[0],0); decipher(glyphs[1],280); },.35)
        .to(rule,{width:'100%',duration:.34,ease:'power2.out'},1.25)
        .add(goPaper,1.38).to(intro,{color:'#111',duration:.04},1.38)
        .to(button,{opacity:1,duration:.25},1.62).to(folio,{opacity:.6,duration:.15},1.65);
    } else {
      greeting.style.opacity = '1'; issue.style.opacity = '1'; glyphs.flat().forEach(el => el.textContent = el.textContent);
      window.setTimeout(goPaper, 150); window.setTimeout(() => { rule.style.width='100%';button.style.opacity='1'; }, 220);
    }
    function finish() {
      if (opened || opening) return;
      opening = true; opened = true;
      const bounds = button.getBoundingClientRect();
      const x = bounds.left + bounds.width / 2, y = bounds.top + bounds.height / 2;
      const photos = window.Marhamat?.data?.gallery || [];
      const source = Array.isArray(photos) ? photos[0] : '';
      const shootDate = $('.shoot-date', intro), shootMarquee = $('.shoot-marquee', intro);
      const layer = document.createElement('div'); layer.className = 'shoot-reveal';
      if (source) layer.style.backgroundImage = `url("${String(source).replace(/["\\]/g,'')}")`;
      layer.style.setProperty('--tap-x', `${x}px`); layer.style.setProperty('--tap-y', `${y}px`);
      intro.append(layer);
      window.Marhamat?.open();
      document.body.classList.add('is-opening'); intro.classList.add('is-opening');
      const complete = () => { intro.classList.add('is-finished'); document.body.classList.remove('is-opening'); document.body.classList.add('is-open'); opening = false; };
      if (window.gsap && !lite) {
        const tl = gsap.timeline({onComplete:complete});
        tl.to(layer,{clipPath:`circle(${Math.max(innerWidth,innerHeight)*1.45}px at ${x}px ${y}px)`,duration:1.45,ease:'power3.inOut'},0)
          .to(names[0],{x:'-8vw',y:'-12vh',rotation:-5,duration:.85,ease:'power3.inOut'},.08)
          .to(names[1],{x:'8vw',y:'12vh',rotation:5,duration:.85,ease:'power3.inOut'},.08)
          .to(amp,{rotation:180,scale:1.4,duration:.65,ease:'back.out(1.4)'},.2)
          .fromTo(shootDate,{y:'100%',opacity:0},{y:0,opacity:1,duration:.7,ease:'power3.out'},.85)
          .fromTo(shootMarquee,{y:40,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out'},1.35)
          .to(shootMarquee?.firstElementChild||{}, {x:'-35%',duration:1.05,ease:'none'},1.38)
          .to(intro,{opacity:0,duration:.35},2.05);
      } else { layer.style.clipPath=`circle(${Math.max(innerWidth,innerHeight)*1.45}px at ${x}px ${y}px)`; window.setTimeout(complete, 450); }
    }
    button.addEventListener('click', finish);
    intro.addEventListener('click', event => { if (opening && event.detail > 0) { intro.classList.add('is-finished'); document.body.classList.add('is-open'); } });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !opened) finish(); });
    // The tap-point reveal emulates the source image even when sample photos are absent.
    const style = document.createElement('style');
    style.textContent = '.shoot-reveal{position:absolute;inset:0;z-index:3;background-color:#3a3a3a;background-position:center;background-size:cover;filter:grayscale(1);clip-path:circle(0 at var(--tap-x) var(--tap-y));transition:clip-path .9s cubic-bezier(.7,0,.2,1);pointer-events:none}.intro.is-opening .shoot-reveal{clip-path:circle(150vmax at var(--tap-x) var(--tap-y))}.intro__amp{transition:transform .5s}';
    document.head.append(style);
    if (window.Marhamat?.guestParam) greeting.textContent = window.Marhamat.data.greeting;
  }

  function scrollFilm() {
    const api = window.Marhamat;
    if (!api || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = api.reducedMotion, lite = api.tier === 'lite';
    $$('[data-section]').forEach(section => {
      if (section.id === 'hero') return;
      gsap.fromTo(section,{y:reduced?0:28,opacity:0},{y:0,opacity:1,duration:.75,ease:'power3.out',scrollTrigger:{trigger:section,start:'top 86%',once:true}});
    });
    $$('.program__item').forEach(item => {
      const line = document.createElement('i'); line.className='draw-rule'; line.setAttribute('aria-hidden','true'); item.append(line);
      if (!reduced) gsap.fromTo(line,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:item,start:'top 86%',end:'top 60%',scrub:true}});
    });
    const venueImage = $('.venue__photo img');
    if (venueImage && !reduced) gsap.fromTo(venueImage,{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:'.venue__photo',start:'top bottom',end:'bottom top',scrub:true}});
    $$('.title-drift').forEach(title => {
      if (reduced) return;
      gsap.fromTo(title,{x:-16},{x:16,ease:'none',scrollTrigger:{trigger:title,start:'top bottom',end:'bottom top',scrub:true,onUpdate(self){title.style.transform=`translateX(${gsap.utils.interpolate(-16,16,self.progress)}px) skewX(${Math.max(-6,Math.min(6,self.getVelocity()/-1600))}deg)`;}}});
    });
    const gallery = $('.gallery--editorial'), items = gallery && $$('.gallery__item',gallery);
    if (gallery && items.length > 1 && !lite && !reduced) {
      const distance = () => Math.max(0, items.reduce((sum,item)=>sum+item.getBoundingClientRect().width,0) + 15*(items.length-1) - gallery.parentElement.clientWidth + 56);
      gsap.to(gallery,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:gallery.parentElement,start:'top top+=20',end:()=>`+=${distance()}`,pin:true,scrub:.7,invalidateOnRefresh:true}});
      gallery.style.overflow='visible';
    }
    api.on('rsvp',answer=>{
      const stamp=$('.rsvp__stamp');
      if(!stamp) return;
      stamp.hidden=answer?.status!=='yes';
      if(answer?.status==='yes') stamp.animate([{transform:'rotate(-8deg) scale(2)',opacity:0},{transform:'rotate(-8deg) scale(1)',opacity:1}],{duration:440,easing:'cubic-bezier(.2,.8,.2,1)'});
    });
    const done=$('[data-rsvp-done]'), stamp=$('.rsvp__stamp');
    if(done&&stamp){const sync=()=>{stamp.hidden=!($('[data-rsvp-summary]',done)?.textContent||'').includes('Kelaman ·');};new MutationObserver(sync).observe(done,{subtree:true,childList:true,characterData:true});sync();}
  }
  function marqueeCopy(){ $$('[data-marquee]').forEach(node=>{ if(!node.dataset.doubled){node.innerHTML=node.innerHTML+node.innerHTML;node.dataset.doubled='true';} }); }
  function heroFallback(){const image=$('.hero__photo');if(image){const fallback=$('.hero__fallback');const show=()=>fallback?.classList.add('is-visible');image.addEventListener('error',show);if(image.complete&&!image.naturalWidth)show();}}
  window.Marhamat?.on('ready',()=>{introFilm();scrollFilm();marqueeCopy();heroFallback();});
})();
