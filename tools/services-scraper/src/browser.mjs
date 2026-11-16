import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { validateMapsUrl } from "./network.mjs";
import { BrowserProxy } from "./browser-proxy.mjs";
import { scraperEnvironment } from "./environment.mjs";

function consentUrl(value) {
  const url = new URL(value);
  return (
    url.protocol === "https:" &&
    !url.port &&
    !url.username &&
    !url.password &&
    /^consent\.google\.(?:com|co\.uz|ru)$/.test(url.hostname)
  );
}

export class BrowserSession {
  constructor(options = {}) {
    this.options = options;
    this.browser = null;
    this.proxy = null;
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
    try {
      return await this.initializeBrowser();
    } catch (error) {
      await this.browser?.close().catch(() => {});
      await this.proxy?.close();
      this.browser = null;
      this.context = null;
      this.proxy = null;
      throw error;
    }
  }
  async initializeBrowser() {
    this.proxy = new BrowserProxy({ timeout: this.options.timeout });
    const launch = {
      headless: !this.options.headed,
      chromiumSandbox: true,
      env: scraperEnvironment(),
      proxy: await this.proxy.start(),
      args: [
        "--disable-quic",
        "--force-webrtc-ip-handling-policy=disable_non_proxied_udp",
      ],
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
      if (!this.browser) {
        throw new Error(
          "No sandboxed browser available. Run npm run setup:browser inside tools/services-scraper; keep Chromium sandboxing enabled.",
        );
      }
    }
    this.context = await this.browser.newContext({
      locale: "en-US",
      viewport: { width: 1365, height: 1000 },
      serviceWorkers: "block",
      acceptDownloads: false,
    });
    // Maps collection does not require WebSockets. Do not rely on mixed-content
    // or private-network browser heuristics to protect the worker's network.
    await this.context.routeWebSocket("**/*", (socket) => socket.close());
    await this.context.route("**/*", async (route) => {
      const request = route.request(),
        url = request.url();
      if (
        !/^https?:/.test(url) ||
        ["media", "font"].includes(request.resourceType())
      )
        return route.abort();
      try {
        // All top-level navigations stay on Maps or Google's consent screen.
        if (
          request.isNavigationRequest() &&
          request.frame() === request.frame().page().mainFrame() &&
          !consentUrl(url)
        )
          validateMapsUrl(url);
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
    if (consentUrl(page.url())) {
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
    try {
      await this.browser?.close();
    } finally {
      await this.proxy?.close();
    }
    this.browser = null;
    this.context = null;
    this.proxy = null;
  }
}
