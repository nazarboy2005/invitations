import assert from "node:assert/strict";
import test from "node:test";
import { createInvitation, invitationSchema, switchTemplate } from "@taklifnoma/contracts";
import { makePulauSehatiPayload } from "./adapter";

test("Pulau-specific source fields validate, persist, and survive template switching", () => {
  const base = createInvitation("wedivo-pulau-sehati");
  const authored = invitationSchema.parse({
    ...base,
    eventType: "wedding",
    templateData: {
      "wedivo-pulau-sehati": {
        inscription: { arabic: "نص", text: { "uz-Latn": "Tarjima" }, attribution: { "uz-Latn": "Manba" } },
        hotels: [{ name: "Mehmonxona", address: "Toshkent", distance: "2 km", price: "500 000 so‘m", bookingUrl: "https://example.com/book", note: "Oldindan band qiling" }],
        missions: [{ title: "Surat", description: "Birga rasmga tushing", reward: "Xotira" }],
        keepsakes: [{ name: "Uzuk", anecdote: "Birinchi sovg‘a", icon: "cincin" }],
        media: { videoUrl: "https://example.com/film.mp4", liveUrl: "https://youtube.com/live/abc123456", intro: "Film" },
        secondaryEvent: { enabled: true, date: "2027-06-13", time: "09:00", label: "Nikoh", venueName: "Bog‘", address: "Toshkent", mapUrl: "https://maps.example.com" },
        storyDates: { chapter: "2027-06-01" },
        coInviters: "Kuyov va kelin oilalari",
        hashtag: "#BaxtliKun",
      },
    },
  });
  assert.equal(switchTemplate(authored, "anor").templateData["wedivo-pulau-sehati"], authored.templateData["wedivo-pulau-sehati"]);
  assert.equal(invitationSchema.safeParse({ ...authored, templateData: { "wedivo-pulau-sehati": { media: { videoUrl: "javascript:alert(1)" } } } }).success, false);
  const data = authored.templateData["wedivo-pulau-sehati"];
  assert.ok(data);
});

test("Pulau source payload exposes authored localized optional fields", () => {
  const invitation = invitationSchema.parse({
    ...createInvitation("wedivo-pulau-sehati"),
    eventType: "wedding",
    enabledLocales: ["uz-Latn", "en"],
    content: {
      "uz-Latn": { ...createInvitation().content["uz-Latn"], people: ["Ali", "Vali"] },
      en: { ...createInvitation().content["uz-Latn"], people: ["Ali", "Vali"] },
    },
    templateData: { "wedivo-pulau-sehati": { inscription: { arabic: "نص", text: { en: "Translation" }, attribution: { en: "Source" } }, hotels: [{ name: "Hotel", address: "", distance: "", price: "", bookingUrl: "https://example.com", note: "" }], missions: [{ title: "Mission", description: "", reward: "" }], keepsakes: [{ name: "Memory", icon: "cincin", anecdote: "" }], secondaryEvent: { enabled: true, date: "2027-06-13", time: "09:00", label: "Ceremony", venueName: "Venue 2", address: "Address 2", mapUrl: "https://maps.example.com" }, storyDates: { story: "2027-06-01" }, coInviters: "Families", hashtag: "#Day" } },
  });
  const result = makePulauSehatiPayload(invitation, "en", "", { invitationId: "preview", preview: true });
  const pulau = result.payload.data.pulau;
  assert.equal(pulau.inscription.text, "Translation");
  assert.equal(pulau.hotels[0]?.name, "Hotel");
  assert.equal(pulau.missions[0]?.title, "Mission");
  assert.equal(pulau.keepsakes[0]?.name, "Memory");
  assert.equal(pulau.hashtag, "#Day");
  assert.equal(pulau.secondaryEvent.label, "Ceremony");
  assert.equal(pulau.storyDates.story, "2027-06-01");
  assert.equal(pulau.coInviters, "Families");
});
