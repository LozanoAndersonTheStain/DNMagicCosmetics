"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { useProducts } from "@/hooks/useProducts";
import { SeedProduct } from "@/seed/seed";

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
        className="fixed top-[72px] left-0 w-full bg-pink-500 transform transition-transform duration-300 z-40"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(-100%)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div className="container mx-auto px-16 py-4">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Buscar por producto o marca"
              className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
              autoFocus
              disabled={loading}
            />
            <IoSearchOutline className="absolute left-3 text-gray-400 w-5 h-5" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>
          </form>

          {loading && (
            <div className="mt-4 text-white text-center">
              <p>Cargando productos...</p>
            </div>
          )}

          {error && (
            <div className="mt-4 text-white text-center">
              <p>Error al cargar productos: {error}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((product) => (
                <div
                  key={product.slug}
                  className="bg-white rounded-lg p-4 shadow"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <h3 className="mt-2 text-lg font-semibold text-gray-800">
                    {product.title}
                  </h3>
                  <p className="text-pink-500 font-bold">${product.price}</p>
                </div>
              ))}
            </div>
          )}

          {hasSearched && showNoResults && !loading && (
            <div className="mt-4 text-white text-center">
              <p className="text-lg font-semibold">
                No se encontraron productos
              </p>
              <p className="mt-2">
                Intenta con otras palabras o navega por nuestras categorías
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
