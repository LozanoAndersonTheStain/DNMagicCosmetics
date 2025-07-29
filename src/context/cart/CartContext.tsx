"use client";

import { CartItem } from "@/interfaces";
import { createContext, useContext, useEffect, useState } from "react";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  isEmpty: boolean;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Función para actualizar las cookies
  const updateCartCookie = (cartItems: CartItem[]) => {
    if (typeof window !== 'undefined') {
      const itemSlugs = cartItems.map(item => item.slug);
      document.cookie = `cart-items=${JSON.stringify(itemSlugs)}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 días
    }
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setItems(parsedCart);
      updateCartCookie(parsedCart);
    }
  }, []);

  const addToCart = (product: any, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.slug === product.slug);

      let newItems;
      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          ...product,
          quantity,
        };
        newItems = [...prevItems, newItem];
      }

      localStorage.setItem("cart", JSON.stringify(newItems));
      updateCartCookie(newItems);
      return newItems;
    });
  };

  const removeFromCart = (slug: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.slug !== slug);
      localStorage.setItem("cart", JSON.stringify(newItems));
      updateCartCookie(newItems);
      return newItems;
    });
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(slug);
      return;
    }

    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.slug === slug ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(newItems));
      updateCartCookie(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
    updateCartCookie([]);
  };

  const isEmpty = items.length === 0;
  
  // Calcular el número total de productos en el carrito
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isEmpty,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};