"use client";

import { useCart } from "@/context/cart/CartContext";
import Link from "next/link";
import { CartItem, OrderSummary } from "@/components/cart";
import { useRouter } from "next/navigation";
import { IoArrowBackOutline } from "react-icons/io5";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const handleGoBack = () => {
    router.back();
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

      {items.length === 0 ? (
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8">
              ¡Descubre nuestros productos y comienza a añadir tus favoritos!
            </p>
            <Link
              href="/products"
              className="inline-block bg-pink-600 text-white px-8 py-3 rounded-md hover:bg-pink-700 transition-colors"
            >
              Ir a la tienda
            </Link>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">Carrito de compras</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.slug}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </div>
            <div className="lg:w-1/3">
              <OrderSummary
                totalItems={totalItems}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
