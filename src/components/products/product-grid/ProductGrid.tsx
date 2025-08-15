"use client";

import { Product } from "@/interfaces";
import { ProductGridItem } from "./ProductGridItem";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface ProductGridProps {
  products: Product[];
  itemsPerPage?: number;
}

export const ProductGrid = ({
  products,
  itemsPerPage = 8,
}: ProductGridProps) => {
  const { displayedProducts, hasMore, isLoading } = useInfiniteScroll({
    products,
    itemsPerPage,
  });

  return (
    <div className="w-full">
      {/* Grid de productos - Responsive: 2 en mobile, 3 en tablet, 5 en desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-10">
        {displayedProducts.map((product, index) => (
          <ProductGridItem
            key={`${product.slug}-${index}`}
            product={product}
          />
        ))}
      </div>

      {/* Indicador de carga */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-500dn"></div>
            <span className="text-gray-600">Cargando más productos...</span>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay más productos */}
      {!hasMore && displayedProducts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">¡Has visto todos nuestros productos!</p>
        </div>
      )}

      {/* Mensaje cuando no hay productos */}
      {displayedProducts.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay productos disponibles</p>
        </div>
      )}
    </div>
  );
};
