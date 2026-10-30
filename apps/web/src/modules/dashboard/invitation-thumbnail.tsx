"use client";

import { useEffect, useRef, useState } from "react";
import { FileHeart, LoaderCircle, RotateCw } from "lucide-react";
import { invitationSchema, type Invitation } from "@taklifnoma/contracts";
import { COVER_VERSION } from "./cover-recipe";
import { thumbnailContent } from "./cover-content";
import styles from "./invitation-thumbnail.module.css";

type CoverImage = {
  url: string;
  users: number;
  slot: string;
  obsolete?: boolean;
};
const ready = new Map<string, CoverImage>();
const pending = new Map<string, Promise<string>>();
let active = 0;
const queue: Array<() => void> = [];
let cacheWrites = Promise.resolve();
const currentBySlot = new Map<string, string>();

function selectCover(slot: string, identity: string) {
  if (currentBySlot.size >= 1000 && !currentBySlot.has(slot))
    currentBySlot.delete(currentBySlot.keys().next().value!);
  currentBySlot.set(slot, identity);
}

function remember(identity: string, blob: Blob, slot: string) {
  const existing = ready.get(identity);
  if (existing) return existing.url;
  // Retain images still displayed by mounted cards. Release only idle entries.
  for (const [key, entry] of ready) {
    if (ready.size < 100) break;
    if (entry.users === 0) {
      URL.revokeObjectURL(entry.url);
      ready.delete(key);
    }
  }
  const url = URL.createObjectURL(blob);
  for (const [key, entry] of ready) {
    if (entry.slot !== slot || key === identity) continue;
    entry.obsolete = true;
    if (entry.users === 0) {
      URL.revokeObjectURL(entry.url);
      ready.delete(key);
    }
  }
  ready.set(identity, { url, users: 0, slot });
  return url;
}

async function coverBlob(response: Response) {
  if (
    !response.ok ||
    response.headers.get("Content-Type")?.split(";")[0].trim() !== "image/webp"
  )
    throw new Error("Cover unavailable");
  const blob = await response.blob();
  if (!blob.size) throw new Error("Empty cover");
  // Reject broken disk entries before they become a permanently broken <img>.
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
  } finally {
    URL.revokeObjectURL(url);
  }
  return blob;
}

async function requestCover(sourceContent: string) {
  const started = Date.now();
  for (let attempt = 0; attempt < 3; attempt++) {
    let response: Response;
    try {
      response = await fetch("/api/invitation-covers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: sourceContent,
        signal: AbortSignal.timeout(
          Math.min(60000, 80000 - (Date.now() - started)),
        ),
      });
    } catch (error) {
      if (attempt === 2 || Date.now() - started > 60000) throw error;
      await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
      continue;
    }
    if (response.ok) return coverBlob(response);
    const retryable = [429, 500, 502, 503, 504].includes(response.status);
    const delay =
      Math.max(0, Number(response.headers.get("Retry-After")) || 0) * 1000 ||
      800 * (attempt + 1);
    // Respect long rate limits without leaving a card spinning for minutes.
    if (
      !retryable ||
      attempt === 2 ||
      delay > 5000 ||
      Date.now() - started + delay > 75000
    )
      throw new Error("Cover unavailable");
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error("Cover unavailable");
}

async function storageKey(content: string, scope: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(COVER_VERSION + scope + content),
  );
  return `/__invitation-covers/${Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")}`;
}

