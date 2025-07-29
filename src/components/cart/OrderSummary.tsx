"use client";

import { Button } from "@/components";
import { useRouter } from "next/navigation";

interface OrderSummaryProps {
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const OrderSummary = ({ 
  totalItems, 
  subtotal, 
  shipping, 
  total 
}: OrderSummaryProps) => {
  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        Información de la orden
      </h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>No. Productos</span>
          <span>{totalItems} productos</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      <Button
        variant="primary"
        className="w-full"
        onClick={() => router.push("/checkout")}
      >
        Confirmar Compra
      </Button>
    </div>
  );
};