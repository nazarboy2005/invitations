
(function(){
  var $cover   = document.getElementById('cover');
  var $openBtn = document.getElementById('open-btn');
  var $letter  = document.getElementById('letter');
  var $yes     = document.getElementById('yes-btn');
  var $no      = document.getElementById('no-btn');
  var $noArea  = document.getElementById('no-area');
  var $petals  = document.getElementById('petals');
  var $confirm = document.getElementById('confirm');
  var $cta     = document.getElementById('confirm-cta');

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Cover open ────────────────────────────────────
  function openCover(){
    if($cover.classList.contains('open')) return;
    $cover.classList.add('open');
    $cover.setAttribute('aria-hidden','true');
    $letter.setAttribute('aria-hidden','false');
    setTimeout(function(){ $letter.classList.add('show'); }, reduced?0:150);
  }
  $cover.addEventListener('click', openCover);
  $cover.addEventListener('keydown', function(e){
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openCover(); }
  });
  $openBtn.addEventListener('click', function(e){ e.stopPropagation(); openCover(); });

  // ─── No button — dodging ───────────────────────────
  // The dodge captions are localised: the i18n block publishes a per-
  // language array on window.__LK02_NO_STAGES (keyed uz/en/ru) and keeps
  // it in sync on langchange. We read the active language each dodge so a
  // mid-interaction switch shows the right caption.
  var NO_STAGES = {
    uz: ['Hozir emas','Hozir emas?','Rostdanmi?','Yoq, bo\'ladi'],
    en: ['Not now','Not now?','Really?','Okay, fine'],
    ru: ['Не сейчас','Не сейчас?','Правда?','Ладно, согласна']
  };
  window.__LK02_NO_STAGES = NO_STAGES;
  function noStagesFor(){
    var l = (window.__takliflaLang || document.documentElement.lang || 'uz').toLowerCase().slice(0,2);
    return NO_STAGES[l] || NO_STAGES.uz;
  }
  var dodgeCount = 0;

  function dodge(e){
    if(reduced) return; // accessibility — let user actually click
    if(dodgeCount >= 3) return; // surrendered, allow click
    if(e) e.preventDefault();
    dodgeCount++;

    // Switch to absolutely-positioned dodging on first dodge
    if(!$no.classList.contains('dodging')){
      var rect = $no.getBoundingClientRect();
      var areaRect = $noArea.getBoundingClientRect();
      $noArea.style.minHeight = areaRect.height + 'px';
      $no.style.left = (rect.left - areaRect.left) + 'px';
      $no.style.top  = (rect.top  - areaRect.top)  + 'px';
      $no.classList.add('dodging');
    }

    // Find a new safe position within the shell (never off-screen)
    var shellRect = document.getElementById('shell').getBoundingClientRect();
    var areaRect2 = $noArea.getBoundingClientRect();
    var btnW = $no.offsetWidth;
    var btnH = $no.offsetHeight;
    var safePad = 18;

    // safe area: stay within shell horizontally, and within letter vertically (don't go above question)
    var minLeftAbs = shellRect.left + safePad;
    var maxLeftAbs = shellRect.right - btnW - safePad;
    var minTopAbs  = areaRect2.top - 60;
    var maxTopAbs  = shellRect.bottom - btnH - safePad;

    var newLeftAbs = minLeftAbs + Math.random() * Math.max(0, maxLeftAbs - minLeftAbs);
    var newTopAbs  = minTopAbs  + Math.random() * Math.max(0, maxTopAbs  - minTopAbs);

    var newLeft = newLeftAbs - areaRect2.left;
    var newTop  = newTopAbs  - areaRect2.top;

    $no.style.left = newLeft + 'px';
    $no.style.top  = newTop  + 'px';

    var stages = noStagesFor();
    $no.textContent = stages[Math.min(dodgeCount, stages.length-1)];

    $no.classList.remove('wobble');
    // force reflow to restart animation
    void $no.offsetWidth;
    $no.classList.add('wobble');

    if(dodgeCount >= 3){
      $no.classList.add('surrender');
    }
  }

  // Use pointerover/touchstart so it dodges before click fires reliably,
  // but also bind click as fallback.
  $no.addEventListener('pointerenter', dodge);
  $no.addEventListener('touchstart', function(e){
    if(dodgeCount < 3) dodge(e);
  }, {passive:false});
  $no.addEventListener('click', function(e){
    if(dodgeCount < 3){ dodge(e); return; }
    // After surrender, treat as Yes
    triggerYes();
  });

  // ─── Yes button — petals + confirm ─────────────────
  function spawnPetals(){
    if(reduced) return;
    var COUNT = 22;
    var W = $petals.clientWidth || window.innerWidth;
    var palette = ['#D99584','#C97766','#B89968','#6B4C8A','#EDD0DA'];
    for(var i=0;i<COUNT;i++){
      var p = document.createElement('div');
      p.className = 'petal';
      var x = Math.random() * W;
      var dx = (Math.random() - 0.5) * 120;
      var rot = (Math.random() * 720 - 360);
      var dur = 1.2 + Math.random() * 0.6;
      var delay = Math.random() * 0.4;
      var size = 10 + Math.random() * 10;
      var color = palette[Math.floor(Math.random()*palette.length)];
      p.style.left = x + 'px';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--rot', rot + 'deg');
      p.style.animationDuration = dur + 's';
      p.style.animationDelay = delay + 's';
      p.innerHTML = '<svg viewBox="0 0 14 14" fill="none">'
        + '<path d="M7 1 C 11 2 13 6 11 10 C 9 13 5 13 3 10 C 1 6 3 2 7 1 Z" fill="'+color+'" opacity="0.9"/>'
        + '</svg>';
      $petals.appendChild(p);
      // trigger
      requestAnimationFrame(function(el){ return function(){ el.classList.add('fall'); }; }(p));
    }
    setTimeout(function(){
      while($petals.firstChild) $petals.removeChild($petals.firstChild);
    }, 2200);
  }

  function triggerYes(){
    if($confirm.classList.contains('show')) return;
    spawnPetals();
    // Build map link from current (possibly-replaced) venue/address text
    try{
      var propVal = document.querySelector('.prop-cell.full .prop-val');
      var propSub = document.querySelector('.prop-cell.full .prop-sub');
      var q = encodeURIComponent(((propVal?propVal.textContent:'')+' '+(propSub?propSub.textContent:'')).trim());
      $cta.href = 'https://yandex.com/maps/?text='+q;
    }catch(_){}
    setTimeout(function(){
      $confirm.classList.add('show');
      $confirm.setAttribute('aria-hidden','false');
    }, reduced?0:600);
  }
  $yes.addEventListener('click', triggerYes);
})();
