import { invitationSchema, templateById } from "@taklifnoma/contracts";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";

export const runtime = "nodejs";
export const maxDuration = 60;

// Accept the actual browser draft as well as saved content. This endpoint neither
// reads invitations by ID nor saves/publishes the submitted invitation.
export async function POST(request: Request) {
  try {
    verifySameOrigin(request);
    const invitation = invitationSchema.parse(await readJson(request));
    if (!templateById(invitation.templateId))
      throw new ApiError(400, "NO_TEMPLATE", "Avval dizayn tanlang.");
    // Keep browser/native dependency failures inside the JSON error boundary.
    const { personalizedCover } = await import("@/server/invitation-cover");
    const image = await personalizedCover(
      invitation,
      request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local",
      request.headers.get("cookie") ?? "",
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
