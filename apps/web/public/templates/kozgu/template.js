/* A six-second passage through the mirror into the same painted world. */
(function () {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const M=window.Marhamat, art=window.KozguMirror, gsap=window.gsap;
  const intro=$('#intro'),hero=$('#hero'),scene=$('.scene'),mirror=$('#open-invitation');
  const reduced=M.reducedMotion, lite=()=>reduced||M.tier==='lite';
  let state='idle',timeline,storyBuilt=false;

  function finish(){
    if(state==='open')return;
    state='open';intro.hidden=true;intro.setAttribute('aria-hidden','true');$('#page').removeAttribute('inert');
    document.body.classList.add('is-open');document.documentElement.classList.remove('is-locked');
    gsap?.set(scene,{scale:1,x:0,y:0,clearProps:'willChange'});
    mirror.style.willChange='';window.scrollTo(0,0);
    startAmbient();scrollStory();window.ScrollTrigger?.refresh();
  }

  function opening(autoWipe){
    if(state==='open')return;
    if(state==='opening'){timeline?.timeScale(4);return;}
    state='opening';window.scrollTo({top:0,left:0,behavior:'instant'});M.open();art.stop();art.prime?.();
    document.body.classList.add('is-opening');
    art.ready.then(()=>{
      art.snapshot();
      if(!gsap){intro.style.opacity='0';setTimeout(finish,450);return;}
      if(reduced){timeline=gsap.timeline({onComplete:finish}).to(intro,{opacity:0,duration:.65});return;}
      const p=art.projection(),F={x:p.sr.left+p.F.x,y:p.sr.top+p.F.y},gc={x:p.box.left+p.gc.x,y:p.box.top+p.gc.y};
      const endScale=1/p.s,dx=F.x-gc.x,dy=F.y-gc.y;
      gsap.set(scene,{scale:p.s,x:-dx,y:-dy,transformOrigin:`${p.F.x}px ${p.F.y}px`});
      gsap.set(mirror,{transformOrigin:`${p.gc.x}px ${p.gc.y}px`});
      gsap.set('.hero__kicker,.hero__date,.hero__when,.hero__cue',{opacity:0});
      mirror.style.willChange='transform';scene.style.willChange='transform';
      const groomY=+$('.mirror__writing .name--groom').getAttribute('y'),brideY=+$('.mirror__writing .name--bride').getAttribute('y');
      timeline=gsap.timeline({onComplete:finish});
      if(autoWipe){const sweep={p:0};timeline.to(sweep,{p:1,duration:.8,ease:'sine.inOut',onUpdate(){const y=p.box.height*(.28+sweep.p*.56),x=p.box.width*(.5+Math.sin(sweep.p*Math.PI*3)*.2);art.wipe(x,y,p.box.width*.23);}},0);}
      timeline.to('.mirror__demo,.mirror__hint,.mirror__hint-second,.intro__edition',{opacity:0,duration:.35},0)
        .to('.mirror__fog',{opacity:0,duration:1.1,ease:'sine.inOut'},.1)
        .to('.intro__warm',{opacity:.6,duration:1.4,ease:'sine.out'},.15)
        .to('.mirror__writing',{opacity:1,duration:.25},.38)
        .to('.write-mask--groom',{attr:{x:0},duration:.82,ease:'sine.inOut'},.42)
        .fromTo('.mirror__glint',{opacity:0,attr:{cx:100,cy:groomY-8}},{opacity:.8,attr:{cx:510},duration:.82,ease:'sine.inOut'},.42)
        .to('.mirror__writing .name--amp',{opacity:1,duration:.28},1.24)
        .to('.write-mask--bride',{attr:{x:0},duration:.86,ease:'sine.inOut'},1.54)
        .set('.mirror__glint',{attr:{cx:100,cy:brideY-8}},1.54)
        .to('.mirror__glint',{attr:{cx:510},opacity:0,duration:.86,ease:'sine.inOut'},1.54)
        .call(()=>art.chime(),[],.48)
        .to('.mirror__seam',{opacity:.85,duration:.8,ease:'sine.inOut'},2.5)
        .to('.intro__warm',{opacity:1,duration:1.3,ease:'sine.inOut'},2.55)
        .to('.mirror__ripple',{opacity:lite()?0:.7,duration:.35},2.72)
        .call(()=>{if(!lite())art.ripple();},[],2.72)
        .to('.mirror__ripple',{opacity:0,duration:.55},3.75)
        .to(mirror,{scale:endScale,x:dx,y:dy,duration:1.95,ease:'power2.inOut'},3.4)
        .to(scene,{scale:1,x:0,y:0,duration:1.95,ease:'power2.inOut'},3.4)
        .to('.intro__console,.intro__flames',{y:125,opacity:0,duration:1.55,ease:'power2.in'},3.55)
        .to('.intro__greeting',{opacity:0,y:-24,duration:.9},3.45)
        .to(intro,{opacity:0,duration:.95,ease:'sine.inOut'},4.7)
        .to('.hero__kicker',{opacity:1,duration:.65},4.85)
        .fromTo('.hero__date,.hero__when',{y:12},{y:0,opacity:1,duration:.7,stagger:.12,ease:'power2.out'},4.95)
        .to('.scene__curtain--left',{xPercent:-3,duration:.9,ease:'sine.out'},5.05)
        .to('.scene__curtain--right',{xPercent:3,duration:.9,ease:'sine.out'},5.05)
        .to('.hero__cue',{opacity:1,duration:.65},5.35);
      if(lite())timeline.timeScale(2.6);
    });
  }
  window.KOZGU.open=opening;
  intro.addEventListener('pointerdown',()=>{if(state==='opening')timeline?.timeScale(4);});
  intro.addEventListener('keydown',event=>{if(event.key==='Enter'&&state==='opening'){event.preventDefault();timeline?.timeScale(4);}});
  intro.addEventListener('wheel',event=>event.preventDefault(),{passive:false});
  art.ready.then(()=>{if(state!=='idle'||!gsap||reduced)return;gsap.fromTo('.intro__edition,.intro__greeting',{opacity:0,y:8},{opacity:1,y:0,duration:1.15,stagger:.12,ease:'sine.out'});});

  /* One ambient canvas loop. Petal celebrations also work below the hero. */
  const petalCanvas=$('.petals'),pc=petalCanvas.getContext('2d'),life=$('.scene__life'),lc=life.getContext('2d');
  const sprite=new Image();sprite.src='art/petal-sprites.webp';
  let particles=[],raf=0,last=0,ambient=false,heroVisible=true,view={w:0,h:0,sw:0,sh:0};
  const flies=Array.from({length:8},()=>({x:.29+Math.random()*.42,y:.48+Math.random()*.18,phase:Math.random()*Math.PI*2}));
  function sizeCanvas(){const ratio=Math.min(devicePixelRatio||1,lite()?1.5:2),r=petalCanvas.getBoundingClientRect();view={w:r.width,h:r.height,sw:scene.clientWidth,sh:scene.clientHeight};[[petalCanvas,pc,view.w,view.h],[life,lc,view.sw,view.sh]].forEach(([canvas,ctx,w,h])=>{canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);});}
  function petal(burst=false,x=0,y=0){const angle=Math.random()*Math.PI*2,speed=1.5+Math.random()*3;return {x:burst?x:Math.random()*view.w,y:burst?y:Math.random()*view.h,vx:burst?Math.cos(angle)*speed:(Math.random()-.5)*.1,vy:burst?Math.sin(angle)*speed-1.5:.2+Math.random()*.3,size:4+Math.random()*7,rotation:Math.random()*6.28,phase:Math.random()*6.28,kind:Math.floor(Math.random()*6),burst,life:0};}
  function draw(now){raf=0;if(document.hidden)return;const delta=Math.min(2,(now-(last||now))/16.67);last=now;pc.clearRect(0,0,view.w,view.h);lc.clearRect(0,0,view.sw,view.sh);let burstAlive=false;
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];if(!p.burst&&!heroVisible)continue;p.life+=delta;p.phase+=.015*delta;p.rotation+=.008*delta;p.x+=(p.vx+Math.sin(p.phase)*.15)*delta;p.y+=p.vy*delta;
      if(p.burst){burstAlive=true;p.vy+=.045*delta;if(p.life>105){particles.splice(i,1);continue;}}else if(p.y>view.h+15){p.y=-15;p.x=Math.random()*view.w;}
      pc.save();pc.translate(p.x,p.y);pc.rotate(p.rotation);pc.scale(Math.cos(p.phase),1);pc.globalAlpha=p.burst?Math.min(.9,(105-p.life)/40):.42;
      if(sprite.complete&&sprite.naturalWidth){const sw=sprite.naturalWidth/3,sh=sprite.naturalHeight/2;pc.drawImage(sprite,(p.kind%3)*sw,Math.floor(p.kind/3)*sh,sw,sh,-p.size/2,-p.size/3,p.size,p.size*.7);}pc.restore();
    }
    if(ambient&&heroVisible)flies.slice(0,lite()?3:8).forEach(f=>{f.phase+=.012*delta;lc.globalAlpha=.12+Math.max(0,Math.sin(f.phase))*.52;lc.fillStyle='#ffe3a3';lc.beginPath();lc.arc(f.x*view.sw+Math.sin(f.phase*.4)*5,f.y*view.sh+Math.cos(f.phase*.6)*4,1.15,0,Math.PI*2);lc.fill();});
    if((ambient&&heroVisible)||burstAlive)raf=requestAnimationFrame(draw);
  }
  function run(){if(!raf&&!document.hidden){last=0;raf=requestAnimationFrame(draw);}}
  function startAmbient(){if(reduced||ambient)return;ambient=true;sizeCanvas();particles=Array.from({length:lite()?7:22},()=>petal());run();}
  function burst(x,y){if(reduced)return;sizeCanvas();const rect=petalCanvas.getBoundingClientRect(),count=lite()?8:28,cap=lite()?15:60;for(let i=0;i<count&&particles.length<cap;i++)particles.push(petal(true,x-rect.left,y-rect.top));run();}
  M.on('rsvp',answer=>{if(answer.status==='yes'){const box=$('[data-rsvp-done]').getBoundingClientRect();burst(box.left+box.width/2,Math.max(90,box.top+40));}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else if(ambient)run();});
  new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;if(heroVisible&&ambient)run();},{threshold:.03}).observe(hero);
  addEventListener('resize',()=>{if(ambient)sizeCanvas();});

  function scrollStory(){
    if(storyBuilt||!gsap||!window.ScrollTrigger||reduced)return;storyBuilt=true;gsap.registerPlugin(ScrollTrigger);
    const heroScroll={trigger:hero,start:'top top',end:'bottom top',scrub:.7};
    gsap.to('.scene__curtain--left',{xPercent:-13,ease:'none',scrollTrigger:heroScroll});
    gsap.to('.scene__curtain--right',{xPercent:13,ease:'none',scrollTrigger:heroScroll});
    gsap.to('.scene__fore',{yPercent:-8,ease:'none',scrollTrigger:heroScroll});
    gsap.to('.hero__copy',{y:-35,opacity:.1,ease:'none',scrollTrigger:heroScroll});
    gsap.fromTo('.letter-card__fog',{opacity:1},{opacity:0,ease:'none',scrollTrigger:{trigger:'#invitation-text',start:'top 90%',end:'top 35%',scrub:.7}});
    const wick={progress:0};gsap.to(wick,{progress:1,ease:'none',onUpdate(){ $('.program').style.setProperty('--timeline-fill',wick.progress);$$('.program__item').forEach((item,i,all)=>item.classList.toggle('is-lit',wick.progress>(i+.25)/all.length));},scrollTrigger:{trigger:'.program',start:'top 75%',end:'bottom 55%',scrub:.65}});
    $$('.section').forEach((section,index)=>{
      gsap.fromTo($$('.eyebrow,.section__title',section),{opacity:0,y:index%2?16:8},{opacity:1,y:0,duration:.95,stagger:.12,ease:'power2.out',scrollTrigger:{trigger:section,start:'top 84%',once:true}});
    });
    [['.calendar',{y:25,scale:.96}],['.venue__photo',{clipPath:'inset(45% 0 0 0 round 160px 160px 8px 8px)'}],['.gallery__item',{x:30}],['.gift',{rotationX:-8,y:20}],['.contacts li',{x:-15}]].forEach(([selector,from])=>gsap.from(selector,{...from,opacity:.3,duration:1.15,stagger:.1,ease:'power2.out',scrollTrigger:{trigger:selector,start:'top 88%',once:true}}));
  }
})();
