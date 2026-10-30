import { invitationSchema, templateById } from "@taklifnoma/contracts";
import { verifySameOrigin, getSessionUser } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";
import { coverFailure } from "@/server/cover-error";
import { getDb } from "@taklifnoma/database";
import { getOwnedInvitation } from "@/server/invitations";
import { verifyPublicationCover } from "@/server/cover-publication-auth";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

// Drafts render transiently. Published covers always use the canonical record.
export async function POST(request: Request) {
  try {
    const signature = request.headers.get("X-Publication-Cover");
    if (!signature) verifySameOrigin(request);
    const data = await readJson(request);
    let invitation;
    let ownerId: string | undefined;
    const cookie = request.headers.get("cookie") ?? "";
    if (signature) {
      const { id } = z.object({ id: z.uuid() }).strict().parse(data);
      if (!verifyPublicationCover(id, signature))
        throw new ApiError(403, "FORBIDDEN", "Muqova so‘rovi yaroqsiz.");
      const [row] =
        await getDb()`SELECT data,owner_id FROM invitations WHERE id=${id} AND status='published'`;
      if (!row) throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
      invitation = invitationSchema.parse({ ...row.data, status: "published" });
      ownerId = row.owner_id;
    } else {
      invitation = invitationSchema.parse(data);
      if (invitation.status === "published") {
        const owner = await getSessionUser();
        if (!owner)
          throw new ApiError(
            401,
            "LOGIN_REQUIRED",
            "Avval Telegram orqali kiring.",
          );
        const saved = await getOwnedInvitation(invitation.id, owner.id);
        if (!saved || saved.status !== "published")
          throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
        invitation = saved;
        ownerId = owner.id;
      }
    }
    if (!templateById(invitation.templateId))
      throw new ApiError(400, "NO_TEMPLATE", "Avval dizayn tanlang.");
    // Keep browser/native dependency failures inside the JSON error boundary.
    const { personalizedCover } =
      await import("@/server/invitation-cover").catch((error) => {
        throw coverFailure(error, "dependencies");
      });
    const image = await personalizedCover(
      invitation,
      request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local",
      cookie,
      ownerId,
    );
    return new Response(new Uint8Array(image), {
      headers: {
        ...privateHeaders,
        "Content-Type": "image/webp",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const response = apiError(error);
    if (error instanceof ApiError && error.code === "COVER_BUSY")
      response.headers.set("Retry-After", "3");
    return response;
  }
}
