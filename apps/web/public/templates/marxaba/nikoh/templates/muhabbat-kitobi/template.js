(function(){
  'use strict';
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
  function intro(){
    const root=$('#intro'), button=$('#open-invitation'), book=$('#book'); if(!root||!button)return;
    let opened=false, timer=0;
    function finish(){if(root.classList.contains('is-zooming')||root.classList.contains('is-finished'))return;clearTimeout(timer);const reveal=()=>{root.classList.add('is-finished');document.documentElement.classList.remove('is-locked');document.body.classList.add('is-open');root.setAttribute('aria-hidden','true');$('#hero')?.scrollIntoView({block:'start',behavior:'auto'});};if(window.Marhamat?.reducedMotion){reveal();return}root.classList.add('is-zooming');setTimeout(reveal,620);}
    function turn(){
      if(opened){finish();return} opened=true;
      window.Marhamat?.open?.();root.classList.add('is-turning');
      const pages=document.createElement('div');pages.className='turn-pages';book.append(pages);
      const stories=window.Marhamat?.data?.story||[];
      stories.forEach((story,i)=>{const p=document.createElement('article');p.className='turn-page';p.innerHTML='<h3></h3><p></p>';p.querySelector('h3').textContent=story.title;p.querySelector('p').textContent=story.text;pages.append(p);setTimeout(()=>p.classList.add('turning'),250+i*310);});
      const leaf=document.createElement('div');leaf.className='title-leaf';leaf.innerHTML='<span>Bir bor ekan...</span><strong></strong><svg viewBox="0 0 40 40"><path d="M20 34S4 25 5 14C6 5 17 5 20 13 24 4 36 6 35 16 34 25 20 34 20 34z"/></svg>';leaf.querySelector('strong').textContent=`${window.Marhamat?.data?.groom||''} & ${window.Marhamat?.data?.bride||''}`;book.append(leaf);
      setTimeout(()=>leaf.classList.add('is-visible'),1150);
      timer=setTimeout(finish,2500);
    }
    button.addEventListener('click',e=>{e.stopPropagation();turn()});root.addEventListener('click',()=>{if(opened)finish()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened)finish()});
    $('#close-book')?.addEventListener('click',()=>{$('html').classList.add('is-locked');root.hidden=false;root.classList.remove('is-finished');root.style.opacity='';root.style.visibility='';opened=false;window.scrollTo(0,0);});
    if(window.Marhamat?.reducedMotion){$('.table-light').style.animation='none'}
  }
  function circleDate(){const day=$('.calendar-day.is-event');if(!day)return;const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 100 70');svg.setAttribute('aria-hidden','true');svg.classList.add('calendar-mark','draw');const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M16 37C15 16 36 8 58 13c22 4 31 17 25 34-7 19-31 20-49 15C20 57 12 49 16 37Z');svg.append(path);day.append(svg);}
  function scrollMotion(){
    const reduced=window.Marhamat?.reducedMotion, lite=window.Marhamat?.tier==='lite';
    const reveal=el=>{el.classList.add('is-drawn'); if(reduced)el.style.transition='none'};
    if(window.gsap&&window.ScrollTrigger&&!reduced){gsap.registerPlugin(ScrollTrigger);
      $$('.draw').forEach(el=>gsap.to(el,{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:el,start:'top 88%',end:'bottom 45%',scrub:lite?false:true}}));
      $$('.program__item').forEach((el,i)=>gsap.fromTo(el,{opacity:.55},{opacity:1,scrollTrigger:{trigger:el,start:'top 90%',end:'top 55%',scrub:true}}));
      $('.table-light').style.animation='none';gsap.to('.table-light',{xPercent:35,ease:'none',scrollTrigger:{trigger:'.page',start:'top top',end:'bottom bottom',scrub:true}});
      gsap.fromTo('.footer',{backgroundColor:'#eaddc5'},{backgroundColor:'#2f4a3a',color:'#f3e9d7',scrollTrigger:{trigger:'#footer',start:'top 70%',end:'bottom bottom',scrub:true}});
    }else{
      const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){reveal(e.target);observer.unobserve(e.target)}}),{threshold:.2});
      $$('.draw').forEach(el=>observer.observe(el));
      $$('.program__item').forEach(el=>observer.observe(el));
    }
  }
  function ambient(){
    if(window.Marhamat?.reducedMotion)return;
    const canvas=document.createElement('canvas');canvas.className='dust';canvas.setAttribute('aria-hidden','true');$('#intro').append(canvas);
    const ctx=canvas.getContext('2d');if(!ctx)return;
    let w=0,h=0,dpr=1,active=true,raf=0;const count=window.Marhamat?.tier==='lite'?12:32;
    const dots=Array.from({length:count},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.5+.4,s:Math.random()*.0006+.0002,a:Math.random()*.25+.08}));
    function size(){const box=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,window.Marhamat?.tier==='lite'?1.5:2);w=box.width;h=box.height;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
    function frame(){if(!active||document.hidden)return;ctx.clearRect(0,0,w,h);dots.forEach(p=>{p.y-=p.s*16;if(p.y<-.02)p.y=1.02;ctx.globalAlpha=p.a;ctx.fillStyle='#e2c98c';ctx.beginPath();ctx.arc(p.x*w,p.y*h,p.r,0,Math.PI*2);ctx.fill()});ctx.globalAlpha=1;raf=requestAnimationFrame(frame)}
    size();frame();window.Marhamat?.on('open',()=>{active=false;cancelAnimationFrame(raf)});window.addEventListener('resize',size,{passive:true});new IntersectionObserver(es=>{active=es[0].isIntersecting;if(active&&!document.hidden)frame();else cancelAnimationFrame(raf)}).observe($('#intro'));document.addEventListener('visibilitychange',()=>{if(!document.hidden&&active)frame();else cancelAnimationFrame(raf)});
  }
  function init(){circleDate();intro();scrollMotion();ambient();window.Marhamat?.on('rsvp',answer=>{if(answer?.status==='yes'){$('.ink-hearts')?.animate([{transform:'scale(.7)',opacity:.3},{transform:'scale(1.2)',opacity:1},{transform:'scale(1)',opacity:1}],{duration:700})}});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
