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

const sql = getDb(),
  userId = randomUUID(),
  telegramId = Math.floor(Math.random() * 1e12) + 1,
  token = randomToken(),
  origin = "http://127.0.0.1:3102";
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
    assert.equal(input.amount, 1000);
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
      "3102",
    ],
    {
      cwd: new URL("../apps/web", import.meta.url),
      windowsHide: true,
      env: {
        ...process.env,
        NODE_ENV: "development",
        TELEGRAM_BOT_TOKEN: "http-fixture-telegram-token",
        APP_URL: origin,
        PUBLISHING_MODE: "paid",
        NODZE_API_BASE_URL: `http://127.0.0.1:${port}/api/v1`,
        NODZE_API_KEY: "http-fixture-project-key",
        NODZE_WEBHOOK_SECRET: secret,
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
after(async () => {
  app?.kill();
  if (originalGeneratedFiles.length)
    await Promise.all(
      generatedFiles.map((path, index) =>
        writeFile(path, originalGeneratedFiles[index]),
      ),
    );
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
  const invitation = completeInvitation();
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
        { revision: 1, expectedAmountMinor: 100000 },
        false,
      )
    ).status,
    401,
  );
  assert.equal(
    (
      await req(
        `/api/invitations/${invitation.id}/checkout`,
        { revision: 1, expectedAmountMinor: 100000 },
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
    expectedAmountMinor: 100000,
  });
  assert.equal(checkout.status, 200, await checkout.clone().text());
  assert.match(checkout.headers.get("cache-control")!, /no-store/);
  const order = (await checkout.json()).order;
  const repeatedCheckout = await req(`/api/invitations/${saved.id}/checkout`, {
    revision: saved.revision,
    expectedAmountMinor: 100000,
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
      amount: 1000,
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
