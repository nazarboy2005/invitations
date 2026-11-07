import { DEFAULT_INVITATION_MUSIC } from "@taklifnoma/contracts/music";
import { publicAsset } from "../../lib/public-asset";
import type { Invitation } from "@taklifnoma/contracts";
import { CLASSICAL_MUSIC } from "../studio/classical-music";

export type PreviewMusicTrack = {
  url: string;
  filename: string;
  assetId?: string | null;
};

/** Select once per opened preview, then carry that selection in its sample data. */
export function pickPreviewMusic(
  tracks: PreviewMusicTrack[] = [DEFAULT_INVITATION_MUSIC, ...CLASSICAL_MUSIC],
  previousUrl = "",
  random = Math.random,
): Invitation["music"] {
  const available = tracks.filter(
    (track) => track.url && track.url !== previousUrl,
  );
  const pool = available.length ? available : tracks;
  const track =
    pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))] ??
    DEFAULT_INVITATION_MUSIC;
  return {
    enabled: true,
    assetId: track.assetId ?? null,
    url: track.url,
    filename: track.filename,
  };
}

/** Adapters must use the selection on this preview, never a global random getter. */
export function catalogPreviewMusic(invitation: Pick<Invitation, "music">) {
  return {
    ...invitation.music,
    url: publicAsset(invitation.music.url || DEFAULT_INVITATION_MUSIC.url),
  };
}

export const CATALOG_PREVIEW_MUSIC = {
  id: "catalog-emotional-piano",
  url: publicAsset(DEFAULT_INVITATION_MUSIC.url),
  filename: DEFAULT_INVITATION_MUSIC.filename,
} as const;

export const CATALOG_MUSIC_CREDIT = {
  title: "Emotional Piano",
  creator: "triangelx",
  source: "https://freesound.org/people/triangelx/sounds/189175/",
  commons: "https://commons.wikimedia.org/wiki/File:Emotional_piano.wav",
  license: "CC0 1.0",
  licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
} as const;
