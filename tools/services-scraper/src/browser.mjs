import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { assertPublicUrl, validateMapsUrl } from "./network.mjs";

export class BrowserSession {
  constructor(options = {}) {
    this.options = options;
    this.browser = null;
    this.validHosts = new Map();
    this.context = null;
    this.starting = null;
  }
  async start() {
    if (this.context) return this.context;
    if (!this.starting)
      this.starting = this.initialize().finally(() => {
        this.starting = null;
      });
    return this.starting;
  }
  async initialize() {
    const launch = {
      headless: !this.options.headed,
      ...(this.options.channel ? { channel: this.options.channel } : {}),
    };
    try {
      this.browser = await chromium.launch(launch);
    } catch (error) {
      if (this.options.channel) throw error;
      // Existing branded browsers avoid downloading a second browser on Windows.
      for (const channel of ["chrome", "msedge"]) {
        try {
          this.browser = await chromium.launch({ ...launch, channel });
          break;
        } catch {
          /* Try next installed browser. */
        }
      }
      if (!this.browser)
        throw new Error(
          "No browser available. Run npm run setup:browser inside tools/services-scraper.",
        );
    }
    this.context = await this.browser.newContext({
      locale: "en-US",
      viewport: { width: 1365, height: 1000 },
      serviceWorkers: "block",
      acceptDownloads: false,
    });
    await this.context.route("**/*", async (route) => {
      const request = route.request(),
        url = request.url();
      if (
        !/^https?:/.test(url) ||
        ["media", "font"].includes(request.resourceType())
      )
        return route.abort();
      try {
        const u = new URL(url);
        // All top-level navigations stay on Maps or Google's consent screen.
        if (
          request.isNavigationRequest() &&
          request.frame() === request.frame().page().mainFrame() &&
          !/^consent\.google\./.test(u.hostname)
        )
          validateMapsUrl(url);
        const cacheKey = u.origin;
        if (!this.validHosts.has(cacheKey))
          this.validHosts.set(cacheKey, assertPublicUrl(url));
        await this.validHosts.get(cacheKey);
        await route.continue();
      } catch {
        await route.abort();
      }
    });
    return this.context;
  }
  async page() {
    return (await this.start()).newPage();
  }
  async navigate(page, url) {
    validateMapsUrl(url);
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: this.options.timeout ?? 35000,
    });
    if (/consent\.google\./.test(new URL(page.url()).hostname)) {
      const reject = page.getByRole("button", {
        name: /Reject all|Decline all|Отклонить все/i,
      });
      if (await reject.count()) await reject.first().click();
    }
    if (
      /showcaptcha|\/sorry\//i.test(page.url()) ||
      /captcha|unusual traffic/i.test(await page.title())
    )
      throw new Error(
        "ACCESS_CHALLENGE: source requested verification; no bypass attempted.",
      );
    if (response && response.status() >= 400)
      throw new Error(`HTTP ${response.status()}`);
    return response;
  }
  async evidence(page, directory, name) {
    if (!directory) return;
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, `${name}.html`), await page.content());
    await writeFile(
      path.join(directory, `${name}.txt`),
      await page.locator("body").innerText(),
    );
    await page
      .screenshot({
        path: path.join(directory, `${name}.png`),
        fullPage: false,
      })
      .catch(() => {});
  }
  async close() {
    await this.starting?.catch(() => {});
    await this.browser?.close();
    this.browser = null;
    this.context = null;
  }
}
