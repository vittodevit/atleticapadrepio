import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">404 - Pagina non trovata</h1>
      <p className="mt-2">Ci dispiace, la pagina che stavi cercando non esiste!</p>
      <Link href="/" className="mt-4 inline-block px-4 py-2 bg-app-1 text-white rounded-md">
        Torna alla home
      </Link>
    </div>
  );
}