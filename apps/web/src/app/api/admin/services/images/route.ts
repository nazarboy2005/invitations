import { NextResponse } from "next/server";
import { requireAdminMutation, adminError } from "@/server/admin";
import { privateHeaders, readBytes } from "@/server/api";
import { saveServiceImage } from "@/server/service-media";
export async function POST(request: Request) {
  try {
    const user = await requireAdminMutation(request);
    const image = await saveServiceImage(
      user.id,
      await readBytes(request, 12 * 1024 * 1024),
    );
    return NextResponse.json(
      { image },
      { status: 201, headers: privateHeaders },
    );
  } catch (e) {
    return adminError(e);
  }
}
