import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createInvitation, TEMPLATES } from "../packages/contracts/src/index";
import { publicInvitationData } from "../apps/web/src/server/public-invitation-data";
import { apiError, ApiError } from "../apps/web/src/server/api";
import { authRoute, AuthError } from "../apps/web/src/server/auth";
import { coverFailure } from "../apps/web/src/server/cover-error";
import { mediaResponse } from "../apps/web/src/server/storage";

const secret = "PRIVATE-credential-and-creator-id";

test("public invitation projection excludes account fields, disabled content and stale template data", () => {
  const invitation = createInvitation("anor");
  const data = {
    ...invitation,
    owner_id: secret,
    telegramUserId: secret,
    botToken: secret,
    content: {
      ...invitation.content,
      ru: { ...invitation.content["uz-Latn"], message: secret },
    },
    enabledLocales: ["uz-Latn"],
    optionalFeatures: { gallery: false, artists: false, contacts: false },
    gallery: [
      { id: secret, url: "/private-photo", alt: secret, caption: secret },
    ],
    contacts: { phoneNumber: secret, telegramUsername: secret },
    music: {
      enabled: false,
      assetId: secret,
      url: "/private-music",
      filename: secret,
    },
    gift: {
      enabled: false,
      receiptUploadEnabled: false,
      cardNumber: "1234567812345678",
      cardHolder: secret,
    },
    templateData: {
      anor: { ownerId: secret },
      "wedivo-pulau-sehati": { private: secret },
    },
  };
  const before = JSON.stringify(data);
  const visible = publicInvitationData(data);
  assert.ok(!JSON.stringify(visible).includes(secret));
  assert.equal(
    JSON.stringify(data),
    before,
    "creator data must remain recoverable",
  );
  assert.equal(visible.id, invitation.id);
  assert.deepEqual(visible.content["uz-Latn"], invitation.content["uz-Latn"]);
});

test("public projection retains intentional public contacts/gifts and typed template content", () => {
  const invitation = createInvitation("taklifla-terracotta");
  invitation.templateData[invitation.templateId] = {
    infoNote: { "uz-Latn": "Authored public note" },
    privateOwnerId: secret,
  };
  assert.equal(
    JSON.stringify(publicInvitationData(invitation).templateData).includes(
      secret,
    ),
    false,
  );
  assert.match(
    JSON.stringify(publicInvitationData(invitation)),
    /Authored public note/,
  );
  const anor = createInvitation("anor");
  anor.gift = {
    enabled: true,
    receiptUploadEnabled: true,
    cardNumber: "1234567812345678",
    cardHolder: "Public recipient",
  };
  anor.contacts = {
    phoneNumber: "+998901234567",
    telegramUsername: "",
    instagramUrl: "",
  };
  anor.optionalFeatures.contacts = true;
  const visible = publicInvitationData(anor);
  assert.deepEqual(visible.gift, anor.gift);
  assert.equal(visible.contacts.phoneNumber, anor.contacts.phoneNumber);
  for (const template of TEMPLATES)
    assert.equal(
      publicInvitationData(createInvitation(template.id)).templateId,
      template.id,
    );
});

test("upstream HTTP errors and raw diagnostics cannot disclose credentials in responses or logs", async () => {
  const messages: unknown[][] = [];
  const original = console.error;
  console.error = (...args) => {
    messages.push(args);
  };
  try {
    for (const status of [400, 403, 500]) {
      const error = Object.assign(new Error(secret), {
        status,
        code: secret,
        name: secret,
        fields: [{ path: secret, message: secret }],
      });
      const response = apiError(error);
      assert.equal(response.status, 503);
      assert.doesNotMatch(await response.text(), /PRIVATE/);
      assert.match(response.headers.get("Cache-Control")!, /private.*no-store/);
    }
    const authResponse = await authRoute(async () => {
      throw Object.assign(new Error(secret), { name: secret });
    });
    assert.equal(authResponse.status, 503);
    assert.doesNotMatch(await authResponse.text(), /PRIVATE/);
    coverFailure(
      new Error(`Authorization: Bearer ${secret}; user=${secret}`),
      "navigate",
    );
    assert.ok(!JSON.stringify(messages).includes(secret));
    for (const error of [
      new ApiError(403, "FORBIDDEN", "Forbidden"),
      new AuthError("FORBIDDEN", "Forbidden", 403),
    ]) {
      const response = apiError(error);
      assert.equal(response.status, 403);
      assert.deepEqual(await response.json(), {
        error: { code: "FORBIDDEN", message: "Forbidden" },
      });
    }
  } finally {
    console.error = original;
  }
});

test("remote media streams bytes and ranges without revealing storage keys, signed URLs or metadata", async () => {
  const { S3Client } = createRequire(import.meta.url)(
    "../apps/web/node_modules/@aws-sdk/client-s3",
  );
  const originalSend = S3Client.prototype.send;
  const env = { ...process.env };
  const calls: unknown[] = [];
  Object.assign(process.env, {
    R2_ACCOUNT_ID: "private-account",
    R2_ACCESS_KEY_ID: "private-key",
    R2_SECRET_ACCESS_KEY: secret,
    R2_BUCKET_NAME: "private-bucket",
  });
  try {
    S3Client.prototype.send = async (command: {
      input: { Key: string; Range?: string };
    }) => {
      calls.push(command.input);
      if (command.input.Range === "bytes=999-")
        throw { $metadata: { httpStatusCode: 416 } };
      const partial = command.input.Range === "bytes=0-3";
      return {
        Body: {
          transformToWebStream: () =>
            command.input.Key.endsWith("broken")
              ? new ReadableStream({
                  start(controller) {
                    controller.error(new Error(secret));
                  },
                })
              : new Response(partial ? "test" : "test media").body,
        },
        ContentLength: partial ? 4 : 10,
        ...(partial ? { ContentRange: "bytes 0-3/10" } : {}),
        Metadata: { owner: secret },
        ETag: secret,
      };
    };
    for (const [range, status, body] of [
      ["", 200, "test media"],
      ["bytes=0-3", 206, "test"],
    ] as const) {
      const response = await mediaResponse(
        new Request("https://fotiha.example/api/media/opaque-id", {
          headers: range ? { range } : {},
        }),
        `verified/creators/${secret}/file.mp3`,
        "audio/mpeg",
      );
      assert.equal(response.status, status);
      assert.equal(await response.text(), body);
      assert.equal(response.headers.get("Location"), null);
      assert.equal(response.headers.get("ETag"), null);
      assert.ok(!JSON.stringify([...response.headers]).includes(secret));
      if (range)
        assert.equal(response.headers.get("Content-Range"), "bytes 0-3/10");
    }
    for (const range of ["bytes=999-", "bytes=0-1,3-4", "invalid"])
      assert.equal(
        (
          await mediaResponse(
            new Request("https://fotiha.example/api/media/id", {
              headers: { range },
            }),
            "creators/private/file",
            "audio/mpeg",
          )
        ).status,
        416,
      );
    assert.equal(calls.length, 3);
    const broken = await mediaResponse(
      new Request("https://fotiha.example/api/media/id"),
      "creators/private/broken",
      "audio/mpeg",
    );
    await assert.rejects(broken.text(), {
      message: "Media stream interrupted",
    });
  } finally {
    S3Client.prototype.send = originalSend;
    for (const name of [
      "R2_ACCOUNT_ID",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_BUCKET_NAME",
    ])
      if (env[name] === undefined) delete process.env[name];
      else process.env[name] = env[name];
  }
});
