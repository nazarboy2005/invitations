(function(){  function cyrl(value) {
    const map={a:"а",b:"б",v:"в",g:"г",d:"д",e:"е",z:"з",i:"и",j:"ж",k:"к",l:"л",m:"м",n:"н",o:"о",p:"п",r:"р",s:"с",t:"т",u:"у",f:"ф",x:"х",c:"ц",y:"й",h:"ҳ",q:"қ"};
    const pairs={"o'":"ў","g'":"ғ",sh:"ш",ch:"ч",ng:"нг",yo:"ё",yu:"ю",ya:"я",ye:"е"};
    const convert=text=>{text=text.replace(/[‘’ʻ]/g,"'");const pair=m=>{let v=pairs[m.toLowerCase()];return m===m.toUpperCase()?v.toUpperCase():m[0]===m[0].toUpperCase()?v[0].toUpperCase()+v.slice(1):v;};text=text.replace(/o'|g'/gi,pair).replace(/sh|ch|ng|yo|yu|ya|ye/gi,pair).replace(/\be/gi,m=>m==="E"?"Э":"э");return [...text].map(c=>c==="'"?"ъ":map[c.toLowerCase()]?(c===c.toUpperCase()?map[c.toLowerCase()].toUpperCase():map[c]):c).join("");};
    return value.split(/(<[^>]*>)/).map(t=>t.startsWith("<")?t:convert(t)).join("");
  }
window.qogozCyrl=cyrl;})();
