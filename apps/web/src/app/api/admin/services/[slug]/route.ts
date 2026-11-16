import { NextResponse } from "next/server";
import { requireAdmin, requireAdminMutation, adminError } from "@/server/admin";
import { privateHeaders, readJson } from "@/server/api";
import {
  deleteAdminService,
  getAdminService,
  writeAdminService,
} from "@/server/admin-services";
type Context = { params: Promise<{ slug: string }> };
export const maxDuration = 60;
export async function DELETE(request: Request, { params }: Context) {
  try {
    const user = await requireAdminMutation(request);
    const result = await deleteAdminService(
      user.id,
      (await params).slug,
      await readJson(request),
    );
    return NextResponse.json(result, { headers: privateHeaders });
  } catch (e) {
    return adminError(e);
  }
}
export async function GET(_request: Request, { params }: Context) {
  try {
    await requireAdmin();
    return NextResponse.json(
      { item: await getAdminService((await params).slug) },
      { headers: privateHeaders },
    );
  } catch (e) {
    return adminError(e);
  }
}
export async function PATCH(request: Request, { params }: Context) {
  try {
    const user = await requireAdminMutation(request);
    const item = await writeAdminService(
      user.id,
      await readJson(request),
      (await params).slug,
    );
    return NextResponse.json({ item }, { headers: privateHeaders });
  } catch (e) {
    return adminError(e);
  }
}
