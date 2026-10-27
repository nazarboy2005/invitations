import type { Metadata } from "next";
import { PaymentReturn } from "@/modules/payments/payment-return";
export const metadata: Metadata = {
  title: "To‘lov holati",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <PaymentReturn />;
}
