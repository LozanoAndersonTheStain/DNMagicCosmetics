"use client";

import { useState, useMemo } from "react";
import { ProductGrid } from "@/components";
import { ProductFilters } from "@/components/ui/filters/ProductFilters";
import { ValidSizes, Product } from "@/interfaces";
import { useProducts } from "@/hooks/useProducts";
import { Title } from "@/components/ui/title/Title";

interface FilterState {
  categories: string[];
  priceRange: { min: number; max: number } | null;
  inStock: boolean;
}

export default function PromotionsPage() {
  const { products, loading, error } = useProducts();
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: null,
    inStock: true,
  });

  // Filtrar productos que tienen 'set' en sus tamaños
  const setProducts = products.filter((product) =>
    product.sizes.includes("set" as ValidSizes)
  );

  // Aplicar filtros adicionales a los productos de promoción
  const filteredPromotions = useMemo(() => {
    if (!setProducts || setProducts.length === 0) return [];

    return setProducts.filter((product: Product) => {
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
  }, [setProducts, filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <span className="text-lg">Cargando promociones...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-red-500 text-center">
          <p className="text-lg mb-2">Error al cargar promociones:</p>
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
          title="Todas nuestras promociones"
          subtitle="Encuentra los mejores productos en oferta"
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
            <div className="flex justify-between items-center">
              {/* <p className="text-gray-600">
                Mostrando {filteredPromotions.length} de {setProducts.length} promociones
              </p> */}

              {/* Filtros móviles - botón para mostrar en modal */}
              <button className="lg:hidden bg-pink-500 text-white px-4 py-2 rounded-lg">
                Filtros
              </button>
            </div>

            {filteredPromotions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {setProducts.length === 0
                    ? "No hay promociones disponibles en este momento"
                    : "No se encontraron promociones que coincidan con los filtros seleccionados"}
                </p>
              </div>
            ) : (
              <ProductGrid products={filteredPromotions} itemsPerPage={6} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
