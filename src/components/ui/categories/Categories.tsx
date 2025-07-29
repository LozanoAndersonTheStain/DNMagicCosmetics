"use client";

import { useCallback, useRef } from 'react';
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import { PrevButton, NextButton, usePrevNextButtons } from './components/CategoriesButtons';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { categoryItems } from "@/seed";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";

type PropType = {
  options?: EmblaOptionsType;
};

export const Categories = ({ options }: PropType = {}) => {
  const { products, loading, error } = useProducts();

  // Filtramos las categorías que tienen contenido
  const availableCategories = categoryItems.filter(
    (item) => item.icon && item.name
  );

  const autoplayRef = useRef(
    Autoplay({ delay: 8000, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      ...options, 
      loop: true,
      duration: 30,
      align: 'start',
      slidesToScroll: 1,
      containScroll: 'trimSnaps',
      breakpoints: {
        '(min-width: 640px)': { slidesToScroll: 2 },
        '(min-width: 768px)': { slidesToScroll: 3 },
        '(min-width: 1024px)': { slidesToScroll: 4 },
      }
    },
    [autoplayRef.current]
  );

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi, onNavButtonClick);

  // Renderizar estados de carga
  if (loading) {
    return (
      <div className="w-full py-12 bg-300dn">
        <div className="flex justify-center items-center">
          <div className="text-lg text-gray-600">Cargando categorías...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 bg-300dn">
        <div className="flex justify-center items-center">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  // No mostrar nada si no hay categorías disponibles
  if (availableCategories.length === 0) return null;

  return (
    <div className="w-full py-12 sm:py-16 bg-300dn relative">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
        Lo que tenemos para ti
      </h2>

      <div className="relative px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {availableCategories.map((item) => (
              <div 
                key={item.id}
                className="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 px-2 sm:px-3"
              >
                <Link
                  href={`/category/${item.id}`}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-50">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base font-medium text-center text-gray-800 group-hover:text-500dn transition-colors duration-300 line-clamp-2">
                    {item.name}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons - Solo mostrar si hay más categorías que las visibles */}
        {availableCategories.length > 4 && (
          <>
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </>
        )}
      </div>
    </div>
  );
};