/* A struck membrane, a dry rim slap and loose metal rings, synthesized locally.
   Sound starts only from a gesture. There is no song or remote audio dependency. */
(() => {
  'use strict';
  let ctx = null, master = null, noise = null, muted = false;
  const stats = { dum: 0, tak: 0, jingle: 0 };
  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return ctx; }
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return null;
    try { ctx = new Audio(); } catch (_) { return null; }
    master = ctx.createGain(); master.gain.value = muted ? 0 : .58;
    const compressor = ctx.createDynamicsCompressor(); compressor.threshold.value = -18; compressor.knee.value = 15; compressor.ratio.value = 4; compressor.attack.value = .003; compressor.release.value = .16;
    master.connect(compressor); compressor.connect(ctx.destination);
    // A very short room reflection adds space without a long artificial reverb tail.
    const delay = ctx.createDelay(.2), room = ctx.createGain(), low = ctx.createBiquadFilter();
    delay.delayTime.value = .047; room.gain.value = .09; low.type = 'lowpass'; low.frequency.value = 2700;
    master.connect(delay); delay.connect(low); low.connect(room); room.connect(compressor);
    noise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate), ctx.sampleRate);
    const samples = noise.getChannelData(0); for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    return ctx;
  }
  const ok = () => !muted && ensure();
  function envelope(gain, t, attack, peak, decay) {
    gain.gain.setValueAtTime(.0001, t); gain.gain.exponentialRampToValueAtTime(Math.max(.0002, peak), t + attack); gain.gain.exponentialRampToValueAtTime(.0001, t + attack + decay);
  }
  function mode(frequency, t, volume, decay, pitchDrop = 1) {
    const oscillator = ctx.createOscillator(), gain = ctx.createGain();
    oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(frequency * pitchDrop, t); oscillator.frequency.exponentialRampToValueAtTime(frequency, t + .035);
    envelope(gain, t, .0015, volume, decay); oscillator.connect(gain); gain.connect(master);
    oscillator.onended = () => {oscillator.disconnect(); gain.disconnect();}; oscillator.start(t); oscillator.stop(t + decay + .04);
  }
  function transient(t, frequency, q, volume, decay) {
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
    source.buffer = noise; filter.type = 'bandpass'; filter.frequency.value = frequency; filter.Q.value = q;
    envelope(gain, t, .001, volume, decay); source.connect(filter); filter.connect(gain); gain.connect(master);
    source.onended = () => {source.disconnect(); filter.disconnect(); gain.disconnect();}; source.start(t, Math.random() * .5); source.stop(t + decay + .02);
  }
  function dum(when = 0, volume = 1) {
    if (!ok()) return; stats.dum++;
    const t = ctx.currentTime + when, base = 118 * (.985 + Math.random() * .03);
    [[1,.76,.42],[1.59,.32,.3],[2.14,.16,.21],[2.65,.09,.15],[3.16,.035,.1]].forEach(([ratio,amp,decay]) => mode(base * ratio, t, amp * volume, decay, 1.16));
    transient(t, 750, .55, .2 * volume, .045); transient(t, 2500, .7, .05 * volume, .025);
  }
  function tak(when = 0, volume = 1) {
    if (!ok()) return; stats.tak++;
    const t = ctx.currentTime + when;
    [[286,.24,.14],[451,.13,.1],[637,.08,.07],[910,.035,.055]].forEach(([frequency,amp,decay]) => mode(frequency, t, amp * volume, decay, 1.055));
    transient(t, 2100, .65, .54 * volume, .055); transient(t, 4300, 1.1, .14 * volume, .025);
  }
  function jingle(when = 0, count = 4, volume = .5) {
    if (!ok()) return; stats.jingle++;
    const t0 = ctx.currentTime + when;
    for (let i = 0; i < count; i++) {
      const t = t0 + Math.random() * .055 + i * .009, base = 1800 + Math.random() * 1400;
      [1,1.47,2.09,2.76].forEach((ratio,j) => mode(base * ratio, t, .022 / (j + 1) * volume, .12 + Math.random() * .15));
    }
    transient(t0, 5300, .6, .06 * volume, .09);
  }
  window.DoiraSound = { unlock: ensure, dum, tak, jingle, stats,
    setMuted(value) { muted = !!value; if (master) master.gain.setTargetAtTime(muted ? 0 : .58, ctx.currentTime, .025); },
    suspend() { if (ctx?.state === 'running') ctx.suspend().catch(() => {}); },
    get muted() { return muted; }, get state() { return ctx?.state || 'uninitialized'; }
  };
})();
