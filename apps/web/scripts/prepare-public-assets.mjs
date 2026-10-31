import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  isCacheablePublicAsset,
  publicAssetRoots,
} from "../src/lib/public-asset-policy.mjs";

// Bump this when changing output transformation, even if source assets are unchanged.
const formatVersion = "public-assets-v2";
const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function writeIfChanged(path, contents) {
  if (existsSync(path) && readFileSync(path, "utf8") === contents) return;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
}

/** Keep relative paths intact and version root-relative references in source frames. */
export function versionPublicReferences(source, prefix) {
  return (
    source
      .replace(
        /(["'`(=\s])\/(images|audio|music|templates)\//g,
        `$1${prefix}/$2/`,
      )
      // One adapter derives its template ID from the original pathname segments.
      .replaceAll(
        'location.pathname.split("/")[2]',
        'location.pathname.split("/templates/")[1]?.split("/")[0]',
      )
  );
}

export function preparePublicAssets(root = webRoot) {
  const publicRoot = join(root, "public");
  const entries = [];
  function walk(directory) {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort(
      (a, b) => a.name.localeCompare(b.name, "en"),
    )) {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile()) {
        const path = "/" + relative(publicRoot, file).replaceAll("\\", "/");
        if (isCacheablePublicAsset(path)) entries.push({ path, file });
      }
    }
  }
  for (const directory of publicAssetRoots) walk(join(publicRoot, directory));
  // One content revision covers the dependency graph: updating a font or shared
  // script also invalidates the CSS/HTML that refers to it. Code-only deploys
  // preserve this revision. Source captures themselves are never modified.
  const hash = createHash("sha256").update(formatVersion);
  for (const entry of entries) {
    const bytes = readFileSync(entry.file);
    hash
      .update(entry.path)
      .update("\0")
      .update(createHash("sha256").update(bytes).digest());
    if (/\.(?:html?|css|js|mjs|json|svg)$/i.test(entry.path))
      entry.text = bytes.toString("utf8");
  }
  const version = hash.digest("hex").slice(0, 20);
  const prefix = `/_assets/${version}`;
  const generatedRoot = resolve(publicRoot, "_assets");
  if (existsSync(generatedRoot)) {
    for (const entry of readdirSync(generatedRoot, { withFileTypes: true })) {
      const target = resolve(generatedRoot, entry.name);
      if (
        entry.isDirectory() &&
        /^[a-f0-9]{20}$/.test(entry.name) &&
        entry.name !== version &&
        target.startsWith(generatedRoot + sep)
      ) {
        rmSync(target, { recursive: true, force: true });
      }
    }
  }
  let textFiles = 0;
  for (const entry of entries) {
    if (entry.text === undefined) continue;
    writeIfChanged(
      join(publicRoot, prefix, entry.path),
      versionPublicReferences(entry.text, prefix),
    );
    textFiles++;
  }
  const manifest = { version, files: entries.map((entry) => entry.path) };
  writeIfChanged(
    join(root, "src/generated/public-assets.json"),
    JSON.stringify(manifest) + "\n",
  );
  writeIfChanged(
    join(root, "src/generated/public-asset-version.json"),
    JSON.stringify({ version }) + "\n",
  );
  return { ...manifest, textFiles };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = preparePublicAssets();
  console.log(
    `Public assets: ${result.files.length} files, ${result.textFiles} source bundles, revision ${result.version}.`,
  );
}
