// A separate local Next server talks ONLY to a loopback Nodze stub. No real checkout.
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createHmac, randomUUID } from "node:crypto";
import { spawn, type ChildProcess } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { getDb, closeDb } from "../packages/database/src/index";
import {
  digest,
  randomToken,
  verifyMiniAppLaunch,
} from "../apps/web/src/server/auth/crypto";
import { completeInvitation } from "./fixtures/publication";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import sharp from "sharp";

const sql = getDb(),
  userId = randomUUID(),
  telegramId = Math.floor(Math.random() * 1e12) + 1,
  token = randomToken();
let origin: string;
const secret = "http-fixture-webhook-secret-only";
const payments = new Map<string, Record<string, unknown>>();
const launchKeys: string[] = [];
let app: ChildProcess | undefined;
let appOutput = "";
const generatedFiles = ["next-env.d.ts", "tsconfig.json"].map(
  (name) => new URL(`../apps/web/${name}`, import.meta.url),
);
let originalGeneratedFiles: string[] = [];
const mock = createServer(async (req, res) => {
  if (req.headers.authorization !== "Bearer http-fixture-project-key") {
    res.writeHead(401).end();
    return;
  }
  let data = "";
  for await (const chunk of req) data += chunk;
  res.setHeader("Content-Type", "application/json");
  if (req.method === "POST" && req.url === "/api/v1/payments") {
    const input = JSON.parse(data);
    assert.equal(input.amount, 49000);
    assert.equal(input.successUrl, origin + "/payment/return");
    let payment = [...payments.values()].find(
      (p) => p.orderId === input.orderId,
    );
    if (!payment) {
      payment = {
        ...input,
        id: randomUUID(),
        status: "PENDING",
        checkoutUrl: "https://my.click.uz/services/pay?mock-only=1",
      };
      payments.set(String(payment.id), payment);
    }
    res.writeHead(201).end(JSON.stringify(payment));
  } else {
    const payment = payments.get(req.url!.split("/").at(-1)!);
    res.writeHead(payment ? 200 : 404).end(JSON.stringify(payment ?? {}));
  }
});
before(async () => {
  // Let the OS choose a usable port; fixed ports can be reserved on Windows.
  const listener = createServer();
  await new Promise<void>((resolve) =>
    listener.listen(0, "127.0.0.1", resolve),
  );
  const appPort = (listener.address() as { port: number }).port;
  await new Promise<void>((resolve) => listener.close(() => resolve()));
  origin = `http://127.0.0.1:${appPort}`;
  originalGeneratedFiles = await Promise.all(
    generatedFiles.map((path) => readFile(path, "utf8")),
  );
  await new Promise<void>((resolve) => mock.listen(0, "127.0.0.1", resolve));
  const port = (mock.address() as { port: number }).port;
  await sql`INSERT INTO users(id,telegram_user_id,display_name) VALUES(${userId},${telegramId},'Disposable payment HTTP fixture')`;
  await sql`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${userId},${digest(token)},'Payment HTTP fixture',now()+interval '1 hour',now()+interval '1 hour')`;
  const require = createRequire(
    new URL("../apps/web/package.json", import.meta.url),
  );
  app = spawn(
    process.execPath,
    [
      require.resolve("next/dist/bin/next"),
      "dev",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(appPort),
    ],
    {
      cwd: new URL("../apps/web", import.meta.url),
      windowsHide: true,
      env: {
        ...process.env,
        NODE_ENV: "development",
        CI: "1",
        TELEGRAM_BOT_TOKEN: "http-fixture-telegram-token",
        APP_URL: origin,

        NODZE_API_BASE_URL: `http://127.0.0.1:${port}/api/v1`,
        NODZE_API_KEY: "http-fixture-project-key",
        NODZE_WEBHOOK_SECRET: secret,
        INVITATION_COVER_BROWSER_PATH:
          process.env.INVITATION_COVER_BROWSER_PATH ||
          (process.platform === "win32"
            ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
            : undefined),
        TAKLIFNOMA_BUILD_DIST_DIR: ".next-payments-test",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  app.stdout?.on("data", (chunk) => {
    appOutput += chunk.toString();
  });
  app.stderr?.on("data", (chunk) => {
    appOutput += chunk.toString();
  });
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(origin + "/api/auth/session")).ok) return;
    } catch {
      /* Server startup. */
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Local Next server did not start: " + appOutput.slice(-2000));
});

test(
  "admin creator uses the same mobile UI without checkout; forged ordinary requests remain unpaid",
  { timeout: 180000 },
  async () => {
    const adminId = randomUUID(),
      adminToken = randomToken();
    const require = createRequire(
      new URL("../apps/web/package.json", import.meta.url),
    );
    const { chromium } = require("playwright");
    let browser: any;
    const request = (
      path: string,
      body?: unknown,
      cookie = adminToken,
      extra: Record<string, string> = {},
    ) =>
      fetch(origin + path, {
        method: body === undefined ? "GET" : "POST",
        headers: {
          Origin: origin,
          "Content-Type": "application/json",
          Cookie: `taklifnoma_session=${cookie}`,
          ...extra,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    const web = completeInvitation();
    const image = normalizeInvitation({
      ...completeInvitation(),
      templateId: "oq-atirgul",
    });
    const unpaid = completeInvitation();
    const providerCount = payments.size;
    try {
      await sql`INSERT INTO users(id,telegram_user_id,display_name,is_admin) VALUES(${adminId},${Math.floor(Math.random() * 1e12) + 1},'Disposable mobile creator admin',true)`;
      // Administrative reauthentication must not interrupt the ordinary creator flow.
      await sql`INSERT INTO sessions(user_id,token_hash,user_agent,created_at,expires_at,absolute_expires_at)
      VALUES(${adminId},${digest(adminToken)},'Disposable mobile creator',now()-interval '8 days',now()+interval '1 hour',now()+interval '1 hour')`;
      for (const invitation of [web, image, unpaid])
        await sql`INSERT INTO invitations(id,owner_id,template_id,data) VALUES(${invitation.id},${invitation.id === unpaid.id ? userId : adminId},${invitation.templateId},${sql.json(invitation)})`;
      const forged = await request(
        `/api/invitations/${unpaid.id}/publish`,
        { revision: unpaid.revision, isAdmin: true, paid: true },
        token,
      );
      assert.equal(forged.status, 400);
      for (const suffix of ["?paid=true&isAdmin=true", ""]) {
        const rejected = await request(
          `/api/invitations/${unpaid.id}/publish${suffix}`,
          { revision: unpaid.revision },
          token,
          {
            "x-user-id": adminId,
            "x-admin": "true",
            "x-payment-status": "SUCCEEDED",
          },
        );
        assert.equal(rejected.status, 402);
      }
      assert.equal(
        (
          await request(
            `/api/invitations/${unpaid.id}/checkout`,
            {
              revision: unpaid.revision,
              expectedAmountMinor: 4900000,
              isAdmin: true,
            },
            token,
          )
        ).status,
        400,
      );
      assert.equal(
        (
          await request(
            `/api/invitations/${unpaid.id}/publish`,
            { revision: unpaid.revision },
            token,
            {
              "x-admin-invitation": unpaid.id,
              "x-admin-reason": "Attempt forged admin context",
            },
          )
        ).status,
        403,
      );
      assert.equal(
        (
          await request(
            `/api/invitations/${web.id}/publish`,
            { revision: web.revision },
            token,
          )
        ).status,
        404,
      );
      assert.equal(
        (
          await request(
            `/api/invitations/${web.id}/publish`,
            { revision: web.revision },
            "invalid-session-token",
          )
        ).status,
        401,
      );

      browser = await chromium.launch({ channel: "chrome", headless: true });
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        acceptDownloads: true,
      });
      await context.addCookies([
        { name: "taklifnoma_session", value: adminToken, url: origin },
      ]);
      await context.route("**/*", async (route: any) => {
        if (new URL(route.request().url()).origin !== origin)
          return route.abort();
        return route.continue();
      });
      const page = await context.newPage();
      const checkoutRequests: string[] = [],
        pageErrors: string[] = [];
      page.on("request", (req: any) => {
        if (new URL(req.url()).pathname.endsWith("/checkout"))
          checkoutRequests.push(req.url());
      });
      page.on("pageerror", (error: Error) => pageErrors.push(error.message));
      for (const invitation of [web, image]) {
        await page.goto(`${origin}/studio/${invitation.id}`, {
          waitUntil: "domcontentloaded",
        });
        const mobileSteps = page.locator("details[data-mobile-steps]");
        await mobileSteps.locator("summary").waitFor({ timeout: 60000 });
        await mobileSteps.locator("summary").click();
        const steps = mobileSteps.locator("nav button");
        await steps.last().click();
        const button = page.getByRole("button", {
          name:
            invitation.id === web.id
              ? /^To‘lash va nashr qilish/
              : /^To‘lash va PNG yuklab olish/,
        });
        await button.waitFor();
        assert.doesNotMatch(
          await page.locator("main").innerText(),
          /publish free|free as owner|bepul|administrator tahriri/i,
        );
        const popupCount = context.pages().length;
        if (invitation.id === web.id) {
          await button.click({ timeout: 60000 });
          await page
            .getByText(
              "Taklifnomangiz nashr qilindi. Havolani mehmonlaringiz bilan ulashing.",
              { exact: true },
            )
            .waitFor({ timeout: 45000 });
        } else {
          const downloadPromise = page.waitForEvent("download", {
            timeout: 45000,
          });
          await button.click({ timeout: 60000 });
          const download = await downloadPromise;
          assert.equal(await download.failure(), null);
          const filename = await download.path();
          const metadata = await sharp(await readFile(filename!)).metadata();
          assert.deepEqual(
            [metadata.width, metadata.height, metadata.format],
            [1500, 2100, "png"],
          );
        }
        assert.equal(
          context.pages().length,
          popupCount,
          "admin flow opens no payment or blank popup",
        );
        const paymentContext = await (
          await request(`/api/invitations/${invitation.id}/payment`)
        ).json();
        assert.equal(paymentContext.order.status, "SUCCEEDED");
        assert.equal(paymentContext.order.checkoutUrl, null);
        assert.equal(
          (
            await request(
              `/api/payments/${paymentContext.order.id}`,
              undefined,
              token,
            )
          ).status,
          404,
        );
        assert.equal(
          (
            await request(
              `/api/payments/${paymentContext.order.id}/refresh`,
              {},
            )
          ).status,
          200,
        );
      }
      assert.deepEqual(checkoutRequests, []);
      assert.deepEqual(pageErrors, []);
      assert.equal(payments.size, providerCount, "no new provider checkout");
      assert.equal(
        (await sql`SELECT * FROM payment_orders WHERE owner_id=${adminId}`)
          .length,
        0,
      );
      assert.equal(
        (
          await sql`SELECT * FROM admin_payment_records WHERE owner_id=${adminId}`
        ).length,
        0,
      );
      const [finalized] =
        await sql`SELECT data,identity_locked_at,edit_deadline_at FROM invitations WHERE id=${image.id}`;
      assert.ok(finalized.data.imageExportedAt);
      assert.ok(finalized.identity_locked_at);
      assert.ok(finalized.edit_deadline_at);
      assert.equal(
        (
          await sql`SELECT * FROM admin_invitation_grants WHERE owner_id=${adminId}`
        ).length,
        2,
      );

      // Revocation is effective on the next request, including a stale client flag.
      await sql`UPDATE users SET is_admin=false WHERE id=${adminId}`;
      const next = completeInvitation();
      await sql`INSERT INTO invitations(id,owner_id,template_id,data) VALUES(${next.id},${adminId},${next.templateId},${sql.json(next)})`;
      assert.equal(
        (
          await request(`/api/invitations/${next.id}/publish`, {
            revision: next.revision,
          })
        ).status,
        402,
      );
      await sql`UPDATE sessions SET revoked_at=now() WHERE user_id=${adminId}`;
      assert.equal(
        (
          await request(`/api/invitations/${next.id}/publish`, {
            revision: next.revision,
          })
        ).status,
        401,
      );
    } catch (error) {
      console.error(
        "Local admin creator verification:",
        appOutput.slice(-5000),
      );
      throw error;
    } finally {
      await browser?.close();
      await sql.begin(async (tx) => {
        await tx`DELETE FROM admin_invitation_grants WHERE owner_id=${adminId}`;
        await tx`DELETE FROM invitation_audit_log WHERE invitation_id IN (SELECT id FROM invitations WHERE owner_id=${adminId})`;
        await tx`DELETE FROM invitations WHERE owner_id=${adminId}`;
        await tx`DELETE FROM invitations WHERE id=${unpaid.id}`;
        await tx`DELETE FROM sessions WHERE user_id=${adminId}`;
        await tx`DELETE FROM users WHERE id=${adminId}`;
      });
    }
  },
);
after(async () => {
  if (app?.exitCode !== null && app?.exitCode !== undefined)
    console.error(
      "Local Next server exited:",
      app.exitCode,
      appOutput.slice(-4000),
    );
  app?.kill();
  if (originalGeneratedFiles.length)
    await Promise.all(
      generatedFiles.map((path, index) =>
        writeFile(path, originalGeneratedFiles[index]),
      ),
    );
  mock.closeAllConnections();
  await new Promise<void>((resolve) => mock.close(() => resolve()));
  await sql.begin(async (tx) => {
    await tx`DELETE FROM auth_requests WHERE user_id=${userId}`;
    for (const key of launchKeys)
      await tx`DELETE FROM miniapp_exchanges WHERE init_hash=${key}`;
    await tx`DELETE FROM jobs WHERE type='payment-confirmation' AND payload->>'orderId' IN (SELECT id::text FROM payment_orders WHERE owner_id=${userId})`;
    await tx`DELETE FROM payment_webhook_events WHERE order_id IN(SELECT id FROM payment_orders WHERE owner_id=${userId})`;
    await tx`DELETE FROM payment_orders WHERE owner_id=${userId}`;
    await tx`DELETE FROM invitation_audit_log WHERE invitation_id IN(SELECT id FROM invitations WHERE owner_id=${userId})`;
    await tx`DELETE FROM invitations WHERE owner_id=${userId}`;
    await tx`DELETE FROM sessions WHERE user_id=${userId}`;
    await tx`DELETE FROM users WHERE id=${userId}`;
  });
  await closeDb();
});
function req(
  path: string,
  body?: unknown,
  authenticated = true,
  requestOrigin = origin,
) {
  return fetch(origin + path, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Origin: requestOrigin,
      "Content-Type": "application/json",
      ...(authenticated ? { Cookie: `taklifnoma_session=${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
test("HTTP checkout requires login/origin, verified webhook publishes, return parameters cannot forge success", async () => {
  const invitation = normalizeInvitation(completeInvitation());
  const fields = {
    auth_date: String(Math.floor(Date.now() / 1000)),
    query_id: randomUUID(),
    user: JSON.stringify({
      id: telegramId,
      first_name: "Telegram identity QA",
    }),
  };
  const params = new URLSearchParams(fields);
  const signingSecret = createHmac("sha256", "WebAppData")
    .update("http-fixture-telegram-token")
    .digest();
  params.set(
    "hash",
    createHmac("sha256", signingSecret)
      .update(
        Object.entries(fields)
          .sort(([a], [b]) => a.localeCompare(b, "en"))
          .map(([key, value]) => `${key}=${value}`)
          .join("\n"),
      )
      .digest("hex"),
  );
  launchKeys.push(
    verifyMiniAppLaunch(params.toString(), "http-fixture-telegram-token")
      .replayKey,
  );
  const miniAppLogin = await req(
    "/api/auth/telegram/mini-app",
    { initData: params.toString() },
    false,
  );
  assert.equal(miniAppLogin.status, 200, await miniAppLogin.clone().text());
  assert.equal((await miniAppLogin.json()).user.id, userId);
  const miniAppCookie = miniAppLogin.headers
    .get("set-cookie")!
    .match(/taklifnoma_session=([^;]+)/)![1];
  const miniAppSession = await fetch(origin + "/api/auth/session", {
    headers: { Cookie: `taklifnoma_session=${miniAppCookie}` },
  });
  assert.equal((await miniAppSession.json()).user.id, userId);
  const browserToken = randomToken();
  const [auth] =
    await sql`INSERT INTO auth_requests(token_hash,browser_hash,user_id,state,expires_at,confirmed_at) VALUES(${digest(randomToken())},${digest(browserToken)},${userId},'confirmed',now()+interval '5 minutes',now()) RETURNING id`;
  const webLogin = await fetch(origin + "/api/auth/telegram/complete", {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      Cookie: `taklifnoma_auth_browser=${browserToken}`,
    },
    body: JSON.stringify({ requestId: auth.id }),
  });
  assert.equal(webLogin.status, 200, await webLogin.clone().text());
  assert.equal((await webLogin.json()).user.id, userId);
  assert.equal((await req("/api/payments", undefined, false)).status, 401);
  assert.equal(
    (
      await req(
        `/api/invitations/${invitation.id}/checkout`,
        { revision: 1, expectedAmountMinor: 4900000 },
        false,
      )
    ).status,
    401,
  );
  assert.equal(
    (
      await req(
        `/api/invitations/${invitation.id}/checkout`,
        { revision: 1, expectedAmountMinor: 4900000 },
        true,
        "https://attacker.example",
      )
    ).status,
    403,
  );
  const savedResponse = await req("/api/invitations", { invitation });
  assert.equal(savedResponse.status, 201, await savedResponse.clone().text());
  const saved = (await savedResponse.json()).invitation;
  // The same Telegram account can save and purchase without account phone data.
  const session = await (await req("/api/auth/session")).json();
  assert.equal(session.user.id, userId);
  assert.equal("phoneShared" in session.user, false);
  assert.equal(
    (await req(`/api/invitations/${saved.id}/payment`, undefined, false))
      .status,
    401,
  );
  const unpaidContext = await req(`/api/invitations/${saved.id}/payment`);
  assert.equal(unpaidContext.status, 200);
  assert.equal((await unpaidContext.json()).order, null);
  assert.equal(
    (await req(`/api/invitations/${randomUUID()}/payment`)).status,
    404,
  );
  assert.equal(
    (
      await req(`/api/invitations/${saved.id}/publish`, {
        revision: saved.revision,
      })
    ).status,
    402,
  );
  const tampered = await req(`/api/invitations/${saved.id}/checkout`, {
    revision: saved.revision,
    expectedAmountMinor: 1,
  });
  assert.equal(tampered.status, 409);
  assert.equal((await tampered.json()).error.code, "PRICE_CHANGED");
  const checkout = await req(`/api/invitations/${saved.id}/checkout`, {
    revision: saved.revision,
    expectedAmountMinor: 4900000,
  });
  assert.equal(checkout.status, 200, await checkout.clone().text());
  assert.match(checkout.headers.get("cache-control")!, /no-store/);
  const order = (await checkout.json()).order;
  const repeatedCheckout = await req(`/api/invitations/${saved.id}/checkout`, {
    revision: saved.revision,
    expectedAmountMinor: 4900000,
  });
  assert.equal(repeatedCheckout.status, 200);
  assert.equal((await repeatedCheckout.json()).order.id, order.id);
  assert.equal(payments.size, 1);
  assert.equal(
    (await req(`/api/payments/${order.id}`, undefined, false)).status,
    401,
  );
  const scoped = await req(`/api/payments/${order.id}`);
  assert.equal(scoped.status, 200);
  assert.match(scoped.headers.get("cache-control")!, /no-store/);
  const scopedContext = await scoped.json();
  assert.equal(scopedContext.invitation.id, saved.id);
  assert.equal(scopedContext.order.id, order.id);
  assert.equal("orders" in scopedContext, false);
  assert.equal((await req(`/api/payments/${randomUUID()}`)).status, 404);
  const returnPage = await fetch(
    origin + "/payment/return?status=SUCCEEDED&paid=true",
  );
  assert.equal(returnPage.status, 200);
  let orders = (await (await req("/api/payments")).json()).orders;
  assert.equal(orders[0].status, "PENDING");
  assert.equal(orders[0].url, null);
  assert.equal(
    (
      await fetch(origin + "/api/webhooks/nodze", {
        method: "POST",
        body: "{}",
      })
    ).status,
    401,
  );
  const payment = [...payments.values()].find((p) => p.orderId === order.id)!;
  payment.status = "SUCCEEDED";
  const id = randomUUID(),
    timestamp = String(Math.floor(Date.now() / 1000));
  const body = JSON.stringify({
    id,
    type: "payment.succeeded",
    data: {
      paymentId: payment.id,
      orderId: order.id,
      amount: 49000,
      currency: "UZS",
      status: "SUCCEEDED",
    },
  });
  const signature =
    "v1=" +
    createHmac("sha256", secret)
      .update(`${timestamp}.${id}.${body}`)
      .digest("hex");
  const send = () =>
    fetch(origin + "/api/webhooks/nodze", {
      method: "POST",
      headers: {
        "X-Nodze-Event-Id": id,
        "X-Nodze-Timestamp": timestamp,
        "X-Nodze-Signature": signature,
      },
      body,
    });
  assert.equal((await send()).status, 204);
  assert.equal((await send()).status, 204);
  orders = (await (await req("/api/payments")).json()).orders;
  assert.equal(orders[0].status, "SUCCEEDED");
  assert.match(orders[0].url, /\/i\/[A-Za-z0-9]{6}$/);
  const publicPage = await fetch(orders[0].url);
  assert.equal(publicPage.status, 200);
  const html = await publicPage.text();
  assert.ok(html.includes("Nodir test"));
  const republish = await req(`/api/invitations/${saved.id}/publish`, {
    revision: saved.revision,
  });
  assert.equal(republish.status, 200);
  assert.equal((await republish.json()).url, orders[0].url);
});
