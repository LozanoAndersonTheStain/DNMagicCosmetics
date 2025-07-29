"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { titleFont } from "@/config/fonts";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 5000);
  }, [router]);

  return (
    <div className="min-h-screen bg-100dn w-full flex flex-col items-center justify-center px-4">
      <h1
        className={`${titleFont.className} text-7xl md:text-9xl font-bold text-500dn`}
      >
        404
      </h1>

      <h2 className="text-2xl md:text-4xl font-semibold mt-5 mb-8 text-center">
        Ups! La Página Que Buscas No Fue Encontrada...
      </h2>

      <p className="text-lg md:text-xl mb-8 text-center">
        En Breve Te Redirigiremos A La Pantalla Principal
      </p>

      <Link
        href="/"
        className="bg-500dn text-white px-8 py-3 rounded-md hover:bg-600dn transition-colors text-center w-full md:w-auto max-w-xs"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
