import type { Metadata } from "next";
import { PaymentReturn } from "@/modules/payments/payment-return";
export const metadata: Metadata = {
  title: "Taklifnomani nashr qilish",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <PaymentReturn
      botUsername={process.env.TELEGRAM_BOT_USERNAME}
      mainMiniApp={process.env.TELEGRAM_MAIN_MINI_APP_ENABLED === "true"}
    />
  );
}
