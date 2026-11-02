import {
  getContent,
  type Invitation,
  type Locale,
} from "@taklifnoma/contracts";

/** A portable PNG filename, retaining the couple's spelling and Unicode names. */
export function invitationImageFilename(
  invitation: Invitation,
  locale: Locale,
) {
  const names = getContent(invitation, locale)
    .people.map((name) =>
      Array.from(
        name
          .normalize("NFC")
          .replace(/[\p{Cc}\p{Cf}<>:"/\\|?*]/gu, " ")
          .replace(/\s+/g, " ")
          .trim()
          .replace(/^[. ]+|[. ]+$/g, ""),
      )
        .slice(0, 55)
        .join(""),
    )
    .filter(Boolean);
  let stem = Array.from(names.join("-"))
    .slice(0, 120)
    .join("")
    .replace(/[. ]+$/g, "");
  if (!stem) stem = "taklifnoma";
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(stem))
    stem = `_${stem}`;
  return `${stem}.png`;
}

export function imageAttachmentHeader(filename: string) {
  const ascii = filename.replace(/[^\x20-\x7E]/g, "_");
  const encoded = encodeURIComponent(filename).replace(
    /['()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}
