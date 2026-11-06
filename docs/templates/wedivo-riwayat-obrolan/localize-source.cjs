const fs=require('fs'), ts=require('typescript'), vm=require('vm');
const base='apps/web/public/templates/wedivo-riwayat-obrolan/';
const context={window:{}};vm.runInNewContext(fs.readFileSync(base+'i18n.js','utf8'),context);
const dictionary=context.window.riwayatDictionary;
let source=fs.readFileSync(base+'source/template.js','utf8');
const ast=ts.createSourceFile('template.js',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS),replacements=[];
function visit(n){
 if(ts.isStringLiteral(n) && dictionary[n.text.trim()]){
  const p=n.parent;
  const key=(ts.isPropertyAssignment(p)||ts.isMethodDeclaration(p)) && p.name===n;
  if(!key)replacements.push([n.getStart(ast),n.getEnd(),`win.riwayatText(${source.slice(n.getStart(ast),n.getEnd())})`]);
 }
 ts.forEachChild(n,visit);
}
visit(ast);for(const [a,b,s] of replacements.reverse())source=source.slice(0,a)+s+source.slice(b);
fs.writeFileSync(base+'source/template.js',source);console.log('Localized source literals:',replacements.length);
