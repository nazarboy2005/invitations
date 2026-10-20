/* Uchar Gilam: an interactive carpet roll, a Bukhara flight, and names gathered from stardust. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const intro = $('#intro'), roll = $('#carpet-roll'), skip = $('#skip-intro');
  const webglCanvas = $('#scene-webgl'), skywriteCanvas = $('#skywriting');
  const mediaReduced = matchMedia('(prefers-reduced-motion: reduce)');
  const isReduced = () => Boolean(window.Marhamat?.reducedMotion || mediaReduced.matches);
  const ART = {
    terrace:{width:820,height:1230,focusX:.5,focusY:.53,roll:{x:.5,y:.79,width:.72}},
    finale:{width:800,height:1200,focusX:.5,focusY:.5,lanterns:[{x:.11,y:.34},{x:.88,y:.42},{x:.72,y:.74}]}
  };
  let app, data, names = [], renderer, scene, camera, rug, carpetTexture, starField, starBase, sceneObserver, raf = 0;
  let webglAvailable = false, webglFailed = false, sceneVisible = true, opening = false, finished = false, ignoreClick = false;
  let rollProgress = 0, initialRoll = 0, openStarted = 0, phase = 0, lastFrame = 0, fpsFrames = 0, fpsTime = 0;
  let heroMount = null, sceneMount = null, pageMode = false, baseCameraZ = 8.2, pose = { rise: 0, rotate: 0, bank: 0 };
  let glyphParticles = [], glyphStarted = 0, glyphMode = 'off', glyphCtx = null, glyphRaf = 0, ambient = null;

  const setText = (el, text) => { if (el) el.textContent = text || ''; };
  function setCoupleName() {
    const couple = [data?.groom, data?.bride].filter(Boolean).map(v => String(v).trim()).filter(Boolean);
    names = couple.map(v => Array.from(v)[0]?.toLocaleUpperCase(app?.lang === 'ru' ? 'ru' : 'uz') || '');
    if (!names.length) names = ['✦'];
    document.title = `${couple.join(' & ')} — ${data?.eventType || 'Uchar Gilam'}`;
    const desc = $('meta[name="description"]');
    if (desc) desc.content = [couple.join(' & '), data?.eventType, data?.date?.long, data?.venue?.name].filter(Boolean).join(' · ');
    paintWovenNames();
  }

  /* One measured 2D overlay keeps the names crisp, long-name safe, and Cyrillic capable. */
  function paintWovenNames() {
    const c = $('#woven-names'); if (!c) return;
    const d = Math.min(devicePixelRatio || 1, 2), w = c.clientWidth || 360, h = c.clientHeight || 180;
    c.width = Math.round(w * d); c.height = Math.round(h * d);
    const g = c.getContext('2d'); if (!g) return;
    g.setTransform(d, 0, 0, d, 0, 0); g.clearRect(0, 0, w, h);
    const couple = [data?.groom, data?.bride].filter(Boolean).map(v => String(v).trim());
    const line = couple.length > 1 ? `${couple[0]}  &  ${couple[1]}` : (couple[0] || '');
    if (!line) return;
    let size = Math.min(h * .22, 28), font;
    do { font = `600 ${size}px "Cormorant Garamond", Georgia, serif`; g.font = font; if (g.measureText(line).width <= w * .72) break; size -= 1; } while (size > 12);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const x = w * .5, y = h * .52;
    g.shadowColor = 'rgba(245,205,112,.8)'; g.shadowBlur = 8;
    g.lineJoin = 'round'; g.lineWidth = .7; g.strokeStyle = 'rgba(255,230,165,.85)'; g.strokeText(line, x, y);
    g.shadowBlur = 2; g.fillStyle = '#f8df9c'; g.fillText(line, x, y);
    g.shadowBlur = 0; g.globalAlpha = .68; g.strokeStyle = '#fff1c4'; g.lineWidth = .35;
    for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(x - g.measureText(line).width * .38, y + i * 2.2); g.lineTo(x + g.measureText(line).width * .38, y + i * 2.2); g.stroke(); }
    const date=$('#hero .hero__date')?.textContent?.trim();if(date){g.globalAlpha=.84;g.shadowColor='rgba(245,205,112,.6)';g.shadowBlur=4;g.fillStyle='#f2d899';g.font=`600 ${Math.max(8,Math.min(11,h*.065))}px "Manrope", Arial, sans-serif`;g.fillText(date,x,h*.72,w*.74);}
    g.globalAlpha = 1;
  }
  function paintIntroNames() {
    const c=$('#intro-woven-names');if(!c)return;
    const d=Math.min(devicePixelRatio||1,1.5),w=c.clientWidth||innerWidth,h=c.clientHeight||innerHeight;
    c.width=Math.round(w*d);c.height=Math.round(h*d);
    const g=c.getContext('2d');if(!g)return;g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,w,h);
    const couple=[data?.groom,data?.bride].filter(Boolean).map(v=>String(v).trim());
    const line=couple.length>1?`${couple[0]}  &  ${couple[1]}`:(couple[0]||'');if(!line)return;
    let size=Math.min(30,w*.075),font;do{font=`600 ${size}px "Cormorant Garamond", Georgia, serif`;g.font=font;if(g.measureText(line).width<=w*.76)break;size-=1;}while(size>15);
    const x=w/2,y=h*.51;g.textAlign='center';g.textBaseline='middle';g.shadowColor='rgba(255,218,137,.92)';g.shadowBlur=12;g.fillStyle='#fff0c8';g.fillText(line,x,y,w*.76);g.shadowBlur=0;
    const date=$('#intro .intro__date')?.textContent?.trim();if(date){g.font=`600 ${Math.max(9,Math.min(13,w*.032))}px Manrope, Arial, sans-serif`;g.globalAlpha=.93;g.fillStyle='#f3dfa9';g.fillText(date,x,y+size*.78,w*.72);}
    g.globalAlpha=1;
  }
  function makeFlightCarpetTexture(T, image) {
    const canvas = document.createElement('canvas');
    const fringe = 37;
    const fieldWidth = 950;
    const fieldHeight = 475;
    canvas.width = 1024;
    canvas.height = 512;
    const g = canvas.getContext('2d');
    const paint = () => {
      g.clearRect(0, 0, canvas.width, canvas.height);
      g.drawImage(image, fringe, (canvas.height - fieldHeight) / 2, fieldWidth, fieldHeight);

      // Fringe is painted into the carpet texture, so it follows every fold and turn.
      for (const side of [0, 1]) {
        const edge = side ? fringe + fieldWidth : fringe;
        const direction = side ? 1 : -1;
        g.fillStyle = 'rgba(71,35,30,.78)';
        g.fillRect(edge - (side ? 0 : 3), 0, 3, 512);
        for (let y = 22; y < 490; y += 8) {
          const length = 27 + ((Math.floor(y / 8) * 13) % 10);
          g.beginPath();
          g.moveTo(edge, y);
          g.quadraticCurveTo(edge + direction * 12, y + 2, edge + direction * length, y + 5);
          g.strokeStyle = (Math.floor(y / 8) % 3 === 0) ? '#f0d393' : '#bd9555';
          g.lineWidth = 2.2;
          g.globalAlpha = .9;
          g.stroke();
        }
      }
      g.globalAlpha = 1;

      const couple = [data?.groom, data?.bride].filter(Boolean).map(v => String(v).trim());
      const line = couple.length > 1 ? `${couple[0]}  &  ${couple[1]}` : (couple[0] || '');
      if (line) {
        let size = 58;
        g.font = `600 ${size}px "Cormorant Garamond", Georgia, serif`;
        while (g.measureText(line).width > 670 && size > 22) {
          size -= 2;
          g.font = `600 ${size}px "Cormorant Garamond", Georgia, serif`;
        }
        const x = canvas.width / 2, y = 253;
        const width = Math.min(690, g.measureText(line).width + 48);
        g.fillStyle = 'rgba(48,17,28,.74)';
        g.beginPath();
        if (g.roundRect) g.roundRect(x - width / 2, y - size * .78, width, size * 1.52, 15);
        else g.rect(x - width / 2, y - size * .78, width, size * 1.52);
        g.fill();
        g.strokeStyle = 'rgba(241,207,139,.78)';
        g.lineWidth = 2;
        g.stroke();
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.shadowColor = 'rgba(22,9,18,.9)';
        g.shadowBlur = 5;
        g.fillStyle = '#fff0c8';
        g.fillText(line, x, y, width - 32);
        const date = $('#hero .hero__date')?.textContent?.trim();
        if (date) {
          g.font = '600 18px Manrope, Arial, sans-serif';
          g.fillStyle = '#f1d698';
          g.fillText(date, x, y + size * .58, width - 40);
        }
        g.shadowBlur = 0;
      }
    };
    paint();
    window.__ucharTextureSize=[canvas.width,canvas.height];
    document.fonts?.ready?.then(() => { paint(); texture.needsUpdate = true; });
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
    return texture;
  }
  function coverAnchor(host,asset,anchor){if(!host)return null;const w=host.clientWidth,h=host.clientHeight,s=Math.max(w/asset.width,h/asset.height),ox=(w-asset.width*s)*asset.focusX,oy=(h-asset.height*s)*asset.focusY;return{x:ox+anchor.x*asset.width*s,y:oy+anchor.y*asset.height*s,s};}
  function layoutArtAnchors(){const p=coverAnchor($('.intro__poster'),ART.terrace,ART.terrace.roll);if(p&&roll){roll.style.left=`${p.x}px`;roll.style.top=`${p.y}px`;roll.style.width=`${Math.min(p.s*ART.terrace.width*ART.terrace.roll.width,innerWidth*.82)}px`;}const host=$('.finale');ART.finale.lanterns.forEach((a,i)=>{const pos=coverAnchor(host,ART.finale,a),el=$$('.finale__glow')[i];if(pos&&el){el.style.left=`${pos.x}px`;el.style.top=`${pos.y}px`;el.style.right='auto';el.style.bottom='auto';}});}
  function writeGreeting(){const el=$('.intro__greeting');if(!el||isReduced())return;const full=el.textContent.trim();if(!full)return;const chars=Array.from(full);el.textContent='';let i=0;const write=()=>{if(i>=chars.length||opening)return;el.textContent+=chars[i++];setTimeout(write,Math.max(24,420/chars.length));};setTimeout(write,320);}

  /* Arrival dust is one tiny canvas and stops whenever its poster is not visible. */
  function startAmbient() {
    const c = $('#ambient-stars'); if (!c || isReduced()) return;
    const g = c.getContext('2d'); if (!g) return;
    let w = 0, h = 0, d = 1, dots = [], on = true, last = 0, id = 0;
    const resize = () => { d = Math.min(devicePixelRatio || 1, app?.tier === 'lite' ? 1 : 1.5); w = innerWidth; h = innerHeight; c.width = Math.round(w * d); c.height = Math.round(h * d); g.setTransform(d,0,0,d,0,0); dots = Array.from({length:app?.tier === 'lite' ? 12 : 32},()=>({x:Math.random()*w,y:Math.random()*h,r:.5+Math.random()*1.1,p:Math.random()*6.28,v:.12+Math.random()*.35})); };
    const tick = now => { id = 0; if (!on || document.hidden) return; const dt = last ? Math.min(.04,(now-last)/1000) : .016; last=now; g.clearRect(0,0,w,h); for (const p of dots) { p.p += dt; p.y -= p.v*dt*17; if(p.y < -2)p.y=h+2; g.globalAlpha=.22+.5*(.5+.5*Math.sin(p.p*1.7)); g.fillStyle='#ffe5a9'; g.beginPath(); g.arc(p.x,p.y,p.r,0,Math.PI*2); g.fill(); } g.globalAlpha=1; id=requestAnimationFrame(tick); };
    resize(); addEventListener('resize',resize,{passive:true});
    const io = new IntersectionObserver(e => { on=e[0].isIntersecting; if(on&&!id&&!document.hidden)id=requestAnimationFrame(tick); else if(!on){cancelAnimationFrame(id);id=0;} }); io.observe(c);
    document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(id);id=0;}else if(on&&!id)id=requestAnimationFrame(tick);});
    id=requestAnimationFrame(tick); ambient={stop(){on=false;cancelAnimationFrame(id);}};
  }

  /* A single renderer and segmented cloth mesh; < 20k triangles, one 1024px texture. */
  function loadThree() {
    if (app?.tier !== 'full' || isReduced() || !window.WebGLRenderingContext || !webglCanvas) { fallback(); return; }
    const inject = () => {
      if (webglFailed || renderer) return;
      const script = document.createElement('script'); script.src = '../../shared/vendor/three/three.bundle.min.js';
      script.onload = initThree; script.onerror = fallback; document.head.appendChild(script);
    };
    if ('requestIdleCallback' in window) requestIdleCallback(inject,{timeout:1200}); else setTimeout(inject,350);
  }
  function initThree() {
    if (!window.THREE || webglFailed) return fallback();
    try {
      const T=window.THREE;
      renderer=new T.WebGLRenderer({canvas:webglCanvas,alpha:true,antialias:false,powerPreference:'low-power',preserveDrawingBuffer:false});
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5)); renderer.setClearColor(0x000000,0);
      scene=new T.Scene(); camera=new T.PerspectiveCamera(38,innerWidth/innerHeight,.1,80); baseCameraZ=fitCameraDistance(innerWidth,innerHeight); camera.position.set(0,1.8,baseCameraZ); camera.lookAt(0,0,0);
      scene.add(new T.HemisphereLight(0xffe8c3,0x202042,1.7));
      const key=new T.DirectionalLight(0xffd48a,2.4); key.position.set(-2,5,6); scene.add(key);
      const fill=new T.PointLight(0x8fcbd0,1.2,18); fill.position.set(3,2,4); scene.add(fill);
      const tex=new T.TextureLoader().load('art/carpet.webp',loaded=>{
        const composed=makeFlightCarpetTexture(T,loaded.image);
        if(!rug||!renderer){composed.dispose();tex.dispose();return;}
        rug.material.uniforms.uMap.value=composed;
        carpetTexture=composed;
        tex.dispose();
      });
      tex.colorSpace=T.SRGBColorSpace;
      const geom=new T.PlaneGeometry(4.03,1.88,120,60); // 14,400 triangles; fringe follows the same cloth mesh.
      window.__ucharGeometryTriangles=geom.index?geom.index.count/3:geom.attributes.position.count/3;
      const mat=new T.ShaderMaterial({uniforms:{uMap:{value:tex},uTime:{value:0},uRoll:{value:0},uFlight:{value:0},uBank:{value:0},uLift:{value:0},uArc:{value:0},uOpacity:{value:1}},transparent:true,side:T.DoubleSide,vertexShader:`
        uniform float uTime; uniform float uRoll; uniform float uFlight; uniform float uBank; uniform float uLift; uniform float uArc; varying vec2 vUv; varying float vLight;
        void main(){vUv=uv;vec3 p=position;float edge=abs(p.x)/2.015;float remaining=max(0.0,p.y+0.94-uRoll*1.88);float radius=.18;float theta=clamp(remaining/radius,0.0,3.12);p.z+=(1.0-cos(theta))*radius;p.y-=sin(theta)*radius;
        float wave=sin(p.x*2.8+p.y*3.4-uTime*3.0)*.075*edge*uFlight;p.z+=wave;p.x+=sin(p.y*4.0-uTime*2.2)*.025*uFlight;
        p.x+=sin(uTime*.62)*.35*uFlight+uArc*.68;p.z-=abs(uArc)*.11;p.y+=uLift+uFlight*(.32+.11*sin(uTime*1.8));p.x+=p.y*uBank*.28;
        vec4 mv=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*mv;vLight=.86+.14*cos(theta);}`,
        fragmentShader:`uniform sampler2D uMap;uniform float uOpacity;varying vec2 vUv;varying float vLight;void main(){vec4 c=texture2D(uMap,vUv);gl_FragColor=vec4(c.rgb*vLight,c.a*uOpacity);}`});
      rug=new T.Mesh(geom,mat); rug.rotation.x=-.46; rug.position.y=-.45; scene.add(rug);
      const count=180, positions=new Float32Array(count*3); for(let i=0;i<count;i++){positions[i*3]=(Math.random()-.5)*9;positions[i*3+1]=(Math.random()-.5)*7;positions[i*3+2]=-1.5;}
      const sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(positions,3));starBase=positions.slice();const sm=new T.PointsMaterial({color:0xffe6a2,size:.035,transparent:true,opacity:.8});starField=new T.Points(sg,sm);scene.add(starField);
      webglAvailable=true;fpsTime=performance.now();fpsFrames=0;intro.classList.add('scene-live');
      webglCanvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback();},{once:true});
      sceneObserver=new IntersectionObserver(entries=>{sceneVisible=entries.some(e=>e.isIntersecting);if(sceneVisible)startRender();},{threshold:0});sceneObserver.observe(intro);
      document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else if(sceneVisible)startRender();});
      addEventListener('resize',resizeRenderer,{passive:true});
      startRender();
    } catch(e) { window.__threeError=String(e?.stack||e); fallback(); }
  }
  function fitCameraDistance(w,h){const horizontalFit=4.2/(2*Math.tan(38*Math.PI/360)*(w/Math.max(1,h))*.84);return Math.max(7.1,horizontalFit);}
  function resizeRenderer(){if(!renderer||!camera)return;const host=pageMode?(sceneMount||heroMount):intro;const w=host?.clientWidth||innerWidth,h=host?.clientHeight||innerHeight;camera.aspect=w/h;baseCameraZ=fitCameraDistance(w,h);if(!opening||pageMode)camera.position.z=baseCameraZ;camera.updateProjectionMatrix();renderer.setSize(w,h,false);paintWovenNames();}
  function disposeScene(){if(scene){scene.traverse(obj=>{obj.geometry?.dispose();const materials=Array.isArray(obj.material)?obj.material:obj.material?[obj.material]:[];for(const material of materials){if(material.uniforms)for(const uniform of Object.values(material.uniforms))uniform.value?.dispose?.();material.map?.dispose?.();material.dispose?.();}});scene.clear();}carpetTexture?.dispose?.();carpetTexture=null;scene=null;camera=null;rug=null;starField=null;starBase=null;}
  function fallback(){const wasOpening=opening;if(!window.__ucharFps&&fpsFrames&&fpsTime)window.__ucharFps=Math.round(fpsFrames*1000/Math.max(1,performance.now()-fpsTime));webglFailed=true;webglAvailable=false;intro?.classList.add('scene-fallback');intro?.classList.remove('scene-live');$('.hero')?.classList.remove('scene-mounted');$('.finale')?.classList.remove('scene-mounted');if(webglCanvas)webglCanvas.hidden=true;if(renderer){disposeScene();sceneObserver?.disconnect();sceneObserver=null;try{renderer.dispose();}catch(_){}renderer=null;}cancelAnimationFrame(raf);raf=0;if(wasOpening){beginSkywriting();setTimeout(finish,1400);}}
  function startRender(){if(!renderer||raf||document.hidden||!sceneVisible)return;lastFrame=performance.now();raf=requestAnimationFrame(renderFrame);}
  function renderFrame(now){raf=0;if(!renderer||!sceneVisible||document.hidden)return;const sec=now/1000;
    if(opening){const t=(now-openStarted)/1000;if(t<1.05){phase=0;const p=clamp(t/1.05,0,1);rollProgress=lerp(initialRoll,1,1-Math.pow(1-p,3));}
      else if(t<1.85){phase=1;rollProgress=1;}
      else if(t<3.75){phase=2;rollProgress=1;}
      else if(t<5.35){phase=3;rollProgress=1;}
      else{phase=4;rollProgress=1;}}
    const uniforms=rug?.material?.uniforms;
    if(uniforms){uniforms.uTime.value=sec;uniforms.uRoll.value=pageMode?1:rollProgress;
      const t=opening?(now-openStarted)/1000:0;
      const takeoff=clamp((t-1.02)/.92,0,1),flightEase=takeoff*takeoff*(3-2*takeoff);
      uniforms.uFlight.value=pageMode?1:opening?flightEase:0;
      uniforms.uLift.value=pageMode?pose.rise:opening?flightEase*.75:0;
      uniforms.uBank.value=pageMode?pose.bank:opening?Math.sin(t*1.05)*.22:0;
      const cruise=opening?clamp((t-2.05)/.45,0,1)*clamp((5.25-t)/.72,0,1):0;
      uniforms.uArc.value=pageMode?pose.bank*1.25:opening?Math.sin((t-2.05)*1.18)*cruise:0;
      uniforms.uOpacity.value=opening&&t>4.6?clamp((5.45-t)/.85,0,1):1;}
    if(rug){if(pageMode){rug.rotation.z=pose.rotate+Math.sin(sec*.5)*.025;rug.position.y=-.45+pose.rise*.3;camera.position.z=baseCameraZ-pose.rise*.15;}
      else if(opening){const t=(now-openStarted)/1000,travel=clamp((t-1.3)/2.9,0,1);camera.position.x=Math.sin((t-1.9)*1.18)*.52*travel;camera.position.y=1.8+clamp((t-1.05)/1.3,0,1)*.5;camera.position.z=baseCameraZ-clamp((t-1.1)/2.2,0,1)*Math.min(1.15,baseCameraZ*.12);}
      camera.lookAt(0,0,0);}
    if(starField&&starBase){const a=starField.geometry.attributes.position;for(let i=0;i<a.count;i++){const k=i*3;a.array[k]=starBase[k]+Math.sin(sec*.18+i*1.7)*.035;a.array[k+1]=starBase[k+1]+Math.sin(sec*.28+i*.7)*.045;}a.needsUpdate=true;}
    renderer.render(scene,camera);
    fpsFrames++;if(now-fpsTime>1200){const fps=fpsFrames*1000/(now-fpsTime||1200);window.__ucharFps=Math.round(fps);fpsFrames=0;fpsTime=now;if(opening&&fps<45)fallback();}
    updateSkywriting(now);
    if(opening){const t=(now-openStarted)/1000;if(t>5.9)finish();}
    raf=requestAnimationFrame(renderFrame);
  }

  /* Sample the actual initials (Latin or Cyrillic) into target coordinates. */
  function makeGlyphTargets() {
    const w=innerWidth,h=innerHeight,d=Math.min(devicePixelRatio||1,1.5),c=document.createElement('canvas'),g=c.getContext('2d');
    const cw=Math.round(w*d),ch=Math.round(h*d);c.width=cw;c.height=ch;
    const letters=names.length>1?`${names[0]}  ♥  ${names[1]}`:`${names[0]}  ♥`;
    let px=Math.min(w*.115,48),font;
    do{font=`600 ${Math.round(px*d)}px "Cormorant Garamond", Georgia, serif`;g.font=font;if(g.measureText(letters).width<cw*.8)break;px-=1;}while(px>22);
    g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';g.fillText(letters,cw/2,ch*.34);
    const pixels=g.getImageData(0,0,cw,ch).data,step=Math.max(4,Math.round(d*4)),targets=[];
    for(let y=0;y<ch;y+=step)for(let x=0;x<cw;x+=step)if(pixels[(y*cw+x)*4+3]>128)targets.push({x:x/d,y:y/d});
    return targets;
  }
  function beginSkywriting() {
    if(!opening)return;
    const c=skywriteCanvas,g=c?.getContext('2d');if(!c||!g)return;
    const d=Math.min(devicePixelRatio||1,2);c.width=Math.round(innerWidth*d);c.height=Math.round(innerHeight*d);g.setTransform(d,0,0,d,0,0);glyphCtx=g;
    const lite=app?.tier==='lite'||webglFailed,targets=makeGlyphTargets(),count=Math.min(lite?180:130,targets.length||36);glyphParticles=[];
    for(let i=0;i<count;i++){const target=targets[Math.floor(i*targets.length/count)]||{x:innerWidth/2,y:innerHeight*.34};glyphParticles.push({sx:innerWidth*(.15+Math.random()*.7),sy:innerHeight*(.66+Math.random()*.22),tx:target.x,ty:target.y,curve:(Math.random()-.5)*innerHeight*.16,p:0,delay:Math.random()*(lite ? .12 : .38),r:lite?.85+Math.random()*.8:1+Math.random()*1.5,tw:Math.random()*6.28});}
    glyphStarted=performance.now();glyphMode='gather';
    if(!renderer||isReduced()){
      if(isReduced()){
        g.clearRect(0,0,innerWidth,innerHeight);g.textAlign='center';g.textBaseline='middle';g.font=`600 ${Math.min(innerWidth*.12,48)}px "Cormorant Garamond", Georgia, serif`;g.fillStyle='#f4d88e';g.shadowColor='#ffd77c';g.shadowBlur=12;g.fillText(names.length>1?`${names[0]}  ♥  ${names[1]}`:`${names[0]}  ♥`,innerWidth/2,innerHeight*.34);g.shadowBlur=0;glyphMode='reduced-hold';return;
      }
      if(!glyphRaf)glyphRaf=requestAnimationFrame(fallbackGlyphFrame);
    }
  }
  function fallbackGlyphFrame(now){glyphRaf=0;if(!opening||glyphMode==='off')return;updateSkywriting(now);if(glyphMode!=='off')glyphRaf=requestAnimationFrame(fallbackGlyphFrame);}
  function updateSkywriting(now){if(!glyphCtx||glyphMode==='off')return;const g=glyphCtx,d=Math.min(devicePixelRatio||1,2);g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,innerWidth,innerHeight);let active=0;const lite=app?.tier==='lite'||webglFailed,travelTime=lite ? .56 : 1.12,fadeStart=lite ? 1.05 : 2.15,fadeTime=lite ? .45 : .85;
    const elapsed=(now-glyphStarted)/1000;
    for(const p of glyphParticles){const travel=clamp((elapsed-p.delay)/travelTime,0,1),e=1-Math.pow(1-travel,3);p.p=e;const x=lerp(p.sx,p.tx,e),y=lerp(p.sy,p.ty,e)+Math.sin(e*Math.PI)*p.curve;let alpha=1;if(elapsed>fadeStart)alpha=clamp(1-(elapsed-fadeStart)/fadeTime,0,1);if(alpha<=0)continue;active++;
      const pulse=.65+.35*Math.sin(now/180+p.tw);g.globalAlpha=alpha*pulse;g.fillStyle=p.tw%2?'#ffe6a6':'#fff7da';g.shadowColor='#ffd77c';g.shadowBlur=lite?3.5:8;g.beginPath();g.arc(x,y,p.r,0,Math.PI*2);g.fill();}
    g.globalAlpha=1;g.shadowBlur=0;if(elapsed>(lite?1.65:3.05)||!active){g.clearRect(0,0,innerWidth,innerHeight);glyphMode='off';}}

  /* Sound is synthesised on the opening gesture; no audio asset or network request. */
  const sound={ctx:null,unlock(){try{this.ctx=this.ctx||new(window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')this.ctx.resume();}catch(_){this.ctx=null;}},cloth(){const c=this.ctx;if(!c)return;const t=c.currentTime;const len=.65,b=c.createBuffer(1,Math.round(c.sampleRate*len),c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++){const k=i/d.length;d[i]=(Math.random()*2-1)*Math.pow(1-k,2)*.12;}const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(1300,t);f.frequency.exponentialRampToValueAtTime(240,t+.56);const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.16,t+.04);g.gain.exponentialRampToValueAtTime(.0001,t+len);s.connect(f).connect(g).connect(c.destination);s.start(t);const o=c.createOscillator(),og=c.createGain();o.type='sine';o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(392,t+1.4);og.gain.setValueAtTime(.0001,t);og.gain.exponentialRampToValueAtTime(.035,t+.35);og.gain.exponentialRampToValueAtTime(.0001,t+1.65);o.connect(og).connect(c.destination);o.start(t);o.stop(t+1.7);},spark(){const c=this.ctx;if(!c)return;const t=c.currentTime;[880,1320,1760].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t+i*.06);g.gain.exponentialRampToValueAtTime(.045,t+i*.06+.02);g.gain.exponentialRampToValueAtTime(.0001,t+i*.06+.75);o.connect(g).connect(c.destination);o.start(t+i*.06);o.stop(t+i*.06+.8);});}};

  function beginOpening(from=0) {
    if(finished)return;if(opening){finish();return;}
    opening=true;initialRoll=from;openStarted=performance.now();phase=0;intro.classList.add('is-opening');skip.hidden=false;
    try{app?.open();sound.unlock();sound.cloth();navigator.vibrate?.(12);}catch(_){}
    if(isReduced()){
      intro.classList.add('is-flight','scene-fallback');
      setTimeout(()=>{beginSkywriting();setTimeout(()=>{glyphCtx?.clearRect(0,0,innerWidth,innerHeight);finish();},950);},280);return;
    }
    if(webglAvailable)startRender();
    // The 2D path follows the same story: reveal, take-off, skywriting, then the hero.
    if(!webglAvailable){
      const lite=app?.tier==='lite',unroll=lite?520:1080,finishAt=lite?2350:5850;
      intro.style.setProperty('--reveal','100%');intro.classList.add('is-preview-unroll');
      const flat=$('.intro__flight-rug');if(flat)flat.style.transform='translate(-50%,-50%) perspective(900px) rotateX(14deg) scaleY(.92)';
      setTimeout(()=>intro.classList.add('is-flight'),unroll);
      setTimeout(()=>{if(opening)beginSkywriting();},lite?850:3060);
      setTimeout(finish,finishAt);
    } else {
      intro.classList.add('is-flight');
      setTimeout(()=>{if(opening)beginSkywriting();},3160);
    }
  }
  function finish() {
    if(finished)return;finished=true;opening=false;skip.hidden=true;ambient?.stop();glyphMode='off';if(glyphRaf){cancelAnimationFrame(glyphRaf);glyphRaf=0;}glyphCtx?.clearRect(0,0,innerWidth,innerHeight);
    document.documentElement.classList.remove('is-locked');document.body.classList.add('is-open');intro.classList.add('is-gone');intro.setAttribute('aria-hidden','true');
    heroMount=$('.hero__stage');
    if(renderer&&heroMount){webglCanvas.hidden=false;webglCanvas.classList.add('scene-webgl--hero');mountScene(heroMount);}
    const hero=$('#hero');hero?.scrollIntoView({block:'start',behavior:'auto'});
    setTimeout(()=>{intro.hidden=true;},850);
    if(window.ScrollTrigger)requestAnimationFrame(()=>ScrollTrigger.refresh());
  }
  function mountScene(host){if(!renderer||!host)return;if(sceneMount&&sceneObserver)sceneObserver.unobserve(sceneMount);sceneMount=host;pageMode=true;host.appendChild(webglCanvas);host.closest('.hero')?.classList.add('scene-mounted');host.closest('.finale')?.classList.add('scene-mounted');if(sceneObserver)sceneObserver.observe(host);sceneVisible=true;resizeRenderer();startRender();}
  function progressGesture(delta) {
    if(opening)return;rollProgress=clamp(delta,0,1);
    intro?.style.setProperty('--reveal',`${Math.round(rollProgress*78)}%`);
    intro?.style.setProperty('--roll-progress',String(rollProgress));
    intro?.classList.toggle('is-preview-unroll',rollProgress>.035);
    if(roll){roll.style.opacity=String(1-rollProgress);if(rollProgress<.01)roll.style.transform='';else{const lift=Math.round(rollProgress*34);roll.style.transform=`translate(-50%,calc(-50% - ${lift}px)) scaleX(${1-rollProgress*.13}) rotateX(${rollProgress*13}deg)`;}}
    const flat=$('.intro__flight-rug');if(flat){if(rollProgress<.01)flat.style.transform='';else flat.style.transform=`translate(-50%,-50%) perspective(900px) rotateX(${46-rollProgress*32}deg) scaleY(${.36+rollProgress*.64})`;}
    if(webglAvailable&&rug){rug.material.uniforms.uRoll.value=rollProgress;startRender();}
  }
  let drag=null;
  roll?.addEventListener('pointerdown',e=>{if(opening)return;drag={id:e.pointerId,y:e.clientY,time:performance.now(),progress:0,moved:false};try{roll.setPointerCapture(e.pointerId);}catch(_){};});
  roll?.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dy=drag.y-e.clientY;if(dy>6){drag.moved=true;drag.progress=clamp(dy/Math.max(120,roll.clientHeight*.72),0,1);progressGesture(drag.progress);}});
  function releaseGesture(e){if(!drag||drag.id!==e.pointerId)return;const d=drag;drag=null;if(e.type==='pointercancel'){progressGesture(0);return;}if(d.moved&&d.progress>=.4){ignoreClick=true;beginOpening(d.progress);setTimeout(()=>ignoreClick=false,360);}else if(!d.moved){ignoreClick=true;beginOpening(0);setTimeout(()=>ignoreClick=false,360);}else{ignoreClick=true;progressGesture(0);roll?.classList.remove('is-pulled');setTimeout(()=>ignoreClick=false,360);}}
  roll?.addEventListener('pointerup',releaseGesture);roll?.addEventListener('pointercancel',releaseGesture);
  roll?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();ignoreClick=true;beginOpening(0);setTimeout(()=>ignoreClick=false,360);}});
  roll?.addEventListener('click',e=>{e.stopPropagation();if(ignoreClick){ignoreClick=false;return;}if(opening)finish();else beginOpening(0);});
  intro?.addEventListener('click',e=>{if(opening&&e.target!==skip)finish();});
  skip?.addEventListener('click',()=>finish());
  addEventListener('resize',()=>{if(renderer)resizeRenderer();paintWovenNames();layoutArtAnchors();},{passive:true});
  addEventListener('resize',paintIntroNames,{passive:true});

  function bindScroll() {
    const gsap=window.gsap,ST=window.ScrollTrigger;if(!gsap||!ST)return;gsap.registerPlugin(ST);
    const hero=$('#hero'),carpet=$('.hero__carpet'),city=$('.hero__city');
    const reduced=isReduced();
    if(!reduced){
      if(carpet){gsap.to(carpet,{y:-28,rotateX:9,rotateZ:-4,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.7,onUpdate:s=>{pose.rise=.28*s.progress;pose.rotate=-.08*s.progress;pose.bank=-.11*s.progress;}}});gsap.to(city,{yPercent:18,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});}
      ST.create({trigger:'.finale',start:'top 88%',end:'bottom 22%',onEnter:()=>{pose={rise:.1,rotate:0,bank:0};mountScene($('.finale'));},onEnterBack:()=>{pose={rise:.1,rotate:0,bank:0};mountScene($('.finale'));},onLeaveBack:()=>{pose={rise:0,rotate:0,bank:0};mountScene(heroMount);},onUpdate:s=>{if(sceneMount===$('.finale')){pose.rise=.12+.28*s.progress;pose.rotate=-.04-.08*s.progress;pose.bank=-.06-.13*s.progress;}}});
      gsap.fromTo('.letter__divider',{strokeDashoffset:1},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.letter',start:'top 75%',end:'center 48%',scrub:.5}});
      gsap.to('.date__rosette',{rotation:12,ease:'none',scrollTrigger:{trigger:'.date',start:'top bottom',end:'bottom top',scrub:true}});
      gsap.fromTo('.map-route__draw',{strokeDashoffset:1},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.map-card',start:'top 78%',end:'bottom 32%',scrub:.5,onUpdate:s=>$('.map-card')?.style.setProperty('--route-progress',s.progress.toFixed(3))}});
      gsap.to('.map-carpet',{offsetDistance:'100%',ease:'none',scrollTrigger:{trigger:'.program__list',start:'top 80%',end:'bottom 20%',scrub:.7}});
      gsap.to('.venue__arch',{y:-15,rotate:1.4,ease:'none',scrollTrigger:{trigger:'.venue',start:'top bottom',end:'bottom top',scrub:true}});
      gsap.fromTo('.finale__art',{scale:1.14},{scale:1,ease:'none',scrollTrigger:{trigger:'.finale',start:'top bottom',end:'bottom bottom',scrub:.6}});
      gsap.from('.finale__copy',{y:32,opacity:0,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:'.finale',start:'top 60%'}});
      $$('.section').forEach((s,i)=>{if(!s.classList.contains('hero'))ST.create({trigger:s,start:'top 78%',onEnter:()=>s.classList.add('in'),onEnterBack:()=>s.classList.add('in')});});
    } else $$('.section').forEach(s=>s.classList.add('in'));
  }

  function bindBehavior() {
    // Venue map is created only after the explicit toggle.
    const toggle=$('[data-map-toggle]'),host=$('[data-map-embed]');
    toggle?.addEventListener('click',()=>{if(!host)return;if(!host.firstChild){const lat=Number(data?.venue?.lat),lng=Number(data?.venue?.lng);if(Number.isFinite(lat)&&Number.isFinite(lng)){const frame=document.createElement('iframe');frame.title=data?.venue?.name||'Buxoro xaritasi';frame.loading='lazy';frame.referrerPolicy='no-referrer';frame.src=`https://yandex.uz/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}%2Cpm2rdm`;host.append(frame);}else{host.textContent='';return;}}host.hidden=!host.hidden;toggle.setAttribute('aria-expanded',String(!host.hidden));});
    $$('.countdown strong[data-unit]').forEach(el=>{let prev=el.textContent;new MutationObserver(()=>{if(prev===el.textContent)return;prev=el.textContent;el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick');}).observe(el,{childList:true,characterData:true,subtree:true});});
    const track=$('.gallery__track');if(track){const shape=()=>{const slides=$$('.gallery__slide',track),single=slides.length===1;track.classList.toggle('is-single',single);track.closest('.gallery__wrap')?.classList.toggle('is-single',single);track.closest('.gallery')?.classList.toggle('is-single',single);if(!isReduced()) {const mid=track.scrollLeft+track.clientWidth/2;slides.forEach(slide=>{const d=single?0:clamp(Math.abs(slide.offsetLeft+slide.offsetWidth/2-mid)/track.clientWidth,0,1);slide.style.setProperty('--s',(1-d*.2).toFixed(3));slide.style.setProperty('--o',(1-d*.45).toFixed(3));});}};track.addEventListener('scroll',()=>requestAnimationFrame(shape),{passive:true});new MutationObserver(shape).observe(track,{childList:true});addEventListener('resize',shape,{passive:true});shape();}
    app?.on?.('rsvp',a=>{if(a?.status!=='yes'||isReduced())return;const star=$('.rsvp__star');star?.animate([{transform:'translateY(0) rotate(0) scale(.5)',opacity:0},{transform:'translateY(-22px) rotate(360deg) scale(1.4)',opacity:1},{transform:'translateY(-50px) rotate(560deg) scale(.2)',opacity:0}],{duration:1050,easing:'cubic-bezier(.2,.8,.2,1)'});burstRsvp();});
    app?.on?.('wish',()=>{const last=$('.wishes__list>*:last-child');last?.animate([{opacity:0,transform:'translateY(16px) scale(.96)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)'});});
    const gift=$('.gift');gift?.addEventListener('toggle',()=>{if(gift.open&&!isReduced())gift.querySelector('.gift__chest')?.animate([{transform:'translateY(8px) scale(.92)'},{transform:'none'}],{duration:550,easing:'cubic-bezier(.2,.8,.2,1)'});});
  }
  function burstRsvp(){const c=$('.rsvp__burst'),g=c?.getContext('2d');if(!c||!g)return;const d=Math.min(devicePixelRatio||1,2),rect=c.getBoundingClientRect();c.width=rect.width*d;c.height=rect.height*d;let ps=Array.from({length:app?.tier==='lite'?20:42},()=>({x:rect.width*.5,y:rect.height*.31,vx:(Math.random()-.5)*5,vy:-1-Math.random()*5,r:1+Math.random()*2,a:1}));let start=performance.now();const tick=now=>{g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,rect.width,rect.height);let alive=0;for(const p of ps){p.x+=p.vx;p.y+=p.vy;p.vy+=.13;p.a-=.018;if(p.a<=0)continue;alive++;g.globalAlpha=p.a;g.fillStyle='#f4d88e';g.beginPath();g.arc(p.x,p.y,p.r,0,Math.PI*2);g.fill();}g.globalAlpha=1;if(alive&&now-start<1800)requestAnimationFrame(tick);else g.clearRect(0,0,rect.width,rect.height);};requestAnimationFrame(tick);}

  function init({data:invitation}={}) {
    app=window.Marhamat;if(!app)return;data=invitation||app.data||{};setCoupleName();
    document.documentElement.classList.toggle('motion',!isReduced());
    if(data.rsvp?.enabled===false)$('#rsvp').hidden=true;if(data.toyona?.enabled===false)$('#toyona').hidden=true;
    startAmbient();loadThree();bindScroll();bindBehavior();
    app.on('tier',tier=>{if(tier!=='full')fallback();});
    app.on('open',()=>$('.music-toggle')?.classList.add('is-ready'));
    // Long names are redrawn after the web fonts are ready and at the measured texture size.
    document.fonts?.ready?.then(()=>{paintWovenNames();paintIntroNames();});layoutArtAnchors();paintIntroNames();writeGreeting();
    if(app.tier!=='full'||isReduced())intro.classList.add('scene-fallback');
  }
  if(window.Marhamat?.on)window.Marhamat.on('ready',init);
  else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>init(),{once:true});
  else init();
})();
