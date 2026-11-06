import type { Invitation, Locale } from "@taklifnoma/contracts";
import { getContent } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import {
  eventInstant,
  eventWallDate,
  formatDate,
} from "@/templates/date-format";
import { CATALOG_PREVIEW_MUSIC } from "@/modules/catalog/catalog-music";

export function makeRiwayatPayload(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  options: {
    invitationId: string;
    guestToken?: string;
    preview: boolean;
    sampleWishes?: boolean;
    catalogMusic?: boolean;
    silentPlayback?: boolean;
    reducedMotion?: boolean;
  },
) {
  const data = makeLegacyData(
    invitation,
    locale,
    guestName,
    options.preview && options.sampleWishes,
  );
  // Source-owned demo media are presentation-only and never enter Invitation data.
  const sampleMedia =
    options.preview &&
    options.sampleWishes &&
    !invitation.gallery.some((photo) => photo.url.trim());
  const gallery = sampleMedia
    ? data.gallery.map((photo, index) => ({
        ...photo,
        src: `/templates/wedivo-riwayat-obrolan/assets/preview/gallery-${(index % 9) + 1}.jpg`,
      }))
    : data.gallery.filter((photo) => photo.src.trim());
  const instant = invitation.startsAt
    ? eventInstant(invitation.startsAt, invitation.timezone)
    : null;
  const wall = invitation.startsAt
    ? eventWallDate(invitation.startsAt, invitation.timezone)
    : null;
  return {
    type: "wedivo-riwayat-obrolan:update" as const,
    payload: {
      data: {
        ...data,
        gallery,
        music:
          options.catalogMusic && options.preview
            ? { enabled: true, url: CATALOG_PREVIEW_MUSIC.url }
            : data.music,
      },
      locale,
      enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId,
      guestToken: options.guestToken || "",
      guestName,
      landmark: getContent(invitation, locale).landmark,
      preview: options.preview,
      previewProfiles: sampleMedia
        ? {
            c: "/templates/wedivo-riwayat-obrolan/assets/preview/profile-c.jpg",
            g: "/templates/wedivo-riwayat-obrolan/assets/preview/profile-g.jpg",
            b: "/templates/wedivo-riwayat-obrolan/assets/preview/profile-b.jpg",
          }
        : null,
      silentPlayback:
        options.preview && (!!options.silentPlayback || !options.catalogMusic),
      reducedMotion: options.preview && !!options.reducedMotion,
      eventISO: instant?.toISOString() || "",
      dateISO: wall?.toISOString().slice(0, 10) || "",
      offsetHours:
        instant && wall ? (wall.getTime() - instant.getTime()) / 3_600_000 : 0,
      months: Array.from({ length: 12 }, (_, i) =>
        formatDate(
          `2024-${String(i + 1).padStart(2, "0")}-01T00:00`,
          locale,
          "UTC",
          { month: "long" },
        ),
      ),
      weekdays: Array.from({ length: 7 }, (_, i) =>
        formatDate(
          `2024-01-${String(7 + i).padStart(2, "0")}T00:00`,
          locale,
          "UTC",
          { weekday: "long" },
        ),
      ),
    },
  };
}
