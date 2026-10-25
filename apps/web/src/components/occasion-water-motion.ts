export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const mix = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

// Projection of the water origin for the fixed camera in occasion-water.ts.
export const WATER_SURFACE_Y = ((3 - 0.14 * 7) / (7 + 0.14 * 3)) * 0.9;

export type WaterFrame = ReturnType<typeof waterFrame>;

/** All positions are CSS pixels from the screen centre, positive downwards. */
export function waterFrame(progress: number, height: number, phone: boolean) {
  const p = clamp(progress);
  const surfaceY = height * WATER_SURFACE_Y;
  const restingRadius = phone ? 7 : 9;
  const liquidRadius = Math.min(phone ? 23 : 30, Math.max(18, height * 0.035));
  const fall = clamp(p / 0.18);
  const impact = ease((p - 0.18) / 0.07);
  const rebound = ease((p - 0.25) / 0.15);
  const lift = ease((p - 0.4) / 0.18);
  const morph = ease((p - 0.46) / 0.14);
  const separation = ease((p - 0.4) / 0.085);
  let radius: number;
  let dropY: number;
  let stretch = 1;

  if (p <= 0.18) {
    radius = liquidRadius;
    dropY = mix(-height * 0.3, surfaceY - liquidRadius, fall * fall);
    stretch = 1 + 0.35 * Math.sin(fall * Math.PI);
  } else if (p <= 0.25) {
    radius = liquidRadius * (1 - impact);
    dropY = surfaceY - radius;
    stretch = 1 - impact * 0.75;
  } else {
    radius = mix(liquidRadius * rebound, restingRadius, morph);
    dropY = mix(surfaceY, height * 0.065, rebound) * (1 - lift);
  }

  const stemTop = mix(dropY + radius * 0.7, surfaceY, separation);
  return {
    progress: p,
    surfaceY,
    dropY,
    radius,
    stretch,
    restingRadius,
    stemTop: Math.min(surfaceY, stemTop),
    stemWidth: liquidRadius * 0.42 * rebound * (1 - separation),
    splash: Math.sin(impact * Math.PI) * (1 - rebound),
    rippleAge: clamp((p - 0.18) / 0.44) * 3.5,
    waterOpacity: 1 - ease((p - 0.49) / 0.13),
    morph,
    handoff: ease((p - 0.6) / 0.025),
    release: ease((p - 0.625) / 0.165),
    orbit: ease((p - 0.79) / 0.17),
  };
}

/** Limit both fill rate and device-pixel scaling, including on high-DPI phones. */
export function waterResolution(
  width: number,
  height: number,
  phone: boolean,
  budgetScale = 1,
) {
  const budget = (phone ? 180_000 : 440_000) * budgetScale;
  const scale = Math.min(1, Math.sqrt(budget / Math.max(1, width * height)));
  return {
    width: Math.max(1, Math.floor(width * scale)),
    height: Math.max(1, Math.floor(height * scale)),
  };
}
