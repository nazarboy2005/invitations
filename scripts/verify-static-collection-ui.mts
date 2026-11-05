// Local browser/backend verification; disposable authored content, no messaging/payment.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { chromium } from "../apps/web/node_modules/playwright-core/index.mjs";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import { completeInvitation } from "../tests/fixtures/publication";

const release = process.argv.includes("--release");
const catalogOnly = process.argv.includes("--catalog-only");
const origin = process.env.STATIC_QA_ORIGIN ?? "http://127.0.0.1:3001";
const out = fileURLToPath(
  new URL("../docs/templates/static-stationery-verification/", import.meta.url),
);
await mkdir(out, { recursive: true });
const sql = getDb();
const ids = ["lola-maktubi", "moviy-ravoq-card", "sahar-ifori"];
const names = ["Lola maktubi", "Moviy ravoq", "Sahar ifori"];
const owner = randomUUID(),
  token = randomToken();
const invitations = ids.map((templateId) => {
  const i = normalizeInvitation({ ...completeInvitation(), templateId });
  i.content["uz-Latn"].greeting = "Assalomu alaykum, aziz mehmon!";
  i.content["uz-Latn"].hosts = "Nodir va Madina oilalari";
  return i;
});
const retiredInvitation = normalizeInvitation({
  ...completeInvitation(), templateId: "zarhal-oqshom-card",
});
let browser;
async function post(route: string, body: unknown) {
  return fetch(origin + route, {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      Cookie: `taklifnoma_session=${token}`,
    },
    body: JSON.stringify(body),
  });
}
async function okay(response: Response, status = 200) {
  assert.equal(
    response.status,
    status,
    response.status !== status
      ? (await response.text()).slice(0, 500)
      : undefined,
  );
}
try {
  await sql`INSERT INTO users(id,telegram_user_id,display_name,phone_number,phone_source,phone_shared_at) VALUES(${owner},${-Math.floor(Math.random() * 1e12) - 1},'Disposable stationery verification','+000000000','telegram_contact',now())`;
  await sql`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${owner},${digest(token)},'Static collection QA',now()+interval '1 hour',now()+interval '1 hour')`;
  for (const i of invitations) {
    if (release) {
      const response = await post("/api/invitations", { invitation: i });
      await okay(response, 201);
    } else {
      await sql`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${i.id},${owner},${i.templateId},'draft',${sql.json(i)})`;
    }
  }
  // Represent a pre-existing owned card, without making the retired design
  // available for new creation. It must remain downloadable after retirement.
  await sql`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${retiredInvitation.id},${owner},${retiredInvitation.templateId},'draft',${sql.json(retiredInvitation)})`;
  const retiredDownload = await post(`/api/invitations/${retiredInvitation.id}/image`, {
    revision: retiredInvitation.revision, locale: "uz-Latn",
  });
  await okay(retiredDownload);
  assert.equal((await sharp(Buffer.from(await retiredDownload.arrayBuffer())).metadata()).width, 1500);
  const blockedNewRetired = normalizeInvitation({
    ...completeInvitation(), templateId: "zarhal-oqshom-card",
  });
  await okay(await post("/api/invitations", { invitation: blockedNewRetired }), 409);
  console.log("PASS retired Zarhal: owned export remains available; new creation rejected");
  // This compatibility probe is complete; keep the dashboard fixture at its
  // original three cards rather than adding another simultaneous render.
  await sql`DELETE FROM invitation_audit_log WHERE invitation_id=${retiredInvitation.id}`;
  await sql`DELETE FROM invitations WHERE id=${retiredInvitation.id}`;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await context.addCookies([
    { name: "taklifnoma_session", value: token, url: origin },
  ]);
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (
      response.status() >= 400 &&
      /static-images|api\/auth|api\/catalog|\.webp/.test(response.url())
    )
      errors.push(`${response.status()} ${response.url()}`);
  });
  async function imageReady() {
    const img = page.getByAltText("Rasm taklifnoma ko‘rinishi");
    await img.waitFor();
    await img.evaluate((i: HTMLImageElement) => i.decode());
    assert.equal(
      await img.evaluate(
        (i: HTMLImageElement) => i.naturalWidth / i.naturalHeight,
      ),
      5 / 7,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
  }
  for (const viewport of process.argv.includes("--backend-only")
    ? []
    : [
        { width: 1440, height: 1000 },
        { width: 390, height: 844 },
      ]) {
    await page.setViewportSize(viewport);
    for (const [index, id] of ids.entries()) {
      if (catalogOnly) break;
      await page.goto(`${origin}/preview?template=${id}`);
      await imageReady();
      await page.screenshot({
        path: out + `${id}-preview-${viewport.width}.png`,
        fullPage: true,
      });
      await page.goto(`${origin}/studio/${invitations[index].id}`);
      if (viewport.width < 700)
        await page
          .getByRole("button", { name: "Ko‘rinishi", exact: true })
          .click();
      await imageReady();
      await page.screenshot({
        path: out + `${id}-studio-${viewport.width}.png`,
      });
      console.log(
        `PASS ${id}: ${viewport.width}px full preview and authored Studio rendering`,
      );
    }
    if (release) {
      await page.goto(origin + "/templates");
      await page
        .getByRole("button", { name: "Rasm taklifnoma", exact: true })
        .click();
      assert.equal(await page.getByRole("button", {
        name: "Zarhal oqshom: batafsil ko‘rish", exact: true,
      }).count(), 0);
      for (const [index, id] of ids.entries()) {
        const card = page.getByRole("button", {
          name: `${names[index]}: batafsil ko‘rish`,
          exact: true,
        });
        await card.scrollIntoViewIfNeeded();
        await card
          .locator("img")
          .first()
          .evaluate((i: HTMLImageElement) => i.decode());
        await card.click();
        const dialog = page.getByRole("dialog");
        await dialog
          .locator(`img[src*="${id}"]`)
          .evaluate((i: HTMLImageElement) => i.decode());
        assert.equal(
          await dialog
            .getByRole("link", { name: "Yaratish", exact: true })
            .count(),
          1,
        );
        await page.screenshot({
          path: out + `${id}-detail-${viewport.width}.png`,
        });
        await dialog
          .getByRole("button", { name: "Yopish", exact: true })
          .click();
      }
      await page.screenshot({
        path: out + `catalog-${viewport.width}.png`,
        fullPage: true,
      });
    }
  }
  if (release && !catalogOnly) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(origin + "/studio?new=1");
    await page
      .getByRole("group", { name: "Taklifnoma formati" })
      .getByRole("button", { name: "Rasm taklifnoma", exact: true })
      .click();
    const event = page.getByRole("combobox", {
      name: "Tadbir turi",
      exact: true,
    });
    await event.click();
    assert.deepEqual(
      (await page.getByRole("option").allTextContents()).map((v) => v.trim()),
      ["Nikoh to‘yi", "Fotiha"],
    );
    await page.getByRole("option", { name: "Fotiha", exact: true }).click();
    for (const id of ids)
      assert.equal(
        await page
          .locator(`[data-template-id="${id}"] button[data-card-art]`)
          .first()
          .isVisible(),
        true,
      );
    await page.screenshot({ path: out + "studio-selection-desktop.png" });
    for (const [index, i] of invitations.entries()) {
      // Real save/reopen and switch before identity finalization. No fixture content persists.
      let edited = structuredClone(i);
      edited.templateId = ids[(index + 1) % ids.length];
      let response = await post("/api/invitations", { invitation: edited });
      await okay(response, 201);
      let saved = (await response.json()).invitation;
      assert.deepEqual(
        saved.content["uz-Latn"].people,
        i.content["uz-Latn"].people,
      );
      assert.equal(saved.content["uz-Latn"].hosts, i.content["uz-Latn"].hosts);
      saved.templateId = i.templateId;
      response = await post("/api/invitations", { invitation: saved });
      await okay(response, 201);
      saved = (await response.json()).invitation;
      const reopen = await fetch(`${origin}/api/invitations/${i.id}`, {
        headers: { Cookie: `taklifnoma_session=${token}` },
      });
      await okay(reopen);
      assert.equal((await reopen.json()).invitation.templateId, i.templateId);
      const mismatch = structuredClone(saved);
      mismatch.eventType = "birthday";
      assert.equal(
        (await post("/api/invitations", { invitation: mismatch })).status,
        409,
      );
      const download = await post(`/api/invitations/${i.id}/image`, {
        revision: saved.revision,
        locale: "uz-Latn",
      });
      await okay(download);
      assert.match(
        download.headers.get("content-disposition")!,
        /attachment.*\.png/,
      );
      const png = Buffer.from(await download.arrayBuffer());
      assert.equal((await sharp(png).metadata()).width, 1500);
      await writeFile(out + `${i.templateId}-owned-download.png`, png);
      const [row] =
        await sql`SELECT data,identity_locked_at,slug FROM invitations WHERE id=${i.id}`;
      assert.ok(row.identity_locked_at);
      assert.ok(row.data.imageExportedAt);
      assert.equal(row.slug, null);
      assert.equal(
        (
          await sql`SELECT count(*)::int AS n FROM payment_orders WHERE invitation_id=${i.id}`
        )[0].n,
        0,
      );
      assert.equal(
        (
          await post(`/api/invitations/${i.id}/checkout`, {
            revision: saved.revision,
            expectedAmountMinor: 0,
          })
        ).status,
        400,
      );
      const changed = structuredClone(row.data);
      changed.content["uz-Latn"].people[0] = "Other person";
      assert.equal(
        (await post("/api/invitations", { invitation: changed })).status,
        403,
      );
      const correction = structuredClone(row.data);
      correction.content["uz-Latn"].address = "Corrected invitation address";
      response = await post("/api/invitations", { invitation: correction });
      await okay(response, 201);
      saved = (await response.json()).invitation;
      response = await post(`/api/invitations/${i.id}/image`, {
        revision: saved.revision,
        locale: "uz-Latn",
      });
      await okay(response);
      await response.arrayBuffer();
      console.log(
        `PASS ${i.templateId}: real save/reopen/switch, compatibility, owned download, identity lock, location correction and repeat export`,
      );
    }
    await page.goto(origin + "/dashboard");
    await page.getByAltText("Rasm taklifnoma ko‘rinishi").first().waitFor();
    await page.screenshot({ path: out + "dashboard-desktop.png" });
    await page.goto(origin + "/");
    for (const id of ids)
      assert.equal(
        await page.locator(`a[href*="${id}"],img[src*="${id}"]`).count(),
        0,
      );
  }
  assert.deepEqual(errors, []);
  console.log(
    `PASS ${release ? "release" : "preflight"}: no browser/runtime/image API failures`,
  );
} finally {
  await browser?.close();
  await sql.begin(async (tx) => {
    const invitationIds = [...invitations.map((i) => i.id), retiredInvitation.id];
    await tx`DELETE FROM invitation_audit_log WHERE invitation_id IN ${sql(invitationIds)}`;
    await tx`DELETE FROM invitations WHERE owner_id=${owner}`;
    await tx`DELETE FROM sessions WHERE user_id=${owner}`;
    await tx`DELETE FROM users WHERE id=${owner}`;
  });
  await closeDb();
}
