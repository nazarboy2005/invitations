import { NextResponse } from "next/server";
import { requireAdmin, requireAdminMutation, adminError } from "@/server/admin";
import { privateHeaders, readJson } from "@/server/api";
import { listAdminServices, writeAdminService } from "@/server/admin-services";
export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(
      { items: await listAdminServices() },
      { headers: privateHeaders },
    );
  } catch (e) {
    return adminError(e);
  }
}
export async function POST(request: Request) {
  try {
    const user = await requireAdminMutation(request);
    const item = await writeAdminService(user.id, await readJson(request));
    return NextResponse.json(
      { item },
      { status: 201, headers: privateHeaders },
    );
  } catch (e) {
    return adminError(e);
  }
}
