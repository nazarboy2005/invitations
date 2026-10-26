export const STORY_TRAVEL = 3.8;

export const storyChapters = [
  {
    id: "anticipation",
    title: "Shirin hayajon.",
    first: "Shirin",
    second: "hayajon.",
    text: "Quvonchli kun hali boshlanmay turib, yurakda boshlanadi.",
    image: "anticipation",
  },
  {
    id: "together",
    title: "Nihoyat, birgamiz.",
    first: "Nihoyat,",
    second: "birgamiz.",
    text: "Bir davra. Qadrdon chehralar. Bir olam quvonch.",
    image: "together",
  },
  {
    id: "memories",
    title: "Bir umrga xotira.",
    first: "Bir umrga",
    second: "xotira.",
    text: "Kun o‘tadi. Birga his qilganlarimiz esa qoladi.",
    image: "memories",
  },
] as const;

export const clampStory = (value: number) => Math.max(0, Math.min(1, value));

export function smoothStory(value: number) {
  const t = clampStory(value);
  return t * t * (3 - 2 * t);
}

export function storyLightRadius(
  travel: number,
  width: number,
  height: number,
) {
  return (
    12 +
    Math.hypot(width / 2, height * 0.51) *
      1.13 *
      smoothStory((travel + 0.04) / 0.78)
  );
}

/** Overlapping exits/entrances leave the centre clear between collections. */
export function storyChapterState(travel: number, chapter: number) {
  const entryStart = [-0.25, 1.22, 2.37][chapter];
  const exitStart = [1.03, 2.18, 3.45][chapter];
  const incoming = smoothStory(
    (travel - entryStart) / (chapter === 0 ? 0.65 : 0.48),
  );
  const outgoing = smoothStory(
    (travel - exitStart) / (chapter === 2 ? 0.35 : 0.48),
  );
  return { incoming, outgoing, opacity: incoming * (1 - outgoing) };
}

/** Photos occupy successive depths along a helix, rather than one circular plane.
 * The camera advances past each photo once; scrolling back retraces that path. */
export function storyPhotoFrame({
  index,
  count,
  travel,
  chapter,
  drift,
  width,
  height,
}: {
  index: number;
  count: number;
  travel: number;
  chapter: number;
  drift: number;
  width: number;
  height: number;
}) {
  const { incoming } = storyChapterState(travel, chapter);
  const phone = width <= 700;
  const entryStart = [-0.25, 1.22, 2.37][chapter];
  const exitEnd = [1.51, 2.66, STORY_TRAVEL][chapter];
  const advance = clampStory((travel - entryStart) / (exitEnd - entryStart));
  const firstDistance = 4.2;
  const spacing = 1.05;
  const lastDistance = firstDistance + Math.max(0, count - 1) * spacing;
  const camera = advance * (lastDistance + 4.4);
  const distance = firstDistance + index * spacing - camera;
  // Softened perspective avoids the sudden acceleration of 1/z near the
  // camera. Later photos remain small and distant until the camera reaches them.
  const projection = 2.35 / (1 + Math.exp(distance * 0.58));
  const depth = projection / 2.35;
  const angle =
    (index / Math.max(1, count - 1)) * Math.PI * 3.4 -
    Math.PI / 2 +
    chapter * 0.23 +
    advance * 1.05 +
    drift;
  const phoneRadius = Math.min(width, height) * 0.6;
  const radiusX = phone ? phoneRadius : width * 0.4;
  const radiusY = phone ? phoneRadius : height * 0.42;
  const maxScale = phone ? 1.95 : 2.15;
  const apparentScale = 0.035 + projection * (phone ? 1.65 : 1.45);
  // Fade in from the back of the tunnel, then pass the near plane gradually.
  // Size remains bounded even after a photo has travelled out of view.
  const farPlaneFade = smoothStory((projection - 0.055) / 0.17);
  const nearPlaneFade = 1 - smoothStory((projection - 1.25) / 0.85);
  return {
    x: Math.cos(angle) * radiusX * projection,
    y: Math.sin(angle) * radiusY * projection,
    scale: maxScale * Math.tanh(apparentScale / maxScale),
    rotation: Math.sin(index * 3.7) * 12 + Math.sin(angle) * 10,
    tilt: Math.cos(angle) * (12 + Math.min(depth, 1) * 18),
    opacity: incoming * farPlaneFade * nearPlaneFade,
    depth,
  };
}
