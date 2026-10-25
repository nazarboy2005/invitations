/** Keep the art and real labels inside the viewport throughout their orbit. */
export function occasionLayout(width: number, height: number) {
  const phone = width <= 700;
  const compact = phone && height <= 700;
  const artwork = phone
    ? compact
      ? 96
      : 132
    : Math.min(245, Math.max(136, width * 0.145));
  const caption = phone
    ? compact
      ? 90
      : 112
    : Math.min(205, Math.max(120, width * 0.13));
  return {
    artwork,
    caption,
    radiusX: phone
      ? (width - artwork - 24) / 2
      : Math.min(width * 0.285, width / 2 - artwork / 2 - caption - 28),
    radiusY: phone
      ? Math.min(height * (compact ? 0.22 : 0.225), compact ? 130 : 190)
      : Math.min(height * 0.205, 210),
    shift: height * 0.06,
    rotation: Math.PI / 2,
    angles: [-135, -45, 135, 45].map((angle) => (angle * Math.PI) / 180),
  };
}

const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

/** One continuous caption: around the inner edge at the poles, outward at the sides. */
export function occasionCaption(
  angle: number,
  artwork: number,
  labelHeight: number,
  radiusY: number,
) {
  const side = smooth((Math.cos(angle) + 0.28) / 0.56) * 2 - 1;
  const bend = 1 - smooth((Math.abs(side) - 0.8) / 0.2);
  const halfPhoto = artwork * 0.49; // Includes the tilted silk silhouette.
  const safeScale = Math.max(
    0.5,
    Math.min(1, (radiusY - 31 - labelHeight - 16) / halfPhoto),
  );
  const scale = 1 - bend * (1 - safeScale);
  return {
    side,
    y:
      -Math.sign(Math.sin(angle)) *
      bend *
      (halfPhoto * scale + 10 + labelHeight / 2),
    scale,
    flourish: 1 - bend,
  };
}
