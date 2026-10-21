(()=>{
  'use strict';
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let introParticles=[],introFrame=0,opened=false,opening=false,openingTimer=0;
  function starCanvas(canvas,interactive=false){
    if(!canvas||reduced)return ()=>{};
    const ctx=canvas.getContext('2d');if(!ctx)return ()=>{};
    let w=0,h=0,raf=0,active=true,stars=[];const cap=window.Marhamat?.tier==='lite'?15:48;
    function size(){const dpr=Math.min(devicePixelRatio||1,window.Marhamat?.tier==='lite'?1.5:2);w=canvas.clientWidth;h=canvas.clientHeight;canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);stars=Array.from({length:cap},()=>({x:Math.random()*w,y:Math.random()*h,r:.4+Math.random()*1.5,a:.22+Math.random()*.65,p:Math.random()*7,s:.001+Math.random()*.003}));}
    function draw(t){raf=0;if(!active||document.hidden)return;ctx.clearRect(0,0,w,h);for(const s of stars){const alpha=s.a*(.65+.35*Math.sin(t*s.s+s.p));ctx.beginPath();ctx.fillStyle=`rgba(255,225,145,${alpha})`;ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();}if(interactive&&introParticles.length){for(let i=introParticles.length-1;i>=0;i--){const p=introParticles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.04;p.rot+=p.vr;p.life-=1;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=Math.max(0,p.life/80);ctx.fillStyle=p.color;if(p.circle){ctx.beginPath();ctx.arc(0,0,p.size,0,Math.PI*2);ctx.fill()}else ctx.fillRect(-p.size/2,-p.size/3,p.size,p.size*.58);ctx.restore();if(p.life<=0||p.y>h+20)introParticles.splice(i,1)}}raf=requestAnimationFrame(draw);}
    function start(){if(!active||raf)return;raf=requestAnimationFrame(draw)}function stop(){cancelAnimationFrame(raf);raf=0}function visibility(){if(document.hidden)stop();else start()}document.addEventListener('visibilitychange',visibility);size();start();addEventListener('resize',size,{passive:true});
    return ()=>{active=false;stop();document.removeEventListener('visibilitychange',visibility);removeEventListener('resize',size)};
  }
  function burst(canvas,count=120){if(!canvas)return;const full=window.Marhamat?.tier==='full';const n=reduced?0:full?count:34;const colors=['#D4A84B','#F8E39A','#8EC5E8','#FFF8EC'];introParticles=Array.from({length:n},(_,i)=>({x:Math.random()*innerWidth,y:innerHeight*.55+Math.random()*100,vx:(Math.random()-.5)*5,vy:-2-Math.random()*6,size:3+Math.random()*6,rot:Math.random()*6,vr:(Math.random()-.5)*.25,life:65+Math.random()*65,color:colors[i%colors.length],circle:Math.random()>.72}));}
  function enter(){const horse=$('.horse--hero');if(window.gsap&&!reduced){gsap.fromTo(horse,{x:130,opacity:0,y:5},{x:0,opacity:.95,y:0,duration:1.1,ease:'power3.out',delay:.5});gsap.fromTo('.hero__name',{scale:.78,opacity:0},{scale:1,opacity:1,duration:.9,ease:'back.out(1.35)',delay:.7});gsap.fromTo('.hero-crown',{y:-16,opacity:0},{y:0,opacity:1,duration:.65,ease:'back.out(1.4)',delay:.35});gsap.to('.balloon-field span',{y:'-105vh',duration:17,repeat:-1,ease:'none',stagger:{each:1.4,from:'random'}})}else{horse.style.opacity='1';horse.style.transform='none';}}
  function setupIntro(){const intro=$('#intro'),btn=$('#open-invitation'),canvas=$('.stars--intro');const stopStars=starCanvas(canvas,true);let timeout=0;if(window.gsap&&!reduced){gsap.fromTo('.plaque',{y:24,opacity:0,scale:.96},{y:0,opacity:1,scale:1,duration:.85,delay:.2,ease:'power3.out'});gsap.to('.intro-crown',{y:-6,duration:2.1,repeat:-1,yoyo:true,ease:'sine.inOut'});}
    const finish=()=>{if(opened)return;opened=true;opening=false;clearTimeout(timeout);clearTimeout(openingTimer);document.documentElement.classList.remove('is-opening');document.documentElement.classList.add('is-open');window.Marhamat?.open();enter();stopStars()};
    const start=()=>{if(opening||opened){if(opening)finish();return}opening=true;document.documentElement.classList.add('is-opening');burst(canvas,120);if(window.gsap&&!reduced){gsap.to('.curtain--left i',{x:-12,skewY:-4,opacity:.25,duration:.58,stagger:{each:.055,from:'center'},ease:'power3.inOut'});gsap.to('.curtain--right i',{x:12,skewY:4,opacity:.25,duration:.58,stagger:{each:.055,from:'center'},ease:'power3.inOut'});}timeout=setTimeout(finish,reduced?0:1900);};
    btn?.addEventListener('click',start);intro?.addEventListener('click',e=>{if(opening&&!e.target.closest('button'))finish()});
    if(window.Marhamat){Marhamat.on('open',()=>{if(!opened)finish()});Marhamat.on('ready',()=>{if(Marhamat.reducedMotion){const scene=$('.intro-scene');scene?.classList.add('is-static')}})}
    // An unattended invitation settles into the scene quickly; the guest can open it at any point.
    openingTimer=setTimeout(()=>intro?.classList.add('is-ready'),650);
  }
  function setupScroll(){const pageStars=starCanvas($('.stars--page'));starCanvas($('.stars--footer'));if(!window.gsap||!window.ScrollTrigger){$$('.paper-inner').forEach(e=>e.style.clipPath='none');return}gsap.registerPlugin(ScrollTrigger);
    const reveal=(selector,vars={})=>$$(`${selector}`).forEach((el,i)=>gsap.fromTo(el,{y:22,opacity:0,...vars.from},{y:0,opacity:1,duration:.8,delay:Math.min(i*.08,.24),ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%',once:true},...vars.to}));
    $$('.section').forEach((section,i)=>{gsap.fromTo(section,{opacity:.45,y:22},{opacity:1,y:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:section,start:'top 88%',once:true}})});
    gsap.to('.paper-inner',{clipPath:'inset(0 0 0%)',scrollTrigger:{trigger:'.scroll-paper',start:'top 80%',end:'top 35%',scrub:.7}});
    gsap.fromTo('.mini-crown',{y:-14,scale:.7},{y:0,scale:1,duration:.6,ease:'back.out(1.5)',scrollTrigger:{trigger:'.calendar-card',start:'top 75%',once:true}});
    const list=$('.program'),fill=$('.procession-fill'),horse=$('.procession-horse');if(list){ScrollTrigger.create({trigger:list,start:'top 72%',end:'bottom 58%',scrub:.5,onUpdate:s=>{if(fill)gsap.set(fill,{scaleY:s.progress,transformOrigin:'top'});if(horse)gsap.set(horse,{y:s.progress*Math.max(0,list.offsetHeight-20)});$$('.program__item',list).forEach(item=>item.classList.toggle('is-lit',item.getBoundingClientRect().top<innerHeight*.68));}})}
    gsap.to('.balloon-field',{yPercent:-28,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.stars--footer',{opacity:.9,ease:'none',scrollTrigger:{trigger:'.footer',start:'top bottom',end:'bottom bottom',scrub:true}});
    Marhamat?.on('wish',()=>{const cards=$$('.wishes__item');const card=cards[cards.length-1];if(card&&!reduced)gsap.fromTo(card,{y:18,opacity:0,rotate:-2},{y:0,opacity:1,rotate:0,duration:.55,ease:'back.out(1.3)'})});
    Marhamat?.on('rsvp',payload=>{if(payload?.status==='yes'&&!reduced){burst($('.stars--page'),window.Marhamat?.tier==='lite'?35:90);gsap.fromTo('.rsvp__done .ornament',{scale:.55,rotate:-20},{scale:1,rotate:0,duration:.65,ease:'back.out(2)'})}});
    Marhamat?.on('ready',()=>{$$('.gallery__item').forEach(item=>item.addEventListener('pointerdown',()=>{if(!reduced)gsap.to(item,{rotate:2,duration:.12,yoyo:true,repeat:1})},{passive:true}))});
    return pageStars;
  }
  function init(){setupIntro();setupScroll();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
