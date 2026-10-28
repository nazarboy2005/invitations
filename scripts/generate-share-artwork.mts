// Curate source artwork in docs/design/share-artwork-sources.json, then run
// pnpm share:artwork. All work happens at authoring time, never on a link request.
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { TEMPLATES } from "../packages/contracts/src/index.ts";

type Recipe = {
  source?: string;
  fit?: "cover" | "contain";
  background?: string;
  motif?:
    | "envelope"
    | "rings"
    | "paper"
    | "floral"
    | "confetti"
    | "arch"
    | "butterfly"
    | "island";
  position?: string;
  crop?: [number, number, number, number];
};
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(root, "apps/web/public/templates");
const destination = resolve(root, "apps/web/public/share/templates");
const recipes: Record<string, Recipe> = JSON.parse(
  await readFile(
    resolve(root, "docs/design/share-artwork-sources.json"),
    "utf8",
  ),
);
await mkdir(destination, { recursive: true });

function ornament(
  accent: string,
  background: string,
  motif: Recipe["motif"] = "envelope",
) {
  // Vector templates have no separate bitmap art. Their share image uses a
  // text-free motif and the template palette, with no fabricated initials.
  const motifs = {
    envelope:
      '<rect x="285" y="400" width="630" height="420" rx="18"/><path d="m285 420 315 230 315-230M285 800l220-180m410 180L695 620"/><circle cx="600" cy="650" r="45"/>',
    rings:
      '<circle cx="485" cy="630" r="160"/><circle cx="715" cy="630" r="160"/><path d="m635 424 80-72 80 72-80 64zM480 395v-50m-70 65-25-44m165 44 25-44"/>',
    paper:
      '<path d="m240 675 300-170 60-200 80 180 280 50-225 120-105 200-100-170zM240 675h290l150-190-80-180m-70 370 100 170 105-200-55-160M600 305v310l360-80"/>',
    floral:
      '<path d="M500 880q170-240 65-470m30 270q120-100 170-110M550 780q-140-40-180-140"/><ellipse cx="565" cy="420" rx="55" ry="115"/><ellipse cx="565" cy="420" rx="55" ry="115" transform="rotate(60 565 420)"/><ellipse cx="565" cy="420" rx="55" ry="115" transform="rotate(120 565 420)"/><circle cx="565" cy="420" r="30"/><path d="M595 680q0-130 170-110-40 120-170 110M550 780q-170 20-180-140 150 0 180 140"/>',
    confetti:
      '<path d="m420 800 95-420 220 160zM570 295l30-50m150 110 60-20m-35 135 35 25M415 350l-40-25m-15 230-55 10m360 105 35 45"/><circle cx="720" cy="280" r="18"/><circle cx="850" cy="620" r="18"/><path d="m470 380 228 155M455 450l190 128M440 520l140 95"/>',
    arch: '<path d="M340 880V510q0-220 260-330 260 110 260 330v370M400 880V515q0-165 200-270 200 105 200 270v365"/><path d="M470 740q130-200 260 0M470 740h260v120H470zM600 650V520m-50 0h100"/>',
    butterfly:
      '<path d="M600 690C300 650 230 220 440 320q135 60 160 280 25-220 160-280c210-100 140 330-160 370ZM600 690c-300-160-250 250-75 160l75-160 75 160c175 90 225-320-75-160ZM600 680V490m0 45-50-65m50 65 50-65M390 405q130 60 210 285 80-225 210-285"/>',
    island:
      '<g stroke="none"><ellipse cx="600" cy="790" rx="370" ry="155" fill="#7cc3ca"/><path d="M265 720 530 480l390 175-290 265z" fill="#d8b987"/><path d="M265 680 530 440l390 175-290 265z" fill="#91b276"/><path d="m365 690 190-160 210 95-160 155z" fill="#e9d8ae"/><path d="M480 620V450l145-75 140 80v165l-140 80z" fill="#faf1d9"/><path d="m480 450 145-130 140 135-140 70z" fill="#a87268"/><path d="m625 525 140-70v165l-140 80z" fill="#dbc7aa"/><path d="M585 620v-75q35-50 70 0v75z" fill="#65858a"/><path d="m385 600 10-110 20 110m375 10 10-110 20 110" stroke="#6c8c50" stroke-width="35" stroke-linecap="round"/><ellipse cx="395" cy="470" rx="52" ry="85" fill="#678b58"/><ellipse cx="800" cy="480" rx="55" ry="90" fill="#72945b"/></g>',
  };
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200"><rect width="1200" height="1200" fill="${background}"/><g stroke="${accent}" fill="none" stroke-width="6" stroke-linejoin="round"><rect x="100" y="100" width="1000" height="1000" rx="500" opacity=".28"/><rect x="125" y="125" width="950" height="950" rx="475" opacity=".14"/>${motifs[motif]}</g></svg>`,
  );
}

