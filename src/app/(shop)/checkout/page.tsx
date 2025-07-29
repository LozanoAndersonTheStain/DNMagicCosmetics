"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart/CartContext";
import { useCheckoutProtection } from "@/hooks/useCheckoutProtection";

export default function CheckoutPage() {
  const router = useRouter();
  const { isEmpty } = useCart();
  const isAllowed = useCheckoutProtection();

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    numeroCelular: "",
    direccion: "",
    direccion2: "",
    codigoPostal: "",
    ciudad: "",
    pais: "",
  });

  // Si el carrito está vacío, no renderizar el contenido
  if (!isAllowed || isEmpty) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Carrito vacío</h2>
          <p className="text-gray-600 mb-6">
            No puedes proceder a la verificación sin productos en tu carrito.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar nuevamente antes de proceder
    if (isEmpty) {
      router.push("/products");
      return;
    }

    sessionStorage.setItem("checkoutFormData", JSON.stringify(formData));
    router.push("/checkout/verify");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Datos personales</h2>
        <h3 className="text-xl mb-8">Dirección de entrega</h3>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base mb-2">Nombres</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-pink-50 text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-base mb-2">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-pink-50 text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-base mb-2">Numero Celular</label>
              <input
                type="text"
                name="numeroCelular"
                value={formData.numeroCelular}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-pink-50 text-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base mb-2">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-pink-50 text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-base mb-2">
                Dirección 2 (Opcional)
              </label>
              <input
                type="text"
                name="direccion2"
                value={formData.direccion2}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-pink-50 text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base mb-2">Código postal</label>
              <input
                type="text"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-pink-50 text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-base mb-2">Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-pink-50 text-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base mb-2">País</label>
              <select
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-pink-50 text-lg"
                required
              >
                <option value="">[ Seleccione ]</option>
                <option value="CO">Colombia</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-pink-500 text-white py-3 px-12 rounded-md hover:bg-pink-600 transition-colors text-lg"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
