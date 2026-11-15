import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import {
  requireAdminMutation,
  recordAdminChange,
  adminError,
} from "@/server/admin";
import { ApiError, privateHeaders, readJson } from "@/server/api";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAdminMutation(request),
      id = z.uuid().parse((await params).id);
    const { action } = z
      .object({ action: z.enum(["retry", "cancel"]) })
      .strict()
      .parse(await readJson(request, 1000));
    const job = await getDb().begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(74920319)`;
      const [before] =
        await tx`SELECT * FROM service_import_jobs WHERE id=${id} FOR UPDATE`;
      if (!before)
        throw new ApiError(404, "IMPORT_NOT_FOUND", "Import topilmadi.");
      if (
        (action === "retry" &&
          !["failed", "cancelled"].includes(before.status)) ||
        (action === "cancel" && !["queued", "running"].includes(before.status))
      )
        throw new ApiError(
          409,
          "IMPORT_STATE",
          "Import holati o‘zgargan. Ro‘yxatni yangilang.",
        );
      if (action === "retry") {
        const [count] =
          await tx`SELECT count(*)::int AS count FROM service_import_jobs WHERE status IN ('queued','running')`;
        if (count.count >= 10)
          throw new ApiError(
            429,
            "IMPORT_QUEUE_FULL",
            "Import navbati to‘lgan.",
          );
      }
      const status = action === "retry" ? "queued" : "cancelled";
      const [row] =
        await tx`UPDATE service_import_jobs SET status=${status},error=NULL,lease_token=NULL,updated_at=now() WHERE id=${id} RETURNING id,status`;
      await recordAdminChange(
        tx,
        user.id,
        "service.import",
        id,
        { status: before.status },
        { status },
      );
      return row;
    });
    return NextResponse.json({ job }, { headers: privateHeaders });
  } catch (e) {
    return adminError(e);
  }
}
