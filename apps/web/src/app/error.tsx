"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main id="main" className="page-error">
      <h1>Sahifani ochib bo‘lmadi</h1>
      <p>
        Aloqani tekshiring va qayta urinib ko‘ring. Brauzerda saqlangan draft
        o‘chirilmaydi.
      </p>
      <button className="button" onClick={reset}>
        Qayta urinish
      </button>
    </main>
  );
}
