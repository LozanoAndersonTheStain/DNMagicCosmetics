"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import {
  IoAddCircleOutline,
  IoRemoveCircleOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import { Button } from "@/components";
import { useCart } from "@/context/cart/CartContext";
import { use } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const { products, loading, error } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { addToCart } = useCart();
  const router = useRouter();

  const product = products.find((product) => product.slug === slug);

  useEffect(() => {
    if (!loading && !product && products.length > 0) {
      notFound();
    }
  }, [loading, product, products]);

  const handleGoBack = () => {
    router.back();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-lg">Cargando producto...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-red-500 text-center">
          <p className="text-lg mb-2">Error al cargar producto:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const images =
    selectedVariant !== null && product.colorVariants
      ? product.colorVariants[selectedVariant].images
      : product.images;

  const currentStock =
    selectedVariant !== null && product.colorVariants
      ? product.colorVariants[selectedVariant].inStock
      : product.inStock;

  const handleAddToCart = () => {
    if (selectedVariant !== null && product.colorVariants) {
      const variantProduct = {
        ...product,
        images: product.colorVariants[selectedVariant].images,
        inStock: product.colorVariants[selectedVariant].inStock,
        selectedColor: product.colorVariants[selectedVariant].color,
      };
      addToCart(variantProduct, quantity);
    } else {
      addToCart(product, quantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón de Regresar */}
      <div className="mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors duration-200 font-medium"
        >
          <IoArrowBackOutline size={26} />
          Regresar
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Slideshow */}
        <div className="relative">
          <div
            className="aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-zoom-in relative"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={images[currentImage] || "/placeholder.jpg"}
              alt={product.title}
              width={800}
              height={800}
              className={`w-full h-full object-cover transition-transform duration-200 ease-out ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
              style={{
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
              }}
            />
          </div>

          {/* Thumbnail Navigation */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`aspect-square cursor-pointer rounded-md overflow-hidden ${
                  currentImage === index ? "ring-2 ring-pink-500" : ""
                }`}
                onClick={() => setCurrentImage(index)}
              >
                <Image
                  src={image || "/placeholder.jpg"}
                  alt={`Thumbnail ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Información del Producto */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-2xl font-semibold text-pink-600">
            {formatPrice(product.price)}
            {quantity > 1 && (
              <span className="text-lg text-gray-600 ml-2">
                Total: {formatPrice(product.price * quantity)}
              </span>
            )}
          </p>

          {/* Variantes de Colores */}
          {product.colorVariants && product.colorVariants.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Colores Disponibles:</h3>
              <div className="flex flex-wrap gap-3">
                {product.colorVariants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(index)}
                    className={`
                      w-12 h-12 rounded-full transition-all
                      ${
                        selectedVariant === index
                          ? "ring-2 ring-offset-2 ring-pink-500 scale-110"
                          : "ring-1 ring-gray-300"
                      }
                    `}
                    style={{ backgroundColor: variant.color }}
                    title={`Color ${index + 1} - ${
                      variant.inStock
                    } disponibles`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* información de stock */}
          <p className="text-sm text-gray-600">
            Stock disponible: {currentStock}
          </p>

          {/* Selector de Cantidad */}
          <div className="flex items-center gap-4 my-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={quantity <= 1}
            >
              <IoRemoveCircleOutline size={24} />
            </button>
            <span className="text-xl font-medium w-12 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={quantity >= currentStock}
            >
              <IoAddCircleOutline size={24} />
            </button>
          </div>

          {/* Botón de Agregar al Carrito */}
          <Button
            className="w-full py-3 text-lg"
            onClick={handleAddToCart}
            disabled={currentStock === 0}
          >
            {currentStock === 0 ? "Agotado" : "Agregar al Carrito"}
          </Button>

          {/* Descripción */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Descripción:</h3>
            <p className="text-gray-600 text-lg">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
