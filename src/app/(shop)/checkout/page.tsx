"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart/CartContext";
import { useCheckoutProtection } from "@/hooks/useCheckoutProtection";
import { IoArrowBackOutline } from "react-icons/io5";

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

  // Cargar datos guardados del sessionStorage al montar el componente
  useEffect(() => {
    const savedFormData = sessionStorage.getItem("checkoutFormData");
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        // Si hay error al parsear, limpiar el sessionStorage
        sessionStorage.removeItem("checkoutFormData");
      }
    }
  }, []);

  // Guardar datos en sessionStorage cada vez que cambian
  useEffect(() => {
    // Solo guardar si al menos un campo tiene datos
    const hasData = Object.values(formData).some(
      (value) => value.trim() !== ""
    );
    if (hasData) {
      sessionStorage.setItem("checkoutFormData", JSON.stringify(formData));
    }
  }, [formData]);

  // Función para regresar al carrito
  const handleGoBack = () => {
    router.push("/cart");
  };

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

    // Guardar datos antes de navegar (redundante pero seguro)
    sessionStorage.setItem("checkoutFormData", JSON.stringify(formData));
    router.push("/checkout/verify");
  };

  // Función para limpiar formulario
  const handleClearForm = () => {
    setFormData({
      nombres: "",
      apellidos: "",
      numeroCelular: "",
      direccion: "",
      direccion2: "",
      codigoPostal: "",
      ciudad: "",
      pais: "",
    });
    sessionStorage.removeItem("checkoutFormData");
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
          Regresar al carrito
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Datos personales</h2>
            <h3 className="text-xl mb-8">Dirección de entrega</h3>
          </div>

          {/* Botón para limpiar formulario */}
          <button
            onClick={handleClearForm}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
            type="button"
          >
            Limpiar formulario
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base mb-2">Nombres</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
                placeholder="Ingresa tus nombres"
              />
            </div>
            <div>
              <label className="block text-base mb-2">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
                placeholder="Ingresa tus apellidos"
              />
            </div>
            <div>
              <label className="block text-base mb-2">Numero Celular</label>
              <input
                type="tel"
                name="numeroCelular"
                value={formData.numeroCelular}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
                placeholder="Ej: +57 300 123 4567"
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
                className="w-full p-3 rounded-md bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
                placeholder="Calle, carrera, número"
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
                className="w-full p-3 rounded-md bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Apartamento, edificio, etc."
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
                className="w-full p-3 rounded-md bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
                placeholder="Ej: 110111"
              />
            </div>
            <div>
              <label className="block text-base mb-2">Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
                placeholder="Ej: Bogotá"
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
                className="w-full p-3 rounded-md bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              >
                <option value="">[ Seleccione ]</option>
                <option value="CO">Colombia</option>
              </select>
            </div>
          </div>

          {/* Indicador de datos guardados */}
          {Object.values(formData).some((value) => value.trim() !== "") && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-700 text-sm">
                ✅ Los datos se están guardando automáticamente
              </p>
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={handleGoBack}
              className="bg-gray-200 text-gray-700 py-3 px-8 rounded-md hover:bg-gray-300 transition-colors text-lg"
            >
              Volver al carrito
            </button>

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
