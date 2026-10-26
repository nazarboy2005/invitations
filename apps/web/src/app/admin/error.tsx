"use client";
import Link from "next/link";
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container" style={{ paddingBlock: 80 }}>
      <h1 className="page-heading">Boshqaruv yuklanmadi</h1>
      <p role="alert">Xizmat bilan bog‘lanib bo‘lmadi. Qayta urinib ko‘ring.</p>
      <button className="button" onClick={reset}>
        Qayta urinish
      </button>{" "}
      <Link className="button secondary" href="/dashboard">
        Hisobga qaytish
      </Link>
    </main>
  );
}
