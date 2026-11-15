import { NextResponse } from "next/server";
import { getDb } from "@taklifnoma/database";
import {
  requireAdmin,
  requireAdminMutation,
  recordAdminChange,
  adminError,
} from "@/server/admin";
import { ApiError, privateHeaders, readJson } from "@/server/api";
import { serviceImportSchema } from "@/modules/services/service-editor-contract";
export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();
    const jobs =
      await db`SELECT id,input,status,service_slug,error,result,attempts,created_at,updated_at FROM service_import_jobs ORDER BY created_at DESC LIMIT 30`;
    const [worker] =
      await db`SELECT updated_at > now()-interval '90 seconds' AS online FROM service_worker_heartbeat WHERE name='services-import'`;
    return NextResponse.json(
      { jobs, workerOnline: Boolean(worker?.online) },
      { headers: privateHeaders },
    );
  } catch (e) {
    return adminError(e);
  }
}
export async function POST(request: Request) {
  try {
    const user = await requireAdminMutation(request);
    const input = serviceImportSchema.parse(await readJson(request, 6000)),
      db = getDb();
    const job = await db.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(74920319)`;
      const [count] =
        await tx`SELECT count(*)::int AS count FROM service_import_jobs WHERE status IN ('queued','running')`;
      if (count.count >= 10)
        throw new ApiError(
          429,
          "IMPORT_QUEUE_FULL",
          "Import navbati to‘lgan. Birozdan so‘ng qayta urining.",
        );
      const [existing] =
        await tx`SELECT id FROM service_import_jobs WHERE status IN ('queued','running') AND input=${tx.json(input)}`;
      if (existing)
        throw new ApiError(
          409,
          "IMPORT_EXISTS",
          "Bu so‘rov allaqachon navbatda.",
        );
      const [row] =
        await tx`INSERT INTO service_import_jobs(input,created_by) VALUES(${tx.json(input)},${user.id}) RETURNING id,status`;
      await recordAdminChange(tx, user.id, "service.import", row.id, null, {
        input,
        status: row.status,
      });
      return row;
    });
    return NextResponse.json({ job }, { status: 202, headers: privateHeaders });
  } catch (e) {
    return adminError(e);
  }
}
