"use client"

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/interfaces';

interface UseInfiniteScrollProps {
  products: Product[];
  itemsPerPage?: number;
}

export const useInfiniteScroll = ({ products, itemsPerPage = 8 }: UseInfiniteScrollProps) => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar con los primeros productos
  useEffect(() => {
    if (products.length > 0) {
      const initialProducts = products.slice(0, itemsPerPage);
      setDisplayedProducts(initialProducts);
      setHasMore(products.length > itemsPerPage);
    }
  }, [products, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simular un pequeño delay para una mejor UX
    setTimeout(() => {
      const currentLength = displayedProducts.length;
      const nextProducts = products.slice(currentLength, currentLength + itemsPerPage);
      
      if (nextProducts.length > 0) {
        setDisplayedProducts(prev => [...prev, ...nextProducts]);
        setHasMore(currentLength + nextProducts.length < products.length);
      } else {
        setHasMore(false);
      }
      
      setIsLoading(false);
    }, 300);
  }, [products, displayedProducts.length, itemsPerPage, isLoading, hasMore]);

  // Detectar cuando el usuario llega al final de la página
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  return {
    displayedProducts,
    hasMore,
    isLoading,
    loadMore
  };
};