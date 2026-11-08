window.createZarhalMusic = function(src, autoStart){
    if (!src) return;
    var audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'auto';
    window.__taklifla_audio__ = audio;

    // The button has two visual modes:
    //   - "prompt" (large, with text + pulsing ring) — first-load,
    //     audio paused, no user gesture yet. Drives the user to tap so
    //     iOS Safari unlocks playback.
    //   - "compact" (small circular icon) — once playing, the button
    //     shrinks to a discreet bottom-right toggle.
    // Modes are toggled by setting/removing class names on the button.
    var btn = document.createElement('button');
    btn.id = 'zarhal-music';
    btn.type = 'button';
    btn.setAttribute('aria-label', window.zarhalLabels.musicPlay);

    var STYLE_PROMPT = [
      'position:fixed','bottom:16px','right:16px','z-index:9999',
      'min-width:56px','height:56px','padding:0 22px',
      'border-radius:28px','border:1px solid #2A2118',
      'background:#A7842F','color:#FBF6EC',
      'font-size:14px','font-weight:600','letter-spacing:0.04em',
      'line-height:1','cursor:pointer',
      "font-family:'Manrope',sans-serif",
      'box-shadow:0 6px 18px -6px rgba(0,0,0,0.4)',
      'display:flex','align-items:center','gap:10px',
      'transition:all 280ms ease',
    ].join(';');
    var STYLE_COMPACT = [
      'position:fixed','bottom:16px','right:16px','z-index:9999',
      'width:44px','height:44px','padding:0',
      'border-radius:50%','border:1px solid #2A2118',
      'background:#A7842F','color:#FBF6EC',
      'font-size:14px','line-height:1','cursor:pointer',
      'box-shadow:0 6px 18px -6px rgba(0,0,0,0.4)',
      'display:grid','place-items:center',
      'transition:all 280ms ease',
    ].join(';');

    var ringStyle = document.createElement('style');
    ringStyle.textContent = '@keyframes tk-pulse{0%{box-shadow:0 0 0 0 rgba(167,132,47,0.55),0 6px 18px -6px rgba(0,0,0,0.4);}70%{box-shadow:0 0 0 14px rgba(167,132,47,0);}100%{box-shadow:0 0 0 0 rgba(167,132,47,0);}} .tk-pulse{animation:tk-pulse 1.6s ease-out infinite;}';
    document.head && document.head.appendChild(ringStyle);

    var played = false, chosenPause = false;
    function paint() {
      btn.setAttribute('aria-label', audio.paused ? window.zarhalLabels.musicPlay : window.zarhalLabels.musicPause);
      btn.setAttribute('aria-pressed', String(!audio.paused));
      if (audio.paused) {
        // Prompt mode draws attention — fades to compact once the user
        // has interacted (we set a flag below).
        if (window.__taklifla_audio_seen__) {
          btn.style.cssText = STYLE_COMPACT;
          btn.classList.remove('tk-pulse');
          btn.innerHTML = '▶';
        } else {
          btn.style.cssText = STYLE_PROMPT;
          btn.classList.add('tk-pulse');
          btn.innerHTML = '<span aria-hidden style="font-size:16px;">♫</span><span>' + window.zarhalLabels.musicPlay + '</span>';
        }
      } else {
        btn.style.cssText = STYLE_COMPACT;
        btn.classList.remove('tk-pulse');
        btn.innerHTML = '❚❚';
      }
    }
    paint();
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      window.__taklifla_audio_seen__ = true;
      if (audio.paused) { chosenPause = false; audio.play().catch(function(){}); }
      else { chosenPause = true; audio.pause(); }
      paint();
    });
    function attach(){ if (document.body) document.body.appendChild(btn); else setTimeout(attach, 16); }
    attach();

    function tryPlay(){ if (chosenPause || played) return; audio.play().then(paint).catch(function(){}); }
    if (autoStart) tryPlay();

    var fired = false;
    function onGesture(event){
      if (fired || chosenPause || played || (event && event.target.closest && event.target.closest('#zarhal-music'))) return;
      fired = true;
      window.__taklifla_audio_seen__ = true;
      ['pointerdown','touchstart','click','keydown'].forEach(function(t){
        window.removeEventListener(t, onGesture, true);
      });
      tryPlay();
      paint();
    }
    // Click + pointerdown + touchstart + keydown are the gesture types
    // iOS Safari accepts as user-activation. Scroll deliberately
    // excluded — passive scroll doesn't count on iOS.
    ['pointerdown','touchstart','click','keydown'].forEach(function(t){
      window.addEventListener(t, onGesture, { capture: true, passive: true });
    });
    audio.addEventListener('play', function(){ played = true; paint(); });
    audio.addEventListener('pause', paint);
    return { audio: audio, paint: paint, destroy: function(){ chosenPause = true; audio.pause(); audio.src = ''; btn.remove(); ringStyle.remove(); ['pointerdown','touchstart','click','keydown'].forEach(function(t){window.removeEventListener(t,onGesture,true);}); } };
  };
