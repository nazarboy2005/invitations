import { z } from "zod";
import { localeSchema } from "@taklifnoma/contracts";
import { authenticatedUser } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { apiError, privateHeaders, readJson } from "@/server/api";
import { downloadStaticImage, staticImageLimit } from "@/server/static-images";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    verifySameOrigin(request);
    const owner = await authenticatedUser();
    await staticImageLimit(request, "download", owner.id);
    const id = z.uuid().parse((await params).id);
    const { revision, locale } = z
      .object({ revision: z.number().int().positive(), locale: localeSchema })
      .parse(await readJson(request));
    const { bytes, exportedAt } = await downloadStaticImage(
      id,
      revision,
      locale,
      owner,
    );
    return new Response(new Uint8Array(bytes), {
      headers: {
        ...privateHeaders,
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="fotiha-${id}-${locale}.png"`,
        "X-Image-Exported-At": exportedAt,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    return apiError(e);
  }
}
