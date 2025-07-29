"use client";

import { useCart } from "@/context/cart/CartContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useCheckoutProtection = () => {
  const { isEmpty } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (isEmpty) {
      router.replace('/products');
    }
  }, [isEmpty, router]);

  return !isEmpty;
};