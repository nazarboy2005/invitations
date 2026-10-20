(() => {
 'use strict';
 const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
 const reduced=()=>window.Marhamat?.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
 let introTimeline, opened=false, finishTimer=0;
 function buildBand(){const band=$('.tile-band__inner');if(!band||band.children.length)return;for(let i=0;i<14;i++){const tile=document.createElement('span');tile.className='tile-piece';tile.textContent='✳';band.append(tile);}}
 // The first gold shell lights the square, and its light writes the names.
 function revealNames(){
  const bits=$$('.hero__copy .eyebrow, .hero__copy h1 > span, .hero__copy h1 em, .hero__date, .hero__copy .text-link');
  document.documentElement.classList.remove('names-waiting');
  if(!window.gsap||reduced()){bits.forEach(b=>{b.style.opacity=1;b.style.setProperty('--wipe','0%');});return;}
  const [eyebrow,groom,amp,bride,date,link]=['.hero__copy .eyebrow','.hero__copy h1 > span:first-of-type','.hero__copy h1 em','.hero__copy h1 > span:last-of-type','.hero__date','.hero__copy .text-link'].map(q=>$(q));
  const tl=gsap.timeline();
  tl.fromTo(eyebrow,{opacity:0,y:8},{opacity:1,y:0,duration:.8,ease:'expo.out'},0)
   .fromTo(groom,{opacity:1,'--wipe':'100%'},{'--wipe':'0%',duration:1.1,ease:'power1.inOut'},.15)
   .fromTo(amp,{opacity:0,scale:.7},{opacity:1,scale:1,duration:.6,ease:'back.out(2)'},1.05)
   .fromTo(bride,{opacity:1,'--wipe':'100%'},{'--wipe':'0%',duration:1.1,ease:'power1.inOut'},1.3)
   .fromTo(date,{opacity:0,y:10},{opacity:1,y:0,duration:.8,ease:'expo.out'},2.3)
   .fromTo(link,{opacity:0,y:10},{opacity:1,y:0,duration:.8,ease:'expo.out'},2.9);
 }
 function createFireworks(){const s=window.SamarqandSalute;if(s)s.celebrate(revealNames);else revealNames();}

 // Where the lantern sits inside the camera frame (registan-reveal.webp is 1024 × 1536, object-fit: cover, 52%).
 const LANTERN=[.5,.735];
 function coverShot(camera){
  const w=camera.offsetWidth,h=camera.offsetHeight,vh=camera.parentElement.offsetHeight;
  if(!w||!h)return null;
  const s=Math.max(w/1024,h/1536),lx=(w-1024*s)/2+LANTERN[0]*1024*s,ly=(h-1536*s)*.52+LANTERN[1]*1536*s;
  const scale=vh/w>1.5?2.4:2.1,screenY=camera.offsetTop+ly;
  // keep the lantern a little below centre, but never let the zoomed plate lift off the bottom edge
  const lift=Math.min(vh*.6-screenY,0),floor=-(vh-screenY)*(scale-1)+2;
  // the crop that art/lantern-hd.webp was cut from: 400,940 224 × 360 on the plate
  const box=[(w-1024*s)/2+400*s,(h-1536*s)*.52+940*s,224*s,360*s];
  return{lx,ly,scale,box,y:Math.max(lift,floor)};
 }

 function intro(){
  const scene=$('.intro'),btn=$('#open-invitation'),content=$('.intro__content');
  const camera=$('.intro__camera'),plate=$('.intro__scene',camera||undefined),night=$('.intro__night'),lantern=$('.intro__lantern');
  if(!scene||!btn)return;
  buildBand();content?.classList.add('ready');
  const cinematic=()=>!!(window.gsap&&camera&&!reduced());
  if(!reduced())document.documentElement.classList.add('names-waiting');
  let breathe=null;
  function frameCover(){
   if(!cinematic()||document.body.classList.contains('is-opening'))return;
   const shot=coverShot(camera);if(!shot)return;
   if(lantern){const b=shot.box;Object.assign(lantern.style,{left:b[0]+'px',top:b[1]+'px',width:b[2]+'px',height:b[3]+'px',opacity:1});}
   gsap.set(camera,{transformOrigin:`${shot.lx}px ${shot.ly}px`,x:0,y:shot.y,scale:shot.scale});
   night?.style.setProperty('--lx',shot.lx+'px');night?.style.setProperty('--ly',shot.ly+'px');
  }
  if(cinematic()){
   frameCover();addEventListener('resize',frameCover,{passive:true});
   // the lantern breathes while the square waits in the dark
   gsap.set(night,{'--hole':'64px',opacity:.82});
   breathe=gsap.to(night,{'--hole':'74px',opacity:.76,duration:1.7,ease:'sine.inOut',repeat:-1,yoyo:true});
  }
  function complete(){
   if(opened)return;opened=true;
   document.documentElement.classList.remove('is-locked');
   document.body.classList.remove('is-revealing');
   document.body.classList.add('is-open');
   scene.setAttribute('aria-hidden','true');scene.inert=true;scene.hidden=true;
   window.scrollTo({top:0,behavior:'instant'});
   window.ScrollTrigger?.refresh();
  }
  btn.addEventListener('click',()=>{
   if(opened||document.body.classList.contains('is-opening'))return;
   document.body.classList.add('is-opening');btn.disabled=true;
   window.SamarqandSalute?.prime?.();
   window.Marhamat?.open?.();document.documentElement.classList.add('is-locked');
   try{navigator.vibrate&&navigator.vibrate(12);}catch(_){}
   if(!cinematic()){complete();revealNames();return;}
   breathe?.kill();
   const lite=window.Marhamat?.tier==='lite';
   // 1. the camera pulls back from the lantern and rises to the whole square (0 – 3.4 s)
   // 2. lantern light spreads across the stones, then the floodlights catch the madrasahs (≈1.7 s)
   // 3. the first shell launches as the camera lands; the cover dissolves into the identical hero frame
   introTimeline=gsap.timeline({onComplete:complete});
   introTimeline.to(content,{opacity:0,y:-14,duration:.6,ease:'power2.in'},0)
    .to(camera,{y:0,scale:1,duration:3.4,ease:'power3.inOut'},.15)
    .to(night,{'--hole':'420px',opacity:.55,duration:1.9,ease:'power1.in'},.25);
   if(lite)introTimeline.to(plate,{filter:'brightness(1) saturate(1)',duration:1.2,ease:'power2.out'},1.7);
   else introTimeline.to(plate,{filter:'brightness(.95) saturate(.9)',duration:.07,ease:'none'},1.7)
    .to(plate,{filter:'brightness(.72) saturate(.85)',duration:.12,ease:'none'})
    .to(plate,{filter:'brightness(1.12) saturate(1.05)',duration:.45,ease:'power2.out'})
    .to(plate,{filter:'brightness(1) saturate(1)',duration:1.1,ease:'power1.inOut'});
   // the crisp lantern hands over to the plate's own once the floodlights match its brightness
   if(lantern)introTimeline.to(lantern,{opacity:0,duration:1.1,ease:'power1.inOut'},1.9);
   introTimeline.to(night,{opacity:0,duration:1.4,ease:'power2.out'},1.75)
    .add(createFireworks,2.8)
    .add(()=>document.body.classList.add('is-revealing'),3.1)
    .to(scene,{opacity:0,duration:.9,ease:'power1.inOut'},3.15);
  });
 }

 function choreography(){document.documentElement.classList.add('js-ready');if(!window.gsap||reduced()){$$('.section').forEach(x=>x.classList.add('is-visible'));return;}gsap.registerPlugin(ScrollTrigger);const sections=$$('.section');sections.forEach(el=>el.classList.add('is-visible')); // entrances live in motion.js
 gsap.to('.program__rail',{scaleY:1,ease:'none',scrollTrigger:{trigger:'.program',start:'top 68%',end:'bottom 60%',scrub:true}});$$('.program__item').forEach(item=>gsap.to(item.querySelector('i'),{rotation:45,scale:1,opacity:1,duration:.4,scrollTrigger:{trigger:item,start:'top 78%',toggleActions:'play none none reverse'}}));$$('.tile-piece').forEach((tile,i)=>gsap.fromTo(tile,{scale:.15,rotation:-45,opacity:0},{scale:1,rotation:45,opacity:1,ease:'none',scrollTrigger:{trigger:'.tile-band',start:'top 85%',end:'bottom 30%',scrub:true}}));
 }
 function gallery(){const rail=$('.gallery');if(!rail)return;let items=$$('.gallery__item',rail);const sync=()=>{items=$$('.gallery__item',rail);const mid=rail.scrollLeft+rail.clientWidth/2;items.forEach(item=>{const d=(item.offsetLeft+item.offsetWidth/2-mid)/item.offsetWidth;item.style.transform=`rotateY(${Math.max(-35,Math.min(35,d*35))}deg) scale(${1-Math.min(.12,Math.abs(d)*.08)})`;item.style.opacity=String(1-Math.min(.55,Math.abs(d)*.45));});};rail.addEventListener('scroll',sync,{passive:true});window.addEventListener('resize',sync);requestAnimationFrame(sync);}
 function box(){const btn=$('.lacquer-box'),dialog=$('.gift-modal');if(!btn||!dialog)return;btn.addEventListener('click',()=>{btn.classList.add('is-open');setTimeout(()=>dialog.showModal(),360)});$('.modal-close',dialog).addEventListener('click',()=>{dialog.close();btn.classList.remove('is-open')});dialog.addEventListener('click',e=>{if(e.target===dialog){dialog.close();btn.classList.remove('is-open')}});}
 function rsvp(){window.Marhamat?.on?.('rsvp',answer=>{if(answer?.status!=='yes'||reduced())return;const host=$('.rsvp__done');if(!host)return;host.classList.add('celebrate');for(let i=0;i<18;i++){const star=document.createElement('i');star.className='burst-star';star.textContent='✦';star.style.setProperty('--a',`${i*20}deg`);star.style.setProperty('--r',`${50+Math.random()*65}px`);host.append(star);setTimeout(()=>star.remove(),1300);}});}
 function init(){intro();choreography();gallery();box();rsvp();if(window.Marhamat?.on)Marhamat.on('tier',()=>{});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
