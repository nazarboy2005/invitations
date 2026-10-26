import { writeFileSync } from "node:fs";
import { createTemplatePreviewSample, createLongNamePreview } from "@/modules/catalog/preview-sample";
import { createInvitation, LOCALES } from "@taklifnoma/contracts";
import { makeZarhalPayload } from "./adapter";

// QA only: canonical samples never enter the package's served HTML or saves.
const invitation = createTemplatePreviewSample("taklifla-zarhal-sahifa");
const fixtures: Record<string, ReturnType<typeof makeZarhalPayload>> = {};
for (const locale of LOCALES) fixtures[locale] = makeZarhalPayload(invitation, locale, { invitationId: "qa", preview: true, sampleWishes: true, silentPlayback: true });
fixtures.long = makeZarhalPayload(createLongNamePreview(invitation), "uz-Latn", { invitationId: "qa", preview: true, sampleWishes: true, guestName: "Aziz mehmon", silentPlayback: true });
fixtures.empty = makeZarhalPayload(createInvitation("taklifla-zarhal-sahifa"), "uz-Latn", { invitationId: "qa", preview: true });
const repeat = structuredClone(invitation);
repeat.gallery = Array.from({ length: 7 }, (_, i) => ({ id: `photo-${i}`, url: "/templates/taklifla-zarhal-sahifa/assets/preview/photo-1519741497674-611481863552.avif", alt: `Surat ${i+1}`, caption: `Xotira ${i+1}` }));
fixtures.repeat = makeZarhalPayload(repeat, "uz-Latn", { invitationId: "qa", preview: true, sampleWishes: true, silentPlayback: true });
fixtures.public = makeZarhalPayload(invitation, "uz-Latn", { invitationId: "qa-service", guestToken: "qa-token", guestName: "Mehmon" });
const music = structuredClone(invitation);
music.music = { enabled: true, url: "/qa-tone.wav", assetId: null, filename: "qa.wav" };
fixtures.music = makeZarhalPayload(music, "uz-Latn", { invitationId: "qa", preview: false });
writeFileSync(process.argv[2] || ".tmp-zarhal-fixtures.json", JSON.stringify(fixtures));
