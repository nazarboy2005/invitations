import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import {
  addLanguage,
  createInvitation,
  defaultLocalizedInvitationContent,
  switchTemplate,
} from "@taklifnoma/contracts";
import { switchEventType } from "./event-switch";
import {
  DRAFT_KEY,
  deleteBrowserDraft,
  listBrowserDrafts,
  readBrowserDraft,
  saveBrowserDraft,
} from "./draft-storage";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  clear() {
    this.values.clear();
  }
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}
beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", {
    value: new MemoryStorage(),
    configurable: true,
  });
});

test("editing a second invitation preserves recovery for the first", () => {
  const first = createInvitation();
  first.content["uz-Latn"].title = "First unsaved changes";
  const second = createInvitation();
  second.content["uz-Latn"].title = "Second invitation";
  saveBrowserDraft(first, true);
  saveBrowserDraft(second, true);
  assert.equal(
    readBrowserDraft(first.id)?.invitation.content["uz-Latn"].title,
    "First unsaved changes",
  );
  assert.equal(readBrowserDraft()?.invitation.id, second.id);
  assert.equal(listBrowserDrafts().length, 2);
});

test("claimed drafts stay hidden after logout and across account switches", () => {
  const first = createInvitation();
  const anonymous = createInvitation();
  saveBrowserDraft(anonymous, true);
  saveBrowserDraft(first, true, "owner-A");
  assert.equal(readBrowserDraft(first.id), null);
  assert.equal(readBrowserDraft(first.id, "owner-B"), null);
  assert.equal(readBrowserDraft(first.id, "owner-A")?.invitation.id, first.id);
  assert.deepEqual(
    listBrowserDrafts().map((item) => item.invitation.id),
    [anonymous.id],
  );
  assert.equal(listBrowserDrafts("owner-A").length, 2);
});

test("legacy browser drafts survive migration to per-document storage", () => {
  const legacy = createInvitation();
  const next = createInvitation();
  localStorage.setItem(DRAFT_KEY, JSON.stringify(legacy));
  assert.equal(readBrowserDraft()?.invitation.id, legacy.id);
  saveBrowserDraft(next, true);
  assert.equal(readBrowserDraft(legacy.id)?.invitation.id, legacy.id);
  assert.equal(listBrowserDrafts().length, 2);
});

test("deleting a draft removes its stored copy and only clears its own latest pointer", () => {
  const first = createInvitation();
  const latest = createInvitation();
  saveBrowserDraft(first, true);
  saveBrowserDraft(latest, true);

  deleteBrowserDraft(first.id);
  assert.equal(readBrowserDraft(first.id), null);
  assert.equal(readBrowserDraft()?.invitation.id, latest.id);
  assert.equal(listBrowserDrafts().length, 1);

  deleteBrowserDraft(latest.id);
  assert.equal(readBrowserDraft(), null);
  assert.deepEqual(listBrowserDrafts(), []);
});

test("dirty state distinguishes recoverable edits from a cloud-saved snapshot", () => {
  const invitation = createInvitation();
  saveBrowserDraft(invitation, true, "owner");
  assert.equal(readBrowserDraft(invitation.id, "owner")?.dirty, true);
  saveBrowserDraft(invitation, false, "owner");
  assert.equal(readBrowserDraft(invitation.id, "owner")?.dirty, false);
});

test("malformed content is never recovered as an invitation", () => {
  localStorage.setItem(DRAFT_KEY, '{"id":"bad"}');
  localStorage.setItem(`${DRAFT_KEY}:bad`, '{"invitation":{"id":"bad"}}');
  assert.equal(readBrowserDraft(), null);
  assert.deepEqual(listBrowserDrafts(), []);
});

test("switching templates and recovering locally preserves the complete authored draft", () => {
  const draft = addLanguage(createInvitation("anor"), "ru");
  draft.eventType = "wedding";
  draft.content["uz-Latn"].people = ["Ali", "Malika"];
  draft.content.ru.people = ["Али", "Малика"];
  draft.startsAt = "2027-05-20T18:00";
  draft.content["uz-Latn"].venueName = "Our venue";
  draft.music = {
    enabled: true,
    assetId: "audio",
    url: "/api/media/audio",
    filename: "song.mp3",
  };
  draft.gallery = [
    { id: "photo", url: "/api/media/photo", alt: "Our photo", caption: "" },
  ];
  saveBrowserDraft(draft, true);

  const switched = switchTemplate(
    readBrowserDraft(draft.id)!.invitation,
    "asalari",
  );
  saveBrowserDraft(switched, true);
  const recovered = readBrowserDraft(draft.id)!.invitation;
  assert.deepEqual({ ...recovered, templateId: draft.templateId }, draft);
  assert.deepEqual(switchTemplate(recovered, draft.templateId), draft);
});

test("changing event type reuses shared details without mapping wedding names to a celebrant", () => {
  const draft = addLanguage(createInvitation("anor"), "ru");
  draft.eventType = "wedding";
  for (const locale of draft.enabledLocales) {
    draft.content[locale] = {
      ...defaultLocalizedInvitationContent("wedding", locale),
      people: ["First", "Second"],
      venueName: `Venue ${locale}`,
      address: `Address ${locale}`,
    };
  }
  draft.content.ru.greeting = "Our custom greeting";
  draft.content.ru.message = "Our custom message";
  draft.startsAt = "2027-05-20T18:00";
  draft.venue.mapUrl = "https://yandex.com/maps/?pt=69.2,41.3&z=16&l=map";
  draft.music = {
    enabled: true,
    assetId: "audio",
    url: "/api/media/audio",
    filename: "song.mp3",
  };
  const snapshot = structuredClone(draft);
  const next = switchEventType(draft, "birthday");
  saveBrowserDraft(switchTemplate(next, "sharlar"), true);
  const recovered = readBrowserDraft(draft.id)!.invitation;

  assert.equal(recovered.eventType, "birthday");
  for (const locale of draft.enabledLocales) {
    assert.deepEqual(recovered.content[locale].people, []);
    assert.equal(
      recovered.content[locale].venueName,
      draft.content[locale].venueName,
    );
    assert.equal(
      recovered.content[locale].address,
      draft.content[locale].address,
    );
    assert.equal(
      recovered.content[locale].eventLabel,
      defaultLocalizedInvitationContent("birthday", locale).eventLabel,
    );
  }
  assert.equal(recovered.content["uz-Latn"].message, "");
  assert.equal(recovered.content.ru.message, "Our custom message");
  assert.equal(recovered.content.ru.greeting, "Our custom greeting");
  assert.deepEqual(recovered.venue, draft.venue);
  assert.deepEqual(recovered.music, draft.music);
  assert.equal(recovered.startsAt, draft.startsAt);
  assert.deepEqual(draft, snapshot);
});

test("selecting the same event type leaves names and all other details intact", () => {
  const draft = createInvitation("sharlar");
  draft.eventType = "birthday";
  draft.content["uz-Latn"].people = ["Aziza"];
  draft.celebrantAge = 20;
  assert.equal(switchEventType(draft, "birthday"), draft);
});
