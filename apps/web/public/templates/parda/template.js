(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var intro = $("#intro"), button = $("#open-invitation"), hero = $("#hero"), curtain = $(".curtain"), glCanvas = $(".curtain-gl");
  var M = window.Marhamat || {}, reduce = !!M.reducedMotion || matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lite = M.tier === "lite" || document.documentElement.dataset.tier === "lite" || reduce;
  var data = M.data || window.INVITATION || {}, E = window.PardaEmbroidery;
  var lang = new URLSearchParams(location.search).get("lang"), cyrillic = {A:"А",B:"Б",C:"К",D:"Д",E:"Е",F:"Ф",G:"Г",H:"Х",I:"И",J:"Дж",K:"К",L:"Л",M:"М",N:"Н",O:"О",P:"П",Q:"Қ",R:"Р",S:"С",T:"Т",U:"У",V:"В",W:"В",X:"Х",Y:"Й",Z:"З"};
  function monogramInitial(name){var letter=E.first(name), upper=String(name||"").trim().toUpperCase();if(lang!=="ru")return letter;if(/^G[‘'ʻʼ]/.test(upper))return "Ғ";if(/^O[‘'ʻʼ]/.test(upper))return "Ў";return cyrillic[letter]||letter;}
  var letters = [monogramInitial(data.groom), monogramInitial(data.bride)];
  var texture = new Image(), cleanTexture = new Image(), maskTexture = new Image(), mono = document.createElement("canvas"), lift = $(".monogram--float");
  var texCanvas = document.createElement("canvas"), tex = texCanvas.getContext("2d");
  var ctx = curtain && curtain.getContext("2d"), glRenderer = window.PardaMesh && window.PardaMesh.create(glCanvas), opened = false, opening = false, pull = 0, raf = 0, dpr = 1;
  maskTexture.src = "art/suzani-mask.webp";
  if(glRenderer){curtain.style.display="none";}else if(glCanvas){glCanvas.style.display="none";}
  texture.src = "art/suzani.webp"; cleanTexture.src = "art/suzani.webp";
  var fontLoad = document.fonts && document.fonts.load ? document.fonts.load('80px "Great Vibes"', letters.join("") + "&").catch(function () {}) : Promise.resolve();
  function monogramTexture() {
    if (!E) return;
    var w = texture.naturalWidth || 1088, h = texture.naturalHeight || 1530;
    texCanvas.width = w; texCanvas.height = h; tex.clearRect(0, 0, w, h); tex.drawImage(texture, 0, 0);
    mono.width = mono.height = Math.round(w * .37);
    E.draw(mono, letters, 420, false);
    var dw = w * .27, dh = h * .12, dx = w * .365, dy = h * .295;
    tex.drawImage(mono, dx, dy, dw, dh);
    var url = texCanvas.toDataURL("image/webp", .88); texture.onload = function(){drawCurtain();}; texture.src = url;
    E.draw(lift, letters, 420, true);
    E.draw($(".monogram--stitched"), letters, 420, false);
  }
  texture.onload = function () { Promise.resolve(fontLoad).then(monogramTexture); };
  cleanTexture.onload = function () { if (!texture.naturalWidth) texture = cleanTexture; drawCurtain(); };

  var STRINGS = [[35,245,470,360,34,14],[490,355,925,250,42,16],[15,480,440,545,28,15],[515,545,955,450,40,16],[55,710,410,760,35,14],[555,745,940,675,32,13],[92,1020,400,950,30,12],[570,930,875,1060,34,13]];
  function catenary(a, t) { return [a[0] + (a[2]-a[0])*t, a[1] + (a[3]-a[1])*t + a[4]*4*t*(1-t)]; }
  function resize() {
    if (!ctx || !hero) return;
    var r = hero.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, lite ? 1 : 1.5);
    curtain.width = Math.round(r.width*d); curtain.height = Math.round(r.height*d); curtain.style.width=r.width+"px"; curtain.style.height=r.height+"px";
    if(glCanvas){glCanvas.width=Math.round(r.width*d);glCanvas.height=Math.round(r.height*d);glCanvas.style.width=r.width+"px";glCanvas.style.height=r.height+"px";}
    ctx.setTransform(d,0,0,d,0,0); dpr=d; drawCurtain();
    var life = $(".life"); life.width=Math.round(r.width*d); life.height=Math.round(r.height*d); life.style.width=r.width+"px"; life.style.height=r.height+"px"; lifeCtx.setTransform(d,0,0,d,0,0);
  }
  var progress=0, backlight=0, sway=0;
  function drawCurtain() {
    if (!texture.complete || !texture.naturalWidth) return;
    var w=curtain.clientWidth||hero.clientWidth, h=curtain.clientHeight||hero.clientHeight, p=progress, folds=lite?20:35, rows=lite?14:30;
    if(glRenderer){glRenderer.draw(texture,maskTexture,{progress:progress,backlight:backlight,lite:lite});return;}
    if(!ctx)return;
    ctx.clearRect(0,0,w,h); ctx.save(); ctx.globalCompositeOperation="source-over";
    for (var side=0;side<2;side++) {
      var gather=Math.max(0,Math.min(1,p)), destWidth=w*(.5-.34*gather), destStart=side===0?0:w-destWidth;
      var columns=folds;
      for(var i=0;i<columns;i++){
        var u=i/columns, u2=(i+1)/columns, sourceHalf=texture.naturalWidth/2, panelSource=sourceHalf*.34;
        var xSource=(side===0?0:sourceHalf*2-panelSource)+u*panelSource;
        var sw=panelSource/columns+1, phase=(u*Math.PI*14), alpha=1;
        var compression=(1-.24*Math.cos(phase+Math.sin(sway)*.12));
        var x=destStart+u*destWidth, dw=(u2-u)*destWidth*compression;
        for(var j=0;j<rows;j++){
          var v=j/rows, sy=v*texture.naturalHeight, sh=texture.naturalHeight/rows+1;
          var wave=Math.sin(phase+v*2.6+sway)* (2+gather*5);
          ctx.globalAlpha=alpha; ctx.drawImage(texture,xSource,sy,sw,sh,x+wave,h*v,dw,h/rows+1);
          ctx.globalAlpha=.08+.12*(.5+.5*Math.cos(phase));ctx.fillStyle="#19131c";ctx.fillRect(x+wave,h*v,dw,h/rows+1);
          if(backlight>.01){ctx.globalCompositeOperation="lighter";ctx.globalAlpha=backlight*.09;ctx.fillStyle="#ffd18a";ctx.fillRect(x+wave,h*v,dw,h/rows+1);ctx.globalCompositeOperation="source-over";}
        }
      }
      // soft selvage catches the doorway key light
      var edgeX=side===0?destStart+destWidth:destStart;
      var g=ctx.createLinearGradient(edgeX-8,0,edgeX+8,0); g.addColorStop(0,"rgba(255,220,143,0)");g.addColorStop(.5,"rgba(255,222,158,"+(.12+backlight*.34)+")");g.addColorStop(1,"rgba(255,220,143,0)");ctx.fillStyle=g;ctx.fillRect(edgeX-9,0,18,h);
    }
    ctx.restore();
  }

  var life=$(".life"), lifeCtx=life&&life.getContext("2d"), motes=[], ambientOn=false, heroVisible=true, last=0, lifeRaf=0;
  function ambientFrame(now){lifeRaf=0;if(document.hidden||!ambientOn||!heroVisible)return;var dt=Math.min(2,(now-(last||now))/16.7);last=now;
    var w=hero.clientWidth,h=hero.clientHeight;lifeCtx.clearRect(0,0,w,h);
    // Living candle points on the exact strings baked into garden.webp.
    STRINGS.forEach(function(a,k){for(var i=1;i<a[5];i++){var pt=catenary(a,i/a[5]),x=pt[0]/960*w,y=(.62+pt[1]/1800*.16)*h,tw=.45+.55*Math.sin(now*.0014+i*3+k*1.7);lifeCtx.globalAlpha=.18*tw;lifeCtx.fillStyle="#ffc96e";lifeCtx.beginPath();lifeCtx.arc(x,y+3,8,0,7);lifeCtx.fill();lifeCtx.globalAlpha=.7*tw;lifeCtx.fillStyle="#ffe5a4";lifeCtx.beginPath();lifeCtx.arc(x,y,1.7,0,7);lifeCtx.fill();}});
    // Candle flames along the table breathe independently from the overhead strings.
    for(var ci=0;ci<7;ci++){var t=ci/6,cy=h*(.58+t*t*.27),cx=w*.5+Math.sin(now*.014+ci*2.3)*1.2,fl=.7+.3*Math.sin(now*.019+ci*4.1);lifeCtx.globalAlpha=.2*fl;var rg=lifeCtx.createRadialGradient(cx,cy,1,cx,cy,14+8*t);rg.addColorStop(0,"rgba(255,233,170,.9)");rg.addColorStop(1,"rgba(255,174,72,0)");lifeCtx.fillStyle=rg;lifeCtx.beginPath();lifeCtx.arc(cx,cy,14+8*t,0,7);lifeCtx.fill();}
    if(motes.length<(lite?9:22)&&Math.random()<.035*dt)motes.push({x:Math.random()*w,y:h+10,v:.3+Math.random()*.8,s:1+Math.random()*2,p:Math.random()*7});
    motes.forEach(function(m){m.y-=m.v*dt;m.x+=Math.sin(now*.001+m.p)*.25;lifeCtx.globalAlpha=.35+.35*Math.sin(now*.003+m.p);lifeCtx.fillStyle="#f3d88d";lifeCtx.beginPath();lifeCtx.arc(m.x,m.y,m.s,0,7);lifeCtx.fill();});motes=motes.filter(function(m){return m.y>-10;});lifeCtx.globalAlpha=1;lifeRaf=requestAnimationFrame(ambientFrame);
  }
  function startAmbient(){ambientOn=true;if(!lite&&!reduce&&!lifeRaf)lifeRaf=requestAnimationFrame(ambientFrame);}
  if("IntersectionObserver" in window){new IntersectionObserver(function(entries){heroVisible=entries[0].isIntersecting;if(heroVisible&&ambientOn&&!lite&&!reduce&&!lifeRaf)lifeRaf=requestAnimationFrame(ambientFrame);else if(!heroVisible){cancelAnimationFrame(lifeRaf);lifeRaf=0;if(lifeCtx)lifeCtx.clearRect(0,0,life.width,life.height);}},{rootMargin:"100px"}).observe(hero);}
  document.addEventListener("visibilitychange",function(){if(document.hidden){cancelAnimationFrame(lifeRaf);lifeRaf=0;if(lifeCtx)lifeCtx.clearRect(0,0,life.width,life.height);}else if(ambientOn&&heroVisible&&!lite&&!reduce&&!lifeRaf)lifeRaf=requestAnimationFrame(ambientFrame);});
  var audio=null;
  function sound(){if(reduce)return;try{var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;if(!audio)audio=new AC();if(audio.state==="suspended")audio.resume();var sr=audio.sampleRate;
      [146.83,220,293.66].forEach(function(freq,k){var n=Math.floor(sr*.8),b=audio.createBuffer(1,n,sr),d=b.getChannelData(0),period=Math.round(sr/freq);for(var i=0;i<period;i++)d[i]=Math.random()*2-1;for(i=period;i<n;i++)d[i]=(d[i-period]+d[i-period+1]||0)*.498;var src=audio.createBufferSource(),g=audio.createGain();src.buffer=b;g.gain.value=.075;src.connect(g);g.connect(audio.destination);src.start(audio.currentTime+k*.12);src.stop(audio.currentTime+1.1);});
      var len=sr*.45|0,nb=audio.createBuffer(1,len,sr),nd=nb.getChannelData(0);for(var j=0;j<len;j++)nd[j]=(Math.random()*2-1)*(1-j/len);var no=audio.createBufferSource(),bp=audio.createBiquadFilter(),ng=audio.createGain();no.buffer=nb;bp.type="bandpass";bp.frequency.value=1450;ng.gain.value=.08;no.connect(bp);bp.connect(ng);ng.connect(audio.destination);no.start();}catch(_){}
  }
  function start() {
    if(opening){if(window.PardaTimeline)window.PardaTimeline.progress(1);return;}
    opening=true;clearTimeout(idleTimer);if(navigator.vibrate)navigator.vibrate(12);sound();
    if(M.open)M.open(); document.body.classList.add("is-opening");intro.classList.add("opening");
    if(reduce){progress=1;drawCurtain();finish();return;}
    var full=lite?2.05:6.5, tl=window.gsap?gsap.timeline({onComplete:finish}):null;
    if(tl){window.PardaTimeline=tl;
      tl.to(button,{y:innerHeight*.9,opacity:0,duration:lite?.32:.7,ease:"power2.in"},0)
        .to(intro,{duration:.9,css:{"--back":1},onUpdate:function(){backlight=Math.sin(this.progress()*Math.PI)*.35;drawCurtain();}},.1)
        .to(intro.querySelector(".leak"),{opacity:1,duration:.8},.1)
        .to(".intro__reveal",{opacity:1,duration:.6},2.05)
        .to(".intro__reveal h1 span:first-child",{clipPath:"inset(0 0% 0 0)",duration:.9,ease:"power2.out"},2.45)
        .to(".intro__reveal h1 i",{opacity:1,duration:.2},3.35)
        .to(".intro__reveal h1 span:last-child",{clipPath:"inset(0 0% 0 0)",duration:.9,ease:"power2.out"},3.55)
        .to(lift,{opacity:1,duration:.45},lite?.3:.55)
        .to(".monogram--stitched",{opacity:0,duration:.24},lite?.42:.82)
        .call(function(){texture=cleanTexture;drawCurtain();},[],.98)
        .to(lift,{y:-26,scale:1.12,duration:lite?.25:.65,ease:"power2.out"},lite?.5:.85)
        .to(intro.querySelector(".door--left"),{x:"-100%",duration:lite?.75:2.7,ease:"power2.inOut"},lite?.6:1.08)
        .to(intro.querySelector(".door--right"),{x:"100%",duration:lite?.75:2.7,ease:"power2.inOut"},lite?.6:1.08)
        .to({p:0},{p:1,duration:lite?.8:2.7,ease:"power2.inOut",onUpdate:function(){progress=this.targets()[0].p;backlight=.35*(1-this.progress());drawCurtain();}},lite?.6:1.08)
        .to(".world",{scale:1,duration:2.3,ease:"power2.out"},1.3)
        .to(".world__rays",{opacity:.62,duration:1.2},1.7).to(".bloom",{opacity:.32,duration:1.2},1.65)
        .to(lift,{y:-innerHeight*.25,opacity:0,duration:.8},2.55)
        .to(".hero__names .groom",{clipPath:"inset(0 0% 0 0)",duration:.95,ease:"power2.out"},3.05)
        .to(".hero__names .amp",{opacity:1,duration:.25},3.95)
        .to(".hero__names .bride",{clipPath:"inset(0 0% 0 0)",duration:.95,ease:"power2.out"},4.22)
        .to([".hero__kicker",".hero__date",".hero__when",".hero__cue"],{opacity:1,y:0,stagger:.12,duration:.55,ease:"power2.out"},5.3)
        .to(".hero__greeting",{opacity:.8,duration:.4},5.8);
      if(lite)tl.duration(2.05);
    } else {progress=1;drawCurtain();setTimeout(finish,full*1000);}
    window.setTimeout(finish,full*1000+150);
  }
  function finish(){if(!opening&&!reduce)return;opened=true;opening=false;clearTimeout(idleTimer);progress=1;drawCurtain();$$(".hero__names .name").forEach(function(el){el.style.clipPath="inset(0 0 0 0)";});var amp=$(".hero__names .amp");if(amp)amp.style.opacity="1";[".hero__kicker",".hero__date",".hero__when",".hero__cue"].forEach(function(sel){var el=$(sel);if(el){el.style.opacity="1";el.style.transform="none";}});intro.classList.add("opened");document.documentElement.classList.remove("is-locked");document.body.classList.add("is-open");startAmbient();if(window.ScrollTrigger)ScrollTrigger.refresh();}
  var downY=0,downAt=0,dragging=false,suppressClick=false;
  button.addEventListener("pointerdown",function(e){downY=e.clientY;downAt=performance.now();dragging=true;button.setPointerCapture(e.pointerId);if(navigator.vibrate)navigator.vibrate(12);});
  button.addEventListener("pointermove",function(e){if(!dragging||opening)return;var dy=Math.max(0,e.clientY-downY),res=dy<90?dy*.72:65+(dy-90)*.2;button.style.setProperty("--pull",res+"px");button.style.transform="translate(-50%,"+res+"px)";});
  button.addEventListener("pointerup",function(e){if(!dragging)return;dragging=false;var dy=Math.max(0,e.clientY-downY),velocity=dy/Math.max(1,performance.now()-downAt);if(dy>=90||(dy>35&&velocity>.75)){suppressClick=true;start();}else{button.style.transition="transform .65s cubic-bezier(.2,1.5,.4,1)";button.style.transform="translateX(-50%)";setTimeout(function(){button.style.transition="";},700);}});
  button.addEventListener("click",function(e){e.stopPropagation();if(suppressClick){suppressClick=false;return;}if(!dragging)start();});
  intro.addEventListener("click",function(){if(opening){if(window.PardaTimeline)window.PardaTimeline.progress(1);else finish();}else start();});
  var idleTimer=setTimeout(function(){if(!opening){button.classList.add("nudge");setTimeout(function(){button.classList.remove("nudge");},1500);}},2000);
  document.fonts&&document.fonts.ready.then(function(){if(texture.complete&&texture.naturalWidth)monogramTexture();});
  if(texture.complete&&texture.naturalWidth)monogramTexture();
  addEventListener("resize",resize);resize();
  // A small horizontal string-light canvas echoes the fixed bulbs of the pavilion drawing.
  var bc=$(".bulbs"), bctx=bc&&bc.getContext("2d");
  if(bctx) addEventListener("resize",function(){bc.width=Math.round(hero.clientWidth*dpr);bc.height=Math.round(hero.clientHeight*dpr);bctx.setTransform(dpr,0,0,dpr,0,0);});
  function stories(){if(!window.gsap||!window.ScrollTrigger)return;gsap.registerPlugin(ScrollTrigger);
    gsap.to(".world__garden",{yPercent:-8,scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:true}});
    gsap.to(".world__sky",{yPercent:5,scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:true}});
    gsap.to(".timeline>i",{scaleY:1,transformOrigin:"top",scrollTrigger:{trigger:".program-section",start:"top 75%",end:"bottom 45%",scrub:true}});
    gsap.fromTo(".rsvp",{clipPath:"inset(0 0 0 50%)"},{clipPath:"inset(0 0 0 0%)",scrollTrigger:{trigger:".rsvp",start:"top 85%",end:"top 40%",scrub:true}});
    gsap.to(".world__tulips",{yPercent:-12,scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:true}});
    $$(".section").forEach(function(el){gsap.fromTo(el,{opacity:.72,y:18},{opacity:1,y:0,duration:.7,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}});});
  }
  if(M.on){M.on("ready",function(){data=M.data||data;});M.on("open",startAmbient);M.on("rsvp",function(a){if(a.status==="yes"&&!reduce)document.querySelector("[data-rsvp-done]").animate([{transform:"scale(.94)"},{transform:"scale(1.03)"},{transform:"scale(1)"}],{duration:700});});}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",stories,{once:true});else stories();
})();
