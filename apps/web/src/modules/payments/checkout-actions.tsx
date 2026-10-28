"use client";

import { useState } from "react";
import { openCheckout } from "./open-checkout";

export function CheckoutActions({ checkoutUrl }: { checkoutUrl: string }) {
  const [message, setMessage] = useState("");
  const [manualCopy, setManualCopy] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="button secondary"
        onClick={() => {
          try {
            openCheckout(checkoutUrl);
            setMessage(
              "Click ochilmasa, quyidagi ko‘rsatma orqali shu havolani Chrome’da oching.",
            );
          } catch {
            setMessage(
              "Havolani ochib bo‘lmadi. Shu havolani nusxalab Chrome’da oching. Telegramni yangilash ham yordam berishi mumkin.",
            );
          }
        }}
      >
        Click orqali davom etish
      </button>
      <button
        type="button"
        className="button secondary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(checkoutUrl);
            setMessage(
              "To‘lov havolasi nusxalandi. Uni Chrome manzil satriga joylang.",
            );
          } catch {
            setManualCopy(true);
            setMessage("Quyidagi to‘lov havolasini bosib ushlab, nusxalang.");
          }
        }}
      >
        To‘lov havolasini nusxalash
      </button>
      <p>
        Click sahifasida “Открыть в приложении”ni bosing. Ilova ochilmasa yoki
        “ERR_UNKNOWN_URL_SCHEME” chiqsa, Telegram brauzeri menyusidan “Brauzerda
        ochish / Open in browser”ni tanlang. Bu band bo‘lmasa, shu to‘lov
        havolasini nusxalab, Chrome manzil satriga joylang. Telegram versiyasi
        va sozlamalariga qarab havola ichki brauzerda ochilishi mumkin.
      </p>
      <p>
        Click o‘rnatilmagan bo‘lsa, uni o‘rnating va shu havolani qayta oching
        yoki Click sahifasidagi boshqa mavjud usuldan foydalaning. Yangi to‘lov
        yaratmang. So‘ng Taklifnoma’ga qaytib, “Holatni tekshirish”ni bosing.
        Havolani ochish to‘lov tasdig‘i emas.
      </p>
      {manualCopy && (
        <label>
          To‘lov havolasi
          <input
            aria-label="To‘lov havolasi"
            type="text"
            readOnly
            value={checkoutUrl}
            onFocus={(event) => event.currentTarget.select()}
            style={{ width: "100%" }}
          />
        </label>
      )}
      {message && <p role="status">{message}</p>}
    </div>
  );
}
