import { invitationSchema, localeSchema } from "@taklifnoma/contracts";
import { normalizeInvitation } from "@taklifnoma/contracts/capabilities";
import { z } from "zod";
import { verifySameOrigin } from "@/server/auth";
import { apiError, privateHeaders, readJson } from "@/server/api";
import { renderStaticImage } from "@/server/static-image-renderer";
import { staticInvitationQrUrl } from "@/server/static-location-links";
import { staticImageLimit } from "@/server/static-images";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    verifySameOrigin(request);
    await staticImageLimit(request, "preview");
    const { invitation, locale } = z
      .object({ invitation: invitationSchema, locale: localeSchema })
      .parse(await readJson(request));
    // This renders caller-supplied content only. It never looks up another draft.
    const normalized = normalizeInvitation(invitation);
    const qrUrl = await staticInvitationQrUrl(normalized, locale);
    const bytes = await renderStaticImage(normalized, locale, true, qrUrl);
    return new Response(new Uint8Array(bytes), {
      headers: {
        ...privateHeaders,
        "Content-Type": "image/png",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    return apiError(e);
  }
}
