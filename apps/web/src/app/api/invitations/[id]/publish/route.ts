import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticatedUser } from "@/server/invitations";
import { publishInvitation } from "@/server/publication";
import { verifySameOrigin } from "@/server/auth";
import { apiError, privateHeaders, readJson } from "@/server/api";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    const { id } = await params;
    z.uuid().parse(id);
    const { revision } = z
      .object({ revision: z.number().int().positive() })
      .strict()
      .parse(await readJson(request, 1000));
    return NextResponse.json(await publishInvitation(id, revision, user), {
      headers: privateHeaders,
    });
  } catch (error) {
    return apiError(error);
  }
}
