
/* ===== STARS ===== */
(function(){
  var box=document.getElementById('starsBox');
  var colors=['#F5F0E8','#E5D08C','#A8C0DA','#fff'];
  for(var i=0;i<120;i++){
    var s=document.createElement('div');s.className='star';
    var sz=(.6+Math.random()*2.2);
    s.style.cssText='left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;width:'+sz+'px;height:'+sz+'px;background:'+colors[Math.floor(Math.random()*colors.length)]+';--d:'+(2+Math.random()*5)+'s;animation-delay:'+(Math.random()*5)+'s;box-shadow:0 0 '+(sz*2)+'px '+colors[Math.floor(Math.random()*colors.length)];
    box.appendChild(s);
  }
})();

/* ===== PARTICLES ===== */
(function(){
  var c=document.getElementById('particles'),ctx=c.getContext('2d');
  function resize(){c.width=window.innerWidth;c.height=window.innerHeight}
  resize();window.addEventListener('resize',resize);
  var pts=[];
  for(var i=0;i<35;i++){
    pts.push({x:Math.random()*c.width,y:Math.random()*c.height,
      r:.4+Math.random()*1.2,vy:-.15-Math.random()*.35,vx:(Math.random()-.5)*.3,
      o:.15+Math.random()*.45,
      color:Math.random()>.5?'200,169,81':'168,192,218'});
  }
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    for(var i=0;i<pts.length;i++){
      var p=pts[i];
      p.y+=p.vy;p.x+=p.vx;
      if(p.y<-10){p.y=c.height+10;p.x=Math.random()*c.width}
      if(p.x<-10)p.x=c.width+10;if(p.x>c.width+10)p.x=-10;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba('+p.color+','+p.o+')';ctx.fill();
      ctx.shadowBlur=p.r*4;ctx.shadowColor='rgba('+p.color+','+p.o*0.5+')';
    }
    if(!document.hidden&&!window.starryReducedMotion)requestAnimationFrame(draw);else window.starryResumeParticles=draw;
  }
  if(!window.starryReducedMotion)draw();else window.starryResumeParticles=draw;
})();

/* ===== SPLASH ===== */
document.getElementById('openBtn').addEventListener('click',function(){
  document.getElementById('splash').classList.add('hide');
  document.getElementById('splash').inert=true;
  var heading=document.querySelector('.hero-names');heading.tabIndex=-1;heading.focus({preventScroll:true});
  document.body.style.overflow='auto';
  /* try autoplay music */
  var a=document.getElementById('bgMusic');
  if(window.starryTryMusic)window.starryTryMusic();
});
document.body.style.overflow='hidden';

/* ===== SCROLL REVEAL ===== */
(function(){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('shown');obs.unobserve(e.target)}});
  },{threshold:0.15});
  document.querySelectorAll('.rv').forEach(function(el){obs.observe(el)});
})();

/* ===== COUNTDOWN ===== */
(function(){

  var dEl=document.getElementById('cdD'),hEl=document.getElementById('cdH'),mEl=document.getElementById('cdM'),sEl=document.getElementById('cdS');
  function pad(n){return n<10?'0'+n:''+n}
  function tick(){
    var diff=(window.__WED_TS||0)-Date.now();
    if(diff<=0){dEl.textContent='0';hEl.textContent='00';mEl.textContent='00';sEl.textContent='00';return}
    var d=Math.floor(diff/864e5),h=Math.floor(diff%864e5/36e5),m=Math.floor(diff%36e5/6e4),s=Math.floor(diff%6e4/1e3);
    dEl.textContent=d;hEl.textContent=pad(h);mEl.textContent=pad(m);sEl.textContent=pad(s);
  }
  tick();setInterval(tick,1000);
})();


document.addEventListener('visibilitychange',function(){if(!document.hidden&&window.starryResumeParticles&&!window.starryReducedMotion){var resume=window.starryResumeParticles;window.starryResumeParticles=null;resume();}});
