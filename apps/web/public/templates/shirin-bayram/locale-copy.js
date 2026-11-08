(()=>{
  const lang=new URLSearchParams(location.search).get('lang')||'uz';
  const copy={
    uz:['Shirin Bayram','Shirin Bayram taklifnomasi'],
    'uz-Cyrl':['Ширин байрам','Ширин байрам таклифномаси'],
    ru:['Сладкий праздник','Приглашение на сладкий праздник'],
    en:['Sweet Celebration','Sweet Celebration invitation']
  }[lang]||['Shirin Bayram','Shirin Bayram invitation'];
  document.title=copy[0];
  const title=document.querySelector('meta[property="og:title"]');
  if(title) title.content=copy[0];
  const description=document.querySelector('meta[name="description"]');
  if(description) description.content=copy[1];
})();
