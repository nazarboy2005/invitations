import {
  getContent,
  type Invitation,
  type Locale,
} from "@taklifnoma/contracts";
import { makeLegacyData } from "@/templates/anor/renderer";
import {
  eventInstant,
  eventWallDate,
  formatDate,
  intlLocale,
} from "@/templates/date-format";

/** Only public presentation data crosses the source-frame boundary. No fixture is created here. */
export function makePulauSehatiPayload(
  invitation: Invitation,
  locale: Locale,
  guestName: string,
  options: {
    invitationId: string;
    guestToken?: string;
    preview: boolean;
    sampleWishes?: boolean;
  },
) {
  const content = getContent(invitation, locale);
  const data = makeLegacyData(
    invitation,
    locale,
    guestName,
    options.preview && options.sampleWishes,
  );
  const wall = eventWallDate(invitation.startsAt, invitation.timezone);
  const instant = eventInstant(invitation.startsAt, invitation.timezone);
  const time = data.date.time;
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  const offset =
    wall && instant
      ? (Date.UTC(
          wall.getUTCFullYear(),
          wall.getUTCMonth(),
          wall.getUTCDate(),
          hour,
          minute,
        ) -
          instant.getTime()) /
        3_600_000
      : 0;
  const date = wall
    ? `${wall.getUTCFullYear()}-${String(wall.getUTCMonth() + 1).padStart(2, "0")}-${String(wall.getUTCDate()).padStart(2, "0")}`
    : "";
  return {
    type: "wedivo-pulau-sehati:update" as const,
    payload: {
      data: {
        ...data,
        program: data.program.map((item) => ({
          ...item,
          description: content.programDescriptions?.[item.id] ?? "",
        })),
      },
      locale,
      enabledLocales: invitation.enabledLocales,
      invitationId: options.invitationId,
      guestName,
      guestToken: options.guestToken ?? "",
      preview: options.preview,
      date,
      time,
      timezoneOffset: offset,
      intlLocale: intlLocale[locale],
      landmark: content.landmark,
      deadlineLabel: invitation.rsvp.deadline
        ? formatDate(invitation.rsvp.deadline, locale, invitation.timezone, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "",
    },
  };
}
