"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { useState } from "react";
import { Button } from "@/components";

export const Footer = () => {
  const [showMoreProducts, setShowMoreProducts] = useState(false);

  const firstSetProducts = [
    { href: "/productos/cremas", label: "Cremas" },
    { href: "/productos/cuidado-piel", label: "Cuidado De Piel" },
    { href: "/productos/pestaninas", label: "Pestañinas" },
    { href: "/productos/labiales", label: "Labiales" },
  ];

  const secondSetProducts = [
    { href: "/productos/accesorios", label: "Accesorios" },
    { href: "/productos/pinceles", label: "Pinceles" },
    { href: "/productos/pintaunas", label: "Pintauñas" },
    { href: "/productos/iluminador", label: "Iluminador" },
    { href: "/productos/bases", label: "Bases" },
  ];

  return (
    <footer className="bg-transparent py-[5.4rem] px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Columna 1: Slogan y Redes Sociales */}
        <div className="space-y-6">
          <p className="text-lg font-semibold">
            &rdquo;D&N: Más Que Cosméticos, Creamos Experiencias Que Cuidan De
            Ti Y Te Hacen Brillar Cada Día.&rdquo;
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold">Redes Sociales</h3>
            <div className="flex gap-4">
              <Link
                href="#"
                className="hover:text-950dn hover:scale-105 transition-all duration-300"
              >
                <FaFacebook size={24} />
              </Link>
              <Link
                href="#"
                className="hover:text-950dn hover:scale-105 transition-all duration-300"
              >
                <FaInstagram size={24} />
              </Link>
              <Link
                href="#"
                className="hover:text-950dn hover:scale-105 transition-all duration-300"
              >
                <FaTiktok size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Columna 2: Enlaces principales */}
        <div className="space-y-3">
          <Link
            href="/productos"
            className="block hover:text-950dn hover:scale-105 transition-all duration-300"
          >
            Productos
          </Link>
          <Link
            href="/nosotros"
            className="block hover:text-950dn hover:scale-105 transition-all duration-300"
          >
            Nosotros
          </Link>
          <Link
            href="/novedades"
            className="block hover:text-950dn hover:scale-105 transition-all duration-300"
          >
            Novedades
          </Link>
          <Link
            href="/promociones"
            className="block hover:text-950dn hover:scale-105 transition-all duration-300"
          >
            Promociones
          </Link>
        </div>

        {/* Columna 3: Categorías de productos */}
        <div className="space-y-3">
          {(showMoreProducts ? secondSetProducts : firstSetProducts).map(
            (product) => (
              <Link
                key={product.href}
                href={product.href}
                className="block hover:text-950dn hover:scale-105 transition-all duration-300"
              >
                {product.label}
              </Link>
            )
          )}
          <div className="pt-4">
            <Button
              onClick={() => setShowMoreProducts(!showMoreProducts)}
              variant="secondary"
              size="sm"
            >
              {showMoreProducts
                ? "Ver opciones anteriores"
                : "Ver otras opciones"}
            </Button>
          </div>
        </div>

        {/* Columna 4: Información de contacto */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p>
              Dirección De Un Lugar Físico Dónde Pueden Recoger Los Productos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p>+57 322 244 5259</p>
          </div>
          <div className="flex items-center gap-2">
            <p>magicmakeup007@gmail.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
