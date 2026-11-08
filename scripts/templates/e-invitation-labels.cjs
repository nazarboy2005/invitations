const fs = require('node:fs'), ts = require('typescript');
function literals(file) {
  const sf=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),99,true), known={};
  function read(n) {
    if(ts.isStringLiteralLike(n)||ts.isNumericLiteral(n))return ts.isNumericLiteral(n)?Number(n.text):n.text;
    if(n.kind===ts.SyntaxKind.TrueKeyword)return true;
    if(n.kind===ts.SyntaxKind.FalseKeyword)return false;
    if(n.kind===ts.SyntaxKind.NullKeyword)return null;
    if(ts.isIdentifier(n)&&Object.hasOwn(known,n.text))return known[n.text];
    if(ts.isPrefixUnaryExpression(n)){const v=read(n.operand);if(n.operator===ts.SyntaxKind.ExclamationToken)return !v;if(n.operator===ts.SyntaxKind.MinusToken)return -v;}
    if(ts.isArrayLiteralExpression(n))return n.elements.map(read);
    if(ts.isObjectLiteralExpression(n)){
      const v={};for(const p of n.properties){
        if(ts.isSpreadAssignment(p)){Object.assign(v,read(p.expression));continue;}
        if(!ts.isPropertyAssignment(p))throw Error('Nonliteral');
        if(['defaultGroomName','defaultBrideName','defaultVenue','creditLabel'].includes(p.name.text))continue;
        try {v[p.name.text]=read(p.initializer);}catch{}
      }return v;
    }
    if(ts.isPropertyAccessExpression(n))return read(n.expression)[n.name.text];
    throw Error('Nonliteral');
  }
  for(const s of sf.statements)if(ts.isVariableStatement(s))for(const d of s.declarationList.declarations)try{known[d.name.text]=read(d.initializer)}catch{}
  return Object.values(known).filter(x=>x&&typeof x==='object'&&!Array.isArray(x));
}
const base=literals("D:/Projects/Fotiha/Templates/E-invitation/Nikoh to'yi/_nuxt/CpAy8Rbk.js");
const languages=['uz','oz','ru','en'];
// Original labels only; no source registry, orders or app code is executed.
const common={};for(const [idx,lang] of languages.entries()){
  const name=['Taklifnoma','Таклифнома','Приглашение','Invitation'][idx];
  const obj=base.find(x=>x.title===name&&x.htmlLang);
  common[lang]=Object.fromEntries(['ui','manor','oliveManor','xatna','islamic'].filter(k=>obj[k]).map(k=>[k,obj[k]]));
}
fs.mkdirSync('apps/web/public/templates/e-invitation-shared',{recursive:true});
fs.writeFileSync('apps/web/public/templates/e-invitation-shared/labels.json',JSON.stringify(common,null,2));
for(const id of ['islamic-edition','monochrome-editorial-edition']){
  const file=`apps/web/public/templates/${id}/source/current/template.module.js`;
  if(!fs.existsSync(file))continue;
  const entries=literals(file),result={};
  for(const entry of entries){
    if(entry.htmlLang&&entry.title){const lang=entry.title==='Таклифнома'?'oz':entry.htmlLang;if(languages.includes(lang))result[lang]={ui:entry.ui,islamic:entry.islamic};}
    if(entry.locale&&['uz','ru','en','oz','uz-Cyrl'].includes(entry.locale))result[entry.locale==='uz-Cyrl'?'oz':entry.locale]=entry;
  }
  fs.writeFileSync(`apps/web/public/templates/${id}/source/labels.json`,JSON.stringify(result,null,2));
  console.log(id,Object.keys(result));
}
console.log('common',Object.fromEntries(Object.entries(common).map(([k,v])=>[k,Object.keys(v)])));
