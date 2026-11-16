import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { ApiError, apiError } from "@/server/api";
import { getPublishedService } from "@/server/services";
import { serviceImageResponse } from "@/server/service-image-cache";
import {
  bundledServiceImageSource,
  uploadedServiceImageSource,
} from "@/server/service-image-source";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const query = new URL(request.url).searchParams;
    const width = z.coerce
      .number()
      .int()
      .parse(query.get("w") ?? 1600);
    // Read the authoritative listing on EVERY request, including conditional requests.
    const listing = await getPublishedService(slug);
    const image = listing?.images.find((item) => item.src === query.get("src"));
    if (!image) throw new ApiError(404, "IMAGE_NOT_FOUND", "Rasm topilmadi.");
    const id = image.src.match(
      /^\/api\/services\/media\/([0-9a-f-]{36})$/,
    )?.[1];
    let source;
    if (id) {
      const [media] =
        await getDb()`SELECT object_key FROM service_media WHERE id=${id}`;
      if (!media) throw new ApiError(404, "IMAGE_NOT_FOUND", "Rasm topilmadi.");
      source = uploadedServiceImageSource(media.object_key);
    } else {
      source = bundledServiceImageSource(image.src);
    }
    return await serviceImageResponse(request, source, { width });
  } catch (error) {
    return apiError(error);
  }
}

export const HEAD = GET;
