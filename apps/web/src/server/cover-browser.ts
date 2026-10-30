import type { Browser, Page } from "playwright-core";
import { coverCleanup, coverDeadline } from "./cover-deadline";

// One warm browser, with a new private context for every capture. The caller
// admits one capture at a time, including cleanup of failed jobs.
export class CoverBrowser {
  private browser?: Browser;
  private idle?: ReturnType<typeof setTimeout>;

  constructor(private launch: () => Promise<Browser>) {}

  async acquire() {
    clearTimeout(this.idle);
    if (!this.browser?.isConnected()) this.browser = await this.launch();
    return this.browser;
  }

  async discard(browser: Browser) {
    if (this.browser === browser) {
      clearTimeout(this.idle);
      this.browser = undefined;
    }
    await coverCleanup(() => browser.close());
  }

  release(browser: Browser) {
    if (this.browser !== browser) return;
    this.idle = setTimeout(() => void this.discard(browser), 20000);
    this.idle.unref();
  }
}

export async function captureCoverPixels(page: Page, element?: string) {
  const frame = page
    .frames()
    .find((frame) => /\/templates\//.test(frame.url()));
  const box = element ? await frame?.locator(element).boundingBox() : undefined;
  if (element && !box) throw new Error("Cover capture element missing");
  const viewport = page.viewportSize()!;
  const session = await page.context().newCDPSession(page);
  try {
    // Fonts/images and the selected animation scene are settled by the caller.
    // Capture those pixels directly: Playwright's screenshot preparation waits
    // again for every font (including hidden/offscreen template content).
    const result = await coverDeadline(
      () =>
        session.send("Page.captureScreenshot", {
          format: "png",
          captureBeyondViewport: true,
          clip: { ...(box ?? { x: 0, y: 0, ...viewport }), scale: 1 },
        }),
      8000,
    );
    return Buffer.from(result.data, "base64");
  } finally {
    await coverCleanup(() => session.detach());
  }
}
