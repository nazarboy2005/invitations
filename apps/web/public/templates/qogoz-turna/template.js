(() => {
  'use strict';
  const $ = (s, c=document) => c.querySelector(s), $$ = (s, c=document) => [...c.querySelectorAll(s)];
  const reduced = () => window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lite = () => window.Marhamat?.tier === 'lite' || reduced();
  const clamp = (v,a,b) => Math.max(a, Math.min(b,v));

  function introFilm() {
    const intro = $('#intro'), button = $('#open-invitation'); if (!intro || !button) return;
    const shapes = ['.folding-sheet__square','.folding-sheet__kite','.folding-sheet__wing--left','.folding-sheet__wing--right','.folding-sheet__crane','.intro__tag','.intro__button'];
    let opened = false, timer;
    if (window.gsap && !reduced()) {
      gsap.set('.folding-sheet__kite,.folding-sheet__wing,.folding-sheet__crane', { opacity:0 });
      gsap.set('.intro__tag,.intro__button', { y:18, opacity:0 });
      const arrivalTL=gsap.timeline({defaults:{ease:'power3.out'}})
        .fromTo('.intro__greeting',{y:10,opacity:0},{y:0,opacity:1,duration:.55})
        .to('.folding-sheet__square',{rotation:0,scale:.86,duration:.45,ease:'back.out(1.4)'},.15)
        .fromTo('.folding-sheet__kite',{rotation:-22,scale:.5,opacity:0},{rotation:0,scale:1,opacity:1,duration:.52,ease:'back.out(1.5)'},.56)
        .fromTo('.folding-sheet__wing',{rotationY:88,opacity:0},{rotationY:0,opacity:1,duration:.42,stagger:.09,ease:'power2.out'},1.03)
        .fromTo('.folding-sheet__crane',{y:13,scale:.7,opacity:0},{y:0,scale:1,opacity:1,duration:.48,ease:'back.out(1.5)'},1.58)
        .fromTo('.intro__tag',{y:18,opacity:0,rotation:3},{y:0,opacity:1,rotation:-1,duration:.55,ease:'back.out(1.3)'},1.95)
        .fromTo('.intro__button',{y:14,opacity:0},{y:0,opacity:1,duration:.4},2.35);
    }
    function finish(){ clearTimeout(timer);document.documentElement.classList.remove('is-locked');document.body.classList.add('is-open');intro.setAttribute('aria-hidden','true');intro.hidden=true;$('#hero')?.scrollIntoView({block:'start',behavior:'auto'}); }
    function open(){ if(opened){finish();return} opened=true;window.Marhamat?.open?.();document.body.classList.add('is-opening');
      if(window.gsap&&!reduced()){
        const tl=gsap.timeline({onComplete:finish});
        tl.to('.folding-sheet__wing--left',{rotationY:-30,rotationZ:-12,duration:.25,ease:'power2.inOut'},0)
          .to('.folding-sheet__wing--right',{rotationY:-30,rotationZ:12,duration:.25,ease:'power2.inOut'},0)
          .to('.folding-sheet__crane',{y:-26,rotation:-10,scale:1.18,duration:.62,ease:'power2.in'},.12)
          .to('.book-scene__page--back',{rotationX:0,rotationY:-148,duration:.62,ease:'power3.inOut'},.35)
          .to('.hill--far,.hill--near',{rotationX:0,y:0,stagger:.1,duration:.55,ease:'back.out(1.35)'},.55)
          .to('.scene-art--registan,.paper-tree',{rotationX:0,y:0,stagger:.08,duration:.62,ease:'back.out(1.25)'},.66)
          .fromTo('.hero-banner',{y:42,scaleX:.72,opacity:0},{y:0,scaleX:1,opacity:1,duration:.5,ease:'back.out(1.4)'},1.04)
          .to('.hero-crane',{y:-12,rotation:0,duration:.6,ease:'back.out(1.5)'},.92)
          .to('.intro__tag',{y:18,rotation:4,opacity:0,duration:.45},1.16)
          .to('.intro__film',{scale:1.1,opacity:0,duration:.45,ease:'power2.in'},1.34)
          .to('.intro',{opacity:0,duration:.3},1.65);
        if(lite())tl.timeScale(1.5);
        timer=setTimeout(finish,2500);
      } else {timer=setTimeout(finish,120)}
    }
    button.addEventListener('click', e=>{e.stopPropagation();open()});
    intro.addEventListener('click',()=>{if(opened)finish()});
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened)finish()});
  }

  function paperDrift(){
    const canvas=$('.paper-drift'), ctx=canvas?.getContext('2d'); if(!canvas||!ctx||lite())return;
    const particles=Array.from({length:Math.min(60,innerWidth<600?32:54)},(_,i)=>({x:Math.random(),y:Math.random(),r:2+Math.random()*4,v:.00012+Math.random()*.00024,w:Math.random()*6.28,rot:Math.random()*6.28,c:['#C8A35F','#C9785A','#A9B8A0','#EBC4BA'][i%4]}));
    let raf=0,active=true;const dpr=Math.min(devicePixelRatio||1,2);function resize(){canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}resize();addEventListener('resize',resize,{passive:true});
    const io=new IntersectionObserver(es=>{active=es[0].isIntersecting; if(active&&!document.hidden&&!raf)raf=requestAnimationFrame(draw);if(!active&&raf){cancelAnimationFrame(raf);raf=0}});io.observe($('.page'));
    function draw(t){raf=0;if(!active||document.hidden)return;ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of particles){p.y+=p.v*(innerHeight/2);p.x+=Math.sin(t*.0005+p.w)*.00035;if(p.y>1.03){p.y=-.03;p.x=Math.random()}ctx.save();ctx.translate(p.x*innerWidth,p.y*innerHeight);ctx.rotate(p.rot+=.006);ctx.fillStyle=p.c;ctx.globalAlpha=.28;ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*.72);ctx.restore()}raf=requestAnimationFrame(draw)}
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0}else if(!document.hidden&&active&&!raf)raf=requestAnimationFrame(draw)});raf=requestAnimationFrame(draw);
  }

  function makeBirdGeometry(THREE){
    const verts=[], cols=[];const colors=['#EBC4BA','#f4dfc9','#D6E0D2','#E7D2A9','#B8C9D6'];
    const tris=[[-.55,0,0, -.08,-.03,.02, -.05,.20,0],[-.08,-.03,.02,.08,-.03,-.02,-.05,.20,0],[.08,-.03,-.02,.5,.02,0,.13,.1,.01],[-.55,0,0,-.1,-.03,-.02,-.31,-.27,-.01],[-.1,-.03,-.02,.15,.05,.02,-.31,-.27,-.01],[-.05,.2,0,.08,-.03,-.02,.05,.47,-.04],[-.05,.2,0,.05,.47,-.04,-.28,.39,-.02],[-.08,-.03,.02,-.31,-.27,-.01,-.34,.2,.06],[.08,-.03,-.02,.13,.1,.01,.17,-.19,.03],[.13,.1,.01,.5,.02,0,.17,-.19,.03]];
    tris.forEach((t,i)=>{const rgb=new THREE.Color(colors[i%colors.length]);for(let j=0;j<9;j+=3){verts.push(t[j],t[j+1],t[j+2]);cols.push(rgb.r,rgb.g,rgb.b)}});
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));g.computeVertexNormals();return g;
  }
  function setupFlock(){
    if(lite()||!window.WebGLRenderingContext)return;
    const canvas=$('.flock-canvas'), host=$('.book-scene');if(!canvas||!host)return;
    let stopped=false,renderer,raf=0,inside=false,frame=0,threeScript;
    const fallback=()=>{host.classList.remove('is-flocking');if(renderer){renderer.dispose();renderer=null}if(raf)cancelAnimationFrame(raf);if(threeScript?.parentNode)threeScript.remove()};
    const init=()=>{if(stopped||!window.THREE)return;const T=window.THREE;let gl;
      try{renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(host.clientWidth,host.clientHeight,false);renderer.setClearColor(0,0);gl=renderer.getContext()}catch(e){fallback();return}
      const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,host.clientWidth/host.clientHeight,.1,100);camera.position.set(0,0,8);
      const geom=makeBirdGeometry(T),mat=new T.MeshBasicMaterial({vertexColors:true,side:T.DoubleSide}),count=26,mesh=new T.InstancedMesh(geom,mat,count),dummy=new T.Object3D();scene.add(mesh);const seeded=Array.from({length:count},(_,i)=>({a:i/count*Math.PI*2,rad:2.2+Math.random()*2.3,z:-.4-Math.random()*2,phase:Math.random()*6,scale:.22+Math.random()*.25,speed:.28+Math.random()*.35,tilt:Math.random()*1.4}));
      host.classList.add('is-flocking');const resize=()=>{if(!renderer)return;renderer.setSize(host.clientWidth,host.clientHeight,false);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix()};addEventListener('resize',resize,{passive:true});
      canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback()},{once:true});let last=performance.now(),fpsSum=0,fpsN=0;
      const draw=now=>{raf=0;if(stopped||!inside||document.hidden)return;const dt=now-last;last=now;if(dt>0){fpsSum+=1000/dt;fpsN++;if(fpsN>90){if(fpsSum/fpsN<45){fallback();return}fpsSum=0;fpsN=0}}
        seeded.forEach((b,i)=>{const a=b.a+now*.00014*b.speed;dummy.position.set(Math.sin(a)*b.rad,Math.cos(a*.83+b.phase)*.65, b.z+Math.sin(a*1.6)*.35);dummy.rotation.set(Math.sin(now*.004+b.phase)*.22,Math.cos(a)*.6,Math.sin(a*1.3+b.phase)*.35);dummy.scale.set(b.scale*(.7+.3*Math.sin(now*.009+b.phase)),b.scale*(.6+.4*Math.abs(Math.sin(now*.009+b.phase))),b.scale);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});mesh.instanceMatrix.needsUpdate=true;renderer.render(scene,camera);raf=requestAnimationFrame(draw)};
      const io=new IntersectionObserver(entries=>{inside=entries[0].isIntersecting;if(inside&&!document.hidden&&!raf)raf=requestAnimationFrame(draw);if(!inside&&raf){cancelAnimationFrame(raf);raf=0}});io.observe(host);document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0}else if(!document.hidden&&inside&&!raf)raf=requestAnimationFrame(draw)});window.Marhamat?.on?.('tier',tier=>{if(tier==='lite')fallback()});
    };
    const load=()=>{if(stopped||window.THREE)return init();threeScript=document.createElement('script');threeScript.src='../shared/nikoh/vendor/three/three.bundle.min.js';threeScript.async=true;threeScript.onload=init;threeScript.onerror=fallback;document.head.append(threeScript)};
    const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,900));const afterOpen=()=>idle(load,{timeout:2500});if(window.Marhamat?.on)window.Marhamat.on('open',afterOpen);else addEventListener('load',afterOpen,{once:true});
  }

  function scrollMotion(){
    if(!window.gsap||!window.ScrollTrigger||reduced())return;gsap.registerPlugin(ScrollTrigger);document.documentElement.classList.add('js-motion');
    const once=(trigger,start='top 82%')=>({trigger,start,once:true});
    // Six reverse-scrubbable paper mechanics: hero unfold, camera drift, letter folds, date ring, program tabs, venue rise, dress swatches and book close.
    gsap.fromTo('.book-scene__page--back',{rotationX:88,y:12},{rotationX:68,y:0,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:.7}});
    gsap.fromTo('.hill--far',{rotationX:-90,y:45},{rotationX:-68,y:0,ease:'none',scrollTrigger:{trigger:'#hero',start:'top bottom',end:'top 15%',scrub:.8}});
    gsap.fromTo('.hill--near',{rotationX:-100,y:58},{rotationX:-68,y:0,ease:'none',scrollTrigger:{trigger:'#hero',start:'top bottom',end:'top 12%',scrub:.8}});
    gsap.fromTo('.scene-art--registan',{rotationX:-95,y:80},{rotationX:-62,y:0,ease:'none',scrollTrigger:{trigger:'#hero',start:'top bottom',end:'top 10%',scrub:.8}});
    gsap.fromTo('.hero-crane',{y:30,rotation:-24},{y:-35,rotation:17,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});
    gsap.fromTo('.hero__copy h1',{y:0,opacity:1},{y:-30,opacity:.5,ease:'none',immediateRender:false,scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:.8}});
    $$('.section').forEach((section,index)=>{
      const title=$(':scope > .section__title',section);if(title)gsap.fromTo(title,{rotationX:-84,y:16,transformOrigin:'50% 100%',opacity:0},{rotationX:0,y:0,opacity:1,duration:.8,ease:'back.out(1.4)',scrollTrigger:once(section)});
      const folio=$('.spread__folio',section);if(folio)gsap.fromTo(folio,{y:30,rotation:-12,opacity:0},{y:0,rotation:0,opacity:1,duration:.7,scrollTrigger:once(section,'top 90%')});
      if(index>0){const ornament=$(':scope > .eyebrow',section);if(ornament)gsap.fromTo(ornament,{x:-25,opacity:0},{x:0,opacity:1,duration:.55,scrollTrigger:once(section,'top 88%')})}
    });
    gsap.fromTo('.letter',{rotationX:80,transformOrigin:'50% 0%',y:25},{rotationX:0,y:0,ease:'none',scrollTrigger:{trigger:'.letter',start:'top 92%',end:'top 45%',scrub:.5}});
    gsap.fromTo('.calendar-day:not(.is-empty)',{rotationX:-70,opacity:.2,transformOrigin:'50% 0%'},{rotationX:0,opacity:1,duration:.55,stagger:{each:.018,from:'start'},ease:'power3.out',scrollTrigger:once('.calendar','top 83%')});
    gsap.fromTo('.date-spread .calendar',{y:42,rotation:-3},{y:0,rotation:0,ease:'none',scrollTrigger:{trigger:'.date-spread',start:'top bottom',end:'top 24%',scrub:.6}});
    gsap.fromTo('.program',{scaleY:0,transformOrigin:'50% 0%'},{scaleY:1,ease:'none',scrollTrigger:{trigger:'.program-spread',start:'top 78%',end:'top 33%',scrub:.6}});
    $$('.program__item').forEach((item,i)=>gsap.fromTo(item,{x:i%2?30:-30,opacity:0},{x:0,opacity:1,duration:.6,delay:i*.04,ease:'power2.out',scrollTrigger:once(item,'top 88%')}));
    gsap.fromTo('.venue-building',{rotationX:-84,transformOrigin:'50% 100%',y:30},{rotationX:0,y:0,ease:'none',scrollTrigger:{trigger:'.venue-spread',start:'top 82%',end:'top 35%',scrub:.55}});
    gsap.fromTo('.dresscode__palette li',{rotationY:-90,y:30,opacity:0,transformOrigin:'0% 50%'},{rotationY:0,y:0,opacity:1,stagger:.09,duration:.7,ease:'back.out(1.25)',scrollTrigger:once('.dresscode','top 76%')});
    $$('.gallery__item').forEach((item,i)=>gsap.fromTo(item,{y:55,rotation:i%2?8:-8,opacity:0},{y:0,rotation:i%2?1.3:-1,duration:.8,delay:i*.06,ease:'back.out(1.3)',scrollTrigger:once(item,'top 90%')}));
    gsap.fromTo('.rsvp__choices button',{x:65,rotationY:-32,opacity:0},{x:0,rotationY:0,opacity:1,stagger:.12,duration:.7,ease:'back.out(1.25)',scrollTrigger:once('.rsvp__choices','top 85%')});
    $$('.wishes__item').forEach((item,i)=>gsap.fromTo(item,{x:i%2?45:-45,rotation:i%2?4:-4,opacity:0},{x:0,rotation:i%2?.5:-.6,opacity:1,duration:.7,ease:'back.out(1.25)',scrollTrigger:once(item,'top 90%')}));
    gsap.fromTo('.gift',{rotationX:-75,transformOrigin:'50% 0%',opacity:.65},{rotationX:0,opacity:1,duration:1,ease:'back.out(1.2)',scrollTrigger:once('.gift','top 87%')});
    gsap.fromTo('.footer__cover',{rotationX:-75,transformOrigin:'50% 100%'},{rotationX:0,ease:'none',scrollTrigger:{trigger:'#footer',start:'top bottom',end:'top 20%',scrub:.7}});
    gsap.to('.footer__cover',{y:-20,rotation:14,ease:'none',scrollTrigger:{trigger:'#footer',start:'top 60%',end:'bottom bottom',scrub:.6}});
    if(!lite())gsap.to('.cloud-a',{x:35,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});
    addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
  }
  function celebrations(){window.Marhamat?.on?.('rsvp',answer=>{if(answer?.status!=='yes'||reduced())return;const ornament=$('[data-rsvp-done] .ornament');if(ornament&&window.gsap)gsap.fromTo(ornament,{scale:.4,rotation:-40},{scale:1.3,rotation:12,duration:.35,yoyo:true,repeat:1,ease:'back.out(2)'});burst();});
    window.Marhamat?.on?.('wish',()=>{const last=$('.wishes__item:last-child');if(last&&window.gsap)gsap.fromTo(last,{scale:.82,rotation:5,opacity:0},{scale:1,rotation:.5,opacity:1,duration:.6,ease:'back.out(1.5)'})});
    $$('[data-rsvp-choice],.button,.text-link,.music-toggle').forEach(el=>el.addEventListener('pointerdown',()=>{el.classList.add('is-pressed');setTimeout(()=>el.classList.remove('is-pressed'),180)},{passive:true}));
  }
  function burst(){const c=$('.paper-drift'),ctx=c?.getContext('2d');if(!ctx||reduced())return;const pieces=Array.from({length:24},()=>({x:innerWidth*.5,y:innerHeight*.68,vx:(Math.random()-.5)*5,vy:-2-Math.random()*4,r:2+Math.random()*4,life:1,c:['#C8A35F','#C9785A','#A9B8A0','#EBC4BA'][Math.floor(Math.random()*4)]}));let n=0;function draw(){ctx.save();for(const p of pieces){p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.life-=.015;ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,p.r,p.r*1.6)}ctx.restore();if(++n<68)requestAnimationFrame(draw)}draw()}
  function init(){introFilm();paperDrift();scrollMotion();setupFlock();celebrations()}
  if(window.Marhamat?.on)window.Marhamat.on('ready',()=>setTimeout(init,0));else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
