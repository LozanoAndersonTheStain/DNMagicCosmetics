"use client";

import { Button } from "@/components";
import { CartItem as CartItemType } from "@/interfaces";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (slug: string, quantity: number) => void;
  onRemove: (slug: string) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Evitar navegación si se hace click en controles
    if ((e.target as HTMLElement).closest(".cart-controls")) {
      return;
    }
    router.push(`/product/${item.slug}`);
  };

  const getImageSrc = () => {
    const firstImage = item.images && item.images[0];
    return firstImage && firstImage.trim()
      ? firstImage
      : "/assets/products/placeholder.png";
  };

  return (
    <div
      className="flex items-center gap-4 border p-4 rounded bg-white hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={handleCardClick}
    >
      <Image
        src={getImageSrc()}
        alt={item.title}
        width={100}
        height={100}
        className="object-cover rounded-md"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/assets/products/placeholder.png";
        }}
      />
      <div className="flex-1">
        <h3 className="font-bold text-lg text-gray-900 hover:text-pink-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-gray-600">{formatPrice(item.price)}</p>
        {item.selectedColor && (
          <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>
        )}
      </div>

      {/* Controles con clase especial para evitar propagación del click */}
      <div className="cart-controls flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdateQuantity(item.slug, Math.max(1, item.quantity - 1));
          }}
          className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100 transition-colors"
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdateQuantity(item.slug, item.quantity + 1);
          }}
          className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100 transition-colors"
        >
          +
        </button>
      </div>

      <div className="cart-controls">
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.slug);
          }}
          className="ml-4"
        >
          Remover
        </Button>
      </div>
    </div>
  );
};
