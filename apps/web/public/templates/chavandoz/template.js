(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const intro = $('#intro'), openButton = $('#open-invitation'), canvas = $('.scene-canvas'), hero = $('#hero');
  const reduced = () => window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opened = false, opening = false, openingAt = 0, renderer, scene, camera, raf = 0, alive = false, startAt = 0, frames = 0;

  function buildHorse(THREE) {
    const shape = new THREE.Shape();
    shape.moveTo(-.48,-.18); shape.lineTo(-.45,.04); shape.lineTo(-.29,.1); shape.lineTo(-.19,.34); shape.lineTo(-.08,.39); shape.lineTo(.05,.28); shape.lineTo(.25,.24); shape.lineTo(.36,.38); shape.lineTo(.5,.36); shape.lineTo(.47,.22); shape.lineTo(.37,.12); shape.lineTo(.34,-.2); shape.lineTo(.18,-.2); shape.lineTo(.16,.04); shape.lineTo(-.18,.02); shape.lineTo(-.24,-.23); shape.lineTo(-.38,-.23); shape.lineTo(-.39,-.05); shape.lineTo(-.48,-.18);
    const geo = new THREE.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.045,bevelThickness:.04});
    geo.center(); const mat = new THREE.MeshStandardMaterial({color:0x9c4b29,roughness:.57,metalness:.05});
    const horse = new THREE.Mesh(geo,mat); horse.scale.set(1.1,1.3,1.1);
    const gold = new THREE.MeshStandardMaterial({color:0xe2b04a,metalness:.68,roughness:.27});
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(.42,.11,.25),new THREE.MeshStandardMaterial({color:0xc2185b,roughness:.62})); saddle.position.set(-.02,.1,.1); horse.add(saddle);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,1.25,7),gold); pole.position.y=-.72; horse.add(pole);
    const bridle = new THREE.Mesh(new THREE.TorusGeometry(.16,.025,4,8),gold); bridle.position.set(.37,.25,.12); bridle.rotation.y=Math.PI/2; horse.add(bridle);
    return horse;
  }
  function render() {
    raf=0; if(!alive||document.hidden) return;
    const t=performance.now()*0.001;
    if(scene?.userData.carousel){const progress=opening?Math.min(1,(performance.now()-openingAt)/2100):0;scene.userData.carousel.rotation.y=t*(.22+progress*1.22);scene.userData.horses.forEach((h,i)=>{h.position.y=Math.sin(t*2.2+i*1.1)*.08;h.rotation.z=Math.sin(t*2.2+i*1.1)*.035;});scene.userData.bulbs.forEach((b,i)=>b.material.color.setHex((i+Math.floor(t*3))%6===0?0xfff5c5:0xe2b04a));camera.position.y=1.2+progress*.86;camera.position.z=8.3-progress*1.1;camera.lookAt(0,.2+progress*.35,0);}
    renderer?.render(scene,camera);frames++;
    if(startAt && performance.now()-startAt>2400){const fps=frames*1000/(performance.now()-startAt);if(fps<45){drop3d();return;}startAt=0;}
    raf=requestAnimationFrame(render);
  }
  function start(){alive=true;if(!raf&&!document.hidden)raf=requestAnimationFrame(render);}
  function stop(){alive=false;cancelAnimationFrame(raf);raf=0;}
  function drop3d(){stop();if(renderer){renderer.dispose();renderer=null;}canvas?.classList.remove('is-ready');document.documentElement.classList.add('is-fallback');}
  function build3d(){
    if(!canvas||window.Marhamat?.tier!=='full'||reduced()||!('WebGLRenderingContext'in window))return;
    const script=document.createElement('script');script.src='../shared/nikoh/vendor/three/three.bundle.min.js';
    script.onload=()=>{try{
      const T=window.THREE;if(!T)throw Error('Three unavailable');
      const gl=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'})||canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl)throw Error('WebGL unavailable');
      renderer=new T.WebGLRenderer({canvas,context:gl,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0x000000,0);
      scene=new T.Scene();camera=new T.PerspectiveCamera(35,1,.1,30);camera.position.set(0,1.2,8.3);camera.lookAt(0,.2,0);
      scene.add(new T.HemisphereLight(0xffedce,0x152154,2));const key=new T.DirectionalLight(0xffd987,2.1);key.position.set(3,5,4);scene.add(key);
      const carousel=new T.Group(), horses=[], bulbs=[];scene.add(carousel);scene.userData.carousel=carousel;scene.userData.horses=horses;scene.userData.bulbs=bulbs;
      const floor=new T.Mesh(new T.CylinderGeometry(2.5,2.5,.18,32),new T.MeshStandardMaterial({color:0x17377e,metalness:.45,roughness:.45}));floor.position.y=-.95;carousel.add(floor);
      const rim=new T.Mesh(new T.TorusGeometry(2.28,.075,8,48),new T.MeshStandardMaterial({color:0xe2b04a,metalness:.75,roughness:.25}));rim.rotation.x=Math.PI/2;rim.position.y=-.79;carousel.add(rim);
      for(let i=0;i<6;i++){const a=i*Math.PI/3,h=buildHorse(T);h.position.set(Math.sin(a)*1.65,0,Math.cos(a)*1.65);h.rotation.y=a+Math.PI/2;carousel.add(h);horses.push(h);const bulb=new T.Mesh(new T.SphereGeometry(.065,8,6),new T.MeshBasicMaterial({color:0xffdf8a}));bulb.position.set(Math.sin(a)*2.22,-.48,Math.cos(a)*2.22);carousel.add(bulb);bulbs.push(bulb);}
      const canopy=new T.Mesh(new T.ConeGeometry(2.5,.9,6),new T.MeshStandardMaterial({color:0xc2185b,metalness:.16,roughness:.58,side:T.DoubleSide}));canopy.position.y=1.35;carousel.add(canopy);
      const finial=new T.Mesh(new T.SphereGeometry(.16,10,8),new T.MeshStandardMaterial({color:0xe2b04a,metalness:.75}));finial.position.y=1.88;carousel.add(finial);
      const pole=new T.Mesh(new T.CylinderGeometry(.07,.12,2.8,10),new T.MeshStandardMaterial({color:0xd5a544,metalness:.78,roughness:.3}));pole.position.y=.15;carousel.add(pole);
      function resize(){if(!renderer)return;const box=canvas.getBoundingClientRect(),w=Math.max(1,box.width),h=Math.max(1,box.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}resize();addEventListener('resize',resize,{passive:true});
      canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();drop3d();},{once:true});canvas.classList.add('is-ready');startAt=performance.now();frames=0;start();
    }catch(_){drop3d();}};script.onerror=drop3d;document.head.append(script);
  }
  function beginOpen(){if(opened)return;if(opening){finish();return;}opening=true;openingAt=performance.now();window.Marhamat?.open?.();intro.classList.add('opening');document.body.classList.add('is-opening');if(reduced()){finish();return;}const duration=window.Marhamat?.tier==='lite'?1000:2300;setTimeout(finish,duration);}
  function finish(){if(opened)return;opened=true;opening=false;intro.classList.add('is-gone');document.documentElement.classList.remove('is-locked');document.body.classList.add('is-open');window.scrollTo({top:0,behavior:'instant'});}
  openButton?.addEventListener('click',e=>{e.stopPropagation();beginOpen();});intro?.addEventListener('click',()=>{if(opening)finish();});

  function motions(){
    const sections=$$('[data-section]');const seen=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(!isIntersecting)return;target.classList.add('is-seen');if(target.id==='dresscode')target.classList.add('dc-in');if(target.id==='rsvp')target.classList.add('rsvp-in');}),{threshold:.16});sections.forEach(s=>seen.observe(s));
    if(!window.gsap||!window.ScrollTrigger||reduced())return;gsap.registerPlugin(ScrollTrigger);
    const tweenIfPresent=(selector,vars)=>{const targets=$$(selector);if(targets.length)gsap.to(targets,vars);};
    tweenIfPresent('.hero__art',{yPercent:13,scale:1.05,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.7}});
    tweenIfPresent('.calendar-medallion',{rotateY:9,rotateX:-4,y:-18,ease:'none',scrollTrigger:{trigger:'#date',start:'top bottom',end:'center center',scrub:true}});
    tweenIfPresent('.program-track',{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'#program',start:'top 75%',end:'bottom 45%',scrub:.7}});
    tweenIfPresent('.program-ride span',{x:300,ease:'none',scrollTrigger:{trigger:'#program',start:'top 75%',end:'bottom 45%',scrub:.7}});
    tweenIfPresent('.venue__frame',{rotateY:5,y:-12,ease:'none',scrollTrigger:{trigger:'#venue',start:'top bottom',end:'center center',scrub:true}});
    tweenIfPresent('.dresscode__palette li',{rotateY:0,y:0,stagger:.08,ease:'none',scrollTrigger:{trigger:'#dresscode',start:'top bottom',end:'center center',scrub:true}});
    tweenIfPresent('.gallery__item',{rotateY:0,y:-5,stagger:.08,ease:'none',scrollTrigger:{trigger:'#gallery',start:'top bottom',end:'center center',scrub:true}});
    tweenIfPresent('.gift__chest',{rotateY:18,scale:1.08,ease:'none',scrollTrigger:{trigger:'#toyona',start:'top bottom',end:'center center',scrub:true}});
    sections.forEach(s=>{const targets=Array.from(s.querySelectorAll('.eyebrow,.section__title'));if(!targets.length)return;gsap.fromTo(targets,{y:16,opacity:0},{y:0,opacity:1,duration:.75,stagger:.09,ease:'power3.out',scrollTrigger:{trigger:s,start:'top 78%',once:true}});});
  }
  // A discreet edge rider follows the guest's scroll and lifts at section transitions.
  function rider(){const horse=$('.horse-runner'),sections=$$('[data-section]');let last=scrollY,lastTime=performance.now(),busy=false,lastSection=-1;const step=()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{const now=performance.now(),delta=Math.abs(scrollY-last),speed=delta/Math.max(1,now-lastTime);last=scrollY;lastTime=now;const y=36+(scrollY%(innerHeight-100));horse.style.transform=`translate3d(0,${y}px,0)`;horse.classList.toggle('gallop',speed>.08);if(sectionsCrossed())horse.animate([{translate:'0 0'},{translate:'0 -17px'},{translate:'0 0'}],{duration:550,easing:'cubic-bezier(.2,.8,.25,1)'});busy=false;});};function sectionsCrossed(){const line=innerHeight*.68,index=sections.findIndex(section=>{const rect=section.getBoundingClientRect();return rect.top<=line&&rect.bottom>line;});if(index<0||index===lastSection)return false;const crossed=lastSection>=0;lastSection=index;return crossed;}addEventListener('scroll',step,{passive:true});step();}
  function translateA11y(){const dict={"Taklifnomani ochish":["Открыть приглашение","Open invitation"],"Taklifnomani ko‘rish":["Посмотреть приглашение","View invitation"],"To‘y kuni taqvimi":["Календарь праздника","Celebration calendar"],"To‘y manzili":["Место праздника","Celebration venue"],"Oldingi surat":["Предыдущее фото","Previous photo"],"Keyingi surat":["Следующее фото","Next photo"],"Suratlar galereyasi":["Галерея фотографий","Photo gallery"],"Suratni kattalashtirish":["Увеличить фото","Enlarge photo"],"Tashrif javobi":["Ответ о присутствии","Attendance response"],"Mehmonlar sonini kamaytirish":["Уменьшить число гостей","Decrease guest count"],"Mehmonlar sonini oshirish":["Увеличить число гостей","Increase guest count"]};const index=window.Marhamat?.lang==="ru"?0:window.Marhamat?.lang==="en"?1:-1;if(index<0)return;$$('[aria-label]').forEach(el=>{const value=dict[el.getAttribute('aria-label')];if(value)el.setAttribute('aria-label',value[index]);});document.title=index===0?"Чавандоз · Marxaba":"Chavandoz · Marxaba";$$('img[alt=\"To‘y manzili\"]').forEach(img=>img.alt=index===0?"Место праздника":"Celebration venue");}
  function init(){translateA11y();motions();rider();const audio=$('audio[data-music]'),musicButtons=$$('[data-music-toggle]');audio?.addEventListener('error',()=>{const hide=()=>musicButtons.forEach(button=>{button.hidden=true;button.setAttribute('aria-pressed','false');});hide();setTimeout(hide,180);},{once:true});if(!reduced()&&window.Marhamat?.tier==='full'){const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,280));idle(build3d,{timeout:1200});}if(reduced())document.documentElement.classList.add('is-fallback');
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(canvas?.classList.contains('is-ready'))start();});window.Marhamat?.on?.('tier',()=>{if(window.Marhamat.tier==='lite')drop3d();});
    window.Marhamat?.on?.('rsvp',answer=>{if(answer?.status==='yes'&&!reduced()){const section=$('#rsvp');section.classList.add('rsvp__celebrate');setTimeout(()=>section.classList.remove('rsvp__celebrate'),1800);}});
    if(window.gsap&&!reduced()){gsap.fromTo('.intro__greeting',{opacity:0,y:14},{opacity:1,y:0,duration:.7,ease:'power3.out',delay:.15});gsap.fromTo('.open-button',{opacity:0,y:14},{opacity:1,y:0,duration:.6,ease:'back.out(1.15)',delay:.8});}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
