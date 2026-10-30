/* Bog‘i Eram: the guest knocks, the carved gate of the paradise garden swings open and the camera walks
   through into a living morning garden; the invitation ends in the same garden at dusk. */
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const app=window.Marhamat; if(!app)return;
  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n)), rand=(a,b)=>a+Math.random()*(b-a), lerp=(a,b,t)=>a+(b-a)*t;
  const ease={inOut:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,out:t=>1-Math.pow(1-t,3),in:t=>t*t*t,sine:t=>-(Math.cos(Math.PI*t)-1)/2};
  const reduced=()=>!!app.reducedMotion, lite=()=>app.tier==='lite';
  // Measured on the exported paintings (fractions of the image). The doorway box also lives in template.css.
  const ART={
    // the court painting (source px of art/src/generated/garden-court-clean.png, 1024×1536)
    court:{w:1024,h:1536,posY:.5,doveH:58,
      jet:{x:565,y:828,top:750},
      tiers:[{cx:565,cy:832,rx:76,ry:13,drop:70,n:14},{cx:565,cy:911,rx:116,ry:18,drop:86,n:20},{cx:562,cy:1016,rx:188,ry:24,drop:90,n:28}],
      basin:[[295,1058],[835,1058],[885,1115],[870,1172],[205,1172],[180,1115]],basinTop:1058,basinBottom:1172,
      bowl:{cx:565,cy:1048,rx:150,ry:72},
      glows:[{x:470,y:654,r:34},{x:524,y:662,r:30},{x:654,y:624,r:34},{x:676,y:700,r:30},{x:160,y:1106,r:30},{x:324,y:1146,r:28},{x:810,y:1146,r:28},{x:920,y:1106,r:30},{x:814,y:1290,r:32}],
      doves:[{x:300,y:1063,s:.84,dir:1},{x:292,y:1153,s:1,dir:1},{x:796,y:1172,s:1,dir:-1},{x:812,y:1063,s:.84,dir:-1}]},
    petals:{cells:6,cellW:755/6,cellH:126}
  };

  function canvasSize(canvas,cap=2){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,cap);canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));const c=canvas.getContext('2d');c.setTransform(d,0,0,d,0,0);return{c,w:r.width,h:r.height,d};}
  function coverFit(w,h,iw,ih,posY=.5){const s=Math.max(w/iw,h/ih);return{s,ox:(w-iw*s)/2,oy:(h-ih*s)*posY};}
  const petalSheet=new Image();petalSheet.src='art/petals.webp';
  function drawPetal(c,p){c.save();c.translate(p.x,p.y);c.rotate(p.rot);c.scale(.5+Math.abs(Math.sin(p.flip))*.5,1);c.globalAlpha=p.alpha;
    if(petalSheet.complete&&petalSheet.naturalWidth){const cw=ART.petals.cellW;c.drawImage(petalSheet,p.cell*cw,0,cw,ART.petals.cellH,-p.size,-p.size*.72,p.size*2,p.size*1.45);}
    else{c.fillStyle='#e7a3a8';c.beginPath();c.ellipse(0,0,p.size*.6,p.size,0,0,Math.PI*2);c.fill();}c.restore();}
  // A loop that only runs while its element is on screen and the tab is visible.
  function visibleLoop(el,frame){let raf=0,on=false,last=0;const run=now=>{if(!on||document.hidden){raf=0;return}const dt=Math.min(.05,(now-(last||now))/1000);last=now;frame(now/1000,dt);raf=requestAnimationFrame(run)};
    const kick=()=>{if(on&&!document.hidden&&!raf){last=0;raf=requestAnimationFrame(run)}};
    new IntersectionObserver(es=>{on=es[0].isIntersecting;kick()}).observe(el);document.addEventListener('visibilitychange',kick);return kick;}

  /* ── sound: two soft knocks on wood, then a bright chime as the light comes in ── */
  function gateSound(){let ctx;try{ctx=new(window.AudioContext||window.webkitAudioContext)();ctx.resume()}catch(_){return{knock(){},chime(){}}}
    const knock=at=>{const t=ctx.currentTime+at,o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type='triangle';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(62,t+.16);f.type='lowpass';f.frequency.value=700;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.42,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+.22);o.connect(f).connect(g).connect(ctx.destination);o.start(t);o.stop(t+.25);
      const n=ctx.createBufferSource(),b=ctx.createBuffer(1,ctx.sampleRate*.06,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,4);n.buffer=b;const ng=ctx.createGain(),nf=ctx.createBiquadFilter();nf.type='bandpass';nf.frequency.value=1100;ng.gain.value=.16;n.connect(nf).connect(ng).connect(ctx.destination);n.start(t)};
    const chime=at=>{[784,988,1175,1568].forEach((fr,i)=>{const t=ctx.currentTime+at+i*.13,o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=fr;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.05,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+1.8);o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+1.9)})};
    return{knock,chime};}

  function init(){
    const data=app.data;
    {const couple=[data.groom,data.bride].filter(Boolean).join(' & '),copy=({uz:{title:'Bog‘i Eram taklifnomasi',description:'Bog‘i Eram — jannat bog‘i darvozasi ortidagi nafis taklifnoma'},'uz-Cyrl':{title:'Боғи Эрам таклифномаси',description:'Боғи Эрам — жаннат боғи дарвозаси ортидаги нафис таклифнома'},ru:{title:'приглашение Bog‘i Eram',description:'Приглашение в цветущем саду за резными воротами'},en:{title:'Bog‘i Eram invitation',description:'An elegant invitation in a flowering garden beyond carved gates'}})[app.lang]||{title:'Bog‘i Eram invitation',description:'An elegant invitation in a flowering garden beyond carved gates'},title=couple?`${couple} — ${copy.title}`:copy.title;document.title=title;const meta=$('meta[name="description"]');if(meta)meta.content=[couple,copy.description].filter(Boolean).join(' · ');const ogTitle=$('meta[property="og:title"]');if(ogTitle)ogTitle.content=title;const ogDescription=$('meta[property="og:description"]');if(ogDescription)ogDescription.content=[couple,copy.description].filter(Boolean).join(' · ');if(data.rsvp?.enabled===false)$('#rsvp').hidden=true;if(data.toyona?.enabled===false)$('#toyona').hidden=true;}
    // Russian months come in the genitive ("ноября"); alone with the year they need the nominative ("ноябрь 2026").
    const nom=app.t('monthsNom');if(Array.isArray(nom)&&data.date?.monthNumber){const m=$('.date__month');if(m)m.textContent=`${nom[data.date.monthNumber-1]} ${data.date.year}`;}
    $$('.arch-card > :not(.orn-star)').forEach((el,i)=>{el.classList.add('reveal-line');el.style.transitionDelay=`${.12+i*.11}s`});
    setupGate();setupInteractions();setupDateFlecks();setupCountdownTicks();setupLanterns();setupScroll();
  }

  /* ── The gate ─────────────────────────────────────────────────────────── */
  function setupGate(){
    const reduce=reduced(),intro=$('#intro'),scene=$('.gate__scene'),beyond=$('.gate__beyond'),doorL=$('.gate__door--l'),doorR=$('.gate__door--r'),light=$('.gate__light'),flare=$('.gate__flare'),portal=$('.gate__portal'),skip=$('#skip-intro'),knockBtn=$('#gate-knock'),canvas=$('.intro__petals'),hero=$('#hero');
    let opening=false,finished=false,raf=0;
    function place(){if(opening)return;const r=intro.getBoundingClientRect(),s=scene.getBoundingClientRect(),x=s.left-r.left+s.width*.5,y=s.top-r.top+s.height*.603;beyond.style.setProperty('--door-x',`${x}px`);beyond.style.setProperty('--door-y',`${y}px`);}
    place();addEventListener('resize',place,{passive:true});
    const start=e=>{if(finished)return;if(opening){if(e&&!e.target.closest?.('#skip-intro'))return;return}if(e?.button>0)return;open()};
    knockBtn.addEventListener('click',e=>{e.stopPropagation();start(e)});
    intro.addEventListener('click',e=>{if(e.target.closest('#skip-intro'))return;start(e)});
    skip.addEventListener('click',e=>{e.stopPropagation();finish(true)});

    function open(){
      opening=true;app.open();intro.classList.add('is-opening','is-knock');skip.hidden=false;
      if(reduce){intro.style.transition='opacity .5s';setTimeout(()=>finish(true),60);return}
      const snd=gateSound();snd.knock(0);snd.knock(.32);snd.chime(1.25);try{navigator.vibrate?.([18,140,18])}catch(_){}
      const r=intro.getBoundingClientRect(),{c,w,h}=canvasSize(canvas,lite()?1.5:2),door=$('.gate__doorway').getBoundingClientRect(),cx=door.left-r.left+door.width/2,cy=door.top-r.top+door.height*.55;
      const petals=[],maxPetals=lite()?70:150;let spawned=0,chimed=false;
      const t0=performance.now();
      const frame=now=>{if(finished)return;const t=(now-t0)/1000;
        const d=ease.inOut(clamp((t-.62)/2.4,0,1));
        doorL.style.transform=`rotateY(${d*86}deg)`;doorR.style.transform=`rotateY(${-d*86}deg)`;
        const shade=`brightness(${1-d*.38})`;doorL.style.filter=doorR.style.filter=shade;
        light.style.opacity=clamp((t-.7)/.9,0,1);
        const f=clamp((t-.9)/1.6,0,1);flare.style.opacity=Math.sin(Math.min(1,f)*Math.PI*.5)*(1-clamp((t-3.1)/.9,0,1))*.7;flare.style.transform=`translate(-50%,-50%) scale(${.2+ease.out(f)*1.5})`;
        const q=ease.inOut(clamp((t-1.75)/2.45,0,1));
        scene.style.transform=`translate(-50%,-50%) scale(${1+Math.pow(q,1.25)*2.9})`;
        beyond.style.transform=`scale(${lerp(.6,1,ease.out(q))})`;
        portal.style.opacity=doorL.style.opacity=doorR.style.opacity=1-clamp((t-3.55)/.6,0,1);
        if(t>.95&&t<3.4&&spawned<maxPetals){const n=Math.min(maxPetals-spawned,lite()?1:2);for(let i=0;i<n;i++,spawned++)petals.push({wx:rand(-.42,.42)*door.width,wy:rand(-.45,.4)*door.height,z:rand(1.15,1.6),vz:rand(.32,.55),drift:rand(-30,30),rot:rand(0,6.3),vr:rand(-3,3),flip:rand(0,6.3),cell:Math.random()*ART.petals.cells|0,base:rand(4.2,6.4),alpha:0})}
        c.clearRect(0,0,w,h);const dolly=1+Math.pow(q,1.25)*2.9;
        for(let i=petals.length-1;i>=0;i--){const p=petals[i];p.z-=p.vz*(1/60)*(1+q*1.6);p.rot+=p.vr/60;p.flip+=.09;p.wy+=.35;p.wx+=Math.sin(t*2+p.rot)*.4+p.drift/60;
          if(p.z<.16){petals.splice(i,1);continue}const k=1/p.z;p.x=cx+p.wx*k*dolly*.55;p.y=cy+p.wy*k*dolly*.55;p.size=p.base*k;p.alpha=Math.min(.95,(1.6-p.z)*2)*clamp((p.z-.16)*4,0,1);drawPetal(c,p)}
        if(!chimed&&t>1.2){chimed=true;try{navigator.vibrate?.(10)}catch(_){}}
        if(t<4.15)raf=requestAnimationFrame(frame);else finish(false,()=>{const left=petals.slice();fadePetals(c,w,h,left)})};
      raf=requestAnimationFrame(frame);
    }
    function fadePetals(c,w,h,list){const s=performance.now();const step=now=>{const k=clamp((now-s)/900,0,1);c.clearRect(0,0,w,h);list.forEach(p=>{p.y+=1.2;p.x+=Math.sin(now/300+p.rot);p.alpha*=.96;drawPetal(c,p)});if(k<1)requestAnimationFrame(step);else c.clearRect(0,0,w,h)};requestAnimationFrame(step)}
    function finish(instant,after){if(finished)return;finished=true;cancelAnimationFrame(raf);app.open();skip.hidden=true;intro.setAttribute('aria-hidden','true');document.documentElement.classList.remove('is-locked');document.body.classList.add('is-open');
      if(!reduce)hero.classList.add('is-writing');intro.classList.add('is-gone');after?.();setTimeout(()=>{intro.hidden=true},instant?500:950);
      startHero();startAmbient();requestAnimationFrame(()=>window.ScrollTrigger?.refresh());}
  }

  /* ── Hero: water, fountains, motes, a bird ─────────────────────────────── */
  let heroStarted=false;
  function startHero(){if(heroStarted)return;heroStarted=true;startFountain($('.hero__water'),$('.hero__painting'),$('.hero__garden'),{doves:true});startFountain($('.finale__water'),$('.finale__painting'),$('.finale__garden'),{doves:false,warm:true});if(!reduced())startMotes($('.hero__motes'));}
  /* The fountain and its doves, drawn over the painting in the painting's own coordinates (1024×1536 source px).
     Water: a rising jet, three curtains falling tier to tier with flowing highlights, splashes, mist and a
     rippling basin that redraws the painted water row by row. Doves: perch, peck, drink, preen, turn, hop,
     and now and then fly off over the garden and glide back to land. */
  function startFountain(canvas,img,garden,opt){
    if(!canvas||!img)return;
    const C=ART.court,still=reduced(),few=lite();let ctx,W,H,fit,k=1;
    const doveSheet=new Image();doveSheet.src='art/doves.webp';
    const P=(x,y)=>[fit.ox+x*fit.s,fit.oy+y*fit.s];
    const resize=()=>{const r=canvasSize(canvas,few?1.25:1.75);ctx=r.c;W=r.w;H=r.h;fit=coverFit(W,H,C.w,C.h,C.posY);k=(img.naturalWidth||800)/C.w};
    const ready=()=>img.complete&&img.naturalWidth;
    if(!ready())img.addEventListener('load',resize,{once:true});resize();addEventListener('resize',resize,{passive:true});
    // streams: front half of every tier rim, falling outward to the level below
    const streams=[];C.tiers.forEach((t,ti)=>{const n=Math.round(t.n*(few?.6:1));for(let i=0;i<n;i++){const a=Math.PI*(.03+.94*i/(n-1)),x0=t.cx+t.rx*Math.cos(a),y0=t.cy+t.ry*Math.sin(a),out=1.07+.03*Math.random();streams.push({ti,x0,y0,x1:t.cx+t.rx*out*Math.cos(a),y1:y0+t.drop*(.92+.12*Math.random()),ph:Math.random()*40,sp:rand(120,170),w:rand(.7,1.25),front:Math.sin(a)})}});
    const drops=[],rings=[];let mistT=0;
    const ripple=(x,y,big)=>rings.push({x,y,t:0,r:big?26:rand(6,12),life:big?1.6:rand(.7,1.1)});
    garden.addEventListener('pointerdown',e=>{const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left-fit.ox)/fit.s,y=(e.clientY-r.top-fit.oy)/fit.s;if(inPoly(C.basin,x,y))ripple(x,y,true)});
    if(opt.doves)$('.hero__scene').style.pointerEvents='auto';else garden.style.pointerEvents='auto';
    function inPoly(p,x,y){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const[xi,yi]=p[i],[xj,yj]=p[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c}
    // doves
    const doves=(opt.doves?C.doves:[]).map((d,i)=>({...d,home:{x:d.x,y:d.y},state:i===0||i===3?'away':'idle',frame:0,t:0,next:rand(1,3),dir:d.dir,fly:null,hop:0,arrive:i===0?1.2:i===3?2.4:0}));
    function setState(d,s,dur){d.state=s;d.t=0;d.next=dur}
    function planFlight(d,leaving){const s=d.home,side=d.home.x<C.w/2?-1:1,far={x:s.x+side*rand(520,700),y:s.y-rand(520,760)};
      d.fly=leaving?{a:{x:s.x,y:s.y-10},b:{x:s.x+side*120,y:s.y-260},c:far,dur:rand(2.2,2.8),leaving:true}:{a:{x:s.x-side*rand(560,720),y:s.y-rand(560,780)},b:{x:s.x-side*160,y:s.y-180},c:{x:s.x,y:s.y-6},dur:rand(2.6,3.2),leaving:false};d.dir=leaving?side:-side;d.t=0}
    const bez=(f,t)=>{const u=1-t;return{x:u*u*f.a.x+2*u*t*f.b.x+t*t*f.c.x,y:u*u*f.a.y+2*u*t*f.b.y+t*t*f.c.y}};
    let flightAt=rand(9,14);
    function updateDove(d,dt,clock){d.t+=dt;
      if(d.state==='away'){if(d.arrive&&clock>d.arrive){d.arrive=0;planFlight(d,false);d.state='fly'}else if(!d.arrive&&d.t>d.next){planFlight(d,false);d.state='fly'}return}
      if(d.state==='fly'){const f=d.fly,q=clamp(d.t/f.dur,0,1),e=f.leaving?ease.in(q)*.6+q*.4:1-Math.pow(1-q,2.2),p=bez(f,e);d.x=p.x;d.y=p.y;
        const flap=f.leaving||q<.72;d.frame=flap?4+Math.floor(clock*13+(d.home.x%7))%3:(q<.93?7:3);d.scaleFly=f.leaving?1+q*.5:1.5-q*.5;
        if(q>=1){if(f.leaving){setState(d,'away',rand(2.5,5));}else{d.x=d.home.x;d.y=d.home.y;d.scaleFly=1;setState(d,'land',.35);ripple(d.home.x+d.dir*30,d.home.y+14,false)}}return}
      if(d.state==='land'){d.frame=3;if(d.t>d.next)setState(d,'idle',rand(.8,2));return}
      if(d.state==='takeoff'){d.frame=3;d.y=d.home.y-Math.min(1,d.t/.3)*4;if(d.t>.32){planFlight(d,true);d.state='fly'}return}
      if(d.state==='drink'){d.frame=d.t%1.1<.75?1:0;if(d.t>.6&&d.t%1.1<.05)ripple(d.home.x+d.dir*-34,d.home.y+12,false)}
      else if(d.state==='peck'){d.frame=Math.floor(d.t*5)%2?1:0}
      else if(d.state==='preen'){d.frame=2}
      else d.frame=0;
      if(d.hop){const q=clamp(d.t/.28,0,1);d.x=d.hopFrom+d.hop*q;d.y=d.home.y-Math.sin(q*Math.PI)*6;if(q>=1){d.home.x=d.x;d.hop=0;d.y=d.home.y}}
      if(d.t>d.next){const r=Math.random();
        if(r<.3)setState(d,'drink',rand(1.8,3.2));else if(r<.5)setState(d,'peck',rand(.8,1.6));else if(r<.68)setState(d,'preen',rand(1.4,2.6));
        else if(r<.8){d.dir*=-1;setState(d,'idle',rand(1,2.2))}
        else{const lim=d.hx||d.home.x;d.hopFrom=d.x;d.hop=clamp(d.x+rand(-18,18),d.minX,d.maxX)-d.x;setState(d,'idle',rand(1,2))}}}
    doves.forEach(d=>{d.x=d.home.x;d.y=d.home.y;d.minX=d.home.x-26;d.maxX=d.home.x+26;d.scaleFly=1;if(d.state==='away')d.y=-200});
    function drawDove(d){if(!doveSheet.complete||!doveSheet.naturalWidth||d.state==='away')return;const[x,y]=P(d.x,d.y),sc=C.doveH*d.s*fit.s/70*(d.scaleFly||1);
      if(d.state!=='fly'){ctx.save();ctx.globalAlpha=.22;ctx.fillStyle='#3b2c25';ctx.beginPath();ctx.ellipse(x,y+1,22*sc,4*sc,0,0,6.29);ctx.fill();ctx.restore()}
      ctx.save();ctx.translate(x,y);ctx.scale(d.dir>0?-1:1,1);ctx.drawImage(doveSheet,d.frame*128,0,128,128,-64*sc,-116*sc,128*sc,128*sc);ctx.restore()}
    function draw(t,dt){if(!ready()||!ctx)return;ctx.clearRect(0,0,W,H);const s=fit.s;
      // basin: painted water redrawn with a moving ripple (the bowl and pedestal are left untouched)
      ctx.save();ctx.beginPath();C.basin.forEach(([x,y],i)=>{const[px,py]=P(x,y);i?ctx.lineTo(px,py):ctx.moveTo(px,py)});ctx.closePath();const[bx,by]=P(C.bowl.cx,C.bowl.cy);ctx.ellipse(bx,by,C.bowl.rx*s,C.bowl.ry*s,0,0,6.29);ctx.clip('evenodd');
      const top=P(0,C.basinTop)[1],bot=P(0,C.basinBottom)[1],band=few?3:2;
      for(let y=top;y<bot;y+=band){const sy=(y-fit.oy)/s,f=(sy-C.basinTop)/(C.basinBottom-C.basinTop),amp=(.5+1.4*f)*s*1.6;const dx=still?0:Math.sin(sy*.21+t*3.1)*amp+Math.sin(sy*.07-t*1.7)*amp*.6;ctx.drawImage(img,0,sy*k,C.w*k,band/s*k,fit.ox+dx,y,C.w*s,band+.6)}
      ctx.globalCompositeOperation='lighter';
      for(const r of rings){const q=r.t/r.life,[x,y]=P(r.x,r.y),rad=(r.r+q*r.r*3)*s;ctx.globalAlpha=(1-q)*.5;ctx.strokeStyle='#fffaf0';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,rad,rad*.3,0,0,6.29);ctx.stroke();if(q>.25){ctx.globalAlpha=(1-q)*.25;ctx.beginPath();ctx.ellipse(x,y,rad*.6,rad*.18,0,0,6.29);ctx.stroke()}}
      for(let i=0;i<(few?6:12);i++){const gx=C.basin[0][0]+((i*97.3)%1)*0+((i*137)%(C.basin[2][0]-C.basin[5][0]))+C.basin[5][0],gy=C.basinTop+20+((i*53)%(C.basinBottom-C.basinTop-28)),a=Math.pow(Math.max(0,Math.sin(t*1.3+i*1.7)),10);if(a<.03)continue;const[x,y]=P(gx,gy);ctx.globalAlpha=a*.9;ctx.fillStyle='#fffbe8';ctx.beginPath();ctx.ellipse(x,y,3.4*s,.8*s,0,0,6.29);ctx.fill()}
      ctx.restore();
      // falling curtains
      ctx.save();ctx.lineCap='round';
      for(const st of streams){const t0=C.tiers[st.ti],[x0,y0]=P(st.x0,st.y0),[x1,y1]=P(st.x1,st.y1),cx=x0+(x1-x0)*1.05,cy=y0+(y1-y0)*.12;
        ctx.globalAlpha=.16+.12*st.front;ctx.strokeStyle=opt.warm?'#ffe9c4':'#f4fbff';ctx.lineWidth=st.w*1.5*s;ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(cx,cy,x1,y1);ctx.stroke();
        if(!still){ctx.globalAlpha=.55+.3*st.front;ctx.strokeStyle=opt.warm?'#fff3d6':'#ffffff';ctx.lineWidth=st.w*1.1*s;ctx.setLineDash([7*s,11*s,3*s,15*s]);ctx.lineDashOffset=-(t*st.sp+st.ph)*s;ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(cx,cy,x1,y1);ctx.stroke()}}
      ctx.setLineDash([]);ctx.restore();
      if(!still){
        // splashes where curtains land, and the jet
        for(const st of streams)if(Math.random()<dt*(few?2.2:4.5))for(let j=0;j<2;j++)drops.push({x:st.x1+rand(-2,2),y:st.y1,vx:rand(-26,26),vy:-rand(30,80),g:520,r:rand(.6,1.2),life:0,floor:st.y1+2,max:.45});
        for(let j=0;j<(few?3:6)*dt*60/6+Math.random()-.4;j++){const v=Math.sqrt(2*900*(C.jet.y-C.jet.top))*rand(.9,1.03);drops.push({x:C.jet.x+rand(-1.5,1.5),y:C.jet.y,vx:rand(-22,22),vy:-v,g:900,r:rand(.8,1.6),life:0,floor:C.jet.y+4,max:2})}
        ctx.save();ctx.globalCompositeOperation='lighter';
        const[jx,jy]=P(C.jet.x,C.jet.y),[,jt]=P(0,C.jet.top+8),col=ctx.createLinearGradient(jx,jt,jx,jy);col.addColorStop(0,'rgba(255,255,255,.05)');col.addColorStop(.4,'rgba(255,255,255,.55)');col.addColorStop(1,'rgba(240,250,255,.25)');ctx.strokeStyle=col;ctx.lineWidth=(2.6+Math.sin(t*9)*.4)*s;ctx.beginPath();ctx.moveTo(jx,jy);ctx.lineTo(jx+Math.sin(t*2.3)*.6*s,jt);ctx.stroke();
        for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.vy+=d.g*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.life+=dt;if((d.vy>0&&d.y>d.floor)||d.life>d.max){if(d.max>1&&Math.random()<.25)ripple(d.x,C.tiers[0].cy+4,false);drops.splice(i,1);continue}const[x,y]=P(d.x,d.y);ctx.globalAlpha=.7*(1-d.life/d.max*.6);ctx.fillStyle=opt.warm?'#ffeccc':'#f6fcff';ctx.beginPath();ctx.arc(x,y,d.r*s*1.4,0,6.29);ctx.fill()}
        if(drops.length>1400)drops.splice(0,drops.length-1400);
        // mist rising from the basin
        mistT+=dt;C.tiers.forEach((tr,i)=>{const[mx,my]=P(tr.cx,tr.cy+tr.drop+tr.ry*.6),g=ctx.createRadialGradient(mx,my,0,mx,my,tr.rx*1.2*s);g.addColorStop(0,`rgba(255,255,255,${.08+.03*Math.sin(mistT*1.7+i)})`);g.addColorStop(1,'rgba(255,255,255,0)');ctx.globalAlpha=1;ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(mx,my,tr.rx*1.3*s,tr.ry*2.4*s,0,0,6.29);ctx.fill()});
        ctx.restore();
        for(let i=rings.length-1;i>=0;i--){rings[i].t+=dt;if(rings[i].t>rings[i].life)rings.splice(i,1)}
        if(Math.random()<dt*(few?3:6)){const st=streams[(Math.random()*streams.length)|0];if(st.ti===2)ripple(st.x1,st.y1+3,false)}
      }
      if(opt.warm){ctx.save();ctx.globalCompositeOperation='lighter';C.glows.forEach((g,i)=>{const[x,y]=P(g.x,g.y),fl=.75+.25*Math.sin(t*(7+i)+i*2)*Math.sin(t*3.1+i),r=g.r*s*(still?1:fl+.15),gr=ctx.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(255,226,160,${.55*fl})`);gr.addColorStop(.35,`rgba(255,180,90,${.22*fl})`);gr.addColorStop(1,'rgba(255,170,80,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x,y,r,0,6.29);ctx.fill()});ctx.restore()}
      // doves
      const clock=t-start;flightAt-=dt;
      if(!still){if(flightAt<=0){const d=doves.filter(d=>d.state==='idle'||d.state==='peck'||d.state==='preen')[(Math.random()*4)|0];if(d){setState(d,'takeoff',.32)}flightAt=rand(10,16)}doves.forEach(d=>updateDove(d,dt,clock))}
      doves.slice().sort((a,b)=>a.y-b.y).forEach(drawDove);
    }
    let start=performance.now()/1000;
    if(still){const once=()=>{if(!ready()||!doveSheet.complete){setTimeout(once,200);return}doves.forEach(d=>{d.state='idle';d.x=d.home.x;d.y=d.home.y});draw(0,0)};once();addEventListener('resize',()=>draw(0,0));return}
    visibleLoop(canvas,(t,dt)=>{if(start>t)start=t;draw(t,dt)})();
  }
  function startMotes(canvas){if(!canvas)return;const{c,w,h}=canvasSize(canvas,lite()?1.5:2),arr=Array.from({length:lite()?8:18},()=>({x:Math.random()*w,y:h*rand(.3,.9),r:rand(1,2.6),p:rand(0,6),v:rand(.3,1.2)}));
    const bird=new Image();if(!lite())bird.src='art/bird-sprite.webp';let birdAt=performance.now()/1000+rand(3,6),birdStart=0;
    visibleLoop(canvas,(t,dt)=>{c.clearRect(0,0,w,h);arr.forEach(p=>{p.p+=dt*p.v;p.y-=dt*1.6;if(p.y<h*.25){p.y=h*.9;p.x=Math.random()*w}const a=.25+.65*(.5+.5*Math.sin(p.p*2));c.beginPath();c.fillStyle=`rgba(255,247,225,${a*.55})`;c.shadowColor='#fff4cf';c.shadowBlur=8;c.arc(p.x+Math.sin(p.p)*9,p.y,p.r,0,Math.PI*2);c.fill()});c.shadowBlur=0;
      if(bird.complete&&bird.naturalWidth&&t>=birdAt){if(!birdStart)birdStart=t;const p=clamp((t-birdStart)/7.5,0,1),frame=Math.floor((t-birdStart)/.13)%4;c.drawImage(bird,frame*128,0,128,116,-50+(w+100)*p,h*.38+Math.sin(p*Math.PI*2)*22-p*40,46,42);if(p>=1){birdStart=0;birdAt=t+rand(12,20)}}})();}
  function startAmbient(){const canvas=$('.ambient-petals');if(reduced()||!canvas)return;const{c,w,h}=canvasSize(canvas,lite()?1.5:2);
    const items=Array.from({length:lite()?8:16},()=>({x:Math.random()*w,y:Math.random()*h,vy:rand(16,38),rot:rand(0,6.28),vr:rand(-.5,.5),flip:rand(0,6),phase:rand(0,6),size:rand(5,9),cell:Math.random()*6|0,alpha:.55}));canvas.classList.add('is-on');
    visibleLoop($('.page'),(t,dt)=>{c.clearRect(0,0,w,h);items.forEach(p=>{p.y+=p.vy*dt;p.phase+=dt;p.rot+=p.vr*dt;p.flip+=dt*1.6;if(p.y>h+20){p.y=-20;p.x=Math.random()*w}const x=p.x;p.x=x+Math.sin(p.phase)*14;drawPetal(c,p);p.x=x})})();}

  /* ── Sections ─────────────────────────────────────────────────────────── */
  function setupLanterns(){
    const canvas=$('.finale__sky');if(!canvas||reduced())return;let ctx,w,h;const size=()=>{const r=canvasSize(canvas,lite()?1.5:2);ctx=r.c;w=r.w;h=r.h};
    const flies=Array.from({length:lite()?8:16},()=>({x:Math.random(),y:rand(.45,.9),r:rand(1,2.4),p:rand(0,6),v:rand(.3,1)})),sparks=[],rockets=[];let next=1.2,clock=0,started=false;
    const palette=['255,226,160','255,205,190','255,244,214','244,190,120'];
    const kick=visibleLoop(canvas,(t,dt)=>{if(!started){started=true;size()}clock+=dt;ctx.clearRect(0,0,w,h);ctx.save();ctx.globalCompositeOperation='lighter';
      flies.forEach(f=>{f.p+=dt*f.v;f.y-=dt*.012;if(f.y<.4)f.y=.9;const a=.3+.7*(.5+.5*Math.sin(f.p*2.3));ctx.fillStyle=`rgba(255,224,154,${a*.8})`;ctx.shadowColor='#ffe39a';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(f.x*w+Math.sin(f.p)*10,f.y*h,f.r,0,6.29);ctx.fill()});ctx.shadowBlur=0;
      if(clock>next){next=clock+rand(2.2,3.8);const x=rand(.22,.78)*w;rockets.push({x,y:h*.5,tx:x+rand(-20,20),ty:h*rand(.1,.26),t:0})}
      for(let i=rockets.length-1;i>=0;i--){const r=rockets[i];r.t+=dt/1.1;const e=ease.out(Math.min(1,r.t)),x=lerp(r.x,r.tx,e),y=lerp(r.y,r.ty,e);ctx.fillStyle=`rgba(255,230,180,${.8*(1-e*.4)})`;ctx.beginPath();ctx.arc(x,y,1.4,0,6.29);ctx.fill();
        if(r.t>=1){rockets.splice(i,1);const col=palette[Math.random()*palette.length|0],n=lite()?34:64;for(let k=0;k<n;k++){const a=k/n*6.283+rand(-.05,.05),v=rand(38,74);sparks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1,col,trail:[]})}}}
      for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.vx*=.985;s.vy=s.vy*.985+26*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt/2.1;if(s.life<=0){sparks.splice(i,1);continue}ctx.fillStyle=`rgba(${s.col},${Math.pow(s.life,1.5)*.9})`;ctx.beginPath();ctx.arc(s.x,s.y,1.3*s.life+.4,0,6.29);ctx.fill()}
      ctx.restore()});addEventListener('resize',()=>{if(started)size()},{passive:true});}
  function setupInteractions(){
    const toggle=$('[data-map-toggle]'),map=$('.venue__map'),lat=Number(app.data.venue?.lat),lng=Number(app.data.venue?.lng);
    if(toggle&&map&&Number.isFinite(lat)&&Number.isFinite(lng)&&lat&&lng){toggle.hidden=false;toggle.addEventListener('click',()=>{if(!map.firstChild){const f=document.createElement('iframe');f.title=app.data.venue.name||'Map';f.loading='lazy';f.referrerPolicy='no-referrer';f.src=`/maps/venue?latitude=${lat}&longitude=${lng}`;map.append(f)}map.hidden=!map.hidden;const text=app.lang==='ru'?(map.hidden?'Показать карту здесь':'Скрыть карту'):app.lang==='en'?(map.hidden?'Show the map here':'Hide the map'):(map.hidden?'Xaritani shu yerda ko‘rish':'Xaritani yopish');toggle.textContent=text})}
    const gift=$('.gift');gift?.addEventListener('click',()=>{const open=gift.getAttribute('aria-expanded')!=='true';gift.setAttribute('aria-expanded',String(open));if(open)burst($('.toyona'),gift,lite()?16:28)});
    const gallery=$('.gallery__track');if(gallery){const measure=()=>{const m=gallery.getBoundingClientRect();$$('.gallery__slide',gallery).forEach(el=>{const r=el.getBoundingClientRect(),dist=Math.min(1,Math.abs((r.left+r.width/2)-(m.left+m.width/2))/m.width);el.style.setProperty('--s',(1-dist*.16).toFixed(3));el.style.setProperty('--o',(1-dist*.4).toFixed(3))})};gallery.addEventListener('scroll',()=>requestAnimationFrame(measure),{passive:true});addEventListener('resize',measure,{passive:true});new MutationObserver(measure).observe(gallery,{childList:true});measure()}
    app.on('rsvp',a=>{if(a?.status==='yes'){const card=$('.rsvp__card');burst($('#rsvp'),card,lite()?22:40)}});
    app.on('wish',()=>$('.wishes__list article:last-child')?.classList.add('wish-arrive'));
  }
  // rose petals bursting up from an element, drawn on the section's own canvas
  function burst(section,from,count){if(reduced()||!section||!from)return;let canvas=$('canvas.burst',section)||$('.rsvp__bouquet',section);if(!canvas){canvas=document.createElement('canvas');canvas.className='burst rsvp__bouquet';canvas.setAttribute('aria-hidden','true');section.append(canvas)}
    const{c,w,h}=canvasSize(canvas,lite()?1.5:2),sr=section.getBoundingClientRect(),fr=from.getBoundingClientRect(),x0=fr.left-sr.left+fr.width/2,y0=fr.top-sr.top+fr.height*.35;
    const ps=Array.from({length:count},()=>({x:x0+rand(-20,20),y:y0,vx:rand(-120,120),vy:rand(-260,-120),rot:rand(0,6),vr:rand(-4,4),flip:rand(0,6),size:rand(5,9),cell:Math.random()*6|0,alpha:1,life:rand(1.4,2.2)}));let last=0;
    const tick=now=>{const dt=Math.min(.04,(now-(last||now))/1000);last=now;c.clearRect(0,0,w,h);let live=false;ps.forEach(p=>{if(p.life<=0)return;live=true;p.life-=dt;p.vy+=170*dt;p.vx*=.99;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;p.flip+=dt*5;p.alpha=clamp(p.life,0,1);drawPetal(c,p)});if(live)requestAnimationFrame(tick);else c.clearRect(0,0,w,h)};requestAnimationFrame(tick)}
  function setupCountdownTicks(){$$('.countdown .tile strong').forEach(el=>new MutationObserver(()=>{const tile=el.parentElement;tile.classList.remove('is-tick');void tile.offsetWidth;tile.classList.add('is-tick')}).observe(el,{childList:true,characterData:true,subtree:true}))}
  function setupDateFlecks(){const section=$('#date'),canvas=$('.date__gold');if(!section||!canvas||reduced())return;let done=false;const io=new IntersectionObserver(es=>{if(!es[0].isIntersecting||done)return;done=true;io.disconnect();const{c,w,h}=canvasSize(canvas,lite()?1.5:2),glyph=document.createElement('canvas'),g=glyph.getContext('2d');glyph.width=Math.ceil(w);glyph.height=Math.ceil(h);const day=$('[data-slot="date.day"]',section)?.textContent||'14';g.font=`500 ${Math.min(w*.32,78)}px "Cormorant Garamond", Georgia, serif`;g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff';g.fillText(day,w/2,h/2);const px=g.getImageData(0,0,glyph.width,glyph.height).data,targets=[];for(let y=0;y<glyph.height;y+=4)for(let x=0;x<glyph.width;x+=4)if(px[(y*glyph.width+x)*4+3]>100)targets.push({x,y});if(!targets.length)return;const n=Math.min(lite()?34:70,targets.length);const points=Array.from({length:n},(_,i)=>{const t=targets[(i*targets.length/n)|0];return{x:rand(0,w),y:rand(0,h),tx:t.x,ty:t.y,phase:Math.random(),r:rand(.7,2.1)}});const start=performance.now();function tick(now){const p=clamp((now-start)/1300,0,1);c.clearRect(0,0,w,h);points.forEach(q=>{const k=clamp(p*1.2-q.phase*.25,0,1),e=ease.out(k);c.globalAlpha=(1-p)*.85;c.fillStyle='#c39b56';c.beginPath();c.arc(q.x+(q.tx-q.x)*e,q.y+(q.ty-q.y)*e,q.r*(1-p*.35),0,Math.PI*2);c.fill()});if(p<1)requestAnimationFrame(tick);else c.clearRect(0,0,w,h)}requestAnimationFrame(tick)},{threshold:.35});io.observe(section)}

  function setupScroll(){
    const sections=$$('.paper-section'),lightLantern=li=>li.classList.add('is-lit');
    if(reduced()){sections.forEach(s=>s.classList.add('section-in'));$$('.garden-path__list li').forEach(lightLantern);return}
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('section-in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});sections.forEach(s=>{s.classList.add('reveal');io.observe(s)});
    const lio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){lightLantern(e.target);lio.unobserve(e.target)}}),{rootMargin:'0px 0px -28% 0px'});
    const watchLanterns=()=>$$('.garden-path__list li').forEach(li=>lio.observe(li));watchLanterns();new MutationObserver(watchLanterns).observe($('.garden-path__list'),{childList:true});
    if(!window.gsap||!window.ScrollTrigger)return;gsap.registerPlugin(ScrollTrigger);
    const scene={trigger:'#hero',start:'top top',end:'bottom top',scrub:.6};
    gsap.to('.hero__garden',{yPercent:14,scale:1.06,ease:'none',scrollTrigger:scene});
        gsap.to('.hero__copy',{yPercent:-30,opacity:0,ease:'none',scrollTrigger:{...scene,end:'60% top'}});
    gsap.fromTo('.garden-path__grow',{strokeDashoffset:1},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.program',start:'top 72%',end:'bottom 62%',scrub:.5}});
    gsap.fromTo('.date__medallion',{rotate:-12,scale:.86},{rotate:0,scale:1,ease:'none',scrollTrigger:{trigger:'.date',start:'top bottom',end:'center center',scrub:.8}});
    gsap.fromTo('.corner-art',{rotate:-6,yPercent:-12},{rotate:10,yPercent:8,ease:'none',scrollTrigger:{trigger:'.letter',start:'top bottom',end:'bottom top',scrub:.8}});
    gsap.fromTo('.finale__garden',{scale:1.16,yPercent:5},{scale:1,yPercent:-2,ease:'none',scrollTrigger:{trigger:'#finale',start:'top bottom',end:'bottom bottom',scrub:.7}});
    gsap.fromTo('.finale__copy',{y:40,opacity:0},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'#finale',start:'top 70%',end:'top 20%',scrub:.6}});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
