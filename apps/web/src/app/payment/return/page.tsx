import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PaymentReturn } from "@/modules/payments/payment-return";
export const metadata: Metadata = {
  title: "Taklifnomani nashr qilish",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  // Nodze returns the browser to this exact registered URL for both outcomes.
  // Keep its callback destination stable, then send Click's browser back action
  // to the invitation dashboard instead of rendering the legacy status page.
  if (query.payment_status || query.payment_id) {
    const orderId =
      typeof query.order === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        query.order,
      )
        ? query.order
        : "";
    redirect(
      `/dashboard?payment_return=1${orderId ? `&order=${encodeURIComponent(orderId)}` : ""}`,
    );
  }
  return (
    <PaymentReturn
      botUsername={process.env.TELEGRAM_BOT_USERNAME}
      mainMiniApp={process.env.TELEGRAM_MAIN_MINI_APP_ENABLED === "true"}
    />
  );
}
