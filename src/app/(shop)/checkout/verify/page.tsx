"use client";

import { useCart } from "@/context/cart/CartContext";
import { useCheckoutProtection } from "@/hooks/useCheckoutProtection";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FormData {
  nombres: string;
  apellidos: string;
  numeroCelular: string;
  direccion: string;
  direccion2?: string;
  codigoPostal: string;
  ciudad: string;
  pais: string;
}

export default function VerifyOrderPage() {
  const { items, removeFromCart, isEmpty } = useCart();
  const isAllowed = useCheckoutProtection();
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    const savedFormData = sessionStorage.getItem("checkoutFormData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  // Si el carrito está vacío, no renderizar el contenido
  if (!isAllowed || isEmpty) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Carrito vacío</h2>
          <p className="text-gray-600 mb-6">
            No puedes proceder a la verificación final sin productos en tu
            carrito.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePlaceOrder = () => {
    if (!formData) return;

    // Crear el mensaje para WhatsApp
    let mensaje = "*Nuevo Pedido*\n\n";

    // Información del cliente
    mensaje += "*Información de Envío*\n";
    mensaje += `Nombre: ${formData.nombres} ${formData.apellidos}\n`;
    mensaje += `Dirección: ${formData.direccion}\n`;
    if (formData.direccion2) mensaje += `${formData.direccion2}\n`;
    mensaje += `Ciudad: ${formData.ciudad}\n`;
    mensaje += `Código Postal: ${formData.codigoPostal}\n`;
    mensaje += `Teléfono: ${formData.numeroCelular}\n`;
    mensaje += `País: ${
      formData.pais === "CO" ? "Colombia" : formData.pais
    }\n\n`;

    // Detalles de los productos
    mensaje += "*Productos*\n";
    items.forEach((item) => {
      mensaje += `• ${item.title}\n`;
      mensaje += `  Cantidad: ${item.quantity}\n`;
      mensaje += `  Precio: ${formatPrice(item.price)}\n`;
      if (item.selectedColor) mensaje += `  Color: ${item.selectedColor}\n`;
      mensaje += `  Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;
    });

    // Resumen del pedido
    mensaje += "*Resumen del Pedido*\n";
    mensaje += `Subtotal: ${formatPrice(subtotal)}\n`;
    mensaje += `Envío: ${formatPrice(shipping)}\n`;
    mensaje += `Total: ${formatPrice(total)}\n`;

    // Codificar el mensaje para la URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Número de WhatsApp del vendedor
    const numeroWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; // Formato: código de país + número

    // Crear el enlace de WhatsApp
    const whatsappUrl = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

    // Limpiar el carrito y los datos del formulario
    items.forEach((item) => removeFromCart(item.slug));
    sessionStorage.removeItem("checkoutFormData");

    // Redirigir a WhatsApp
    window.location.href = whatsappUrl;
  };

  if (!formData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Por favor complete sus datos de envío
        </h2>
        <Link
          href="/checkout"
          className="bg-pink-500 text-white py-3 px-6 rounded-md hover:bg-pink-600 transition-colors inline-block"
        >
          Volver al formulario
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Verificar Orden</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Ajustar productos</h3>
              <Link href="/cart" className="text-pink-500 hover:underline">
                Editar carrito
              </Link>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white p-4 rounded-lg shadow"
                >
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-gray-600">
                      ${item.price} X{item.quantity}
                    </p>
                    <p className="font-semibold">
                      Subtotal: {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">
                Dirección de la entrega
              </h3>
              <div className="space-y-2">
                <p>
                  {formData.nombres} {formData.apellidos}
                </p>
                <p>{formData.direccion}</p>
                {formData.direccion2 && <p>{formData.direccion2}</p>}
                <p>{formData.ciudad}</p>
                <p>CP {formData.codigoPostal}</p>
                <p>{formData.numeroCelular}</p>
                <p>{formData.pais === "CO" ? "Colombia" : formData.pais}</p>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  Información de la orden
                </h3>
                <div className="space-y-2">
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
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Al hacer clic en &apos;Subir Orden&apos;, aceptas nuestros{" "}
                    <Link
                      href="/terminos"
                      className="text-pink-500 hover:underline"
                    >
                      Términos y Condiciones
                    </Link>{" "}
                    y{" "}
                    <Link
                      href="/privacidad"
                      className="text-pink-500 hover:underline"
                    >
                      Políticas de Privacidad
                    </Link>
                  </p>
                  <button
                    className="w-full bg-pink-500 text-white py-3 px-6 rounded-md hover:bg-pink-600 transition-colors text-lg"
                    onClick={handlePlaceOrder}
                  >
                    Subir Orden
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
