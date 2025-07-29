"use client";

import { Product } from "@/interfaces/product.interface";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { Button } from "@/components";
import { useCart } from "@/context/cart/CartContext";
import { useRouter } from "next/navigation";

interface ProductGridItemProps {
  product: Product;
}

export const ProductGridItem = ({ product }: ProductGridItemProps) => {
  const [displayImage, setDisplayImage] = useState(product.images[0]);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    addToCart(product, 1);
    router.push("/cart");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Manejo de imágenes con fallback
  const imageSrc =
    imageError || !displayImage
      ? "/assets/products/placeholder.jpg"
      : displayImage;

  return (
    <div className="bg-gray-50 rounded-lg p-2 md:p-4 w-full transition-all duration-300 hover:shadow-lg">
      {/* Imagen del producto */}
      <div className="mb-2 md:mb-4">
        <Link href={`/product/${product.slug}`}>
          <div className="aspect-square bg-white rounded-lg overflow-hidden">
            <Image
              src={imageSrc}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300"
              width={200}
              height={200}
              onMouseEnter={() =>
                setDisplayImage(product.images[1] || product.images[0])
              }
              onMouseLeave={() => setDisplayImage(product.images[0])}
              onError={() => setImageError(true)}
            />
          </div>
        </Link>
      </div>

      {/* Información del producto */}
      <div className="text-center space-y-1 md:space-y-2">
        {/* Título del producto - Responsive text size */}
        <h3 className="text-sm md:text-lg font-semibold text-gray-800 hover:text-500dn transition-colors line-clamp-2">
          <Link href={`/product/${product.slug}`}>{product.title}</Link>
        </h3>

        {/* Precio - Responsive text size */}
        <p className="text-base md:text-xl font-medium text-gray-900">
          {formatPrice(product.price)}
        </p>

        {/* Botones de acción - Responsive spacing y sizing */}
        <div className="pt-2 md:pt-4 space-y-1 md:space-y-2">
          <Button
            onClick={handleBuyNow}
            variant="primary"
            className="w-full bg-500dn hover:bg-600dn text-white py-1.5 md:py-2 px-2 md:px-4 rounded-lg transition-colors duration-200 text-xs md:text-sm"
          >
            Adquirir Ahora
          </Button>

          <Button
            variant="secondary"
            className="w-full flex items-center justify-center space-x-1 md:space-x-2 py-1.5 md:py-2 px-2 md:px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-xs md:text-sm"
            onClick={() => addToCart(product, 1)}
          >
            <IoCartOutline className="text-sm md:text-lg" />
            <span className="hidden sm:inline">Agregar al Carrito</span>
            <span className="sm:hidden">Agregar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};