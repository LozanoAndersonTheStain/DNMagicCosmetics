"use client";

import { useState, useEffect, useRef } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { useProducts } from "@/hooks/useProducts";
import { SeedProduct } from "@/seed/seed";
import Link from "next/link";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchBox = ({ isOpen, onClose }: Props) => {
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SeedProduct[]>([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setResults([]);
      setShowNoResults(false);
      setHasSearched(false);
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || loading) return;

    setHasSearched(true);

    // Filtrar productos basados en el término de búsqueda
    const filteredProducts = products.filter((product) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    });

    setResults(filteredProducts);
    setShowNoResults(filteredProducts.length === 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      setResults([]);
      setHasSearched(false);
      setShowNoResults(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 top-[72px] bg-black bg-opacity-30 z-30"
        onClick={onClose}
      />
      <div
        ref={searchRef}
        className="fixed top-[72px] left-0 w-full bg-pink-500 transform transition-transform duration-300 z-40 max-h-[calc(100vh-72px)] overflow-y-auto"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(-100%)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div className="container mx-auto px-4 md:px-16 py-4">
          {/* Barra de búsqueda */}
          <div className="bg-pink-500 rounded-lg p-4 mb-6">
            <form
              onSubmit={handleSearch}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Buscar por producto o marca"
                className="w-full py-2 pl-10 pr-12 text-gray-800 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
                autoFocus
                disabled={loading}
              />
              <IoSearchOutline className="absolute left-3 text-gray-400 w-5 h-5" />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoCloseOutline className="w-6 h-6" />
              </button>
            </form>
          </div>

          {/* Estados de carga y error */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                <span className="text-lg text-gray-700">
                  Cargando productos...
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center py-8">
              <p className="text-lg mb-2">Error al cargar productos:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Resultados de búsqueda */}
          {results.length > 0 && (
            <div className="text-gray-800">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Resultados de búsqueda para "{searchTerm}" ({results.length}{" "}
                  productos encontrados)
                </h3>
              </div>

              {/* Grid de productos compacto */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {results.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 hover:border-pink-300">
                      {/* Imagen del producto */}
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <Image
                          src={
                            product.images?.[0]
                              ? `/products/${product.images[0]}`
                              : "/assets/products/placeholder.png"
                          }
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                        />

                        {/* Badge de stock
                        {product.inStock ? (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Disponible
                          </div>
                        ) : (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Agotado
                          </div>
                        )} */}
                      </div>

                      {/* Información del producto */}
                      <div className="p-3">
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-pink-600 transition-colors">
                          {product.title}
                        </h3>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-pink-600">
                            ${product.price.toFixed(2)}
                          </span>

                          {/* Tags/categorías */}
                          {/* {product.tags.length > 0 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {product.tags[0]}
                            </span>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mostrar más resultados si hay muchos */}
              {results.length > 12 && (
                <div className="text-center mt-6">
                  <p className="text-gray-600 text-sm">
                    Mostrando los primeros 12 resultados. Refina tu búsqueda
                    para resultados más específicos.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Sin resultados */}
          {hasSearched && showNoResults && !loading && (
            <div className="text-center py-8">
              <div className="text-gray-600">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl font-semibold mb-2 text-black">
                  No se encontraron productos
                </p>
                <p className="text-black">
                  No hay productos que coincidan con "{searchTerm}"
                </p>
                <p className="text-black mt-2">
                  Intenta con otras palabras o navega por nuestras categorías
                </p>
              </div>
            </div>
          )}

          {/* Mensaje inicial (cuando no se ha buscado nada) */}
          {!hasSearched && !loading && (
            <div className="text-center py-8">
              <div className="text-gray-600">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 mt-2">
                  Busca por nombre, tipo de producto o marca
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
