"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  GUEST_FAVORITES_KEY,
  parseFavorites,
  type Favorite,
} from "./favorites-data";

type Snapshot = {
  favorites: Favorite[];
  userId: string | null;
  ready: boolean;
  busy: boolean;
  error: string;
};
const initial: Snapshot = {
  favorites: [],
  userId: null,
  ready: false,
  busy: false,
  error: "",
};
let state = initial;
let started = false;
let revision = 0;
let queue = Promise.resolve();
let failedAction: { templateId: string; userId: string | null } | null = null;
const listeners = new Set<() => void>();
const SIGNAL_KEY = "taklifnoma:favorites:changed";

function publish(update: Partial<Snapshot>) {
  state = { ...state, ...update };
  listeners.forEach((listener) => listener());
}
function guestFavorites() {
  try {
    return parseFavorites(localStorage.getItem(GUEST_FAVORITES_KEY));
  } catch {
    return state.userId ? [] : state.favorites;
  }
}
function announce() {
  try {
    localStorage.setItem(SIGNAL_KEY, crypto.randomUUID());
  } catch {
    /* Account saves do not require browser storage. */
  }
}
async function request(
  method = "GET",
  userId?: string,
  ids?: string[],
  guest?: Favorite[],
) {
  const response = await fetch("/api/favorites", {
    method,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
    ...(method === "GET"
      ? {}
      : {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            templateIds: ids,
            ...(guest
              ? {
                  savedAt: Object.fromEntries(
                    guest.map((item) => [item.templateId, item.savedAt]),
                  ),
                }
              : {}),
          }),
        }),
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 409) {
      revision++;
      publish({ ...initial, error: "Hisob o‘zgardi. Qayta urinib ko‘ring." });
    }
    throw new Error(
      "Saralanganlarni hisobga saqlab bo‘lmadi. Qayta urinib ko‘ring.",
    );
  }
  return (await response.json()) as {
    userId: string | null;
    favorites: Favorite[];
  };
}
function enqueue(action: () => Promise<void>) {
  queue = queue.then(action).catch(() => {
    publish({
      busy: false,
      error:
        "Saralanganlarni yuklab yoki saqlab bo‘lmadi. Qayta urinib ko‘ring.",
    });
  });
  return queue;
}

export function refreshFavorites() {
  return enqueue(async () => {
    const version = revision;
    publish({ busy: true });
    try {
      let result = await request();
      if (version !== revision) return;
      // Guest storage is read again after network work, so another tab's edits
      // made during sign-in are included in the next merge rather than erased.
      const guest = guestFavorites();
      if (result.userId && guest.length) {
        const accountIds = new Set(
          result.favorites.map((item) => item.templateId),
        );
        publish({
          userId: result.userId,
          favorites: [
            ...guest.filter((item) => !accountIds.has(item.templateId)),
            ...result.favorites,
          ],
          ready: true,
        });
        result = await request(
          "POST",
          result.userId,
          guest.map((item) => item.templateId),
          guest,
        );
        if (version !== revision) return;
        const imported = new Set(guest.map((item) => item.templateId));
        const remaining = guestFavorites().filter(
          (item) => !imported.has(item.templateId),
        );
        try {
          if (remaining.length)
            localStorage.setItem(
              GUEST_FAVORITES_KEY,
              JSON.stringify(remaining),
            );
          else localStorage.removeItem(GUEST_FAVORITES_KEY);
        } catch {
          /* A repeated merge is safe; never discard before server success. */
        }
        announce();
      }
      publish({
        favorites: result.userId ? result.favorites : guest,
        userId: result.userId,
        ready: true,
        error: "",
      });
      failedAction = null;
    } catch {
      if (version === revision) {
        // A disconnected guest can still save locally. Never replace a known
        // account's list with anonymous data after a temporary network failure.
        publish({
          ...(!state.userId
            ? { favorites: guestFavorites(), ready: true }
            : {}),
          error: "Hisob bilan ulanish amalga oshmadi. Qayta urinib ko‘ring.",
        });
      }
    } finally {
      publish({ busy: false });
    }
  });
}

export function toggleFavorite(templateId: string) {
  if (!state.ready || state.busy) return;
  // Capture identity before queuing; never reinterpret the action for a new user.
  const userId = state.userId;
  const version = revision;
  publish({ busy: true });
  return enqueue(async () => {
    if (version !== revision) {
      publish({ busy: false });
      return;
    }
    const previous = state.favorites;
    const saved = previous.some((item) => item.templateId === templateId);
    const next = saved
      ? previous.filter((item) => item.templateId !== templateId)
      : [{ templateId, savedAt: new Date().toISOString() }, ...previous];
    try {
      if (userId) {
        publish({ favorites: next, error: "" });
        const result = await request(saved ? "DELETE" : "POST", userId, [
          templateId,
        ]);
        if (version !== revision) return;
        publish({ favorites: result.favorites });
        // A pending guest import may contain this ID after a failed transfer.
        // Remove it after a successful explicit account action, so it cannot
        // resurrect a favorite the user just removed.
        try {
          const remaining = guestFavorites().filter(
            (item) => item.templateId !== templateId,
          );
          if (remaining.length)
            localStorage.setItem(
              GUEST_FAVORITES_KEY,
              JSON.stringify(remaining),
            );
          else localStorage.removeItem(GUEST_FAVORITES_KEY);
        } catch {
          /* Storage restrictions do not invalidate the account save. */
        }
        announce();
      } else {
        // Read latest storage before changing one ID, preserving other-tab edits.
        const latest = guestFavorites().filter(
          (item) => item.templateId !== templateId,
        );
        const updated = saved ? latest : [next[0], ...latest];
        localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(updated));
        publish({ favorites: updated, error: "" });
      }
    } catch {
      if (version === revision) publish({ favorites: previous });
      failedAction = version === revision ? { templateId, userId } : null;
      publish({
        error: userId
          ? "Hisobga saqlanmadi. Qayta urinib ko‘ring."
          : "Brauzer saqlashga ruxsat bermadi. Qayta urinib ko‘ring.",
      });
    } finally {
      publish({ busy: false });
    }
  });
}

export function retryFavorites() {
  const action = failedAction;
  failedAction = null;
  if (action && state.ready && action.userId === state.userId)
    return toggleFavorite(action.templateId);
  return refreshFavorites();
}

function start() {
  if (started) return;
  started = true;
  publish({ favorites: guestFavorites() });
  void refreshFavorites();
  window.addEventListener("focus", () => {
    void refreshFavorites();
  });
  window.addEventListener("online", () => {
    void refreshFavorites();
  });
  window.addEventListener("storage", (event) => {
    if (
      event.key === GUEST_FAVORITES_KEY ||
      event.key === SIGNAL_KEY ||
      event.key === null
    )
      void refreshFavorites();
  });
  window.addEventListener("session-changed", (event) => {
    const userId = (event as CustomEvent<{ userId: string | null }>).detail
      .userId;
    if (state.ready && state.userId === userId) return;
    revision++;
    publish({ ...initial });
    announce();
    void refreshFavorites();
  });
}
export function useFavorites() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => initial,
  );
  useEffect(start, []);
  return snapshot;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
