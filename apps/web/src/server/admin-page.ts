import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "./admin";
import { ApiError } from "./api";

export async function requireAdminPage(fresh = true) {
  let user;
  try {
    user = await requireAdmin(fresh);
  } catch (error) {
    if (error instanceof ApiError && error.code === "ADMIN_REAUTH_REQUIRED")
      redirect("/admin/verify");
    // Fail closed, including when authentication configuration/storage fails.
    notFound();
  }
  return user;
}
