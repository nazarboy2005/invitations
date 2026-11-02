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

const sql = getDb();
const origin = process.env.APP_URL!;
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
const out = fileURLToPath(
  new URL("../docs/design/studio-refinements/", import.meta.url),
);
await mkdir(out, { recursive: true });
const userId = randomUUID(),
  token = randomToken();
const image = normalizeInvitation({
  ...completeInvitation(),
  templateId: "ivory-rose-card",
});
image.content["uz-Latn"].people = ["Javohir", "Madina"];
const web = completeInvitation();
web.program = [
  {
    id: randomUUID(),
    time: "18:37",
    title: { "uz-Latn": "Mehmonlarni kutib olish" },
    description: {},
  },
];
const selectedPlace = {
  id: "venue-test",
  name: "Versal",
  address: "Toshkent, test ko‘chasi",
  latitude: 41.31,
  longitude: 69.28,
  mapUrl: yandexMapUrl({ latitude: 41.31, longitude: 69.28, mapUrl: "" }),
};
const linkedPlace = {
  ...selectedPlace,
  name: "Yangi saroy",
  latitude: 41.32,
  longitude: 69.29,
  mapUrl: yandexMapUrl({ latitude: 41.32, longitude: 69.29, mapUrl: "" }),
};
let browser;
try {
  await sql`INSERT INTO users(id,telegram_user_id,display_name,phone_number,phone_source,phone_shared_at) VALUES(${userId},${-Math.floor(Math.random() * 1e12) - 1},'Disposable refinement test','+000000000','telegram_contact',now())`;
  await sql`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${userId},${digest(token)},'Studio refinement verification',now()+interval '1 hour',now()+interval '1 hour')`;
  for (const invitation of [image, web])
    await sql`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${invitation.id},${userId},${invitation.templateId},'draft',${sql.json(invitation)})`;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await context.addCookies([
    { name: "taklifnoma_session", value: token, url: origin },
  ]);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.setDefaultTimeout(20000);
  // Controlled Yandex responses exercise real editor state without provider variability.
  await page.route("**/api/places?*", (route) =>
    route.fulfill({
      json: {
        places: [
          {
            id: selectedPlace.id,
            name: selectedPlace.name,
            address: selectedPlace.address,
          },
        ],
      },
    }),
  );
  await page.route("**/api/places/venue-test?*", (route) =>
    route.fulfill({ json: selectedPlace }),
  );
  await page.route("**/api/places/link", (route) =>
    route.fulfill({ json: linkedPlace }),
  );
  await page.goto(origin + `/studio/${image.id}`);
  const steps = page
    .locator('aside[aria-label="Tahrirlash bo‘limlari"]')
    .getByRole("button");
  await steps.nth(2).click();
  const name = page.getByRole("combobox", {
    name: "To‘yxona yoki joy nomi",
    exact: true,
  });
  const link = page.getByRole("textbox", {
    name: "Yandex Maps havolasi",
    exact: true,
  });
  await name.fill("Versal");
  await page.getByRole("option", { name: /Versal/ }).click();
  await page
    .waitForFunction(
      ([id, expected]) =>
        (document.getElementById(id!) as HTMLInputElement)?.value === expected,
      [await link.getAttribute("id"), selectedPlace.mapUrl],
    )
    .catch(async (error) => {
      await page.screenshot({ path: out + "debug-venue.png" });
      console.log(
        "Venue state",
        await link.inputValue(),
        await name.inputValue(),
        await page.getByRole("status").allTextContents(),
        errors,
      );
      throw error;
    });
  const description =
    "Versal to‘yxonasi, katta zal, mehmonlar uchun asosiy kirish";
  await name.fill(description);
  await page.getByRole("listbox", { name: "Yandex joy natijalari" }).waitFor();
  assert.equal(await link.inputValue(), selectedPlace.mapUrl);
  await name.press("Escape");
  await link.focus();
  assert.equal(await name.inputValue(), description);
  assert.equal(await link.inputValue(), selectedPlace.mapUrl);
  assert.equal(
    await page.locator("textarea").first().inputValue(),
    selectedPlace.address,
  );
  await link.fill("https://yandex.uz/maps/?pt=69.29,41.32&z=17");
  await page
    .getByRole("button", { name: "Yangi saroy", exact: true })
    .waitFor();
  assert.equal(await name.inputValue(), description);
  assert.equal(await link.inputValue(), linkedPlace.mapUrl);
  await name.fill(description + " — 2-qavat");
  await page.getByRole("listbox", { name: "Yandex joy natijalari" }).waitFor();
  await name.press("Escape");
  assert.equal(await link.inputValue(), linkedPlace.mapUrl);
  await page.screenshot({ path: out + "venue-preserved.png" });
  await page
    .getByRole("button", { name: "Tadbir sanasi va vaqtini tanlang" })
    .click();
  const dateDialog = page.getByRole("dialog", {
    name: "Sana va vaqtni tanlash",
    exact: true,
  });
  const hour = dateDialog.getByRole("spinbutton", {
    name: "Soat",
    exact: true,
  });
  const minute = dateDialog.getByRole("spinbutton", {
    name: "Daqiqa",
    exact: true,
  });
  assert.equal(await dateDialog.getByRole("combobox").count(), 0);
  assert.equal(await hour.getAttribute("aria-valuenow"), "18");
  // Native wheel scroll snaps and commits both columns.
  await hour.hover();
  await page.mouse.wheel(0, 72);
  await page.waitForFunction(
    () =>
      document
        .querySelector('[role="spinbutton"]')
        ?.getAttribute("aria-valuenow") === "20",
  );
  await minute.focus();
  await minute.press("End");
  await minute.press("ArrowUp");
  assert.equal(await minute.getAttribute("aria-valuenow"), "58");
  // Desktop pointer dragging also slides the wheel.
  const box = (await hour.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + 90);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + 126, { steps: 6 });
  await page.mouse.up();
  await page.waitForFunction(
    () =>
      document
        .querySelector('[role="spinbutton"]')
        ?.getAttribute("aria-valuenow") === "19",
  );
  await page.screenshot({ path: out + "time-desktop.png" });
  await dateDialog.getByRole("button", { name: "Tayyor", exact: true }).click();
  assert.match(
    await page
      .getByRole("button", { name: "Tadbir sanasi va vaqtini tanlang" })
      .innerText(),
    /19:58/,
  );
  await steps.nth(3).click();
  const downloadEvent = page.waitForEvent("download", { timeout: 60000 });
  await page.getByRole("button", { name: "PNG yuklab olish · Bepul" }).click();
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), "Javohir-Madina.png");
  await download.saveAs(out + "Javohir-Madina.png");
  await page
    .getByText(
      "PNG rasm yuklab olindi. Taklifnomangiz “Taklifnomalarim”da saqlangan.",
      { exact: true },
    )
    .waitFor();
  const saved = (
    await (
      await context.request.get(origin + `/api/invitations/${image.id}`)
    ).json()
  ).invitation;
  assert.equal(saved.venue.mapUrl, linkedPlace.mapUrl);
  assert.equal(saved.venue.latitude, linkedPlace.latitude);
  assert.equal(saved.venue.longitude, linkedPlace.longitude);
  assert.equal(saved.content["uz-Latn"].venueName, description + " — 2-qavat");
  assert.match(saved.startsAt, /T19:58/);
  await page.goto(origin + `/studio/${web.id}`);
  await steps.nth(2).click();
  const programTime = page.getByRole("button", {
    name: "Vaqtni tanlang",
    exact: true,
  });
  await programTime.click();
  const timeDialog = page.getByRole("dialog", {
    name: "Vaqtni tanlash",
    exact: true,
  });
  assert.equal(
    await timeDialog
      .getByRole("spinbutton", { name: "Daqiqa" })
      .getAttribute("aria-valuenow"),
    "37",
  );
  await timeDialog
    .getByRole("spinbutton", { name: "Daqiqa" })
    .press("ArrowDown");
  await timeDialog.getByRole("button", { name: "Tayyor", exact: true }).click();
  assert.match(await programTime.innerText(), /18:38/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  // Phone navigation has the same section controls in its editor.
  // The desktop sidebar may be hidden; the active schedule section survives reload via draft state.
  if (
    (await page
      .getByRole("button", { name: "Tadbir sanasi va vaqtini tanlang" })
      .count()) === 0
  ) {
    await page.locator("[data-mobile-steps] summary").click();
    await page
      .getByRole("navigation", { name: "Qadamni tanlash" })
      .getByRole("button")
      .nth(2)
      .click();
  }
  await page
    .getByRole("button", { name: "Tadbir sanasi va vaqtini tanlang" })
    .click();
  await dateDialog.waitFor();
  assert.ok((await dateDialog.boundingBox())!.width <= 390);
  assert.ok((await dateDialog.boundingBox())!.height <= 844);
  const touch = await context.newCDPSession(page);
  await touch.send("Emulation.setTouchEmulationEnabled", { enabled: true });
  const touchWheel = dateDialog.getByRole("spinbutton", {
    name: "Daqiqa",
    exact: true,
  });
  const touchBox = (await touchWheel.boundingBox())!;
  const touchX = touchBox.x + touchBox.width / 2;
  const touchY = touchBox.y + 130;
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: touchX, y: touchY }],
  });
  for (let step = 1; step <= 6; step++) {
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: touchX, y: touchY - step * 12 }],
    });
  }
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await page.waitForFunction(
    () =>
      document
        .querySelectorAll('[role="spinbutton"]')[1]
        ?.getAttribute("aria-valuenow") !== "30",
  );
  await page.screenshot({ path: out + "time-mobile.png" });
  await touch.send("Emulation.setTouchEmulationEnabled", { enabled: false });
  await touch.detach();
  await page.keyboard.press("Escape");
  await page.goto(origin + "/templates");
  for (const format of ["Rasm taklifnoma", "Veb taklifnoma"]) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole("button", { name: format, exact: true }).click();
    await page
      .getByRole("button", { name: /batafsil ko‘rish/ })
      .first()
      .click();
    const dialog = page.getByRole("dialog");
    const panel = dialog.locator("section");
    const desktop = (await panel.boundingBox())!;
    assert.ok(desktop.width <= 760 && desktop.height < 540);
    await page.screenshot({
      path:
        out + (format.startsWith("Rasm") ? "image-popup.png" : "web-popup.png"),
    });
    await page.setViewportSize({ width: 390, height: 844 });
    const mobile = (await panel.boundingBox())!;
    assert.ok(mobile.height < 740);
    assert.ok(
      await dialog.getByRole("link", { name: /To‘liq ko‘rish/ }).isVisible(),
    );
    await page.screenshot({
      path:
        out +
        (format.startsWith("Rasm")
          ? "image-popup-mobile.png"
          : "web-popup-mobile.png"),
    });
    await dialog.getByRole("button", { name: "Yopish", exact: true }).click();
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS: preserved Yandex selection after descriptive edits, optional linked-name suggestion, canonical saved map, couple-named browser download, wheel/drag/keyboard time changes, program minute preservation, compact desktop/mobile popups and mobile time dialog.",
  );
} finally {
  await browser?.close();
  for (const invitation of [image, web]) {
    await sql`DELETE FROM invitation_audit_log WHERE invitation_id=${invitation.id}`;
    await sql`DELETE FROM invitations WHERE id=${invitation.id} AND owner_id=${userId}`;
  }
  await sql`DELETE FROM sessions WHERE user_id=${userId}`;
  await sql`DELETE FROM users WHERE id=${userId}`;
  await closeDb();
}
