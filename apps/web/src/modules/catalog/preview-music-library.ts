import { DEFAULT_INVITATION_MUSIC } from "@taklifnoma/contracts/music";
import { CLASSICAL_MUSIC } from "../studio/classical-music";
import type { PreviewMusicTrack } from "./catalog-music";

const cacheKey = "fotiha:preview-music-library:v1";
const cacheLifetime = 5 * 60 * 1000;
let pending: Promise<void> | undefined;

export function previewMusicLibrary(): PreviewMusicTrack[] {
  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
    if (cached?.expiresAt > Date.now() && Array.isArray(cached.tracks) && cached.tracks.length) return cached.tracks;
  } catch { /* Storage may be disabled; the bundled library is always available. */ }
  return [DEFAULT_INVITATION_MUSIC, ...CLASSICAL_MUSIC];
}

/** Warm the playlist on the gallery; never hold visual rendering behind music. */
export function warmPreviewMusicLibrary(): Promise<void> {
  if (pending) return pending;
  try {
    if (JSON.parse(sessionStorage.getItem(cacheKey) || "null")?.expiresAt > Date.now()) return Promise.resolve();
  } catch {}
  pending = (async () => {
    try {
      const response = await fetch("/api/music", { signal: AbortSignal.timeout(3000) });
      if (!response.ok) return;
      const data = await response.json();
      const tracks: PreviewMusicTrack[] = Array.isArray(data.tracks)
        ? data.tracks.filter((track: PreviewMusicTrack) => typeof track?.url === "string" && track.url && typeof track.filename === "string")
        : [];
      if (tracks.length) sessionStorage.setItem(cacheKey, JSON.stringify({ expiresAt: Date.now() + cacheLifetime, tracks: [DEFAULT_INVITATION_MUSIC, ...tracks] }));
    } catch { /* Direct visits use bundled music while warming the next opening. */ }
  })().finally(() => { pending = undefined; });
  return pending;
}
