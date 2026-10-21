/* Ko‘zgu: gilded initials, silvered reflection and touchable breath fog. */
(function () {
  'use strict';
  const $ = (selector, host = document) => host.querySelector(selector);
  const M = window.Marhamat;
  const data = M.data;
  const intro = $('#intro');
  const stage = $('#intro-stage');
  const mirror = $('#open-invitation');
  const glass = $('.mirror__glass');
  const fog = $('.mirror__fog');
  const ripple = $('.mirror__ripple');
  const writing = $('.mirror__writing');
  const scene = $('.scene');
  const hero = $('#hero');
  const letters = [data.groom, data.bride].map(name => Array.from(String(name || '').trim())[0]?.toLocaleUpperCase() || '');
  const reduced = M.reducedMotion;
  const lite = () => M.tier === 'lite' || reduced;
  const flames = [[90,1096],[134,1054],[170,1114],[603,1086],[646,1051],[338,875],[372,854]];
  let layout, projection, fogContext, edgeFog, fogRaf = 0, stopped = false;
  let wipeStarted = false, lastSound = 0, audio;
  const xml = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const dpr = () => Math.min(devicePixelRatio || 1, lite() ? 1.5 : 2);

  function canvasContext(canvas, width, height) {
    const ratio = dpr();
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    const context = canvas.getContext('2d', {willReadFrequently: canvas === fog});
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return context;
  }

  // Two circular arcs, sharing the original frame's exact pointed aperture.
  function aperture(context, width, height) {
    const u = width / 600;
    context.beginPath();
    context.moveTo(84*u,950*u);
    context.lineTo(84*u,430*u);
    context.arc(348.48*u,430*u,264.48*u,Math.PI,Math.atan2(-260,-48.48)+Math.PI*2,false);
    context.arc(251.52*u,430*u,264.48*u,Math.atan2(-260,48.48),0,false);
    context.lineTo(516*u,950*u);
    context.closePath();
  }

  function placeFlames(host, points, scale, offset = 0) {
    host.replaceChildren();
    points.forEach((point, index) => {
      const flame = document.createElement('i');
      flame.style.cssText = `left:${point[0]*scale}px;top:${(point[1]+offset)*scale}px;--phase:${index*.27}s`;
      host.append(flame);
    });
  }

  function measure() {
    const width = Math.min(innerWidth,480), height = innerHeight;
    const sw = Math.max(width,height*9/16), sh = sw*16/9, scale = sw/720, top = (height-sh)/2;
    const shelfY = 1120*scale;
    const topSpace=Math.min(168,height*.27)-top;
    const fw = Math.min(width*.88,(shelfY-topSpace)*600/1000,390), u = fw/600;
    stage.style.cssText = `width:${sw}px;height:${sh}px;left:50%;top:${top}px;margin-left:${-sw/2}px`;
    scene.style.width = sw+'px'; scene.style.height = sh+'px'; scene.style.top = top+'px';scene.style.marginLeft=(-sw/2)+'px';
    hero.style.height = height+'px';
    mirror.style.cssText = `width:${fw}px;height:${1040*u}px;left:50%;top:${shelfY-998*u}px;margin-left:${-fw/2}px`;
    $('.intro__greeting').style.top = (shelfY-998*u-58)+'px';
    $('.intro__greeting').classList.toggle('is-long', String(data.greeting || '').length > 28 || $('.intro__greeting').textContent.length > 28);
    $('.intro__edition').style.top = Math.max(32, shelfY-998*u-110)+'px';
    placeFlames($('.intro__flames'),[[96,92],[138,58],[182,108],[540,98],[584,64],[626,112]],scale,920);
    placeFlames($('.hero__flames'),flames,scale);
    layout = {width,height,sw,sh,scale,top,fw,u};
    return layout;
  }

  function names(svg) {
    svg.setAttribute('viewBox','0 0 720 300');
    svg.innerHTML = `<text class="name name--groom" x="360" y="108" text-anchor="middle">${xml(data.groom)}</text><text class="name name--amp" x="360" y="166" text-anchor="middle">&amp;</text><text class="name name--bride" x="360" y="258" text-anchor="middle">${xml(data.bride)}</text>`;
    svg.setAttribute('aria-label',`${data.groom || ''} & ${data.bride || ''}`);
    ['groom','bride'].forEach(key => {
      const text = $('.name--'+key,svg);
      if (text.getComputedTextLength() > 650) { text.setAttribute('textLength','650'); text.setAttribute('lengthAdjust','spacingAndGlyphs'); }
    });
  }

  function crest() {
    const canvas = $('.mirror__crest'), size = 192;
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    const mask = document.createElement('canvas'); mask.width = mask.height = size;
    const mg = mask.getContext('2d');
    mg.fillStyle = '#fff'; mg.textAlign = 'center'; mg.textBaseline = 'middle';
    mg.font = '112px "Great Vibes", "Cormorant Garamond", serif';
    mg.fillText(letters[0],size*.31,size*.51,100);
    mg.fillText(letters[1],size*.67,size*.54,100);
    const soft = document.createElement('canvas'); soft.width = soft.height = size;
    const sg = soft.getContext('2d'); sg.filter = 'blur(1.3px)'; sg.drawImage(mask,0,0);
    const sharp = mg.getImageData(0,0,size,size).data, field = sg.getImageData(0,0,size,size).data;
    const output = context.createImageData(size,size);
    for (let y=1;y<size-1;y++) for (let x=1;x<size-1;x++) {
      const i=y*size+x, alpha=sharp[i*4+3]/255;
      if(alpha < .01) continue;
      const nx=-(field[(i+1)*4+3]-field[(i-1)*4+3])*.028;
      const ny=-(field[(i+size)*4+3]-field[(i-size)*4+3])*.028;
      const norm=Math.hypot(nx,ny,1), color=window.KozguArt.gold([nx/norm,ny/norm,1/norm],.93,1.2);
      output.data[i*4]=Math.min(255,color[0]+38);
      output.data[i*4+1]=Math.min(255,color[1]+30);
      output.data[i*4+2]=Math.min(255,color[2]+18);
      output.data[i*4+3]=alpha*255;
    }
    context.putImageData(output,0,0);
  }

  function snapshot() {
    const box=mirror.getBoundingClientRect(), sr=scene.getBoundingClientRect();
    const context=canvasContext(glass,box.width,box.height), s=box.width*.72/sr.width;
    projection={s,gc:{x:box.width/2,y:box.height*660/1040},F:{x:sr.width/2,y:sr.height*.48},sr,box};
    const {gc,F}=projection;
    context.save(); aperture(context,box.width,box.height); context.clip();
    context.fillStyle='#2b203b';context.fillRect(0,0,box.width,box.height);
    // Extend the room's top paint through the unprojected arch, without a hard horizon.
    const room=$('.scene__room'), roomTop=gc.y-F.y*s;
    if(room.complete && room.naturalWidth) {
      context.drawImage(room,0,0,room.naturalWidth,6,0,0,box.width,Math.max(1,roomTop+3));
    }
    ['.scene__room','.scene__curtain--left','.scene__curtain--right','.scene__fore'].forEach(selector=>{
      const element=$(selector),image=element.matches('img')?element:$('img',element);
      if(!image?.complete || !image.naturalWidth)return;
      const rect=element.getBoundingClientRect();
      const x=gc.x+(rect.left-sr.left-F.x)*s, y=gc.y+(rect.top-sr.top-F.y)*s;
      context.save();
      if(selector.endsWith('right')) {context.translate(x+rect.width*s,y);context.scale(-1,1);context.drawImage(image,0,0,rect.width*s,rect.height*s);}
      else context.drawImage(image,x,y,rect.width*s,rect.height*s);
      context.restore();
    });
    flames.forEach(point=>{
      const x=gc.x+(point[0]*layout.scale-F.x)*s,y=gc.y+(point[1]*layout.scale-F.y)*s;
      const glow=context.createRadialGradient(x,y,0,x,y,12*s);glow.addColorStop(0,'#ffe3a1b0');glow.addColorStop(1,'#ffc17400');
      context.fillStyle=glow;context.fillRect(x-12*s,y-12*s,24*s,24*s);
    });
    if(room.complete && room.naturalWidth) {
      const sample=document.createElement('canvas');sample.width=sample.height=1;
      const sc=sample.getContext('2d');sc.drawImage(room,0,0,room.naturalWidth,6,0,0,1,1);
      const color=sc.getImageData(0,0,1,1).data;
      const feather=context.createLinearGradient(0,roomTop,0,roomTop+30);
      feather.addColorStop(0,`rgb(${color[0]},${color[1]},${color[2]})`);
      feather.addColorStop(1,`rgba(${color[0]},${color[1]},${color[2]},0)`);
      context.fillStyle=feather;context.fillRect(0,0,box.width,roomTop+30);
    }
    const edge=context.createRadialGradient(box.width*.5,box.height*.57,box.width*.18,box.width*.5,box.height*.57,box.width*.63);
    edge.addColorStop(.3,'#34294400');edge.addColorStop(1,'#24182788');context.fillStyle=edge;context.fillRect(0,0,box.width,box.height);
    const sheen=context.createLinearGradient(0,0,box.width,box.height);
    sheen.addColorStop(0,'#f3e9db05');sheen.addColorStop(.44,'#eee8ee00');sheen.addColorStop(.49,'#eee8ee16');sheen.addColorStop(.56,'#eee8ee00');
    context.fillStyle=sheen;context.fillRect(0,0,box.width,box.height);context.restore();
    syncWriting();
  }

  function syncWriting() {
    if(!projection)return;
    const {s,gc,F,sr,box}=projection, svg=$('.hero__names');
    ['groom','amp','bride'].forEach(key=>{
      const source=$('.name--'+key,svg),target=$('.name--'+key,writing);
      if(!source||!target)return;
      const matrix=source.getScreenCTM();if(!matrix)return;
      const point=svg.createSVGPoint();point.x=360;point.y=+source.getAttribute('y');
      const screen=point.matrixTransform(matrix),unit=600/box.width;
      target.setAttribute('x',(gc.x+(screen.x-sr.left-F.x)*s)*unit);
      target.setAttribute('y',(gc.y+(screen.y-sr.top-F.y)*s)*unit);
      target.style.fontSize=(parseFloat(getComputedStyle(source).fontSize)*Math.abs(matrix.a)*s*unit)+'px';
      const ink=source.getComputedTextLength()*Math.abs(matrix.a)*s*unit;
      if(ink>0){target.setAttribute('textLength',ink);target.setAttribute('lengthAdjust','spacingAndGlyphs');}
    });
  }

  function mist() {
    const box=mirror.getBoundingClientRect(),w=box.width,h=box.height;
    fogContext=canvasContext(fog,w,h);
    fogContext.save();aperture(fogContext,w,h);fogContext.clip();
    const wash=fogContext.createRadialGradient(w*.48,h*.48,8,w*.5,h*.57,w*.8);
    wash.addColorStop(0,'rgba(195,181,181,.66)');wash.addColorStop(.54,'rgba(183,172,178,.73)');wash.addColorStop(1,'rgba(160,148,161,.88)');
    fogContext.fillStyle=wash;fogContext.fillRect(0,0,w,h);
    for(let i=0;i<220;i++){
      const x=Math.random()*w,y=Math.random()*h,r=.35+Math.random()*1.3;
      fogContext.fillStyle=`rgba(246,232,217,${.04+Math.random()*.12})`;
      fogContext.beginPath();fogContext.ellipse(x,y,r,r*(1+Math.random()*1.6),0,0,Math.PI*2);fogContext.fill();
    }
    // The fog is thinner along precisely the same strokes as the written SVG.
    fogContext.globalCompositeOperation='destination-out';fogContext.globalAlpha=.17;
    ['groom','amp','bride'].forEach(key=>{
      const text=$('.name--'+key,writing),scale=w/600;
      fogContext.font=`${parseFloat(text.style.fontSize)*scale}px "Great Vibes", "Cormorant Garamond", serif`;
      fogContext.textAlign='center';fogContext.textBaseline='alphabetic';fogContext.fillStyle='#000';
      fogContext.fillText(text.textContent,+text.getAttribute('x')*scale,+text.getAttribute('y')*scale,+text.getAttribute('textLength')*scale||w*.65);
    });fogContext.restore();
    edgeFog=document.createElement('canvas');edgeFog.width=fog.width;edgeFog.height=fog.height;
    const edge=edgeFog.getContext('2d');edge.drawImage(fog,0,0);edge.globalCompositeOperation='destination-in';
    const mask=edge.createRadialGradient(fog.width*.5,fog.height*.56,fog.width*.2,fog.width*.5,fog.height*.56,fog.width*.65);
    mask.addColorStop(0,'#0000');mask.addColorStop(.75,'#0000');mask.addColorStop(1,'#000');edge.fillStyle=mask;edge.fillRect(0,0,fog.width,fog.height);
    if(!fogRaf&&!reduced)fogRaf=requestAnimationFrame(reform);
  }
  let fogTick=0;
  function reform(){fogRaf=0;if(stopped||document.hidden)return;if(++fogTick%3===0&&fogContext&&edgeFog){fogContext.save();fogContext.globalAlpha=.002;fogContext.drawImage(edgeFog,0,0,layout.fw,layout.fw*1040/600);fogContext.restore();}fogRaf=requestAnimationFrame(reform);}
  function wipe(x,y,radius=layout.fw*.13){if(!fogContext)return;fogContext.save();fogContext.globalCompositeOperation='destination-out';const brush=fogContext.createRadialGradient(x,y,0,x,y,radius);brush.addColorStop(0,'#000');brush.addColorStop(.65,'#000e');brush.addColorStop(1,'#0000');fogContext.fillStyle=brush;fogContext.fillRect(x-radius,y-radius,radius*2,radius*2);fogContext.restore();}
  const probe=document.createElement('canvas');probe.width=40;probe.height=70;
  function cleared(){const context=probe.getContext('2d',{willReadFrequently:true});context.clearRect(0,0,40,70);context.drawImage(fog,0,0,40,70);const pixels=context.getImageData(0,0,40,70).data;let count=0,total=0;for(let y=0;y<70;y++)for(let x=0;x<40;x++){const nx=x/40,ny=y/70;if(nx<.15||nx>.85||ny<.18||ny>.90)continue;if(ny<.414&&Math.abs(nx-.5)>.35*Math.sqrt((ny-.18)/.234))continue;total++;if(pixels[(y*40+x)*4+3]<55)count++;}return count/Math.max(total,1);}

  function sound(kind,speed=1){const toggle=$('[data-music-toggle]');if(reduced||(toggle&&!toggle.hidden&&toggle.getAttribute('aria-pressed')==='false'))return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audio ||= new AC();audio.resume();const time=audio.currentTime;if(kind==='bell'){[1318,1975,2637].forEach((frequency,index)=>{const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(.028/(index+1),time+.018);gain.gain.exponentialRampToValueAtTime(.0001,time+1.6);oscillator.connect(gain).connect(audio.destination);oscillator.start(time);oscillator.stop(time+1.7);});}else{if(performance.now()-lastSound<70)return;lastSound=performance.now();const buffer=audio.createBuffer(1,audio.sampleRate*.11,audio.sampleRate),channel=buffer.getChannelData(0);for(let i=0;i<channel.length;i++)channel[i]=Math.random()*2-1;const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=1250;filter.Q.value=1.8;gain.gain.setValueAtTime(Math.min(.018,speed*.001),time);gain.gain.exponentialRampToValueAtTime(.0001,time+.1);source.connect(filter).connect(gain).connect(audio.destination);source.start(time);}}catch(_){}}

  function rippleGlass(){if(lite())return;const W=112,H=194;ripple.width=W;ripple.height=H;const context=ripple.getContext('2d');const sourceCanvas=document.createElement('canvas');sourceCanvas.width=W;sourceCanvas.height=H;const sourceContext=sourceCanvas.getContext('2d');sourceContext.drawImage(glass,0,0,W,H);const source=sourceContext.getImageData(0,0,W,H).data,output=context.createImageData(W,H),radii=new Float32Array(W*H),dxs=new Float32Array(W*H),dys=new Float32Array(W*H);for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,dx=x-W/2,dy=y-H*.58,r=Math.hypot(dx,dy)||1;radii[i]=r;dxs[i]=dx/r;dys[i]=dy/r;}const start=performance.now();function frame(now){const time=(now-start)/1000,fade=Math.max(0,1-time/1.4);for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,displace=Math.sin(radii[i]*.32-time*10)*3.3*fade,sx=Math.max(0,Math.min(W-1,Math.round(x+dxs[i]*displace))),sy=Math.max(0,Math.min(H-1,Math.round(y+dys[i]*displace))),from=(sy*W+sx)*4,to=i*4;output.data[to]=source[from];output.data[to+1]=source[from+1];output.data[to+2]=source[from+2];output.data[to+3]=source[from+3];}context.putImageData(output,0,0);if(fade>0&&!intro.hidden)requestAnimationFrame(frame);}requestAnimationFrame(frame);}

  let pointer=null,checked=0;
  mirror.addEventListener('pointerdown',event=>{if(stopped)return;const box=mirror.getBoundingClientRect();pointer={x:event.clientX-box.left,y:event.clientY-box.top,startX:event.clientX,startY:event.clientY,moved:false};mirror.setPointerCapture(event.pointerId);if(!wipeStarted){wipeStarted=true;navigator.vibrate?.(12);}wipe(pointer.x,pointer.y);event.preventDefault();});
  mirror.addEventListener('pointermove',event=>{if(!pointer||stopped)return;const box=mirror.getBoundingClientRect(),x=event.clientX-box.left,y=event.clientY-box.top,dx=x-pointer.x,dy=y-pointer.y,distance=Math.hypot(dx,dy);if(Math.hypot(event.clientX-pointer.startX,event.clientY-pointer.startY)>5)pointer.moved=true;for(let p=0;p<=Math.ceil(distance/5);p++){const f=p/Math.max(1,Math.ceil(distance/5));wipe(pointer.x+dx*f,pointer.y+dy*f);}sound('wipe',distance);pointer.x=x;pointer.y=y;if(performance.now()-checked>200){checked=performance.now();if(cleared()>=.45)window.KOZGU.open?.(false);}event.preventDefault();});
  mirror.addEventListener('pointerup',()=>{if(!pointer)return;const tap=!pointer.moved;pointer=null;if(tap&&!stopped)window.KOZGU.open?.(true);});
  mirror.addEventListener('pointercancel',()=>{pointer=null;});
  mirror.addEventListener('click',event=>{if(event.detail===0&&!stopped)window.KOZGU.open?.(true);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(fogRaf);fogRaf=0;}else if(!stopped&&!fogRaf&&!reduced)fogRaf=requestAnimationFrame(reform);});

  window.KOZGU={mirror,stage,open:null};
  window.KozguMirror={
    layout:()=>layout,projection:()=>projection,flames, snapshot,wipe,cleared,ripple:rippleGlass,
    stop:()=>{stopped=true;cancelAnimationFrame(fogRaf);fogRaf=0;pointer=null;},
    chime:()=>sound('bell'),
    prime:()=>sound('wipe',0),
    ready:null
  };
  measure();
  const imageReady=Promise.all(Array.from(scene.querySelectorAll('img')).map(image=>image.complete?Promise.resolve():new Promise(resolve=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true});})));
  const fonts=document.fonts?Promise.all([document.fonts.load('80px "Great Vibes"',letters.join('')+data.groom+data.bride),document.fonts.load('18px "Cormorant Garamond"')]).catch(()=>{}):Promise.resolve();
  window.KozguMirror.ready=Promise.all([imageReady,Promise.race([fonts,new Promise(resolve=>setTimeout(resolve,1800))])]).then(()=>{
    names($('.hero__names'));
    writing.setAttribute('viewBox','0 0 600 1040');
    writing.innerHTML=`<defs><linearGradient id="kozgu-write"><stop offset=".88" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient><mask id="kozgu-write-groom" maskUnits="userSpaceOnUse"><rect class="write-mask write-mask--groom" x="-650" y="0" width="650" height="1040" fill="url(#kozgu-write)"/></mask><mask id="kozgu-write-bride" maskUnits="userSpaceOnUse"><rect class="write-mask write-mask--bride" x="-650" y="0" width="650" height="1040" fill="url(#kozgu-write)"/></mask></defs><text class="name name--groom" x="300" y="470" text-anchor="middle" mask="url(#kozgu-write-groom)">${xml(data.groom)}</text><text class="name name--amp" x="300" y="520" text-anchor="middle">&amp;</text><text class="name name--bride" x="300" y="580" text-anchor="middle" mask="url(#kozgu-write-bride)">${xml(data.bride)}</text><circle class="mirror__glint" cx="100" cy="470" r="7" fill="#ffefbb"/>`;
    crest();snapshot();mist();intro.classList.add('is-ready');
  });
  let width=innerWidth;addEventListener('resize',()=>{if(width===innerWidth)return;width=innerWidth;measure();if(!stopped){snapshot();mist();}});
  setTimeout(()=>$('.mirror__hint-second').classList.add('is-visible'),2300);
})();