const manifest: Record<string, string> = {};
const templates = [
  ...new Map(TEMPLATES.map((template) => [template.id, template])).values(),
];
for (const template of [{ id: "default", accent: "#873d4c" }, ...templates]) {
  const recipe: Recipe =
    template.id === "default"
      ? { motif: "envelope", background: "#f5eee4" }
      : recipes[template.id];
  if (!recipe) throw new Error(`Choose share artwork for ${template.id}`);
  const background = recipe.background ?? "#f4eee6";
  let pipeline: sharp.Sharp;
  if (recipe.source) {
    // A dedicated whitelist prevents accidentally publishing a catalog capture.
    if (
      /(?:preview|catalog|gallery|story-|bride-groom\.jpg)/i.test(
        recipe.source.replace("/previews/template/", "/"),
      )
    )
      throw new Error(`Not text-free artwork: ${recipe.source}`);
    const path = resolve(sourceRoot, recipe.source);
    if (!path.startsWith(sourceRoot + sep))
      throw new Error("Artwork must stay in the template asset folder");
    let input = await readFile(path);
    if (
      path.endsWith(".svg") &&
      /<(?:text|foreignObject)\b/i.test(input.toString())
    )
      throw new Error(`SVG contains text: ${recipe.source}`);
    const info = await sharp(input).metadata();
    if (recipe.crop) {
      const [left, top, width, height] = recipe.crop;
      input = await sharp(input)
        .extract({
          left: Math.round(left * info.width!),
          top: Math.round(top * info.height!),
          width: Math.floor(width * info.width!),
          height: Math.floor(height * info.height!),
        })
        .png()
        .toBuffer();
    }
    const fit = recipe.fit ?? (info.hasAlpha ? "contain" : "cover");
    if (fit === "contain") {
      const layer = await sharp(input, { density: 180 })
        .resize(920, 920, { fit: "inside" })
        .toBuffer();
      pipeline = sharp({
        create: { width: 1200, height: 1200, channels: 3, background },
      }).composite([{ input: layer, gravity: "centre" }]);
    } else {
      pipeline = sharp(input)
        .resize(1200, 1200, {
          fit: "cover",
          position: recipe.position ?? "centre",
        })
        .flatten({ background });
    }
  } else {
    pipeline = sharp(ornament(template.accent, background, recipe.motif));
  }
  const bytes = await pipeline.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  const filename = `${template.id}.${hash}.jpg`;
  await writeFile(resolve(destination, filename), bytes);
  manifest[template.id] = `/share/templates/${filename}`;
}
await writeFile(
  resolve(root, "apps/web/src/modules/catalog/share-artwork.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
const current = new Set(
  Object.values(manifest).map((path) => path.split("/").at(-1)),
);
for (const filename of await readdir(destination)) {
  if (
    /^[a-z0-9-]+\.[0-9a-f]{12}\.jpg$/.test(filename) &&
    !current.has(filename)
  ) {
    const path = resolve(destination, filename);
    if (!path.startsWith(destination + sep))
      throw new Error("Invalid generated artwork path");
    await unlink(path);
  }
}
console.log(
  `Generated ${Object.keys(manifest).length} square share images and the content-hashed manifest.`,
);
