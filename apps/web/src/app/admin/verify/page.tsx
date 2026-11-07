import { notFound, redirect } from "next/navigation";
import { getAdminVerification } from "@/server/admin";
import { AdminVerify } from "@/modules/admin/admin-verify";
import { display, sans } from "@/app/platform-fonts";
import styles from "@/modules/admin/admin.module.css";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Hisobni tasdiqlash",
  robots: { index: false, follow: false },
};
export default async function VerifyPage() {
  let verification;
  try {
    verification = await getAdminVerification();
  } catch {
    notFound();
  }
  if (verification.verified) redirect("/admin");
  const { user } = verification;
  return (
    <main
      id="main"
      className={`${styles.verifyPage} ${display.variable} ${sans.variable}`}
    >
      <AdminVerify userId={user.id} displayName={user.displayName} />
    </main>
  );
}
