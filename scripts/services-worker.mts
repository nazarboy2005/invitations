import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import type { JSONValue } from "postgres";
import { getDb, closeDb } from "../packages/database/src/index";
import { saveServiceImage } from "../apps/web/src/server/service-media";
import { removeMedia } from "../apps/web/src/server/storage";
import { hasAdminRole } from "../apps/web/src/server/auth/admin-role";
import { recordAdminChange } from "../apps/web/src/server/admin";
import {
  serviceEditorSchema,
  serviceCategoryChoices,
  serviceImportSchema,
} from "../apps/web/src/modules/services/service-editor-contract";
import {
  toFotihaDraft,
  importEvidence,
} from "../tools/services-scraper/src/fotiha-adapter.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
// Resolve local media exactly as the web process (whose cwd is apps/web).
process.env.LOCAL_MEDIA_DIR = path.resolve(
  root,
  "apps/web",
  process.env.LOCAL_MEDIA_DIR || ".data/media",
);
const output = path.resolve(
  process.env.SERVICES_IMPORT_DIR ||
    path.join(root, ".data", "service-imports"),
);
const run = promisify(execFile),
  db = getDb();
let stopping = false;
process.on("SIGTERM", () => {
  stopping = true;
});
process.on("SIGINT", () => {
  stopping = true;
});
async function heartbeat() {
  await db`INSERT INTO service_worker_heartbeat(name) VALUES('services-import') ON CONFLICT(name) DO UPDATE SET updated_at=now()`;
}
export async function processNextServiceImport() {
  await heartbeat();
  const lease = randomUUID();
  const job = await db.begin(async (tx) => {
    await tx`UPDATE service_import_jobs SET status='failed',error='Worker interrupted repeatedly. Retry after checking the source.',lease_token=NULL,updated_at=now() WHERE status='running' AND heartbeat_at < now()-interval '2 minutes' AND attempts>=3`;
    const [item] =
      await tx`SELECT * FROM service_import_jobs WHERE status='queued' OR (status='running' AND heartbeat_at<now()-interval '2 minutes' AND attempts<3) ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1`;
    if (!item) return null;
    const [claimed] =
      await tx`UPDATE service_import_jobs SET status='running',attempts=attempts+1,lease_token=${lease},heartbeat_at=now(),updated_at=now() WHERE id=${item.id} RETURNING *`;
    return claimed;
  });
  if (!job) return false;
  const controller = new AbortController();
  const createdImages: string[] = [];
  let committed = false;
  const timer = setInterval(() => {
    void (async () => {
      await heartbeat();
      const rows =
        await db`UPDATE service_import_jobs SET heartbeat_at=now() WHERE id=${job.id} AND lease_token=${lease} AND status='running' RETURNING id`;
      if (!rows.length) controller.abort();
    })().catch(() => {});
  }, 10000);
  try {
    const [actor] = await db`SELECT * FROM users WHERE id=${job.created_by}`;
    if (!actor || !hasAdminRole(actor))
      throw new Error(
        "Importchi administrator huquqini tasdiqlay olmadi. Noutbukdagi administrator sozlamasi sayt bilan mos ekanini tekshiring va import dasturini qayta ishga tushiring.",
      );
    const input = serviceImportSchema.parse(job.input),
      directory = path.join(output, job.id);
    await mkdir(directory, { recursive: true });
    const args = [
      path.join(root, "tools/services-scraper/src/cli.mjs"),
      "scrape",
      "--city",
      input.city,
      "--out",
      directory,
      "--max-images",
      "8",
      "--website",
      "--image-source",
      input.imageSource,
    ];
    for (const url of input.urls) args.push("--url", url);
    if (!input.urls.length) args.push("--query", input.query);
    if (process.env.SERVICES_SCRAPER_CHANNEL)
      args.push("--channel", process.env.SERVICES_SCRAPER_CHANNEL);
    try {
      await run(process.execPath, args, {
        cwd: root,
        timeout: 8 * 60 * 1000,
        maxBuffer: 256 * 1024,
        windowsHide: true,
        signal: controller.signal,
      });
    } catch (e) {
      // Partial jobs retain usable results and explicit source errors.
      if ((e as { code?: number }).code !== 2)
        throw new Error(
          "Scraper did not finish. Check browser setup or source access and retry.",
        );
    }
    const index = JSON.parse(
        await readFile(path.join(directory, "run.json"), "utf8"),
      ),
      item = index.jobs?.[0];
    if (!item?.directory || !/^[a-z0-9-]+$/.test(item.directory))
      throw new Error(
        "No business collected. Try a direct business link or a more specific name.",
      );
    const businessDir = path.join(directory, item.directory),
      result = JSON.parse(
        await readFile(path.join(businessDir, "result.json"), "utf8"),
      );
    if (!result.sources?.length || !result.merged?.name)
      throw new Error(
        "No confirmed business found. Try a direct Maps business link.",
      );
    const images = [];
    for (const image of result.media.images.slice(0, 8)) {
      if (!/^images\/[a-f0-9]+\.webp$/.test(image.file))
        throw new Error("Invalid saved image path.");
      if (controller.signal.aborted) throw new Error("Import cancelled.");
      const saved = await saveServiceImage(
        job.created_by,
        await readFile(path.join(businessDir, image.file)),
        result.merged.name,
      );
      images.push(saved);
      createdImages.push(saved.src.split("/").pop()!);
    }
    const stem =
      result.merged.name
        .normalize("NFKD")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 65)
        .replace(/-$/, "") || "service";
    const slug = `${stem}-${job.id.slice(0, 8)}`;
    const draft = serviceEditorSchema.parse(
      toFotihaDraft(
        result,
        input,
        slug,
        images,
        serviceCategoryChoices.find((c) => c.id === input.categoryId)!.name,
      ),
    );
    const phones = draft.phones.map((p) => p.value.replace(/\D/g, ""));
    const existing =
      await db`SELECT slug,draft->>'name' AS name FROM service_listings WHERE EXISTS (SELECT 1 FROM jsonb_array_elements(draft->'phones') p WHERE regexp_replace(p->>'value','[^0-9]','','g')=ANY(${db.array(phones)}::text[])) OR lower(draft->>'name')=lower(${draft.name})`;
    const evidence = importEvidence(
      result,
      existing.map((r) => ({ slug: r.slug, name: r.name })),
    );
    committed = Boolean(
      await db.begin(async (tx) => {
        const [current] =
          await tx`SELECT id FROM service_import_jobs WHERE id=${job.id} AND status='running' AND lease_token=${lease} FOR UPDATE`;
        if (!current) return false; // Cancellation or another worker's recovered lease wins.
        const [freshActor] =
          await tx`SELECT * FROM users WHERE id=${job.created_by}`;
        if (!freshActor || !hasAdminRole(freshActor))
          throw new Error(
            "Importchi administrator huquqini tasdiqlay olmadi. Administrator huquqi va noutbukdagi sozlamani tekshiring.",
          );
        await tx`INSERT INTO service_listings(slug,draft,evidence,review_required,created_by,updated_by) VALUES(${slug},${tx.json(draft as unknown as JSONValue)},${tx.json(evidence as JSONValue)},true,${job.created_by},${job.created_by})`;
        await tx`UPDATE service_import_jobs SET status='review',service_slug=${slug},result=${tx.json({ photos: images.length, sources: result.sources.map((s: { provider: string }) => s.provider), duplicates: existing.length, collectionStatus: result.status })},error=NULL,lease_token=NULL,updated_at=now() WHERE id=${job.id}`;
        await recordAdminChange(
          tx,
          job.created_by,
          "service.create",
          slug,
          null,
          { status: "draft", importJob: job.id, reviewRequired: true },
        );
        return true;
      }),
    );
    if (committed) console.log(`Import ready for review: ${job.id}`);
  } catch (e) {
    const message =
      e instanceof Error ? e.message.slice(0, 500) : "Import failed.";
    await db`UPDATE service_import_jobs SET status='failed',error=${message},lease_token=NULL,updated_at=now() WHERE id=${job.id} AND lease_token=${lease}`;
    console.error(`Import failed: ${job.id}`);
  } finally {
    clearInterval(timer);
    if (!committed && createdImages.length) {
      const media =
        await db`SELECT object_key FROM service_media WHERE id=ANY(${db.array(createdImages)}::uuid[])`;
      for (const image of media) await removeMedia(image.object_key);
      await db`DELETE FROM service_media WHERE id=ANY(${db.array(createdImages)}::uuid[])`;
    }
  }
  return true;
}
try {
  do {
    const processed = await processNextServiceImport();
    if (process.argv.includes("--once")) break;
    if (!processed && !stopping) await new Promise((r) => setTimeout(r, 3000));
  } while (!stopping);
} finally {
  await closeDb();
}
