"use client";

import { useCallback, useRef, useState, useEffect } from 'react';
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import { DotButton, useDotButton } from './components/TestimonialsDotButton';
import { PrevButton, NextButton, usePrevNextButtons } from './components/TestimonialsButtons';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { TestimonialCard } from "./components/TestimonialCard";
import { useTestimonials } from "@/hooks/useTestimonials";

type PropType = {
  options?: EmblaOptionsType;
};

export const Testimonials = ({ options }: PropType = {}) => {
  const { testimonials, loading, error } = useTestimonials();

  // Filtramos las testimonios que tienen contenido
  const availableTestimonials = testimonials.filter(
    (item) => item.author && item.text
  );

  const [slidesInView, setSlidesInView] = useState<number[]>([]);

  const autoplayRef = useRef(
    Autoplay({ delay: 9000, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      ...options, 
      loop: true,
      duration: 30,
      align: 'center',
      slidesToScroll: 1,
      containScroll: 'trimSnaps'
    },
    [autoplayRef.current]
  );

  const updateSlidesInView = useCallback((emblaApi: EmblaCarouselType) => {
    setSlidesInView((slidesInView) => {
      if (slidesInView.length === emblaApi.slideNodes().length) {
        emblaApi.off('slidesInView', updateSlidesInView);
      }
      const inView = emblaApi
        .slidesInView()
        .filter((index) => !slidesInView.includes(index));
      return slidesInView.concat(inView);
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    updateSlidesInView(emblaApi);
    emblaApi.on('slidesInView', updateSlidesInView);
    emblaApi.on('reInit', updateSlidesInView);
  }, [emblaApi, updateSlidesInView]);

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

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );

  // Estados de carga - manteniendo los estilos existentes
  if (loading) {
    return (
      <div className="w-full py-16 sm:py-20 relative">
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">
          Testimonios
        </h2>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <span className="text-lg text-gray-600">Cargando testimonios...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-16 sm:py-20 relative">
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">
          Testimonios
        </h2>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="text-red-500 text-center">
            <p className="text-lg mb-2">Error al cargar testimonios:</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2 text-gray-600">Mostrando testimonios de respaldo</p>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay testimonios disponibles, no renderizar nada
  if (availableTestimonials.length === 0) return null;

  return (
    <div className="w-full py-16 sm:py-20 relative">
      <h2 className="text-2xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">
        Testimonios
      </h2>

      {/* Contenedor principal con altura automática */}
      <div className="relative flex items-center justify-center px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="overflow-hidden w-full" ref={emblaRef}>
          <div className="flex">
            {availableTestimonials.map((item, index) => (
              <div 
                key={item.id} 
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-3 sm:px-4"
              >
                <div 
                  className={`flex justify-center items-start py-8 sm:py-12 transition-all duration-700 ease-in-out ${
                    index === selectedIndex
                      ? "opacity-100 scale-100 blur-none z-20" 
                      : "opacity-50 scale-75 blur-sm z-10"
                  }`}
                  style={{
                    filter: index === selectedIndex ? 'blur(0px)' : 'blur(3px)',
                    transform: index === selectedIndex ? 'scale(1)' : 'scale(0.75)',
                  }}
                >
                  <div className="max-w-sm w-full">
                    <TestimonialCard {...item} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons - Solo mostrar si hay más de un testimonio */}
        {availableTestimonials.length > 1 && (
          <>
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </>
        )}
      </div>

      {/* Dot Navigation - Solo se muestra si hay más de un testimonio */}
      {availableTestimonials.length > 1 && (
        <div className="flex justify-center mt-8 sm:mt-12">
          <div className="flex space-x-2 z-30">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? "bg-400dn" : "bg-800dn"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};