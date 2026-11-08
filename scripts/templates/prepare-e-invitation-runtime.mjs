import fs from 'node:fs/promises';
import ts from 'typescript';
const ids=['olive-manor-edition','islamic-edition','monochrome-editorial-edition','xatna-edition'];
for(const id of ids){
  const base=`apps/web/public/templates/${id}`;
  await fs.writeFile(`${base}/index.html`,`<!doctype html>
<html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${id}</title>
<link rel="stylesheet" href="/templates/${id}/source/current/fonts.css">
<link rel="stylesheet" href="/templates/${id}/source/current/invitation.css">
<link rel="stylesheet" href="/templates/${id}/source/current/template.css">
<link rel="stylesheet" href="/templates/${id}/source/current/inline.css">
<link rel="stylesheet" href="/templates/e-invitation-shared/adapter.css">
</head><body style="visibility:hidden"><main id="invitation"></main><script type="module" src="/templates/${id}/renderer.js"></script></body></html>\n`);
  await fs.writeFile(`${base}/renderer.js`,`import { mount } from '../e-invitation-shared/runtime.js';
import motion from './motion.js';
mount('${id}', motion).catch(error => { console.error(error); document.body.style.visibility = 'visible'; document.getElementById('invitation').textContent = 'Taklifnoma yuklanmadi. Sahifani yangilang.'; });\n`);
}
const file='apps/web/public/templates/islomiy/source/current/template.module.js';
const source=await fs.readFile(file,'utf8'),sf=ts.createSourceFile(file,source,99,true);
const particle=sf.statements.find(n=>ts.isClassDeclaration(n)&&n.name?.text==='Ra');
if(!particle)throw Error('Source star engine changed; inspect before extracting.');
const engine=`// Exact StarsCanvas particle class from the captured Islamic template module.\nconst Me=18,Le=[201,167,82],$e=[232,213,160];\n${particle.getText(sf)}
export function stars(root,reduced){
  const canvas=root.querySelector('.stars-canvas');if(!canvas||reduced)return;
  const context=canvas.getContext('2d');if(!context)return;let particles=[],frame;
  function resize(){const bounds=canvas.getBoundingClientRect();canvas.width=Math.max(1,Math.round(bounds.width));canvas.height=Math.max(1,Math.round(bounds.height));particles=Array.from({length:Me},()=>new Ra(canvas.width,canvas.height,true));}
  resize();new ResizeObserver(resize).observe(canvas);
  function draw(){if(!document.hidden){context.clearRect(0,0,canvas.width,canvas.height);particles.forEach(p=>{p.update();p.draw(context)});}frame=requestAnimationFrame(draw);}
  draw();window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
}\n`;
await fs.writeFile('apps/web/public/templates/islomiy/stars.js',engine);
