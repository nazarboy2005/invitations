import { NextResponse } from "next/server";
import { ZodError } from "zod";
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
export function apiError(error: unknown) {
  const response = errorResponse(error);
  response.headers.set("Cache-Control", "private, no-store");
  if (response.status === 429) response.headers.set("Retry-After", "60");
  return response;
}
function errorResponse(error: unknown) {
  if (error instanceof ZodError)
    return NextResponse.json(
      {
        error: {
          code: "INVALID_INPUT",
          message: "Kiritilgan ma’lumotlarni tekshiring.",
          fields: error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
      },
      { status: 400 },
    );
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    typeof error.status === "number"
  )
    return NextResponse.json(
      {
        error: {
          code: "code" in error ? error.code : "REQUEST_FAILED",
          message:
            error instanceof Error ? error.message : "So‘rov bajarilmadi.",
        },
      },
      { status: error.status },
    );
  if (error instanceof SyntaxError)
    return NextResponse.json(
      {
        error: {
          code: "INVALID_JSON",
          message: "So‘rov ma’lumotlarini tekshiring.",
        },
      },
      { status: 400 },
    );
  console.error(
    "Request failed",
    error instanceof Error ? error.name : "UnknownError",
  );
  return NextResponse.json(
    {
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Xizmat vaqtincha mavjud emas. Qayta urinib ko‘ring.",
      },
    },
    { status: 503 },
  );
}
export const privateHeaders = { "Cache-Control": "private, no-store" };
export async function readJson(
  request: Request,
  maxBytes = 128_000,
): Promise<unknown> {
  return JSON.parse((await readBytes(request, maxBytes)).toString("utf8"));
}
export async function readBytes(
  request: Request,
  maxBytes: number,
): Promise<Buffer> {
  if (Number(request.headers.get("content-length")) > maxBytes)
    throw new ApiError(413, "TOO_LARGE", "So‘rov hajmi juda katta.");
  if (!request.body) throw new ApiError(400, "EMPTY_BODY", "So‘rov bo‘sh.");
  const reader = request.body.getReader();
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new ApiError(413, "TOO_LARGE", "So‘rov hajmi juda katta.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
}
