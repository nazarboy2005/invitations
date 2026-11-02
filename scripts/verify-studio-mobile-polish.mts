import { chromium } from "../apps/web/node_modules/playwright-core/index.mjs";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { completeInvitation } from "../tests/fixtures/publication";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import { yandexMapUrl } from "../packages/contracts/src/maps";
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const origin = process.env.APP_URL!;
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
const sql = getDb();
const userId = randomUUID(),
  token = randomToken();
const image = normalizeInvitation({
  ...completeInvitation(),
  templateId: "ivory-rose-card",
});
image.content["uz-Latn"].people = ["Javohir"];
const web = completeInvitation();
web.content["uz-Latn"].people = ["Ali", "Vali", "Salim"];
const birthday = normalizeInvitation({
  ...completeInvitation(),
  templateId: "shirin-bayram",
  eventType: "birthday",
});
birthday.content["uz-Latn"].people = ["Malika"];
const invitations = [image, web, birthday];
const place = {
  id: "test-venue",
  name: "Versal",
  address: "Toshkent, test ko‘chasi",
  latitude: 41.31,
  longitude: 69.28,
  mapUrl: yandexMapUrl({ latitude: 41.31, longitude: 69.28, mapUrl: "" }),
};
const out = fileURLToPath(
  new URL("../docs/design/studio-mobile-polish/", import.meta.url),
);
await mkdir(out, { recursive: true });
let browser;
try {
  await sql`INSERT INTO users(id,telegram_user_id,display_name,phone_number,phone_source,phone_shared_at) VALUES(${userId},${-Math.floor(Math.random() * 1e12) - 1},'Mobile verification with a long display name','+000000000','telegram_contact',now())`;
  await sql`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${userId},${digest(token)},'Mobile polish verification',now()+interval '1 hour',now()+interval '1 hour')`;
  for (const invitation of invitations)
    await sql`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${invitation.id},${userId},${invitation.templateId},'draft',${sql.json(invitation)})`;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    hasTouch: true,
    reducedMotion: "reduce",
  });
  await context.addCookies([
    { name: "taklifnoma_session", value: token, url: origin },
  ]);
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let releaseSearch: (() => void) | undefined;
  // Delay a controlled response until after blur to reproduce the original race.
  await page.route(/\/api\/places\?/, async (route) => {
    if (
      new URL(route.request().url()).searchParams
        .get("q")
        ?.startsWith("Delayed")
    )
      await new Promise<void>((resolve) => {
        releaseSearch = resolve;
      });
    await route.fulfill({ json: { places: [place] } });
  });
  await page.route(/\/api\/places\/test-venue\?/, (route) =>
    route.fulfill({ json: place }),
  );
  async function section(index: number) {
    const desktop = page.locator('aside[aria-label="Tahrirlash bo‘limlari"]');
    if (page.viewportSize()!.width > 1100)
      await desktop.getByRole("button").nth(index).click();
    else {
      await page.locator("[data-mobile-steps] summary").click();
      await page
        .getByRole("navigation", { name: "Qadamni tanlash" })
        .getByRole("button")
        .nth(index)
        .click();
    }
  }
  for (const invitation of invitations) {
    console.log("Checking Studio name controls:", invitation.templateId);
    await page.goto(origin + `/studio/${invitation.id}`);
    await section(1);
    assert.equal(
      await page
        .getByRole("button", { name: "Ism qo‘shish", exact: true })
        .count(),
      0,
    );
    assert.equal(
      await page.getByRole("button", { name: /ismni olib tashlash/ }).count(),
      0,
    );
    const names = page.locator('[aria-labelledby="studio-people-title"] input');
    if (invitation === image) {
      assert.equal(
        await page
          .getByRole("textbox", { name: "Kuyov ismi", exact: true })
          .inputValue(),
        "Javohir",
      );
      assert.equal(
        await page
          .getByRole("textbox", { name: "Kelin ismi", exact: true })
          .inputValue(),
        "",
      );
      await page
        .getByRole("textbox", { name: "Kelin ismi", exact: true })
        .fill("Madina");
    } else if (invitation === web) {
      assert.equal(
        await page
          .getByRole("textbox", { name: "3-ism", exact: true })
          .inputValue(),
        "Salim",
      );
    } else assert.ok((await names.count()) >= 1);
  }
  await page.goto(origin + `/studio/${image.id}`);
  console.log("Checking delayed venue response and desktop dismissal");
  await section(2);
  const name = page.getByRole("combobox", {
    name: "To‘yxona yoki joy nomi",
    exact: true,
  });
  const list = page.getByRole("listbox", { name: "Yandex joy natijalari" });
  const link = page.getByRole("textbox", {
    name: "Yandex Maps havolasi",
    exact: true,
  });
  const request = page.waitForRequest((url) => url.url().includes("q=Delayed"));
  await name.fill("Delayed venue");
  await request;
  await link.focus();
  assert.ok(releaseSearch);
  const response = page.waitForResponse((url) =>
    url.url().includes("q=Delayed"),
  );
  releaseSearch();
  await response;
  await page.waitForTimeout(350);
  assert.equal(await list.count(), 0);
  await name.focus();
  await list.waitFor();
  await page.locator("#studio-date-title").click();
  assert.equal(await list.count(), 0);
  await name.click();
  await list.waitFor();
  await page.getByRole("option", { name: /Versal/ }).click();
  await page.waitForFunction(
    (expected) =>
      document.querySelector<HTMLInputElement>(
        'input[aria-label="To‘yxona yoki joy nomi"]',
      )?.value === expected,
    "Versal",
  );
  assert.equal(await link.inputValue(), place.mapUrl);
  await name.fill("Versal katta zal, asosiy kirish");
  await list.waitFor();
  await link.focus();
  assert.equal(await list.count(), 0);
  assert.equal(await link.inputValue(), place.mapUrl);
  await page.screenshot({ path: out + "venue-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  console.log("Checking touch venue selection and dismissal");
  await page.reload();
  await section(2);
  await name.fill("Versal telefon qidiruvi");
  await list.waitFor();
  await page.getByRole("option", { name: /Versal/ }).tap();
  await page.waitForFunction(
    (expected) =>
      document.querySelector<HTMLInputElement>(
        'input[aria-label="To‘yxona yoki joy nomi"]',
      )?.value === expected,
    "Versal",
  );
  await name.fill("Versal katta zal");
  await list.waitFor();
  await page.locator("#studio-date-title").tap();
  assert.equal(await list.count(), 0);
  assert.equal(await link.inputValue(), place.mapUrl);
  await page.screenshot({ path: out + "venue-mobile.png" });

  for (const width of [320, 390, 430, 580]) {
    console.log("Checking catalog and dashboard at width", width);
    await page.setViewportSize({ width, height: 844 });
    for (const favorites of [false, true]) {
      await page.goto(
        origin + (favorites ? "/templates?favorites=1" : "/templates"),
      );
      const search = page.getByRole("search");
      const shortcut = search.locator("..").getByRole("link");
      const [a, b] = await Promise.all([
        search.boundingBox(),
        shortcut.boundingBox(),
      ]);
      assert.ok(
        a &&
          b &&
          b.x > a.x &&
          Math.abs(a.y - b.y) < 2 &&
          b.x + b.width <= width,
      );
      assert.equal((await shortcut.innerText()).trim(), favorites ? "" : "0");
      assert.match(
        (await shortcut.getAttribute("aria-label")) ?? "",
        favorites ? /Barcha dizaynlar/ : /Saralanganlar: 0/,
      );
      assert.equal(
        await shortcut
          .locator(
            favorites ? "svg.lucide-layout-template" : "svg.lucide-heart",
          )
          .count(),
        1,
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      if (favorites)
        await page
          .getByText("Saralanganlar yuklanmoqda…", { exact: true })
          .waitFor({ state: "hidden" });
      if (width === 390)
        await page.screenshot({
          path:
            out + (favorites ? "favorites-mobile.png" : "templates-mobile.png"),
        });
    }
    await page.goto(origin + "/dashboard");
    const create = page.getByRole("link", {
      name: "Yangi taklifnoma",
      exact: true,
    });
    await create.waitFor();
    await page
      .getByText(
        "Xush kelibsiz, Mobile verification with a long display name",
        { exact: true },
      )
      .waitFor();
    await page
      .locator("article")
      .nth(invitations.length - 1)
      .waitFor();
    const box = (await create.boundingBox())!;
    assert.ok(box.x >= 0 && box.x + box.width <= width && box.height >= 44);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    if (width === 390)
      await page.screenshot({ path: out + "dashboard-mobile.png" });
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS: delayed venue responses stay dismissed, mouse/touch outside dismissal and selection, preserved destination, no generic name controls, required couple fields and existing extra names, same-row mobile search/icons and aligned dashboard at 320/390/430/580px; no browser errors.",
  );
} finally {
  await browser?.close();
  for (const invitation of invitations) {
    await sql`DELETE FROM invitation_audit_log WHERE invitation_id=${invitation.id}`;
    await sql`DELETE FROM invitations WHERE id=${invitation.id} AND owner_id=${userId}`;
  }
  await sql`DELETE FROM sessions WHERE user_id=${userId}`;
  await sql`DELETE FROM users WHERE id=${userId}`;
  await closeDb();
}
