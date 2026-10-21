(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = () => window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intro = $('#intro'), openButton = $('#open-invitation');
  let opening = false, finished = false, openingTl = null, renderer = null, composer = null, scene = null, camera = null, group = null, rings = [], raf = 0, active = false, canvasVisible = false, ctxLost = false, fpsStart = 0, fpsFrames = 0;
  const canvas = $('.scene-canvas');
  const scenePose = {x:0,y:.15,z:0,rx:.12,ry:-.08,rz:-.12,cx:0,cy:0,cz:0,sep:0};
  let ringRest=[-.48,.4], ceremonyGroup=null, ceremonyRing=null, ceremonyStartedAt=0, ceremonyPlaying=false, ringMaterials=[];

  function cameraBaseDistance(width){const inIntro=canvas?.parentElement===intro;return inIntro?(width<700?5.4:6.8):(width<500?5.4:5.1);}
  function setGroupOpacity(root,opacity){root?.traverse(o=>{if(!o.isMesh||!o.material)return;const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{m.transparent=true;m.opacity=opacity;});});}
  function placeCanvasInHero(){const stage=$('.hero__stage');if(!stage||!canvas)return;if(renderer&&canvas.classList.contains('is-ready'))stage.classList.add('has-3d');else stage.classList.remove('has-3d');if(canvas.parentElement!==stage)stage.append(canvas);onResize();}
  function showHeroScene(immediate=false){window.__heroScene=true;if(ceremonyGroup)ceremonyGroup.visible=false;if(group){group.visible=true;if(immediate)setGroupOpacity(group,1);}placeCanvasInHero();}
  function transitionHeroScene(){if(!group)return;window.__heroScene=true;if(ceremonyGroup)ceremonyGroup.visible=false;group.visible=true;setGroupOpacity(group,0);if(window.gsap&&ringMaterials.length)gsap.to(ringMaterials,{opacity:1,duration:.58,stagger:.025,ease:'power2.out'});else setGroupOpacity(group,1);}
  function playCeremony(){if(!ceremonyRing)return;ceremonyRing.position.y=1.18;ceremonyRing.rotation.z=-.08;ceremonyStartedAt=performance.now();ceremonyPlaying=true;}

  function finishOpen() {
    if (finished) return; finished = true;
    if(rings.length)ringRest=rings.map(r=>r.position.x);window.__sceneUnion=false;
    if(!window.__heroScene)showHeroScene(true);else placeCanvasInHero();
    openingTl?.progress(1); document.documentElement.classList.remove('is-locked'); document.body.classList.add('is-open'); intro.setAttribute('aria-hidden','true'); intro.hidden = true;
    $('#hero')?.scrollIntoView({block:'start',behavior:'auto'}); window.Marhamat?.open?.();
    if(window.gsap&&!reduced())gsap.timeline({delay:.12}).fromTo('.hero__stage',{scale:.78,opacity:.45},{scale:1,opacity:1,duration:1.1,ease:'expo.out'}).fromTo('.hero__content > *',{y:24,opacity:0},{y:0,opacity:1,duration:.8,stagger:.12,ease:'expo.out'},.32);
  }
  function beginOpen() {
    if (finished) return;
    if (opening) { finishOpen(); return; }
    opening = true; window.Marhamat?.open?.(); document.body.classList.add('is-opening');
    if (reduced() || !window.gsap) { showHeroScene(true); finishOpen(); return; }
    const lite=window.Marhamat?.tier==='lite', act2=lite?1.45:2.65;
    window.__sceneUnion=true;window.__heroScene=false;playCeremony();
    openingTl = gsap.timeline({defaults:{ease:'power3.inOut'},onComplete:finishOpen});
    openingTl.to('.intro__backdrop',{scale:1.08,opacity:.72,duration:act2*.66},0)
      .to('.intro__veil',{opacity:.2,duration:act2*.58},0)
      .to('.intro__line',{opacity:1,scaleX:1,duration:.42},0)
    if(ceremonyGroup)openingTl.to(ceremonyGroup.position,{y:.7,duration:act2*.62,ease:'power3.inOut'},.06)
      .to(ceremonyGroup.rotation,{y:-.18,duration:act2*.62,ease:'power3.inOut'},.06);
    openingTl.add(transitionHeroScene,act2-.62);
    if(ceremonyGroup)openingTl.to(ceremonyGroup.scale,{x:.04,y:.04,z:.04,duration:.58,ease:'power3.in'},act2-.62);
    openingTl
      .to('.intro__copy',{yPercent:18,opacity:0,duration:.62,ease:'power2.in'},.22)
      .to('.scene-canvas',{opacity:1,duration:.75},.4)
      .to(scenePose,{x:0,y:.03,z:.18,rz:0,cx:0,cy:0,cz:-.72,duration:act2*.7,ease:'power3.inOut'},.18)
      .to('.ring-fallback__a',{x:12,rotation:34,duration:act2*.35,ease:'power2.in'},.08)
      .to('.ring-fallback__b',{x:-11,rotation:-39,duration:act2*.35,ease:'power2.in'},.08)
      .to('.ring-fallback__a',{x:0,rotation:-8,duration:act2*.42,ease:'back.out(1.35)'},act2*.36)
      .to('.ring-fallback__b',{x:0,rotation:12,duration:act2*.42,ease:'back.out(1.35)'},act2*.36)
      .to(scenePose,{cx:.12,duration:.08,yoyo:true,repeat:3,ease:'none'},act2*.55)
      .to(intro,{opacity:0,duration:.48},act2-.48);
    if(rings[0])openingTl.to(rings[0].position,{x:-.24,duration:act2*.55,ease:'power3.inOut'},.1);
    if(rings[1])openingTl.to(rings[1].position,{x:.22,y:.02,duration:act2*.55,ease:'power3.inOut'},.1);
  }
  openButton?.addEventListener('click', e => { e.stopPropagation(); beginOpen(); });
  intro?.addEventListener('click', () => { if(opening) finishOpen(); });

  function drawDust() {
    const c=$('.dust-canvas'), g=c?.getContext('2d'); if(!g) return;
    const reducedMotion=reduced(), max=window.Marhamat?.tier==='lite'?12:36, dots=[]; let w=0,h=0,rafId=0,visible=true;
    function resize(){const d=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;c.width=w*d;c.height=h*d;c.style.width=w+'px';c.style.height=h+'px';g.setTransform(d,0,0,d,0,0);dots.length=0;for(let i=0;i<(reducedMotion?0:max);i++)dots.push({x:Math.random()*w,y:Math.random()*h,r:.4+Math.random()*1.8,a:.12+Math.random()*.45,s:.06+Math.random()*.22,p:Math.random()*6});}
    function frame(){if(!visible||document.hidden)return;g.clearRect(0,0,w,h);for(const d of dots){d.p+=.025;d.y-=d.s;d.x+=Math.sin(d.p)*.12;if(d.y<-8)d.y=h+8;g.beginPath();g.fillStyle=`rgba(237,207,145,${d.a*(.72+.28*Math.sin(d.p*1.6))})`;g.arc(d.x,d.y,d.r,0,Math.PI*2);g.fill();}rafId=requestAnimationFrame(frame);}
    addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible&&!reducedMotion)frame();else cancelAnimationFrame(rafId);});resize();if(!reducedMotion)frame();return()=>{cancelAnimationFrame(rafId);};
  }

  function makeRing(THREE, diamond=false) {
    const root=new THREE.Group();
    const shape=[[-.1,-.13],[.1,-.13],[.145,-.09],[.15,.08],[.11,.13],[-.11,.13],[-.15,.08],[-.15,-.08],[-.1,-.13]].map(p=>new THREE.Vector2(1+p[0],p[1]));
    const geo=new THREE.LatheGeometry(shape,96);geo.computeVertexNormals();
    const gold=new THREE.MeshPhysicalMaterial({color:0xd5ac59,metalness:1,roughness:.16,clearcoat:.8,clearcoatRoughness:.12,envMapIntensity:1.65});
    const band=new THREE.Mesh(geo,gold);band.castShadow=true;band.receiveShadow=true;root.add(band);
    if(diamond){
      const points=[], indices=[];const n=8;const topY=.235, girdleY=.22, lowerY=.17, bottomY=.105, rad=.105;
      points.push(0,topY,0);for(let i=0;i<n;i++){let a=(i/n)*Math.PI*2;points.push(Math.cos(a)*rad,girdleY,Math.sin(a)*rad);}for(let i=0;i<n;i++){let a=(i/n)*Math.PI*2;points.push(Math.cos(a)*rad*.68,lowerY,Math.sin(a)*rad*.68);}points.push(0,bottomY,0);
      const crown=0,pav=n*2+1;
      for(let i=0;i<n;i++){const next=(i+1)%n;indices.push(crown,1+i,1+next);indices.push(1+i,1+n+i,1+n+next,1+i,1+n+next,1+next);indices.push(1+n+i,pav,1+n+next);}
      const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.Float32BufferAttribute(points,3));dg.setIndex(indices);dg.computeVertexNormals();
      const dm=new THREE.MeshPhysicalMaterial({color:0xf4fbff,metalness:0,roughness:.025,transmission:1,ior:2.42,thickness:.7,dispersion:.08,transparent:true,opacity:.96,side:THREE.DoubleSide,envMapIntensity:2.2});const stone=new THREE.Mesh(dg,dm);stone.position.set(.1,.16,1.0);root.add(stone);
      const prongMat=new THREE.MeshStandardMaterial({color:0xe4bd68,metalness:1,roughness:.17});
      for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2, p=new THREE.Mesh(new THREE.SphereGeometry(.025,10,8),prongMat);p.position.set(.1+Math.cos(a)*.125,.16+Math.sin(a)*.085,1+Math.sin(a)*.125);root.add(p);}
      const sparkGeo=new THREE.BufferGeometry();sparkGeo.setAttribute('position',new THREE.Float32BufferAttribute([.1,.3,1,.1,.16,1.2,.1,.02,1],3));const spark=new THREE.Points(sparkGeo,new THREE.PointsMaterial({color:0xfff0c7,size:.09,transparent:true,opacity:.0,blending:THREE.AdditiveBlending,depthWrite:false}));spark.name='diamond-spark';root.add(spark);
    }
    return root;
  }
  function studioTexture(THREE){const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');const grad=x.createLinearGradient(0,0,0,256);grad.addColorStop(0,'#18120c');grad.addColorStop(.47,'#55412b');grad.addColorStop(.5,'#21170e');grad.addColorStop(1,'#080706');x.fillStyle=grad;x.fillRect(0,0,512,256);[[55,35,13,100],[150,45,8,75],[278,26,18,130],[390,52,9,82],[475,26,7,80]].forEach(([a,b,w,h])=>{let q=x.createRadialGradient(a,b,0,a,b,w*2);q.addColorStop(0,'rgba(255,234,186,.95)');q.addColorStop(.16,'rgba(250,210,138,.55)');q.addColorStop(1,'rgba(255,210,120,0)');x.fillStyle=q;x.fillRect(a-w*2,b-h/2,w*4,h);});const t=new THREE.CanvasTexture(c);t.mapping=THREE.EquirectangularReflectionMapping;t.colorSpace=THREE.SRGBColorSpace;return t;}
  function makeBokeh(THREE){const n=95,pos=[],size=[],col=[];for(let i=0;i<n;i++){pos.push((Math.random()-.5)*7,(Math.random()-.5)*4,-1.5-Math.random()*3);size.push(1+Math.random()*4);const warm=.65+Math.random()*.3;col.push(1,warm*.88,warm*.65);}const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geom.setAttribute('color',new THREE.Float32BufferAttribute(col,3));geom.setAttribute('aSize',new THREE.Float32BufferAttribute(size,1));const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,vertexColors:true,uniforms:{uPixelRatio:{value:1}},vertexShader:'attribute vec3 color; attribute float aSize; varying vec3 vColor; uniform float uPixelRatio; void main(){vColor=color; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_Position=projectionMatrix*mv; gl_PointSize=aSize*uPixelRatio*(130.0/-mv.z);}',fragmentShader:'varying vec3 vColor; void main(){float r=length(gl_PointCoord-vec2(.5));float a=smoothstep(.5,.05,r);gl_FragColor=vec4(vColor,a*.27);}',blending:THREE.AdditiveBlending});return new THREE.Points(geom,mat);}
  function makeEngraving(THREE, ring){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.fillStyle='#aaa';x.font='italic 24px serif';x.textAlign='center';let a=$('[data-slot="groom"]')?.textContent.trim()||'',b=$('[data-slot="bride"]')?.textContent.trim()||'';const rawDate=window.Marhamat?.data?.dateTime||'';const dt=new Date(rawDate);const parts=rawDate&&!Number.isNaN(dt.getTime())?new Intl.DateTimeFormat('en-GB',{timeZone:window.Marhamat?.data?.timezone||'Asia/Tashkent',day:'2-digit',month:'2-digit',year:'numeric'}).formatToParts(dt):[];const date=parts.filter(part=>['day','month','year'].includes(part.type)).map(part=>part.value).join('.');x.fillText(`${a} & ${b} · ${date}`,256,70);const tex=new THREE.CanvasTexture(c);tex.wrapS=THREE.RepeatWrapping;tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(1,1);tex.colorSpace=THREE.SRGBColorSpace;const interior=new THREE.Mesh(new THREE.TorusGeometry(.865,.018,8,96),new THREE.MeshStandardMaterial({color:0x6d512c,metalness:.65,roughness:.48,bumpMap:tex,bumpScale:.018}));interior.rotation.x=Math.PI/2;ring.add(interior);}

  function makeCeremonyHands(THREE){
    const root=new THREE.Group(),bride=new THREE.Group(),groom=new THREE.Group();root.add(bride,groom);
    const skin=new THREE.MeshPhysicalMaterial({color:0xd19a74,roughness:.56,clearcoat:.12,clearcoatRoughness:.35});
    const groomSkin=new THREE.MeshPhysicalMaterial({color:0xa96f50,roughness:.58,clearcoat:.1});
    const nails=new THREE.MeshPhysicalMaterial({color:0xf1d5c4,roughness:.32,clearcoat:.32});
    const ivory=new THREE.MeshStandardMaterial({color:0xe8e0d1,roughness:.72});
    const suit=new THREE.MeshStandardMaterial({color:0x191716,roughness:.82});
    const goldTrim=new THREE.MeshStandardMaterial({color:0xc49a53,metalness:.82,roughness:.24});
    const addEllipsoid=(parent,pos,scale,mat)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(1,24,18),mat);m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
    const addLimb=(parent,from,to,radius,mat)=>{const a=new THREE.Vector3(...from),b=new THREE.Vector3(...to),dir=b.clone().sub(a),length=dir.length();const m=new THREE.Mesh(new THREE.CapsuleGeometry(radius,Math.max(.015,length-radius*2),5,12),mat);m.position.copy(a.add(b).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
    // A softly modeled hand, palm down, with the ring finger presented to camera.
    addLimb(bride,[0,-1.45,-.09],[0,-.55,-.04],.2,ivory);
    const cuff=new THREE.Mesh(new THREE.CylinderGeometry(.205,.19,.25,28),ivory);cuff.position.set(0,-.73,-.04);cuff.castShadow=true;bride.add(cuff);
    addEllipsoid(bride,[0,-.19,0],[.44,.39,.16],skin);
    const fingerXs=[-.29,-.1,.095,.285],fingerLengths=[.62,.78,.85,.7];
    fingerXs.forEach((x,i)=>{const end=.08+fingerLengths[i];addLimb(bride,[x,-.02,.01],[x*.94,end,.035],.067,skin);addEllipsoid(bride,[x*.94,end-.07,.112],[.043,.076,.018],nails);addEllipsoid(bride,[x,-.005,.01],[.074,.092,.068],skin);});
    addLimb(bride,[-.3,-.35,.02],[-.56,.04,.075],.081,skin);addEllipsoid(bride,[-.545,.035,.14],[.045,.068,.014],nails);
    // A dark suit sleeve and two gentle fingertips frame the ring placement.
    addLimb(groom,[1.45,1.12,-.14],[.65,.52,-.12],.2,suit);
    const groomCuff=new THREE.Mesh(new THREE.CylinderGeometry(.205,.18,.24,26),ivory);groomCuff.position.set(.7,.55,-.11);groomCuff.rotation.z=-.74;groom.add(groomCuff);addEllipsoid(groom,[.71,.55,.09],[.035,.035,.018],goldTrim);
    addEllipsoid(groom,[.42,.47,.09],[.27,.17,.14],groomSkin);
    addLimb(groom,[.34,.53,.17],[-.035,.42,.26],.058,groomSkin);
    addLimb(groom,[.43,.35,.18],[.015,.28,.27],.067,groomSkin);
    addEllipsoid(groom,[-.03,.415,.27],[.06,.055,.035],groomSkin);addEllipsoid(groom,[.012,.285,.27],[.064,.056,.035],groomSkin);
    const band=makeRing(THREE,true);band.scale.setScalar(.092);band.position.set(-.1,1.18,.19);band.rotation.z=-.08;root.add(band);
    root.userData.ring=band;root.userData.bride=bride;root.userData.groom=groom;
    return root;
  }

  function onResize(){if(!renderer||!camera)return;const bounds=canvas.parentElement?.getBoundingClientRect(),w=Math.max(1,bounds?.width||innerWidth),h=Math.max(1,bounds?.height||innerHeight);renderer.setSize(w,h,false);composer?.setSize(w,h);camera.aspect=w/h;camera.fov=canvas.parentElement===intro?34:(w<500?34:29);camera.position.z=cameraBaseDistance(w);camera.updateProjectionMatrix();}
  function fallback(){canvas?.classList.remove('is-ready');intro?.classList.remove('has-webgl');$('.hero__stage')?.classList.remove('has-3d');if(renderer){cancelAnimationFrame(raf);composer?.dispose?.();composer=null;renderer.dispose();renderer=null;}document.documentElement.classList.add('is-fallback');}
  function renderFrame(t=0){
    raf=0;if(!renderer||!active||ctxLost||document.hidden)return;
    const now=performance.now();if(!fpsStart)fpsStart=now;fpsFrames++;if(now-fpsStart>2400){if(fpsFrames*1000/(now-fpsStart)<45){fallback();return;}fpsStart=now;fpsFrames=0;}
    const time=t*.001;
    if(group){group.position.x+=(scenePose.x-group.position.x)*.035;group.position.y+=(scenePose.y-group.position.y)*.035;group.position.z+=(scenePose.z-group.position.z)*.035;group.rotation.z+=(scenePose.rz-group.rotation.z)*.035;group.rotation.y+=(scenePose.ry+(window.__sceneYaw||0)-group.rotation.y)*.03;group.rotation.x+=(scenePose.rx+(window.__scenePitch||0)-group.rotation.x)*.03;camera.position.x+=(scenePose.cx-camera.position.x)*.025;camera.position.y+=(scenePose.cy-camera.position.y)*.025;camera.position.z+=(Math.max(3.9,cameraBaseDistance(canvas.parentElement===intro?innerWidth:canvas.parentElement?.getBoundingClientRect().width||innerWidth)+scenePose.cz)-camera.position.z)*.025;}
    if(ceremonyGroup&&!window.__heroScene){ceremonyGroup.rotation.y+=((window.__sceneYaw||0)*.45-ceremonyGroup.rotation.y)*.025;ceremonyGroup.rotation.z+=(Math.sin(time*.55)*.018-ceremonyGroup.rotation.z)*.025;if(ceremonyRing){if(ceremonyPlaying){const p=Math.min(1,(now-ceremonyStartedAt)/1900),ease=p*p*(3-2*p);ceremonyRing.position.y=1.18+(.31-1.18)*ease;ceremonyRing.position.z=.19+Math.sin(p*Math.PI)*.055;ceremonyRing.rotation.z=-.08+Math.sin(p*Math.PI)*.16;if(p>=1)ceremonyPlaying=false;}else ceremonyRing.position.y=.31+Math.sin(time*1.4)*.012;}}
    rings.forEach((r,i)=>{if(!window.__sceneUnion){const side=i===0?-1:1,target=ringRest[i]+side*scenePose.sep*.5;r.position.x+=(target-r.position.x)*.035;r.rotation.y+=.0012+(i*.0003);r.rotation.z+=.00055;}const sp=r.getObjectByName('diamond-spark');if(sp){const flash=Math.pow(Math.max(0,Math.sin(time*2.3+i*1.8)),24);sp.material.opacity=flash*.9;}});
    if(window.__rim){window.__rim.position.x=Math.sin(time*.45)*3.2;window.__rim.position.z=2+Math.cos(time*.45)*.6;}
    composer?composer.render():renderer.render(scene,camera);raf=requestAnimationFrame(renderFrame);
  }

  async function buildScene(){
    if(window.__ringsPhoto)return; // photoreal ring film in rings.js replaces the procedural scene
    if(window.Marhamat?.tier!=='full'||reduced()||ctxLost||!canvas){fallback();return;}
    try{
      const script=document.createElement('script');script.src='../../shared/vendor/three/three.bundle.min.js';script.async=true;await new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=reject;document.head.append(script);});
      const THREE=window.THREE;if(!THREE)throw new Error('Three.js unavailable');
      const gl=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'})||canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl)throw new Error('WebGL unavailable');
      renderer=new THREE.WebGLRenderer({canvas,context:gl,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.outputColorSpace=THREE.SRGBColorSpace;
      scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(39,1,.1,100);camera.position.set(0,0,5.4);onResize();group=new THREE.Group();group.visible=false;scene.add(group);
      const pmrem=new THREE.PMREMGenerator(renderer);const room=new THREE.RoomEnvironment();const roomEnv=pmrem.fromScene(room,.04);scene.environment=roomEnv.texture;const studio=studioTexture(THREE);const studioEnv=pmrem.fromEquirectangular(studio);const goldEnv=studioEnv.texture;
      scene.add(new THREE.AmbientLight(0xffdca0,.42));const key=new THREE.DirectionalLight(0xffedc2,3.1);key.position.set(-3,4,5);scene.add(key);const fill=new THREE.PointLight(0xffbf62,28,9);fill.position.set(3,0,2);scene.add(fill);const rim=new THREE.PointLight(0xffdc96,38,12);rim.position.set(-3,1,2);scene.add(rim);window.__rim=rim;
      const a=makeRing(THREE,false),b=makeRing(THREE,true);a.position.set(window.__sceneUnion?-.24:-.48,0,0);a.scale.setScalar(.92);b.position.set(window.__sceneUnion ? .22 : .4,window.__sceneUnion ? .02 : .04,-.08);b.scale.setScalar(.83);b.rotation.x=.32;b.rotation.z=-.2;ringRest=[a.position.x,b.position.x];
      a.traverse(o=>{if(o.isMesh&&o.material?.metalness)o.material.envMap=goldEnv;});b.traverse(o=>{if(o.isMesh&&o.material?.metalness)o.material.envMap=goldEnv;});makeEngraving(THREE,a);group.add(a,b);rings=[a,b];group.position.y=.15;group.rotation.set(.12,-.08,-.12);setGroupOpacity(group,0);const materials=new Set();group.traverse(o=>{if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));});ringMaterials=[...materials];
      ceremonyGroup=makeCeremonyHands(THREE);ceremonyRing=ceremonyGroup.userData.ring;ceremonyGroup.position.set(0,.6,-.02);ceremonyGroup.scale.setScalar(.78);scene.add(ceremonyGroup);
      const reflection=new THREE.Mesh(new THREE.CircleGeometry(1.4,48),new THREE.MeshBasicMaterial({color:0x8e642d,transparent:true,opacity:.11,depthWrite:false}));reflection.rotation.x=-Math.PI/2;reflection.position.y=-1.15;reflection.scale.set(1.8,.45,1);scene.add(reflection);
      if(THREE.EffectComposer&&THREE.RenderPass&&THREE.UnrealBloomPass&&THREE.OutputPass){const bounds=canvas.parentElement.getBoundingClientRect();composer=new THREE.EffectComposer(renderer);composer.addPass(new THREE.RenderPass(scene,camera));composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(Math.max(1,Math.floor(bounds.width/2)),Math.max(1,Math.floor(bounds.height/2))),.34,.6,.82));composer.addPass(new THREE.OutputPass());}
      pmrem.dispose();room.dispose?.();studio.dispose();onResize();window.addEventListener('resize',onResize,{passive:true});canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();ctxLost=true;active=false;fallback();},{once:true});
      const observer=new IntersectionObserver(entries=>{canvasVisible=entries[0].isIntersecting;active=canvasVisible&&!document.hidden;if(active&&!raf)raf=requestAnimationFrame(renderFrame);},{threshold:0});observer.observe(canvas);document.addEventListener('visibilitychange',()=>{active=canvasVisible&&!document.hidden;if(active&&!raf)raf=requestAnimationFrame(renderFrame);});
      canvas.classList.add('is-ready');intro?.classList.add('has-webgl');document.documentElement.classList.remove('is-fallback');active=true;playCeremony();renderFrame();
    }catch(err){console.info('Oltin Uzuk: using CSS 3D fallback',err.message);fallback();}
  }
  window.addEventListener('resize',onResize,{passive:true});
  document.addEventListener('pointermove',e=>{window.__sceneYaw=((e.clientX/innerWidth)-.5)*.2;window.__scenePitch=((e.clientY/innerHeight)-.5)*-.14;const venue=$('.venue__frame');if(venue)venue.style.setProperty('--venue-tilt',`${((e.clientX/innerWidth)-.5)*7}deg`);},{passive:true});
  document.addEventListener('touchmove',e=>{const t=e.touches[0];if(t){window.__sceneYaw=((t.clientX/innerWidth)-.5)*.16;window.__scenePitch=((t.clientY/innerHeight)-.5)*-.12;}},{passive:true});

  function interlock(){if(!window.gsap||reduced())return;window.__sceneUnion=true;const timeline=gsap.timeline({onComplete:()=>{if(rings.length)ringRest=rings.map(r=>r.position.x);window.__sceneUnion=false;}});timeline.to('.ring-fallback__a',{x:10,rotation:15,duration:.32,ease:'power2.in'}).to('.ring-fallback__b',{x:-11,rotation:-11,duration:.32},'<').to('.ring-fallback__a',{x:0,rotation:-8,duration:.55,ease:'elastic.out(1,.5)'}).to('.ring-fallback__b',{x:0,rotation:12,duration:.55,ease:'elastic.out(1,.5)'},'<').fromTo('.done__spark',{scale:.4,rotation:-30,opacity:.4},{scale:1.2,rotation:12,opacity:1,duration:.55,ease:'back.out(2)'},'<');if(group&&rings.length){timeline.to(rings[0].position,{x:-.24,duration:.32,ease:'power2.in'},0).to(rings[1].position,{x:.22,duration:.32,ease:'power2.in'},0).to(group.rotation,{z:group.rotation.z+.4,duration:.4,ease:'power2.out'},0).to(group.position,{z:.25,duration:.35,yoyo:true,repeat:1},0);}}
  window.Marhamat?.on?.('rsvp',answer=>{if(answer?.status==='yes')interlock();});

  function motion(){if(!window.gsap||!window.ScrollTrigger||reduced())return;gsap.registerPlugin(ScrollTrigger);const introGreeting=$('.intro__greeting');gsap.fromTo('.intro__line',{scaleX:0,transformOrigin:'left'},{scaleX:1,opacity:.85,duration:1.2,ease:'power3.inOut',delay:.25});gsap.fromTo(introGreeting,{opacity:0,y:12},{opacity:1,y:0,duration:.8,ease:'expo.out',delay:.45});gsap.fromTo(['.intro__eyebrow','.intro__names','.intro__date','.open-button'],{opacity:0,y:20},{opacity:1,y:0,duration:.9,stagger:.18,ease:'expo.out',delay:.65});
    gsap.fromTo('.hero__names span',{yPercent:70,opacity:0},{yPercent:0,opacity:1,duration:1.1,stagger:.14,ease:'expo.out',scrollTrigger:{trigger:'#hero',start:'top 70%',once:true}});gsap.fromTo('.hero__rule',{scaleX:0},{scaleX:1,duration:1,scrollTrigger:{trigger:'#hero',start:'top 70%',once:true}});
    $$('.section:not(.hero),.footer').forEach((sec,i)=>{const head=$('.section__title',sec),ey=$('.eyebrow',sec);if(ey)gsap.fromTo(ey,{opacity:0,letterSpacing:'.7em'},{opacity:1,letterSpacing:'.34em',duration:.8,ease:'power3.out',scrollTrigger:{trigger:sec,start:'top 83%',once:true}});if(head){const text=head.textContent.trim(), chars=Array.from(text);head.textContent='';const mask=document.createElement('span');mask.className='title-mask';chars.forEach(ch=>{const s=document.createElement('span');s.className='title-char';s.textContent=ch===' '?'\u00a0':ch;mask.append(s);});head.append(mask);const titleChars=$$('.title-char',head);if(titleChars.length)gsap.fromTo(titleChars,{yPercent:105,rotation:4,opacity:0},{yPercent:0,rotation:0,opacity:1,duration:.75,stagger:.025,ease:'expo.out',scrollTrigger:{trigger:sec,start:'top 78%',once:true}});}const items=$$('p:not(.eyebrow),li,.venue__frame,.dresscode__icon,form,summary',sec);if(items.length)gsap.fromTo(items,{opacity:0,y:22},{opacity:1,y:0,duration:.7,stagger:.055,ease:'power3.out',scrollTrigger:{trigger:sec,start:'top 68%',once:true}});});
    const sections=['#invitation-text','#date','#program','#venue','#dresscode','#gallery','#rsvp','#wishes','#toyona','#contacts','#footer'];
    sections.forEach((selector,i)=>{const el=$(selector);if(!el)return;const p=[{x:.45,y:.1,z:-.3,rz:.28,cx:.12,cy:0,cz:.1,sep:.32},{x:0,y:.55,z:-.6,rz:-.8,cx:-.15,cy:.12,cz:.3,sep:.7},{x:-.45,y:.25,z:.1,rz:-1.4,cx:0,cy:-.18,cz:-.25,sep:.18},{x:.38,y:-.1,z:-.45,rz:-2.2,cx:.18,cy:.08,cz:.2,sep:.3},{x:.1,y:.48,z:-.2,rz:-2.8,cx:-.12,cy:.16,cz:-.15,sep:.42},{x:-.35,y:.1,z:.2,rz:-3.4,cx:.12,cy:-.1,cz:.15,sep:.12},{x:.4,y:-.3,z:.3,rz:-4,cx:-.12,cy:.06,cz:-.3,sep:.18},{x:-.2,y:.25,z:-.2,rz:-4.7,cx:.1,cy:.12,cz:.12,sep:.1},{x:.25,y:-.2,z:-.5,rz:-5.5,cx:-.1,cy:-.12,cz:.28,sep:.05},{x:0,y:0,z:-.3,rz:-6,cx:0,cy:0,cz:-.2,sep:0},{x:0,y:-.2,z:-.5,rz:-6.28,cx:0,cy:-.1,cz:.2,sep:0}][i];gsap.to(scenePose,{...p,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}});if(i===2){const chain=$('.program__chain path');if(chain){const len=chain.getTotalLength();gsap.set(chain,{strokeDasharray:len,strokeDashoffset:len});gsap.to(chain,{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:el,start:'top 85%',end:'bottom 40%',scrub:true}});}}if(i===4&&$('.dresscode__palette li'))gsap.fromTo('.dresscode__palette li',{rotationX:-90,opacity:0},{rotationX:0,opacity:1,stagger:.12,duration:.6,scrollTrigger:{trigger:el,start:'top 75%',once:true}});});
    const date=$('#date');if(date){const cells=$$('.calendar-day:not(.is-empty)');if(cells.length)gsap.fromTo(cells,{rotationX:-90,opacity:0,transformPerspective:500},{rotationX:0,opacity:1,stagger:.025,duration:.55,ease:'power3.out',scrollTrigger:{trigger:'.calendar',start:'top 84%',once:true}});}
    const venue=$('.venue__photo img');if(venue)gsap.fromTo(venue,{scale:1.22},{scale:1,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:venue,start:'top 90%',once:true}});
    const wishes=$$('.wish-tag');wishes.forEach((el,i)=>gsap.fromTo(el,{rotation:i%2?5:-5,transformOrigin:'50% 0%',opacity:0},{rotation:0,opacity:1,duration:.9,ease:'elastic.out(1,.65)',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
    const box=$('.gift');box?.addEventListener('toggle',()=>{if(box.open)gsap.fromTo('.gift__details',{y:24,opacity:0},{y:0,opacity:1,duration:.55,ease:'expo.out'});});
    ScrollTrigger.create({trigger:'#date',start:'top 70%',end:'bottom 30%',onEnter:()=>document.documentElement.style.setProperty('--calendar-scene','1'),onLeaveBack:()=>document.documentElement.style.setProperty('--calendar-scene','0')});
  }
  function ready(){drawDust();motion();setTimeout(()=>buildScene(),350);window.addEventListener('load',()=>window.ScrollTrigger?.refresh?.(),{once:true});}
  if(window.Marhamat?.on)window.Marhamat.on('ready',ready);else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
  window.addEventListener('load',()=>{const g=$('.gallery');if(g){const arrange=()=>{const mid=g.scrollLeft+g.clientWidth/2;let nearest=null,dist=Infinity;$$('.gallery__item',g).forEach(item=>{const d=Math.abs(item.offsetLeft+item.offsetWidth/2-mid);item.classList.remove('is-center','is-side');if(d<dist){dist=d;nearest=item;}});nearest?.classList.add('is-center');$$('.gallery__item',g).filter(item=>item!==nearest).forEach(item=>item.classList.add('is-side'));};g.addEventListener('scroll',()=>requestAnimationFrame(arrange),{passive:true});arrange();}});
})();
