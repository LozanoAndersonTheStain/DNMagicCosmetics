"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { SeedProduct } from "@/seed/seed";

interface ProductsContextType {
  products: SeedProduct[];
  loading: boolean;
  error: string | null;
  refetchProducts: () => Promise<void>;
  clearCache: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

// Cache global para productos
let productsCache: SeedProduct[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 10 * 60 * 1000;

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<SeedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchProducts = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      if (!isMounted) return;

      // Verificar si hay caché válido y no es refresh forzado
      const now = Date.now();
      if (
        !forceRefresh &&
        productsCache &&
        cacheTimestamp &&
        now - cacheTimestamp < CACHE_DURATION
      ) {
        setProducts(productsCache);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/products", {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error("Error al obtener productos");
      }
      
      const data = await response.json();

      // Actualizar caché
      productsCache = data;
      cacheTimestamp = now;

      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");

      // Si hay caché disponible, usarlo como fallback
      if (productsCache) {
        setProducts(productsCache);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    productsCache = null;
    cacheTimestamp = null;
  };

  const refetchProducts = () => fetchProducts(true);

  useEffect(() => {
    if (isMounted) {
      fetchProducts();
    }
  }, [isMounted]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        refetchProducts,
        clearCache,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};