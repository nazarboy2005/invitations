import type { Invitation, Locale } from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import { eventDate } from "@/templates/date-format";

export function makeLanskapPayload(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  options: { invitationId: string; guestToken?: string; preview: boolean; sampleWishes?: boolean },
) {
  const data = makeLegacyData(invitation, locale, guestName, Boolean(options.preview && options.sampleWishes));
  const info = eventDate(invitation.startsAt, invitation.timezone);
  const parts = info ? new Intl.DateTimeFormat("en-GB", { timeZone: info.zone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(info.date) : [];
  const number = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const wall = info ? new Date(Date.UTC(number("year"), number("month") - 1, number("day"), number("hour"), number("minute"))) : null;
  const instant = data.dateTime ? new Date(data.dateTime) : null;
  const pad = (n: number) => String(n).padStart(2, "0");
  const sampleMedia = options.preview && options.sampleWishes && !data.gallery.some((item) => item.src);
  const previewGallery = ["fe8888373dd36d27981061d3", "3564de63889b8a2d7a251ba8", "019289a9c89374b0fedad5b8", "8c81116edf474831e4a7ebfa", "82bcd84120b1457d9b3c9cc4", "f1bc4ba8d9367baaf80bc54b"];
  return {
    type: "wedivo-lanskap-yang-hidup:update" as const,
    payload: {
      data: {
        ...data,
        gallery: sampleMedia ? previewGallery.map((file, index) => ({ id: `source-preview-${index + 1}`, src: `/templates/wedivo-lanskap-yang-hidup/preview-only/${file}.jpg`, alt: "", caption: "" })) : data.gallery,
        program: data.program.map((entry) => ({ ...entry, description: invitation.content[locale]?.programDescriptions[entry.id] ?? "" })),
      },
      locale,
      enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId,
      guestName,
      guestToken: options.guestToken ?? "",
      preview: options.preview,
      previewMedia: sampleMedia ? { bride: "/templates/wedivo-lanskap-yang-hidup/preview-only/edf39742382ac66b91ff3c84.jpg", groom: "/templates/wedivo-lanskap-yang-hidup/preview-only/efa51c5d3489503f3f844fc9.jpg" } : null,
      date: wall ? `${wall.getUTCFullYear()}-${pad(wall.getUTCMonth() + 1)}-${pad(wall.getUTCDate())}` : "",
      time: wall ? `${pad(wall.getUTCHours())}:${pad(wall.getUTCMinutes())}` : "",
      timezone: { l: invitation.timezone, o: wall && instant ? (wall.getTime() - instant.getTime()) / 3600000 : 0 },
    },
  };
}
