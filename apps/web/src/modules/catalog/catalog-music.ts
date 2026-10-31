import { DEFAULT_INVITATION_MUSIC } from "@taklifnoma/contracts/music";
import { publicAsset } from "../../lib/public-asset";

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
