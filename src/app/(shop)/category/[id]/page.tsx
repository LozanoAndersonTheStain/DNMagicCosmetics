"use client";

import { categoryItems } from "@/seed";
import { ProductGrid } from "@/components/products/product-grid/ProductGrid";
import { notFound } from "next/navigation";
import { Product, ValidTypes } from "@/interfaces/product.interface";
import { useProducts } from "@/hooks/useProducts";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function CategoryById({ params }: Props) {
  const { id } = use(params);
  const categoryId = parseInt(id);
  const { products, loading, error } = useProducts();

  // Encontrar la categoría
  const category = categoryItems.find((cat) => cat.id === categoryId);

  if (!category) {
    notFound();
  }

  // Convertir el nombre de la categoría al formato del tipo de producto
  const categoryTypeMap: { [key: string]: ValidTypes } = {
    Accesorios: "accesorios",
    "Cuidado Capilar": "cuidado-capilar",
    "Cuidado Facial": "cuidado-facial",
    Piel: "piel",
    Uñas: "unas",
    Brochas: "brochas",
    Labios: "labios",
    Ojos: "ojos",
  };

  // Filtrar productos por categoría
  const categoryProducts = products.filter(
    (product: Product) => product.type === categoryTypeMap[category.name]
  ) as Product[];

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

  if (categoryProducts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-lg">No hay productos en esta categoría</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-black px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{category.name}</h1>

      <div className="container mx-auto">
        <ProductGrid products={categoryProducts} itemsPerPage={8} />
      </div>
    </div>
  );
}
