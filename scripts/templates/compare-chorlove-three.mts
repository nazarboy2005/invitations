import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "../../apps/web/node_modules/playwright-core/index.mjs";

const archive = fileURLToPath(
  new URL("../../../Templates/Chorlove/Web invitations/", import.meta.url),
);
const packages = fileURLToPath(
  new URL("../../apps/web/public/templates/", import.meta.url),
);
const out = fileURLToPath(
  new URL("../../docs/templates/chorlove-three-verification/", import.meta.url),
);
await mkdir(out, { recursive: true });
const types: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".png": "image/png",
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url!, "http://localhost");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/_next/image")
      pathname = url.searchParams.get("url") || "";
    if (pathname.endsWith("/preview-frame")) pathname += ".html";
    const file = path.resolve(archive, "." + pathname);
    if (!file.startsWith(archive)) {
      res.writeHead(403);
      res.end();
      return;
    }
    let bytes: Buffer;
    try {
      bytes = await readFile(file);
    } catch {
      if (!pathname.startsWith("/images/")) throw Error("Missing");
      const parts = pathname.split("/");
      const id = parts[2];
      bytes = await readFile(
        path.join(packages, id, "assets", path.basename(pathname)),
      );
    }
    res.writeHead(200, {
      "Content-Type":
        types[path.extname(pathname)] || "application/octet-stream",
    });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = (server.address() as { port: number }).port;
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    for (const id of ["stained-glass", "sunset", "swan-garden"]) {
      const page = await browser.newPage({
        viewport: { width, height: width === 390 ? 844 : 800 },
      });
      await page.route("**/*", (route) => {
        if (new URL(route.request().url()).hostname === "127.0.0.1")
          return route.continue();
        return route.abort();
      });
      await page.goto(
        `http://127.0.0.1:${port}/templates/${id}/preview-frame`,
        { waitUntil: "networkidle" },
      );
      await page.screenshot({
        path: `${out}${id}-${width}-reference-opening.png`,
      });
      const opening =
        id === "stained-glass"
          ? page.locator("section").first().getByRole("button")
          : page.locator("[role=button]").first();
      if (await opening.count()) {
        await opening.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(id === "stained-glass" ? 11500 : 9500);
        await page.screenshot({
          path: `${out}${id}-${width}-reference-hero.png`,
        });
      }
      console.log(`Captured ${id} reference ${width}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
  await new Promise<void>((resolve) => server.close(() => resolve()));
}
