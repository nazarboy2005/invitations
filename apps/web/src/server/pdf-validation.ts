import { Worker } from "node:worker_threads";
import path from "node:path";
import { existsSync } from "node:fs";
import { ApiError } from "./api";

const runtime = globalThis as typeof globalThis & { fotihaPdfWorkers?: number };

// Both app-root and monorepo-root deployments are supported; the source worker
// and its package dependencies are explicitly checked in the deployment trace.
export async function sanitizeReceiptPdf(bytes: Buffer): Promise<Buffer> {
  const workerPath = [
    "src/server/pdf-receipt-worker.cjs",
    "apps/web/src/server/pdf-receipt-worker.cjs",
  ]
    .map((file) =>
      path.resolve(/* turbopackIgnore: true */ process.cwd(), file),
    )
    .find((file) => existsSync(file));
  if (!workerPath)
    throw new ApiError(
      503,
      "PDF_UNAVAILABLE",
      "PDF xizmati vaqtincha mavjud emas. Qayta urinib ko‘ring.",
    );
  if ((runtime.fotihaPdfWorkers ?? 0) >= 2)
    throw new ApiError(
      429,
      "PDF_BUSY",
      "Cheklar tekshirilmoqda. Birozdan so‘ng qayta urinib ko‘ring.",
    );
  runtime.fotihaPdfWorkers = (runtime.fotihaPdfWorkers ?? 0) + 1;
  try {
    return await new Promise<Buffer>((resolve, reject) => {
      const worker = new Worker(workerPath, {
        workerData: new Uint8Array(bytes),
        resourceLimits: {
          maxOldGenerationSizeMb: 96,
          maxYoungGenerationSizeMb: 16,
          stackSizeMb: 4,
        },
        // PDF diagnostics must not enter application logs.
        stdout: true,
        stderr: true,
      });
      worker.stdout.resume();
      worker.stderr.resume();
      let settled = false;
      const finish = (content?: Uint8Array) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        void worker.terminate();
        if (content) resolve(Buffer.from(content));
        else reject(new Error("Invalid PDF"));
      };
      const timer = setTimeout(() => finish(), 10_000);
      worker.on("message", (result) =>
        finish(
          result?.content instanceof Uint8Array ? result.content : undefined,
        ),
      );
      worker.on("error", () => finish());
      worker.on("exit", () => finish());
    });
  } finally {
    runtime.fotihaPdfWorkers = Math.max(0, (runtime.fotihaPdfWorkers ?? 1) - 1);
  }
}
