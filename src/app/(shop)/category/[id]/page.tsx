"use client";

import { categoryItems } from "@/seed";
import { ProductGrid } from "@/components/products/product-grid/ProductGrid";
import { notFound, useRouter } from "next/navigation";
import { Product, ValidTypes } from "@/interfaces/product.interface";
import { useProducts } from "@/hooks/useProducts";
import { use } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

interface Props {
  params: Promise<{ id: string }>;
}

export default function CategoryById({ params }: Props) {
  const { id } = use(params);
  const categoryId = parseInt(id);
  const { products, loading, error } = useProducts();
  const router = useRouter();

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

  const handleGoBack = () => {
    router.back();
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

  if (categoryProducts.length === 0) {
    return (
      <div className="text-black px-4 py-8">
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors duration-200 font-medium"
          >
            <IoArrowBackOutline size={26} />
            Regresar
          </button>
        </div>

        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              No hay productos disponibles
            </h2>
            <p className="text-lg text-gray-600">
              No se encontraron productos en la categoría "{category.name}"
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-black px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 md:gap-0">
        {/* Botón de regresar */}
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors duration-200 font-medium self-start md:self-center"
        >
          <IoArrowBackOutline size={26} />
          Regresar
        </button>

        {/* Título */}
        <h1 className="text-3xl font-bold text-center md:flex-1">
          Productos para
          <br className="md:hidden" />
          <span className="text-pink-600 md:ml-2">{category.name}</span>
        </h1>

        {/* Espacio para balance en desktop */}
        <div className="hidden md:block w-[120px]"></div>
      </div>

      <div className="container mx-auto">
        <ProductGrid products={categoryProducts} itemsPerPage={8} />
      </div>
    </div>
  );
}
