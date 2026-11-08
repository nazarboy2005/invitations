import { ApiError } from "./api";

export function coverFailureCode(error: unknown, stage: string) {
  const message = error instanceof Error ? error.message : String(error);
  if (
    /Cannot find (?:module|package)|ERR_MODULE_NOT_FOUND|Could not load.*sharp/i.test(
      message,
    )
  )
    return "COVER_DEPENDENCY_MISSING";
  if (
    /input directory.*does not exist|Executable doesn't exist|ENOENT.*(?:chrom|browser)/i.test(
      message,
    )
  )
    return "COVER_BROWSER_MISSING";
  if (
    /shared libraries|libnss|libnspr|GLIBC|wrong ELF|Exec format/i.test(message)
  )
    return "COVER_BROWSER_LIBRARY";
  if (stage === "configuration") return "COVER_CONFIGURATION";
  if (stage === "dependencies") return "COVER_DEPENDENCY_FAILED";
  if (stage === "browser" || stage === "launch") return "COVER_BROWSER_FAILED";
  if (/Timeout|timed out|Target.*closed/i.test(message))
    return "COVER_RENDER_TIMEOUT";
  return "COVER_RENDER_FAILED";
}

export function coverFailure(error: unknown, stage: string) {
  if (error instanceof ApiError) return error;
  const code = coverFailureCode(error, stage);
  // Raw error text can contain tokens, SQL, invitation content, or cookies,
  // including on its first line. Keep only classified diagnostics.
  console.error("Invitation cover failed", {
    code,
    stage,
    node: process.version,
    platform: process.platform,
    arch: process.arch,
  });
  return new ApiError(503, code, "Muqova tayyorlanmadi. Qayta urinib ko‘ring.");
}
