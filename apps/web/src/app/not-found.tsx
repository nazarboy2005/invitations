import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="page-error">
      <h1>Bu sahifa topilmadi</h1>
      <p>Taklifnoma havolasini tekshiring yoki bosh sahifaga qayting.</p>
      <Link className="button" href="/">
        Bosh sahifa
      </Link>
    </main>
  );
}
