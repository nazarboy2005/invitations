import { invitationSchema, type Invitation } from "@taklifnoma/contracts";

export const DRAFT_KEY = "taklifnoma:draft:v1";
const prefix = `${DRAFT_KEY}:`;
export type BrowserDraft = {
  invitation: Invitation;
  savedAt: string;
  createdAt: string;
  dirty: boolean;
  ownerId: string | null;
};

function decode(value: string | null): BrowserDraft | null {
  if (!value) return null;
  try {
    const data = JSON.parse(value);
    const parsed = invitationSchema.safeParse(data.invitation ?? data);
    if (!parsed.success) return null;
    return {
      invitation: parsed.data,
      savedAt: typeof data.savedAt === "string" ? data.savedAt : "",
      createdAt:
        typeof data.createdAt === "string"
          ? data.createdAt
          : typeof data.savedAt === "string"
            ? data.savedAt
            : "",
      dirty: data.dirty !== false,
      ownerId: typeof data.ownerId === "string" ? data.ownerId : null,
    };
  } catch {
    return null;
  }
}

export function readBrowserDraft(
  id?: string,
  ownerId: string | null = null,
): BrowserDraft | null {
  const permitted = (draft: BrowserDraft | null) =>
    draft && (!draft.ownerId || draft.ownerId === ownerId) ? draft : null;
  if (id) {
    const draft = decode(localStorage.getItem(prefix + id));
    if (draft) return permitted(draft);
    const legacy = decode(localStorage.getItem(DRAFT_KEY));
    return legacy?.invitation.id === id ? permitted(legacy) : null;
  }
  const latest = localStorage.getItem(DRAFT_KEY);
  const legacy = decode(latest);
  if (legacy) return permitted(legacy);
  if (!latest) return null;
  try {
    const pointer = JSON.parse(latest);
    return typeof pointer.id === "string"
      ? permitted(decode(localStorage.getItem(prefix + pointer.id)))
      : null;
  } catch {
    return null;
  }
}

export function listBrowserDrafts(
  ownerId: string | null = null,
): BrowserDraft[] {
  const result = new Map<string, BrowserDraft>();
  const legacy = readBrowserDraft(undefined, ownerId);
  if (legacy) result.set(legacy.invitation.id, legacy);
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (!key?.startsWith(prefix)) continue;
    const draft = decode(localStorage.getItem(key));
    if (draft && (!draft.ownerId || draft.ownerId === ownerId))
      result.set(draft.invitation.id, draft);
  }
  return [...result.values()].sort((a, b) =>
    b.savedAt.localeCompare(a.savedAt),
  );
}

export function saveBrowserDraft(
  invitation: Invitation,
  dirty: boolean,
  ownerId: string | null = null,
) {
  const savedAt = new Date().toISOString();
  const createdAt =
    readBrowserDraft(invitation.id, ownerId)?.createdAt || savedAt;
  const legacy = decode(localStorage.getItem(DRAFT_KEY));
  if (legacy && legacy.invitation.id !== invitation.id)
    localStorage.setItem(prefix + legacy.invitation.id, JSON.stringify(legacy));
  localStorage.setItem(
    prefix + invitation.id,
    JSON.stringify({ invitation, savedAt, createdAt, dirty, ownerId }),
  );
  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({ id: invitation.id, savedAt }),
  );
}
