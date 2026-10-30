import { tmpdir } from "node:os";
import path from "node:path";
import type { LaunchOptions } from "playwright-core";

export function coverCacheRoot(env = process.env) {
  return path.resolve(
    /* turbopackIgnore: true */
    env.INVITATION_COVER_DIR ||
      path.join(
        env.VERCEL ? tmpdir() : process.cwd(),
        ".data",
        "invitation-covers",
      ),
  );
}

export async function coverBrowserOptions(): Promise<LaunchOptions> {
  const executablePath = process.env.INVITATION_COVER_BROWSER_PATH;
  if (process.env.VERCEL) {
    const { default: chromium } = await import("@sparticuz/chromium");
    return {
      headless: true,
      args: chromium.args,
      executablePath: executablePath || (await chromium.executablePath()),
      timeout: 15000,
    };
  }
  return { headless: true, executablePath, timeout: 15000 };
}
