(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const intro = $('.intro'), openButton = $('#open-invitation'), poster = $('.intro__poster');
  const glitterCanvas = $('.intro__glitter'), gctx = glitterCanvas?.getContext('2d');
  const reduce = () => window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const full = () => window.Marhamat?.tier === 'full' && !reduce();
  const params = new URLSearchParams(location.search);
  function buildFoilDigits(){
    const age=String(window.Marhamat?.data?.extras?.age||'').replace(/[^0-9]/g,'').slice(0,2);
    if(!age)return;
    ['.intro__balloons','.hero__balloons','.rsvp__balloons'].forEach(selector=>{const host=$(selector);if(!host)return;host.replaceChildren();for(const digit of age){const img=document.createElement('img');img.src='art/digits/foil-digit-'+digit+'.webp';img.width=400;img.height=600;img.alt='';img.decoding='async';img.fetchPriority='high';host.append(img)}});
  }
  buildFoilDigits();
  let opened = false, finishing = false, dustRaf = 0, webglRaf = 0, particles = [], burstDots = [], width = 0, height = 0, dpr = 1;
  let renderer = null, scene = null, camera = null, objects = [], threeLoading = false, sceneObserver = null, digitScene = null, sceneRotation = 0, sceneLift = 0;
  const random = (a,b) => a + Math.random() * (b-a);

  function seedDust() {
    if (!gctx || !glitterCanvas) return;
    const box = glitterCanvas.getBoundingClientRect(); width = box.width; height = box.height;
    dpr = Math.min(devicePixelRatio || 1, full() ? 1.5 : 1);
    glitterCanvas.width = Math.round(width*dpr); glitterCanvas.height = Math.round(height*dpr);
    gctx.setTransform(dpr,0,0,dpr,0,0);
    const count = reduce() ? 0 : (full() ? 44 : 12);
    particles = Array.from({length:count},()=>({x:random(0,width),y:random(0,height),r:random(.5,1.8),a:random(.18,.72),p:random(0,6.28),v:random(.08,.35)}));
  }
  function drawDust(now=0) {
    dustRaf=0; if(!gctx || document.hidden || (!intro?.isConnected)) return;
    gctx.clearRect(0,0,width,height); const t=now*.001;
    particles.forEach(p=>{p.y-=p.v*.18;p.x+=Math.sin(t+p.p)*.09;if(p.y<0){p.y=height+3;p.x=random(0,width)};gctx.globalAlpha=p.a*(.58+.42*Math.sin(t*1.3+p.p));gctx.fillStyle='#f4d99b';gctx.beginPath();gctx.arc(p.x,p.y,p.r,0,Math.PI*2);gctx.fill()});
    const live=[];burstDots.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy-=.012;p.life-=.018;if(p.life<=0)return;gctx.globalAlpha=Math.min(1,p.life*1.7);gctx.fillStyle=p.color;gctx.beginPath();gctx.arc(p.x,p.y,p.r,0,Math.PI*2);gctx.fill();live.push(p)});burstDots=live;gctx.globalAlpha=1;
    if((!opened && particles.length)||burstDots.length) dustRaf=requestAnimationFrame(drawDust);
  }
  function startDust(){if(!dustRaf && !document.hidden && ((!opened&&particles.length)||burstDots.length)) dustRaf=requestAnimationFrame(drawDust)}
  seedDust(); startDust(); window.addEventListener('resize',seedDust,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(dustRaf);cancelAnimationFrame(webglRaf);dustRaf=webglRaf=0}else startDust()});

  function makeDigits(THREE) {
    const foil=new THREE.MeshPhysicalMaterial({color:0xd8ba7a,metalness:.84,roughness:.16,clearcoat:1,clearcoatRoughness:.1,side:THREE.DoubleSide});
    const age=String(window.Marhamat?.data?.extras?.age||'').replace(/[^0-9]/g,'').slice(0,2);
    if(!age)return;
    const group=new THREE.Group();
    function balloonDigit(character){
      const digit=new THREE.Group();
      if(character==='0'){
        const loop=new THREE.Mesh(new THREE.TorusGeometry(.39,.145,16,64),foil);
        loop.scale.set(.75,1.22,.76);digit.add(loop);
        const seam=new THREE.Mesh(new THREE.TorusGeometry(.245,.012,6,48),new THREE.MeshStandardMaterial({color:0xf4dfa9,metalness:.7,roughness:.3}));
        seam.scale.set(.75,1.22,.76);seam.position.z=.12;digit.add(seam);
      }else if(character==='3'){
        for(const y of [.235,-.235]){
          const arc=new THREE.Mesh(new THREE.TorusGeometry(.3,.135,16,48,Math.PI*1.53),foil);
          arc.rotation.z=Math.PI/2;arc.scale.set(1.05,.94,.8);arc.position.set(.09,y,0);digit.add(arc);
        }
        const bridge=new THREE.Mesh(new THREE.SphereGeometry(.125,16,12),foil);bridge.scale.set(1.2,.74,.9);bridge.position.set(.28,0,0);digit.add(bridge);
      }else{
        const canvas=document.createElement('canvas');canvas.width=256;canvas.height=400;const ctx=canvas.getContext('2d');ctx.font='900 350px Syne,Arial,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(character,128,205);
        const tex=new THREE.CanvasTexture(canvas);const mat=new THREE.MeshPhysicalMaterial({color:0xd8ba7a,map:tex,metalness:.8,roughness:.17,transparent:true,side:THREE.DoubleSide});
        digit.add(new THREE.Mesh(new THREE.PlaneGeometry(.75,1.15,16,16),mat));
      }
      const knot=new THREE.Mesh(new THREE.SphereGeometry(.095,10,8),foil);knot.scale.set(.75,.8,.65);knot.position.set(0,-.53,.02);digit.add(knot);
      return digit;
    }
    const glyphs=[...age];glyphs.forEach((glyph,i)=>{const digit=balloonDigit(glyph);digit.position.x=(i-(glyphs.length-1)/2)*.95;digit.userData.isBalloon=true;digit.userData.phase=i*.8;group.add(digit);objects.push(digit)});
    group.position.set(0,.35,0);group.scale.set(1.45,1.45,1.2);scene.add(group);group.userData.isDigits=true;digitScene=group;
    const key=new THREE.SpotLight(0xffe3aa,32,12,Math.PI/4,.45,1.2);key.position.set(-2.4,3.2,4);key.target=group;scene.add(key, key.target);
    const rim=new THREE.PointLight(0xffbb65,18,9);rim.position.set(2,-.2,2.5);scene.add(rim);
    scene.add(new THREE.AmbientLight(0x9f7b48,1.8));
    const beadGeo=new THREE.SphereGeometry(.014,6,5),beadMat=new THREE.MeshBasicMaterial({color:0xffe7b0});
    for(let i=0;i<40;i++){const bead=new THREE.Mesh(beadGeo,beadMat);bead.position.set(random(-2,2),random(-1.5,1.7),random(-.8,1.2));bead.userData.phase=random(0,6);scene.add(bead);objects.push(bead)}
    objects.push(group);
  }
  function disposeThree(){if(renderer){renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();renderer=null;scene=null;camera=null;objects=[]}}
  function makeThree() {
    if(!full() || renderer || !window.THREE || !$('.intro__webgl')) return;
    const canvas=$('.intro__webgl');
    try{
      const THREE=window.THREE;const gl=canvas.getContext('webgl2',{alpha:true,antialias:true})||canvas.getContext('webgl',{alpha:true,antialias:true});if(!gl)return;renderer=new THREE.WebGLRenderer({canvas,context:gl,alpha:true,antialias:true,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight,false);renderer.setClearColor(0x000000,0);
      scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.1,50);camera.position.set(0,0,7);
      makeDigits(THREE);canvas.classList.add('is-ready');
      canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();const old=renderer;renderer=null;scene=null;camera=null;objects=[];canvas.classList.remove('is-ready');if(old)old.dispose()},{once:true});
      let begin=performance.now(),frames=0;
      sceneObserver=new IntersectionObserver(es=>{if(es[0].isIntersecting)render();else {cancelAnimationFrame(webglRaf);webglRaf=0}},{threshold:.01});sceneObserver.observe(intro);
      function render(){if(!renderer||document.hidden||!intro.isConnected)return;const t=performance.now()*.001;objects.forEach((o,i)=>{if(o.userData.isDigits){o.rotation.y=Math.sin(t*.42)*.07+sceneRotation;o.rotation.x=Math.sin(t*.27)*.035;o.position.y=.35+Math.sin(t*.6)*.045+sceneLift}else if(o.userData.phase!=null){o.position.y+=Math.sin(t+o.userData.phase)*.0009}});renderer.render(scene,camera);frames++;if(performance.now()-begin>2400&&frames*1000/(performance.now()-begin)<45){disposeThree();return}webglRaf=requestAnimationFrame(render)}
      render();window.addEventListener('resize',()=>{if(!renderer)return;renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()},{passive:true});
    }catch(_){disposeThree()}
  }
  function loadThree(){if(!full()||renderer||threeLoading)return;if(window.THREE)return makeThree();threeLoading=true;const later=window.requestIdleCallback||((fn)=>setTimeout(fn,250));later(()=>{if(!full()){threeLoading=false;return}const s=document.createElement('script');s.src='../shared/nikoh/vendor/three/three.bundle.min.js';s.onload=()=>{threeLoading=false;makeThree()};s.onerror=()=>{threeLoading=false};document.head.appendChild(s)},{timeout:1100})}
  const posterFrame=()=>{poster?.classList.add('is-living');loadThree()};setTimeout(posterFrame,100);
  function playArrival(){
    const targets=['.intro__greeting','.intro__eyebrow','.intro__name','.intro__date','.open-button'];
    if(window.gsap&&!reduce()){
      gsap.set(targets,{opacity:0,y:16});if(openButton)openButton.disabled=true;const tl=gsap.timeline({defaults:{ease:'power3.out'},onComplete:()=>{if(openButton)openButton.disabled=false}});
      tl.to('.intro__greeting',{opacity:1,y:0,duration:.42},.38).to('.intro__eyebrow',{opacity:1,y:0,duration:.42},.66)
        .to('.intro__name',{opacity:1,y:0,duration:.62,ease:'back.out(1.12)'},.88)
        .to('.intro__date',{opacity:1,y:0,duration:.4},1.22).to('.open-button',{opacity:1,y:0,duration:.46,ease:'back.out(1.12)'},1.54);
    }
  }
  playArrival();
  function goldBurst(){
    if(reduce()||!gctx)return;const rect=$('.intro__name')?.getBoundingClientRect();const cx=rect?rect.left+rect.width/2:width/2,cy=rect?rect.top+rect.height/2:height*.72;
    for(let i=0;i<(full()?36:15);i++){const angle=Math.random()*Math.PI*2,speed=random(.5,2.1);burstDots.push({x:cx+random(-18,18),y:cy+random(-7,7),vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-0.4,r:random(.7,2.2),life:random(.55,1),color:Math.random()>.65?'#f4efe6':'#d8ba7a'})}startDust();
  }
  window.Marhamat?.on?.('tier',()=>{seedDust();if(!full())disposeThree();else loadThree()});

  function finish(){if(finishing)return;finishing=true;cancelAnimationFrame(dustRaf);dustRaf=0;const hero=$('#hero'),canvas=$('.intro__webgl');if(canvas&&hero){canvas.classList.remove('intro__webgl');canvas.classList.add('hero__webgl');hero.prepend(canvas);if(sceneObserver){sceneObserver.disconnect();sceneObserver.observe(hero)}if(renderer){const rect=hero.getBoundingClientRect();renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix()}}cancelAnimationFrame(webglRaf);webglRaf=0;if(intro){intro.setAttribute('aria-hidden','true');intro.hidden=true}document.documentElement.classList.remove('is-locked');document.body.classList.add('is-open');hero?.scrollIntoView({block:'start',behavior:reduce()?'auto':'smooth'})}
  function open(){if(opened){finish();return}opened=true;goldBurst();window.Marhamat?.open?.();
    if(window.gsap&&!reduce()){
      const tl=gsap.timeline({onComplete:finish,defaults:{ease:'power3.inOut'}});
      tl.to('.intro__copy',{y:-24,opacity:0,duration:.55},0).to('.intro__poster',{scale:1.12,opacity:.45,duration:1.1},0).to('.intro__spotlight',{opacity:1,duration:.8},.15).to('.intro__veil',{opacity:.15,duration:.8},.25).to('.intro__webgl',{y:-20,scale:1.08,duration:.9},.05);
      if(!full())tl.duration(1.2); else tl.duration(1.8);
    }else finish();
  }
  openButton?.addEventListener('click',e=>{e.stopPropagation();open()});intro?.addEventListener('click',()=>{if(opened)finish()});

  function localizeAttrs(){const lang=window.Marhamat?.lang||document.documentElement.dataset.lang||'uz';const table={ru:{'Oldingi surat':'Предыдущее фото','Keyingi surat':'Следующее фото','Surat tanlash':'Выбрать фото','Bayram surati':'Фото с праздника','Bayram manzili':'Место праздника','Tashrif javobi':'Подтверждение участия'},en:{'Oldingi surat':'Previous photo','Keyingi surat':'Next photo','Surat tanlash':'Choose photo','Bayram surati':'Celebration photo','Bayram manzili':'Celebration venue','Tashrif javobi':'Attendance reply'}};if(lang!=='uz')$$('[aria-label]').forEach(el=>{let v=el.getAttribute('aria-label');if(table[lang]?.[v])el.setAttribute('aria-label',table[lang][v])})}
  let scrollReady=false;
  function setupScroll(){
    if(scrollReady)return;scrollReady=true;
    const sections=$$('.section,[data-section="hero"]');
    if(window.gsap&&window.ScrollTrigger&&!reduce()){
      gsap.registerPlugin(ScrollTrigger);
      sections.forEach((section,i)=>{const children=$$('.eyebrow,.section__title,.letter__message,.date-poster,.program__item,.venue__card,.dresscode,.gallery__item,.rsvp__choices,.wishes__item,.gift,.contacts li',section);children.forEach((el,j)=>{if(el.matches('.program__item,.gallery__item,.wishes__item'))return;gsap.fromTo(el,{y:18,opacity:0},{y:0,opacity:1,duration:.82,delay:Math.min(j*.045,.2),ease:'power3.out',scrollTrigger:{trigger:el,start:'top 84%',once:true}})});});
      gsap.to('.hero__art',{yPercent:12,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:.8}});
      gsap.fromTo('.kinetic-number',{color:'transparent',webkitTextStrokeColor:'rgba(216,186,122,.22)'},{color:'rgba(216,186,122,.14)',webkitTextStrokeColor:'rgba(216,186,122,.8)',scrollTrigger:{trigger:'.date-poster',start:'top 78%',end:'bottom 35%',scrub:.8}});
      gsap.fromTo('.timeline__rail',{scaleY:0},{scaleY:1,transformOrigin:'top',ease:'none',scrollTrigger:{trigger:'#program',start:'top 70%',end:'bottom 45%',scrub:.7}});
      gsap.to('.venue__card img',{yPercent:-7,ease:'none',scrollTrigger:{trigger:'#venue',start:'top bottom',end:'bottom top',scrub:.7}});
      gsap.to('.dresscode__seal',{rotation:360,ease:'none',scrollTrigger:{trigger:'#dresscode',start:'top bottom',end:'center center',scrub:.6}});
      gsap.to('.hero__age',{scale:.84,opacity:.4,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:.7}});
      ScrollTrigger.create({trigger:'#hero',start:'top top',end:'bottom top',scrub:.6,onUpdate:self=>{sceneRotation=(self.progress-.5)*.34}});
      ScrollTrigger.create({trigger:'#hero',start:'top bottom',end:'center center',scrub:.7,onUpdate:self=>{sceneLift=(self.progress-.5)*.26}});
    }else{$$('[data-reveal]').forEach(el=>el.style.opacity='1')}
  }
  let confettiRaf=0;
  function rsvpConfetti(){
    const canvas=$('.rsvp__confetti'),ctx=canvas?.getContext('2d');if(!canvas||!ctx||reduce())return;
    const rect=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(rect.width*d);canvas.height=Math.round(rect.height*d);ctx.setTransform(d,0,0,d,0,0);
    const anchor=$('.rsvp__done')?.getBoundingClientRect(),ox=rect.width/2,oy=anchor?anchor.top-rect.top+54:rect.height*.48;
    let bits=Array.from({length:full()?54:22},()=>({x:ox+random(-12,12),y:oy+random(-8,8),vx:random(-3.2,3.2),vy:random(-6,-1.4),r:random(2,4.2),rot:random(0,6.28),spin:random(-.18,.18),life:random(48,86),color:['#d8ba7a','#e3a693','#f4efe6'][Math.floor(Math.random()*3)]}));
    cancelAnimationFrame(confettiRaf);let tick=0;function draw(){if(document.hidden)return;confettiRaf=0;ctx.clearRect(0,0,rect.width,rect.height);const alive=[];bits.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.14;p.rot+=p.spin;p.life--;if(p.life<=0||p.y>rect.height+8)return;ctx.save();ctx.globalAlpha=Math.min(1,p.life/18);ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.color;ctx.fillRect(-p.r,-p.r*.55,p.r*2,p.r*1.1);ctx.restore();alive.push(p)});bits=alive;if(bits.length&&tick++<100)confettiRaf=requestAnimationFrame(draw)}draw();
  }
  function celebrate(){const b=$('.rsvp__balloons');if(!b||reduce())return;rsvpConfetti();if(window.gsap)gsap.fromTo(b,{scale:1,opacity:1},{scale:1.42,opacity:0,duration:.58,ease:'power2.in'});else b.animate([{transform:'scale(1)',opacity:1},{transform:'scale(1.4)',opacity:0}],{duration:580,easing:'ease-in'})}
  window.Marhamat?.on?.('rsvp',answer=>{if(answer?.status==='yes')celebrate()});
  window.Marhamat?.on?.('ready',()=>{localizeAttrs();setupScroll();setTimeout(()=>window.ScrollTrigger?.refresh?.(),250)});
  window.addEventListener('load',()=>{localizeAttrs();setupScroll()},{once:true});
})();
