(()=>{
  const lang=new URLSearchParams(location.search).get('lang')||'uz';
  const copy={
    uz:['Shirin Bayram · Marxaba','Shirin Bayram · Marxaba taklifnomasi'],
    'uz-Cyrl':['Ширин байрам · Marxaba','Ширин байрам таклифномаси · Marxaba'],
    ru:['Сладкий праздник · Marxaba','Приглашение на сладкий праздник · Marxaba'],
    en:['Sweet Celebration · Marxaba','Sweet Celebration · Marxaba invitation']
  }[lang]||['Shirin Bayram · Marxaba','Shirin Bayram · Marxaba invitation'];
  document.title=copy[0];
  const title=document.querySelector('meta[property="og:title"]');
  if(title) title.content=copy[0];
  const description=document.querySelector('meta[name="description"]');
  if(description) description.content=copy[1];
})();
