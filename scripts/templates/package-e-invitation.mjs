import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(new URL('../../apps/web/package.json',import.meta.url));
const {chromium}=require('playwright');
const ids=['olive-manor-edition','islamic-edition','monochrome-editorial-edition','xatna-edition'];
const common=JSON.parse(await fs.readFile('apps/web/public/templates/e-invitation-shared/labels.json','utf8'));
const maps={
  'olive-manor-edition': {
    '.section-hero__name:first-child':'groom','.section-hero__name:last-child':'bride',
    '.section-intro__seal-initials':'initials','@olive-editorial-date span':'date.short',
    '.section-invitation__guest-name--full':'greeting','@olive-invitation-first':'message','@olive-invitation-second':'hosts',
    '.calendar-card__year':'date.year','.calendar-card__month':'date.month','.calendar-card__weekday':'date.weekday','.calendar-card__time span':'date.time',
    '@olive-venue':'venue.name','@olive-address':'venue.address','.section-payment__number':'toyona.cardNumber','.section-payment__holder strong':'toyona.cardHolder',
    '.section-closing__family':'hosts','.section-payment__bank':'empty',
  },
  'islamic-edition': {
    '@islamic-hero-greeting':'greeting','@islamic-hero-address':'guestName','@islamic-primary-name':'groom','@islamic-secondary-name':'bride',
    '@islamic-couple-intro':'eventType','@islamic-couple-label':'message','@islamic-calendar-date':'date.monthYear','@islamic-calendar-time':'date.time',
    '@islamic-main-venue':'venue.name','@islamic-main-address':'venue.address','@islamic-card-number':'toyona.cardNumber','@islamic-card-holder':'toyona.cardHolder',
    '@islamic-family':'hosts','@islamic-card-bank':'empty','.section-calendar__footer-text':'date.long',
  },
  'monochrome-editorial-edition': {
    '@mono-intro-groom':'groom','@mono-intro-bride':'bride','@mono-intro-date':'date.short',
    '@mono-cover-groom':'groom','@mono-cover-bride':'bride','@mono-cover-date':'date.short','@mono-cover-tagline':'greeting',
    '.section-invitation__monogram span:first-child':'groomInitial','.section-invitation__monogram span:last-child':'brideInitial',
    '@mono-invitation-title':'greeting','@mono-invitation-paragraph-0':'message','@mono-invitation-paragraph-1':'hosts','@mono-invitation-paragraph-2':'empty','@mono-invitation-paragraph-3':'empty','@mono-invitation-signature':'pair',
    '@mono-location-venue':'venue.name','@mono-location-address':'venue.address','@mono-location-date':'date.long','@mono-location-time':'date.time',
    '@mono-gift-number':'toyona.cardNumber','@mono-gift-holder':'toyona.cardHolder','@mono-gift-bank':'empty',
    '@mono-final-groom':'groom','@mono-final-bride':'bride','@mono-final-date':'date.short','.section-calendar__title':'date.monthYear',
    '@mono-rsvp-deadline':'deadline',
  },
  'xatna-edition': {
    '@xatna-greeting':'greeting','@xatna-guest':'guestName','@xatna-child-name':'child','@xatna-child-invite':'message','@xatna-event':'eventType',
    '@xatna-date':'date.monthYear','@xatna-time time':'date.time','.section-calendar__footer-text':'date.long',
    '@xatna-venue':'venue.name','@xatna-address':'venue.address','@xatna-family':'hosts',
    '.section-card__number':'toyona.cardNumber','.section-card__holder':'toyona.cardHolder','.section-card__bank':'empty','.section-xatna-closing__monogram':'hostInitial',
    '@xatna-child-intro':'eventType',
  },
};
const browser=await chromium.launch();
for(const id of ids){
  const base=`apps/web/public/templates/${id}`;
  let specific={};if(['islamic-edition','monochrome-editorial-edition'].includes(id))specific=JSON.parse(await fs.readFile(`${base}/source/labels.json`,'utf8'));
  const labels={};
  for(const lang of ['uz','oz','en','ru']) labels[lang]={common:common[lang],specific:specific[lang]||{}};
  const page=await browser.newPage();
  await page.setContent(await fs.readFile(`${base}/source/current/rendered-reference.html`,'utf8'));
  const result=await page.evaluate(({id,labels,map})=>{
    const root=document.body.firstElementChild;
    if(id==='xatna-edition') {
      // SectionGallery's complete element tree from XatnaEdition.module.js.
      const gallery=document.createElement('section');gallery.className='section-child-gallery';
      gallery.innerHTML='<div class="section-child-gallery__inner"><p class="section-child-gallery__eyebrow" data-reveal data-e-field="child"></p><h2 class="section-child-gallery__title" data-reveal data-e-label="common.oliveManor.gallery.title"></h2><div class="section-child-gallery__grid" data-reveal-stagger><figure class="section-child-gallery__item" data-reveal><img decoding="async" alt=""></figure></div></div>';
      [gallery,...gallery.querySelectorAll('*')].forEach(e=>e.setAttribute('data-v-b5f6b54e',''));
      root.querySelector('.section-quote').after(gallery);
    }
    const select=s=>s.startsWith('@')?`[data-editable-id="${s.slice(1).split(' ')[0]}"]${s.includes(' ')?' '+s.split(' ').slice(1).join(' '):''}`:s;
    const misses=[];
    for(const [s,key] of Object.entries(map)){
      const nodes=root.querySelectorAll(select(s));if(!nodes.length)misses.push(s);
      nodes.forEach(el=>{el.dataset.eField=key;el.textContent='';el.removeAttribute('data-e-label')});
    }
    // Unsupported seating assignments and source personal/contact/payment data are never rendered.
    root.querySelectorAll('.section-table,.section-supplement__table,.section-location__guest-card,.editorial-guest-card,.section-guest-card').forEach(el=>el.remove());
    root.querySelectorAll('script,audio,.music-player,.section-music,.section-music__button').forEach(el=>el.remove());
    root.removeAttribute('order');root.removeAttribute('mode');root.removeAttribute('contained');root.removeAttribute('guest-token');
    root.style.setProperty('--invitation-overlay-offset','0px');root.style.setProperty('--invitation-fixed-right','18px');
    root.querySelectorAll('iframe').forEach(el=>el.removeAttribute('src'));
    root.querySelectorAll('a').forEach(el=>{if(!el.getAttribute('href')?.startsWith('#'))el.removeAttribute('href')});
    for(const el of [root,...root.querySelectorAll('*')]){
      for(const a of [...el.attributes]){
        if(a.name.startsWith('on')||a.name==='data-editable-label'||/Akmal|Madina|Yusufbek|2030|998000|998 00/.test(a.value))el.removeAttribute(a.name);
        if(/https?:\/\/assets\.e-invitation\.uz\//.test(a.value))el.setAttribute(a.name,a.value.replaceAll(`https://assets.e-invitation.uz/${id}/`,`/templates/${id}/source/current/assets/`));
      }
      el.classList.remove('visible','is-visible','aos-animate');
      if(el.matches('video')){el.muted=true;el.setAttribute('muted','');el.removeAttribute('autoplay');}
      if(el.matches('input,textarea')){el.removeAttribute('value');el.value='';el.removeAttribute('placeholder')}
      if(el.matches('time'))el.removeAttribute('datetime');
    }
    // Creator media is bound only from the shared payload; retain the source frames.
    root.querySelectorAll('.section-gallery img,.section-child-gallery img').forEach(el=>{el.removeAttribute('src');el.alt=''});
    const normalize=s=>s.replace(/[‘’ʻʼ`]/g,"'").replace(/\s+/g,' ').trim().toLowerCase();
    const values=new Map();
    function flatten(obj,prefix='') {for(const [k,v] of Object.entries(obj)){const key=prefix?prefix+'.'+k:k;if(typeof v==='string')values.set(normalize(v),key);else if(v&&typeof v==='object')flatten(v,key)}}
    flatten(labels.uz);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),texts=[];while(walker.nextNode())texts.push(walker.currentNode);
    const unknown=[];
    for(const node of texts){
      const el=node.parentElement,text=node.textContent;if(!text.trim()||el.closest('[data-e-field],svg'))continue;
      const key=values.get(normalize(text));
      if(key){
        const label=el.childNodes.length===1?el:document.createElement('span');
        if(label!==el){for(const a of el.attributes)if(a.name.startsWith('data-v-'))label.setAttribute(a.name,'');node.replaceWith(label);label.textContent=text;}
        label.dataset.eLabel=key;
      } else if(/[\u0600-\u06ff]/.test(text)&&!/[A-Za-z]/.test(text)) {
        // Original Arabic calligraphy is ornamental template text, independent of locale.
      } else if(!/^[\s\d\-—·.,:;&/№✦✧❧❦❝❞۞⌁◆›↗︎&]+$/.test(text)){
        unknown.push({cls:el.className,id:el.dataset.editableId,text});node.textContent='';
      } else if(/\d/.test(text)) node.textContent='';
    }
    root.querySelectorAll('img[alt]').forEach(el=>{if(!el.alt||/Akmal|Madina|Yusufbek|2030/.test(el.alt))el.alt=''});
    return {html:root.outerHTML,unknown,misses};
  },{id,labels,map:maps[id]});
  await fs.writeFile(`${base}/template.html`,result.html);
  await fs.writeFile(`${base}/source/labels.json`,JSON.stringify(labels,null,2));
  await fs.writeFile(`D:/Projects/Fotiha/output/${id}-unmapped.json`,JSON.stringify({unknown:result.unknown,misses:result.misses},null,2));
  console.log(id,'unmapped',result.unknown.length,'missing selectors',result.misses);
  await page.close();
}
await browser.close();
