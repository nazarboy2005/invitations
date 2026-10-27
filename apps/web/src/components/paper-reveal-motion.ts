/** Same cubic-bezier timing as the original paper reveal: (.3, 0, .2, 1). */
export function paperEase(progress: number) {
  const x = Math.min(1, Math.max(0, progress));
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 14; i++) {
    const t = (lo + hi) / 2;
    const u = 1 - t;
    const time = 3 * u * u * t * 0.3 + 3 * u * t * t * 0.2 + t * t * t;
    if (time < x) lo = t;
    else hi = t;
  }
  const t = (lo + hi) / 2;
  return x === 0 || x === 1 ? x : 3 * (1 - t) * t * t + t * t * t;
}

export function paperHash(i: number, seed: number) {
  const n = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
