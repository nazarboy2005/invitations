(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = () => !!window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (a, b) => a + Math.random() * (b - a);
  let renderer = null, composer = null, raf = 0, scene = null, camera = null, tileMesh = null, shardMesh = null, candleLight = null, flameMats = [];
  let visible = true, openedAt = -1, targetPoints = [], sourcePoints = [], shardRot = [], frameTimes = [], lastFrame = 0;
  const intro = $('#intro'), hero = $('#hero'), openBtn = $('#open-invitation');

  function textLang(uz, ru, en) { const l = window.Marhamat?.lang || new URLSearchParams(location.search).get('lang') || 'uz'; return ({uz,ru,en})[l] || uz; }
  function translatedNames() {
    const wrap = document.createElement('canvas'), ctx = wrap.getContext('2d');
    const g = $('[data-slot="groom"]', intro)?.textContent?.trim() || 'Javohir';
    const b = $('[data-slot="bride"]', intro)?.textContent?.trim() || 'Madina';
    ctx.font = '600 76px "Cormorant SC", Georgia, serif';
    const width = Math.min(850, Math.ceil(ctx.measureText(`${g}  &  ${b}`).width + 60)); wrap.width = width; wrap.height = 128;
    ctx.font = '600 76px "Cormorant SC", Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff'; ctx.fillText(`${g}  &  ${b}`, width/2, 66, width-20);
    const pixels = ctx.getImageData(0,0,width,128).data, pts=[];
    const step = Math.max(3, Math.floor(width/210));
    for(let y=10;y<120;y+=step) for(let x=4;x<width;x+=step) if(pixels[(y*width+x)*4+3]>180 && Math.random()>.22) pts.push([(x-width/2)/85, (64-y)/85, 0]);
    return pts.length ? pts : [[0,0,0]];
  }
  function addEnvironment(THREE, sc) {
    try {
      const pmrem = new THREE.PMREMGenerator(renderer); const env = new THREE.RoomEnvironment(renderer); const target = pmrem.fromScene(env, .04);
      sc.environment = target.texture; env.dispose(); pmrem.dispose();
    } catch(e) { /* The warm procedural lights still illuminate the fallback material. */ }
  }
  function buildDome(THREE) {
    const geo = new THREE.PlaneGeometry(.075,.06,1,1);
    const count = Math.min(3600, Math.max(1500, Math.floor((innerWidth*innerHeight)/190)));
    const mirrorMat = new THREE.MeshStandardMaterial({color:0xffffff,metalness:1,roughness:.065,envMapIntensity:1.6,vertexColors:true});
    mirrorMat.onBeforeCompile = shader => { shader.uniforms.uMirrorTime={value:0}; shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute float aWave;\nvarying float vWave;\nvarying vec3 vMirrorNormal;').replace('#include <begin_vertex>','#include <begin_vertex>\nvWave=aWave;').replace('#include <defaultnormal_vertex>','#include <defaultnormal_vertex>\nvMirrorNormal=transformedNormal;'); shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform float uMirrorTime;\nvarying float vWave;\nvarying vec3 vMirrorNormal;').replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb*=smoothstep(vWave-.08,vWave+.02,uMirrorTime*.36);').replace('#include <output_fragment>','#include <output_fragment>\nfloat mirrorGlint=pow(max(0.0,dot(normalize(vMirrorNormal),normalize(vec3(sin(uMirrorTime*.7),.6,cos(uMirrorTime*.7))))),38.0);\nmirrorGlint*=.42+.58*sin(uMirrorTime*3.0-vWave*8.0);\noutgoingLight+=vec3(1.0,.78,.49)*mirrorGlint*1.65;'); mirrorMat.userData.shader=shader; };
    const mesh = new THREE.InstancedMesh(geo, mirrorMat, count);
    const wave=new Float32Array(count); for(let i=0;i<count;i++)wave[i]=i/count; geo.setAttribute('aWave',new THREE.InstancedBufferAttribute(wave,1));
    const obj = new THREE.Object3D(), color = new THREE.Color(), up = new THREE.Vector3(0,0,1), norm = new THREE.Vector3();
    const dummy = new THREE.Matrix4(); let n=0;
    const rings = Math.ceil(Math.sqrt(count));
    for(let i=0;i<count;i++) {
      const t=(i+.5)/count, y=0.08 + t*.91, r=Math.sqrt(Math.max(0,1-y*y))*3.1, phi=i*Math.PI*(3-Math.sqrt(5));
      const px=Math.cos(phi)*r, pz=Math.sin(phi)*r;
      obj.position.set(px,y*3.1,pz); norm.set(-px,-y*3.1,-pz).normalize(); obj.quaternion.setFromUnitVectors(up,norm);
      obj.rotateZ(rand(-.17,.17)); const visibleScale=.55+rand(.65,1.2); obj.scale.set(visibleScale,visibleScale,visibleScale); obj.updateMatrix(); mesh.setMatrixAt(i,obj.matrix);
      const star = (i%37===0), painted=(i%113===0);
      color.set(painted?'#3fb7b0':star?'#c29c67':(Math.random()>.42?'#d9dde3':'#ead9b8')).multiplyScalar(rand(.68,1.05)); mesh.setColorAt(i,color); n++;
    }
    mesh.instanceMatrix.needsUpdate=true; if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
    mesh.userData.count=n; tileMesh=mesh; return mesh;
  }
  function addFlames(THREE){const vertex='varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}';const fragment='uniform float uTime;varying vec2 vUv;float noise(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}void main(){vec2 p=vUv-vec2(.5,.46);p.x*=1.2;float n=noise(vec2(vUv.x*8.0,uTime*2.0));p.y+=(n-.5)*.08;float width=(.19*(1.0-vUv.y)+.035);float shape=1.0-smoothstep(width-.02,width+.02,abs(p.x));float base=1.0-smoothstep(.0,.5,vUv.y);float a=shape*base;if(a<.02)discard;vec3 c=mix(vec3(1.0,.32,.055),vec3(1.0,.83,.45),smoothstep(.0,.32,vUv.y));gl_FragColor=vec4(c,a*.92);}';for(let i=0;i<3;i++){const mat=new THREE.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:vertex,fragmentShader:fragment,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});const spr=new THREE.Mesh(new THREE.PlaneGeometry(.38,.72),mat);spr.position.set((i-1)*2.15,-2.48,2.9);scene.add(spr);flameMats.push(mat);}}
  function buildNameShards(THREE) {
    const count= Math.min(440, Math.max(220,targetPoints.length));
    const geo=new THREE.BufferGeometry(), verts=new Float32Array([-.6,-.35,0,.6,-.25,0,0,.55,0]); geo.setAttribute('position',new THREE.BufferAttribute(verts,3));
    geo.computeVertexNormals(); const mat=new THREE.MeshStandardMaterial({color:'#e8e8e8',metalness:1,roughness:.09,side:THREE.DoubleSide,emissive:'#24333b',emissiveIntensity:.25});
    const mesh=new THREE.InstancedMesh(geo,mat,count), ob=new THREE.Object3D(), col=new THREE.Color(); shardMesh=mesh; shardRot=[];
    for(let i=0;i<count;i++) {
      const p=targetPoints[i%targetPoints.length]; const dst=new THREE.Vector3(p[0],p[1]+1.9,p[2]); targetPoints[i]=[dst.x,dst.y,dst.z];
      const src=new THREE.Vector3(rand(-3.6,3.6),rand(.2,4.5),rand(-3.7,3.7)); sourcePoints.push(src);
      ob.position.copy(src); ob.rotation.set(rand(0,6),rand(0,6),rand(0,6)); const scale=rand(.035,.085); ob.scale.set(scale,scale,scale); ob.updateMatrix(); mesh.setMatrixAt(i,ob.matrix);
      col.set(i%12===0?'#3fb7b0':i%4===0?'#ead9b8':'#d9dde3'); mesh.setColorAt(i,col); shardRot.push([rand(-4,4),rand(-4,4),rand(-4,4)]);
    }
    mesh.instanceMatrix.needsUpdate=true; return mesh;
  }
  function initThree() {
    if(renderer || window.Marhamat?.tier !== 'full' || reduced() || !visible) return;
    const canvas=$('.scene--intro'); if(!canvas) return;
    try {
      const THREE=window.THREE; if(!THREE || !THREE.WebGLRenderer) return;
      targetPoints=translatedNames(); renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'low-power',stencil:false,depth:true});
      renderer.setPixelRatio(Math.min(1.5,devicePixelRatio||1)); renderer.setSize(innerWidth,innerHeight,false); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
      scene=new THREE.Scene(); scene.fog=new THREE.FogExp2('#111722',.038); camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,50); camera.position.set(0,0,8.6); camera.lookAt(0,1.5,0);
      addEnvironment(THREE,scene); scene.add(buildDome(THREE)); scene.add(buildNameShards(THREE)); webglScrubs();
      const amb=new THREE.HemisphereLight('#dce8ff','#24150f',1.4); scene.add(amb);
      const key=new THREE.PointLight('#ffb566',24,18,1.6); key.position.set(-2,2.6,3.3); scene.add(key); candleLight=key;
      const fill=new THREE.PointLight('#a9d9dd',7,15); fill.position.set(3,1,-2); scene.add(fill); addFlames(THREE);
      if(THREE.EffectComposer&&THREE.RenderPass&&THREE.UnrealBloomPass&&THREE.OutputPass){try{composer=new THREE.EffectComposer(renderer);composer.addPass(new THREE.RenderPass(scene,camera));composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(Math.ceil(innerWidth/2),Math.ceil(innerHeight/2)),.42,.45,.82));composer.addPass(new THREE.OutputPass());composer.setSize(innerWidth,innerHeight);}catch(_){composer=null;}}
      canvas.addEventListener('webglcontextlost',ev=>{ev.preventDefault();fallback();},{once:true});
      addEventListener('resize',resize,{passive:true}); document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)startLoop();else cancelAnimationFrame(raf)});
      const io=new IntersectionObserver(entries=>{visible=ioSeen&& !document.hidden;if(entries.some(e=>e.target===intro))introSeen=entries.some(e=>e.target===intro&&e.isIntersecting);if(entries.some(e=>e.target===hero))heroSeen=entries.some(e=>e.target===hero&&e.isIntersecting);ioSeen=introSeen||heroSeen;if(ioSeen&&!document.hidden)startLoop();else cancelAnimationFrame(raf);},{threshold:.01});let introSeen=true,heroSeen=false,ioSeen=true;io.observe(intro);io.observe(hero);
      document.documentElement.classList.add('has-webgl'); startLoop();
    } catch(e) { fallback(); }
  }
  function fallback() { if(renderer){cancelAnimationFrame(raf);try{composer?.dispose();renderer.dispose();}catch(_){}} composer=null;renderer=null; document.documentElement.classList.remove('has-webgl'); $$('.scene').forEach(c=>c.style.opacity='0'); }
  function resize(){ if(renderer&&camera){const host=$('.scene--intro')?.parentElement;const w=host?.clientWidth||innerWidth,h=host?.clientHeight||innerHeight;renderer.setSize(w,h,false);composer?.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();} }
  function startLoop(){ if(renderer&&!raf) raf=requestAnimationFrame(render); }
  function render(ts){ raf=0;if(!renderer||!visible)return; const t=ts*.001; const p=openedAt<0?0:Math.min(1,(t-openedAt)/3.4); const THREE=window.THREE;
    if(tileMesh){tileMesh.rotation.x=Math.sin(t*.15)*.012; const u=tileMesh.material.userData.shader?.uniforms?.uMirrorTime;if(u)u.value=t;}
    if(candleLight)candleLight.intensity=22+Math.sin(t*8.7)*2.4+Math.sin(t*15.1)*1.2;for(const m of flameMats)m.uniforms.uTime.value=t;
    camera.position.x+=(pointer.x*.35-camera.position.x)*.025;camera.position.y+=(pointer.y*.2-camera.position.y)*.025;
    if(shardMesh){const ob=new THREE.Object3D(); for(let i=0;i<shardMesh.count;i++){const delay=(i%31)/31*.2, q=Math.max(0,Math.min(1,(p-delay)*1.27));const a=sourcePoints[i],b=targetPoints[i%targetPoints.length];ob.position.set(a.x+(b[0]-a.x)*q,a.y+(b[1]-a.y)*q,a.z+(b[2]-a.z)*q);ob.rotation.set(shardRot[i][0]*(1-q)+t*.15,shardRot[i][1]*(1-q)+t*.12,shardRot[i][2]*(1-q));const s=.045*(.65+.35*Math.sin(q*Math.PI));ob.scale.set(s,s,s);ob.updateMatrix();shardMesh.setMatrixAt(i,ob.matrix);}shardMesh.instanceMatrix.needsUpdate=true;}
    if(composer)composer.render();else renderer.render(scene,camera);frameTimes.push(ts);if(frameTimes.length>60)frameTimes.shift();if(frameTimes.length===60&&frameTimes[59]-frameTimes[0]>1350){fallback();return;}raf=requestAnimationFrame(render);
  }
  const pointer={x:0,y:0};addEventListener('pointermove',e=>{pointer.x=(e.clientX/innerWidth-.5)*2;pointer.y=(.5-e.clientY/innerHeight)*2;},{passive:true});
  function loadThree(){if(window.Marhamat?.tier!=='full'||reduced())return;const s=document.createElement('script');s.src='../shared/nikoh/vendor/three/three.bundle.min.js';s.onload=()=>initThree();s.onerror=fallback;document.head.append(s);}
  function posterFirst(){if(reduced()||window.Marhamat?.tier==='lite')return;const run=()=>loadThree();if('requestIdleCallback'in window)requestIdleCallback(run,{timeout:1800});else setTimeout(run,700);}
  function introFilm(){if(!intro||!openBtn)return;const copy=$('.intro__copy'),button=$('.open-button');let opening=false,done=false,timer=0;
    const reveal=()=>{if(done)return;done=true;clearTimeout(timer);const live=$('.scene--intro');if(live&&$('.hero__art')){$('.hero__art').append(live);resize();}document.documentElement.classList.remove('is-locked');document.body.classList.add('is-open');intro.setAttribute('aria-hidden','true');intro.hidden=true;hero?.scrollIntoView({block:'start',behavior:'auto'});};
    const begin=()=>{if(opening){reveal();return;}opening=true;window.Marhamat?.open?.();document.body.classList.add('is-opening');openedAt=performance.now()*.001;if(window.gsap&&!reduced()){gsap.timeline().to('.intro__names span',{yPercent:-120,opacity:0,rotationX:90,stagger:.08,duration:.55,ease:'power3.in'},0).to('.intro__poster',{scale:1.22,opacity:.15,duration:1.1,ease:'power3.inOut'},0).to(copy,{opacity:0,y:-20,duration:.55,ease:'power2.in'},.15).to(button,{scale:1.2,opacity:0,duration:.3},0);}
      timer=setTimeout(reveal,reduced()?40:window.Marhamat?.tier==='lite'?1900:3200);};
    openBtn.addEventListener('click',e=>{e.stopPropagation();begin()});intro.addEventListener('click',()=>{if(opening)reveal()});
  }
  function installCanvasGlints(){const c=document.createElement('canvas'),ctx=c.getContext('2d');c.className='ambient-glints';c.setAttribute('aria-hidden','true');$('#page')?.prepend(c);let w,h,dpr,particles=[],raf2=0,on=true;
    const resize=()=>{dpr=Math.min(2,devicePixelRatio||1);w=innerWidth;h=innerHeight;c.width=w*dpr;c.height=h*dpr;c.style.width=w+'px';c.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const n=reduced()?0:window.Marhamat?.tier==='lite'?14:44;particles=Array.from({length:n},()=>({x:rand(0,w),y:rand(0,h),r:rand(.5,1.8),p:rand(0,7),v:rand(.1,.55)}));};
    const draw=()=>{raf2=0;if(!on||document.hidden)return;ctx.clearRect(0,0,w,h);for(const a of particles){a.p+=.02*a.v;const alpha=(.15+.6*(.5+.5*Math.sin(a.p)));ctx.beginPath();ctx.fillStyle=`rgba(234,217,184,${alpha})`;ctx.arc(a.x,a.y+Math.sin(a.p)*4,a.r,0,Math.PI*2);ctx.fill();}raf2=requestAnimationFrame(draw)};
    addEventListener('resize',resize,{passive:true});const io=new IntersectionObserver(es=>{on=es.some(e=>e.isIntersecting);if(on&&!raf2)raf2=requestAnimationFrame(draw);else cancelAnimationFrame(raf2)});io.observe($('#page'));document.addEventListener('visibilitychange',()=>{if(!document.hidden&&on&&!raf2)raf2=requestAnimationFrame(draw)});resize();draw();
  }

  function webglScrubs(){if(!window.gsap||!window.ScrollTrigger||!scene)return;const gsap=window.gsap,ST=window.ScrollTrigger;gsap.to(scene.rotation,{y:1.35,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});const beam={v:0};gsap.to(beam,{v:1,ease:'none',scrollTrigger:{trigger:'#date',start:'top bottom',end:'bottom top',scrub:true},onUpdate:()=>{if(candleLight)candleLight.intensity=18+beam.v*12;scene.rotation.x=beam.v*.16;}});gsap.to(camera.position,{z:6.5,ease:'none',scrollTrigger:{trigger:'#footer',start:'top bottom',end:'bottom bottom',scrub:true}});}
  function setupMotion(){if(!window.gsap||!window.ScrollTrigger||reduced())return;const gsap=window.gsap,ST=window.ScrollTrigger;gsap.registerPlugin(ST);if(window.DrawSVGPlugin)gsap.registerPlugin(window.DrawSVGPlugin);document.documentElement.classList.add('oy-motion');
    $$('.section').forEach((s,i)=>{const h=$('h2',s);if(h){let chars=[];if(window.SplitText){try{const split=new SplitText(h,{type:'chars,words',charsClass:'tile-char'});chars=split.chars;}catch(_){}}if(!chars.length){const text=h.textContent;h.textContent='';for(const letter of [...text]){const span=document.createElement('span');span.textContent=letter;span.className='tile-char';h.append(span);chars.push(span)}}gsap.fromTo(chars,{rotationY:90,y:12,opacity:0,transformPerspective:700},{rotationY:0,y:0,opacity:1,duration:.62,stagger:.025,ease:'power3.out',scrollTrigger:{trigger:s,start:'top 78%',once:true}});}
      const eyebrow=$('.eyebrow',s);if(eyebrow)gsap.fromTo(eyebrow,{letterSpacing:'.6em',opacity:0},{letterSpacing:'.3em',opacity:1,duration:.8,scrollTrigger:{trigger:s,start:'top 84%',once:true}});
      if(i===1){gsap.fromTo('.mirror-panel',{rotationX:-14,y:60,opacity:0,transformPerspective:900},{rotationX:0,y:0,opacity:1,duration:1,ease:'expo.out',scrollTrigger:{trigger:s,start:'top 74%',once:true}})}
    });
    const dividers=$$('.star-divider path');if(window.DrawSVGPlugin&&dividers.length)gsap.fromTo(dividers,{drawSVG:'0%'},{drawSVG:'100%',duration:.9,stagger:.08,scrollTrigger:{trigger:hero,start:'top 70%',once:true}});const heroNames=$('.hero__shard-names');gsap.to('.hero__art',{rotation:8,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});gsap.to('.hero__poster',{yPercent:18,scale:1.18,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});gsap.to(heroNames,{yPercent:-45,rotationY:12,opacity:.45,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});
    const cal=$('.calendar');if(cal){gsap.fromTo('.calendar-day:not(.is-empty)',{rotationY:90,opacity:0},{rotationY:0,opacity:1,stagger:.018,duration:.55,ease:'back.out(1.2)',scrollTrigger:{trigger:cal,start:'top 82%',once:true}});gsap.to(cal,{'--beam':1,ease:'none',scrollTrigger:{trigger:cal,start:'top 75%',end:'bottom 45%',scrub:true}});}
    gsap.fromTo('.program__item',{y:30,rotationX:-20,opacity:0},{y:0,rotationX:0,opacity:1,stagger:.13,duration:.7,ease:'expo.out',scrollTrigger:{trigger:'.program',start:'top 78%',once:true}});
    gsap.fromTo('.venue__frame',{rotationY:-5,scale:.94},{rotationY:0,scale:1,ease:'none',scrollTrigger:{trigger:'.venue__frame',start:'top 88%',end:'top 40%',scrub:true}});gsap.to('.frame-corner',{rotation:90,opacity:.45,ease:'none',stagger:.08,scrollTrigger:{trigger:'.venue__frame',start:'top 75%',end:'bottom 40%',scrub:true}});
    gsap.fromTo('.dresscode__palette li',{rotationY:90,y:20,opacity:0},{rotationY:0,y:0,opacity:1,stagger:.12,duration:.72,ease:'back.out(1.5)',scrollTrigger:{trigger:'.dresscode',start:'top 80%',once:true}});
    const gallery=$('.gallery');if(gallery){gallery.addEventListener('click',e=>{const item=e.target.closest('.gallery__item');if(item){item.classList.add('is-kaleidoscope');setTimeout(()=>item.classList.remove('is-kaleidoscope'),650);}});gallery.addEventListener('scroll',()=>{const item=$('.gallery__item',gallery);if(item){item.classList.add('is-kaleidoscope');setTimeout(()=>item.classList.remove('is-kaleidoscope'),450);}},{passive:true});}if(gallery)gsap.fromTo('.gallery__item',{rotationY:-20,x:75,opacity:0},{rotationY:0,x:0,opacity:1,stagger:.08,duration:.8,ease:'expo.out',scrollTrigger:{trigger:gallery,start:'top 82%',once:true}});
    gsap.to('.ambient-glints',{opacity:.22,ease:'none',scrollTrigger:{trigger:'#date',start:'top bottom',end:'bottom top',scrub:true}});gsap.to('.ambient-glints',{opacity:.9,ease:'none',scrollTrigger:{trigger:'#footer',start:'top bottom',end:'bottom bottom',scrub:true}});
    const rsvp=$('#rsvp');rsvp?.addEventListener('click',e=>{const b=e.target.closest('[data-rsvp-choice="yes"]');if(!b)return;const burst=document.createElement('span');burst.className='rsvp-burst';b.append(burst);setTimeout(()=>burst.remove(),850)});
    const casket=$('.gift');if(casket){const art=document.createElement('img');art.src='art/casket.webp';art.loading='lazy';art.alt='';art.width=100;art.height=100;art.className='gift__casket';art.setAttribute('aria-hidden','true');$('.gift summary',casket)?.after(art);casket.addEventListener('toggle',()=>casket.classList.toggle('is-open',casket.open));}
    window.Marhamat?.on?.('rsvp',a=>{if(a?.status==='yes')document.body.classList.add('rsvp-celebrate')});window.addEventListener('load',()=>ST.refresh(),{once:true});
  }
  function init(){introFilm();installCanvasGlints();setupMotion();if(window.Marhamat?.tier==='full')posterFirst();window.Marhamat?.on?.('tier',v=>{if(v==='lite'||window.Marhamat?.tier==='lite')fallback();});}
  if(window.Marhamat?.on)window.Marhamat.on('ready',()=>setTimeout(init,0));else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
