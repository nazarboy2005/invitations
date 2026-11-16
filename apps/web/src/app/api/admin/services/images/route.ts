import { NextResponse } from "next/server";
import { requireAdminMutation, adminError } from "@/server/admin";
import { privateHeaders, readBytes } from "@/server/api";
import { saveServiceImage } from "@/server/service-media";
import { SERVICE_IMAGE_UPLOAD_MAX_BYTES } from "@/modules/services/service-image-policy";
export async function POST(request: Request) {
  try {
    const user = await requireAdminMutation(request);
    const image = await saveServiceImage(
      user.id,
      await readBytes(request, SERVICE_IMAGE_UPLOAD_MAX_BYTES),
    );
    return NextResponse.json(
      { image },
      { status: 201, headers: privateHeaders },
    );
  } catch (e) {
    return adminError(e);
  }
}
