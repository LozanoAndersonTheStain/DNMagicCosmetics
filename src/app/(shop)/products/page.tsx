"use client";

import { useState, useMemo } from "react";
import { Title } from "@/components/ui/title/Title";
import { ProductGrid } from "@/components";
import { ProductFilters } from "@/components/ui/filters/ProductFilters";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/interfaces";

interface FilterState {
  categories: string[];
  priceRange: { min: number; max: number } | null;
  inStock: boolean;
}

export default function ProductsPage() {
  const { products, loading, error } = useProducts();
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: null,
    inStock: true,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtrar productos basado en los filtros seleccionados
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return products.filter((product: Product) => {
      // Si no hay filtros seleccionados o si "todos" está seleccionado, mostrar todos
      if (
        filters.categories.length === 0 ||
        filters.categories.includes("todos")
      ) {
        return true;
      }

      // Filtrar por categoría
      if (filters.categories.length > 0) {
        const productType = product.type?.toLowerCase().replace(/\s+/g, "-");
        return filters.categories.some((category) => {
          // Mapear algunas categorías comunes
          const categoryMappings: { [key: string]: string[] } = {
            accesorios: ["accesorio", "accesorios"],
            "cuidado-capilar": [
              "cabello",
              "capilar",
              "shampoo",
              "acondicionador",
            ],
            "cuidado-facial": ["facial", "cara", "rostro"],
            piel: ["piel", "crema", "loción", "hidratante"],
            uñas: ["uña", "uñas", "esmalte"],
            brochas: ["brocha", "pincel", "aplicador"],
            labios: ["labial", "labios", "lip"],
            ojos: ["ojo", "ojos", "sombra", "mascara", "delineador"],
          };

          const mappedTerms = categoryMappings[category] || [category];
          return mappedTerms.some(
            (term) =>
              productType?.includes(term) ||
              product.title?.toLowerCase().includes(term) ||
              product.description?.toLowerCase().includes(term)
          );
        });
      }

      return true;
    });
  }, [products, filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleCloseMobileFilters = () => {
    setShowMobileFilters(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <span className="text-lg">Cargando productos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-red-500 text-center">
          <p className="text-lg mb-2">Error al cargar productos:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-black">
      {/* Título centrado */}
      <div className="px-4 py-8">
        <Title
          title="Todos los productos"
          subtitle="Encuentra los mejores productos"
          className="flex flex-col items-center"
        />
      </div>

      {/* Layout con sidebar fijo a la izquierda */}
      <div className="flex min-h-screen">
        {/* Sidebar de filtros - pegado a la izquierda */}
        <div className="hidden lg:block w-80 flex-shrink-0 px-4">
          <ProductFilters onFilterChange={handleFilterChange} />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 px-4">
          <div className="max-w-8xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              {/* Filtros móviles - botón para mostrar en modal */}
              <button
                className="lg:hidden bg-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-600 transition-colors"
                onClick={() => setShowMobileFilters(true)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filtros
              </button>
            </div>

            <ProductGrid products={filteredProducts} itemsPerPage={8} />
          </div>
        </div>
      </div>

      {/* Modal de filtros móviles */}
      {showMobileFilters && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={handleCloseMobileFilters}
          />

          {/* Modal content */}
          <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto">
            <div className="p-4">
              {/* Header del modal */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-xl font-bold">Filtros</h2>
                <button
                  onClick={handleCloseMobileFilters}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Contenido de filtros */}
              <ProductFilters
                onFilterChange={(newFilters) => {
                  handleFilterChange(newFilters);
                  // Opcionalmente cerrar el modal después de aplicar filtros
                  // handleCloseMobileFilters();
                }}
              />

              {/* Botones de acción */}
              <div className="mt-6 pt-4 border-t space-y-3">
                <button
                  onClick={handleCloseMobileFilters}
                  className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Aplicar Filtros
                </button>
                <button
                  onClick={() => {
                    setFilters({
                      categories: [],
                      priceRange: null,
                      inStock: true,
                    });
                    handleCloseMobileFilters();
                  }}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
