// Run only against tests/fixtures/security-test-interceptor.cjs on :3024.
// Disposable database rows and local media only. No actual Telegram/CAPTCHA calls.
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID, randomInt } from "node:crypto";
import { createRequire } from "node:module";
import { getDb, closeDb } from "../packages/database/src/index";
import { completeInvitation } from "./fixtures/publication";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { removeLocalMedia } from "../apps/web/src/server/local-storage";
import { resolve } from "node:path";
const requireWeb = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const sharp = requireWeb("sharp");
const { PDFDocument } = requireWeb("pdf-lib");
const origin = "http://127.0.0.1:3024";

test(
  "upload approval, new receipt formats, private access, guest limits and retired covers over real HTTP",
  { timeout: 240000 },
  async () => {
    const db = getDb();
    const owner = randomUUID(),
      stranger = randomUUID(),
      token = randomToken(),
      strangerToken = randomToken();
    const draft = { ...completeInvitation(), id: randomUUID() };
    const invitation = {
      ...completeInvitation(),
      id: randomUUID(),
      status: "published" as const,
      gift: {
        enabled: true,
        receiptUploadEnabled: true,
        cardHolder: "Disposable QA",
        cardNumber: "4444333322221111",
      },
    };
    let ip = 0;
    const oldDirectory = process.env.LOCAL_MEDIA_DIR;
    process.env.LOCAL_MEDIA_DIR = resolve(".tmp/security-test-media");
    async function request(
      path: string,
      body?: unknown,
      session = token,
      extra: Record<string, string> = {},
      method?: string,
    ) {
      return fetch(origin + path, {
        method: method ?? (body === undefined ? "GET" : "POST"),
        headers: {
          Origin: origin,
          "X-Real-IP": `203.0.113.${(++ip % 250) + 1}`,
          ...(session ? { Cookie: `taklifnoma_session=${session}` } : {}),
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
          ...extra,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    }
    async function upload(bytes: Buffer, type = "image/png") {
      const prepared = await request("/api/uploads", {
        filename: "qa.png",
        size: bytes.length,
        contentType: type,
        kind: "image",
        draftId: draft.id,
      });
      assert.equal(prepared.status, 201, await prepared.clone().text());
      const { upload } = await prepared.json();
      const put = await fetch(origin + upload.url, {
        method: "PUT",
        headers: {
          Origin: origin,
          Cookie: `taklifnoma_session=${token}`,
          ...upload.headers,
        },
        body: new Uint8Array(bytes),
      });
      assert.equal(put.status, 204, await put.clone().text());
      return { upload, result: await request(upload.completeUrl, {}, token) };
    }
    async function receipt(bytes: Buffer, action = "guest_receipt") {
      const form = new FormData();
      form.set("giverNames", "Disposable QA");
      form.set(
        "file",
        new Blob([new Uint8Array(bytes)], { type: "application/octet-stream" }),
        "qa-upload.bin",
      );
      return fetch(
        `${origin}/api/public/invitations/${invitation.id}/receipts`,
        {
          method: "POST",
          headers: {
            Origin: origin,
            "X-Real-IP": `203.0.113.${(++ip % 250) + 1}`,
            "cf-turnstile-response": `security-fixture:${action}`,
          },
          body: form,
        },
      );
    }
    try {
      const telegram = -randomInt(1e12);
      await db`INSERT INTO users(id,telegram_user_id,display_name) VALUES(${owner},${telegram},'Disposable security QA'),(${stranger},${telegram - 1},'Disposable security outsider')`;
      for (const [id, value] of [
        [owner, token],
        [stranger, strangerToken],
      ])
        await db`INSERT INTO sessions(user_id,token_hash,expires_at,absolute_expires_at) VALUES(${id},${digest(value)},now()+interval '1 hour',now()+interval '1 hour')`;
      assert.equal(
        (await (await request("/api/auth/session")).json()).user?.id,
        owner,
        "Start the isolated security test server first",
      );
      for (const item of [draft, invitation])
        await db`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${item.id},${owner},${item.templateId},${item.status},${db.json(item)})`;
      assert.equal(
        (await request("/api/invitation-covers", { invalid: true }, "")).status,
        410,
      );

      const png = await sharp({
        create: { width: 40, height: 30, channels: 3, background: "blue" },
      })
        .png()
        .withMetadata()
        .toBuffer();
      const image = await upload(png);
      assert.equal(image.result.status, 200, await image.result.clone().text());
      const asset = (await image.result.json()).asset;
      const [stored] =
        await db`SELECT object_key,size_bytes FROM media_assets WHERE id=${asset.id}`;
      assert.match(stored.object_key, /^local\/verified\//);
      const media = await request(asset.url);
      assert.equal(media.status, 200);
      assert.equal(
        (await sharp(Buffer.from(await media.arrayBuffer())).metadata()).exif,
        undefined,
      );
      assert.equal(
        (await request(asset.url, undefined, strangerToken)).status,
        404,
      );
      assert.equal((await request(asset.url, undefined, "")).status, 404);
      assert.equal(
        (await request(image.upload.completeUrl, {})).status,
        200,
        "completion retry is idempotent",
      );
      const replay = await fetch(origin + image.upload.url, {
        method: "PUT",
        headers: { Origin: origin, Cookie: `taklifnoma_session=${token}` },
        body: new Uint8Array(png),
      });
      assert.equal(
        replay.status,
        409,
        "a finished upload cannot replace approved bytes",
      );

      const forged = Buffer.concat([
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        Buffer.alloc(40),
      ]);
      const broken = await upload(forged);
      assert.equal(broken.result.status, 400);
      assert.equal((await broken.result.json()).error.code, "INVALID_FILE");
      assert.equal(
        (
          await request(
            "/api/uploads",
            {
              filename: "x.png",
              size: png.length,
              contentType: "image/png",
              kind: "image",
              draftId: draft.id,
            },
            strangerToken,
          )
        ).status,
        403,
      );

      assert.equal((await receipt(png, "guest_rsvp")).status, 403);
      const first = await receipt(png);
      assert.equal(first.status, 201, await first.clone().text());
      assert.equal(
        (await receipt(png)).status,
        200,
        "original-byte hash retains duplicate protection after normalization",
      );
      for (const format of ["gif", "avif", "tiff"]) {
        const bytes = await sharp({
          create: { width: 32, height: 24, channels: 3, background: "red" },
        })
          .toFormat(format)
          .toBuffer();
        const result = await receipt(bytes);
        assert.equal(result.status, 201, await result.clone().text());
      }
      const doc = await PDFDocument.create();
      doc.addPage().drawText("Receipt security QA");
      doc.addJavaScript("test", "app.alert('no')");
      assert.equal((await receipt(Buffer.from(await doc.save()))).status, 201);
      const receipts =
        await db`SELECT m.id,m.mime_type,m.visibility,m.filename FROM media_assets m JOIN gift_receipts r ON r.asset_id=m.id WHERE r.invitation_id=${invitation.id}`;
      assert.equal(receipts.length, 5);
      assert.ok(receipts.every((row) => row.visibility === "private"));
      for (const row of receipts)
        assert.equal(
          (await request(`/api/media/${row.id}`, undefined, strangerToken))
            .status,
          404,
        );
      const pdf = receipts.find((row) => row.mime_type === "application/pdf")!;
      const download = await request(`/api/media/${pdf.id}`);
      assert.equal(download.headers.get("content-disposition"), "attachment");
      assert.match(
        download.headers.get("content-security-policy") ?? "",
        /sandbox/,
      );
      assert.equal(
        (await receipt(Buffer.from("%PDF-1.7\nfake\n%%EOF"))).status,
        400,
      );

      const base = `/api/public/invitations/${invitation.id}`;
      const wishHeaders = {
        "cf-turnstile-response": "security-fixture:guest_wish",
      };
      const one = await request(
        base + "/wishes",
        { name: "QA", message: "First" },
        "",
        wishHeaders,
      );
      assert.equal(one.status, 201, await one.clone().text());
      const visitor = one.headers.get("set-cookie")!.split(";")[0];
      for (const [message, status] of [
        ["Second", 201],
        ["Third", 429],
      ] as const) {
        const result = await request(
          base + "/wishes",
          { name: "QA", message },
          "",
          { ...wishHeaders, Cookie: visitor },
        );
        assert.equal(result.status, status, await result.clone().text());
      }
      for (const status of ["yes", "no"]) {
        const response = await request(
          base + "/rsvp",
          { name: "QA", status, partySize: 1 },
          "",
          {
            Cookie: visitor,
            "cf-turnstile-response": "security-fixture:guest_rsvp",
          },
        );
        assert.equal(response.status, 201, await response.clone().text());
      }
      const responses =
        await db`SELECT status FROM rsvp_responses WHERE invitation_id=${invitation.id}`;
      assert.equal(responses.length, 1);
      assert.equal(responses[0].status, "no");
      // Repeated cookieless views on one address stop growing the viewer table.
      for (let n = 0; n < 35; n++)
        assert.equal(
          (
            await request(base + "/view", {}, "", {
              "X-Real-IP": "198.51.100.252",
            })
          ).status,
          204,
        );
      assert.equal(
        Number(
          (
            await db`SELECT count(*) AS count FROM invitation_viewers WHERE invitation_id=${invitation.id}`
          )[0].count,
        ),
        30,
      );
      console.log(
        "Security HTTP: validated immutable uploads; 5 private receipts; guest edits/limits; 30 bounded views; retired cover endpoint.",
      );
    } finally {
      const assets =
        await db`SELECT object_key FROM media_assets WHERE owner_id IN (${owner},${stranger})`;
      for (const asset of assets)
        if (asset.object_key.startsWith("local/"))
          await removeLocalMedia(asset.object_key);
      await db.begin(async (tx) => {
        await tx`DELETE FROM jobs WHERE payload->>'invitationId' IN (${draft.id},${invitation.id}) OR payload->>'ownerId' IN (${owner},${stranger})`;
        await tx`DELETE FROM gift_receipts WHERE invitation_id IN (${draft.id},${invitation.id})`;
        await tx`DELETE FROM wishes WHERE invitation_id IN (${draft.id},${invitation.id})`;
        await tx`DELETE FROM rsvp_responses WHERE invitation_id IN (${draft.id},${invitation.id})`;
        await tx`DELETE FROM invitation_audit_log WHERE invitation_id IN (${draft.id},${invitation.id})`;
        await tx`DELETE FROM invitations WHERE owner_id IN (${owner},${stranger})`;
        await tx`DELETE FROM media_assets WHERE owner_id IN (${owner},${stranger})`;
        await tx`DELETE FROM sessions WHERE user_id IN (${owner},${stranger})`;
        await tx`DELETE FROM users WHERE id IN (${owner},${stranger})`;
      });
      if (oldDirectory === undefined) delete process.env.LOCAL_MEDIA_DIR;
      else process.env.LOCAL_MEDIA_DIR = oldDirectory;
      await closeDb();
    }
  },
);
