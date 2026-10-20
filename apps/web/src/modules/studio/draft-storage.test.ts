import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { createInvitation } from "@taklifnoma/contracts";
import {
  DRAFT_KEY,
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