function loadCover(
  content: string,
  scope: string,
  sourceContent: string,
  slot: string,
): Promise<string> {
  const identity = COVER_VERSION + scope + content;
  selectCover(slot, identity);
  const existing = ready.get(identity);
  if (existing) return Promise.resolve(existing.url);
  if (pending.has(identity)) return pending.get(identity)!;
  // Register the entire lookup, including disk reads, before another card can
  // request it. Memory reuse works even when CacheStorage is unavailable.
  const work = (async () => {
    let key: string | undefined;
    let cache: Cache | undefined;
    try {
      // Hashing and storage are optional: neither may block the network path.
      key = await storageKey(content, scope);
      cache = await caches.open("visol-invitation-covers-v1");
      const cached = await cache.match(key);
      if (cached) {
        try {
          const blob = await coverBlob(cached);
          if (currentBySlot.get(slot) !== identity)
            throw new Error("Cover superseded");
          return remember(identity, blob, slot);
        } catch {
          await cache.delete(key).catch(() => {});
        }
      }
    } catch {
      /* Private browsing can disable disk caching. */
    }
    if (active >= 1) await new Promise<void>((resolve) => queue.push(resolve));
    active++;
    try {
      if (currentBySlot.get(slot) !== identity)
        throw new Error("Cover superseded");
      const blob = await requestCover(sourceContent);
      if (currentBySlot.get(slot) !== identity)
        throw new Error("Cover superseded");
      const url = remember(identity, blob, slot);
      // Display immediately; persisting/evicting disk entries is background work.
      cacheWrites = cacheWrites.then(async () => {
        try {
          if (!cache || !key || currentBySlot.get(slot) !== identity) return;
          const slotKey = await storageKey(`slot:${slot}`, scope);
          await cache.put(
            key,
            new Response(blob, {
              headers: {
                "Content-Type": "image/webp",
                "X-Cover-Slot": slotKey,
              },
            }),
          );
          for (const entry of await cache.keys()) {
            if (new URL(entry.url).pathname === key) continue;
            if (
              (await cache.match(entry))?.headers.get("X-Cover-Slot") ===
              slotKey
            )
              await cache.delete(entry);
          }
          const keys = await cache?.keys();
          if (keys)
            await Promise.all(
              keys
                .slice(0, Math.max(0, keys.length - 100))
                .map((entry) => cache!.delete(entry)),
            );
        } catch {
          /* A full cache must not hide a successful cover. */
        }
      });
      return url;
    } finally {
      active--;
      queue.shift()?.();
    }
  })().finally(() => pending.delete(identity));
  pending.set(identity, work);
  return work;
}

/** Static personalized covers survive filters and client-side navigation. */
export function InvitationThumbnail({
  invitation,
  cacheScope,
}: {
  invitation: Invitation;
  cacheScope: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const content = thumbnailContent(invitation);
  const identity = COVER_VERSION + cacheScope + content;
  const cardKey = JSON.stringify([
    cacheScope,
    invitation.id,
    invitation.templateId,
  ]);
  const sourceContent = JSON.stringify(invitationSchema.parse(invitation));
  const slot = JSON.stringify([cacheScope, invitation.id]);
  const [visible, setVisible] = useState(() => ready.has(identity));
  const [image, setImage] = useState(() => ({
    identity,
    cardKey,
    url: ready.get(identity)?.url ?? "",
  }));
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const url =
    ready.get(identity)?.url ?? (image.cardKey === cardKey ? image.url : "");
  useEffect(() => {
    const entry = ready.get(image.identity);
    if (!entry) return;
    entry.users++;
    return () => {
      entry.users--;
      if (entry.users === 0 && entry.obsolete) {
        URL.revokeObjectURL(entry.url);
        ready.delete(image.identity);
      }
    };
  }, [image]);
  useEffect(() => {
    if (!root.current || visible) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [visible]);
  useEffect(() => {
    if (!visible) return;
    let alive = true;
    setFailed(false);
    const show = (nextUrl: string) => {
      if (!alive) return;
      setImage({ identity, cardKey, url: nextUrl });
    };
    const existing = ready.get(identity);
    selectCover(slot, identity);
    if (existing) show(existing.url);
    else
      void loadCover(content, cacheScope, sourceContent, slot)
        .then(show)
        .catch(() => {
          if (alive) setFailed(true);
        });
    return () => {
      alive = false;
    };
    // sourceContent includes nonvisual publication data; only the normalized
    // render identity should restart this effect.
  }, [identity, visible, retry]);
  return (
    <div ref={root} className={styles.thumbnail}>
      {url ? (
        <img src={url} alt="" width={480} height={800} draggable={false} />
      ) : (
        <span className={styles.placeholder} aria-hidden="true">
          {failed ? (
            <FileHeart size={28} strokeWidth={1} />
          ) : (
            <LoaderCircle size={22} className={styles.spinner} />
          )}
          {failed ? "Muqova yuklanmadi" : "Muqova tayyorlanmoqda…"}
        </span>
      )}
      {failed && (
        <button
          type="button"
          className={styles.retry}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setFailed(false);
            setRetry((value) => value + 1);
          }}
        >
          <RotateCw size={13} aria-hidden="true" /> Qayta urinish
        </button>
      )}
    </div>
  );
}
