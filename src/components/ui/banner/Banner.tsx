"use client";

import { useCallback, useEffect, useRef } from 'react';
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import { DotButton, useDotButton } from './BannerDotButton';
import { PrevButton, NextButton, usePrevNextButtons } from './BannerArrowButtons';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from "next/image";
import { bannerItems } from "@/seed/bannerItem";

type PropType = {
  options?: EmblaOptionsType;
};

export const Banner = ({ options }: PropType) => {
  const autoplayRef = useRef(
    Autoplay({ delay: 8000, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      ...options, 
      loop: true,
      duration: 30,
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

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );

  return (
    <section className="w-screen h-[180px] sm:h-[200px] md:h-[220px] lg:h-[260px] overflow-hidden relative ml-[calc(-50vw+49.5%)] z-0">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {bannerItems.map((item, index) => (
            <div className="flex-[0_0_100%] min-w-0 relative" key={item.id}>
              <div className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[260px] relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority={index === 0}
                  quality={75}
                  sizes="100vw"
                  className="object-cover"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  loading={index === 0 ? "eager" : "lazy"}
                />
                
                {/* Texto superpuesto */}
                <div className="absolute top-1/4 sm:top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-[95%] sm:w-[90%] md:w-4/5">
                  <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-4 text-gray-800 drop-shadow-sm">
                    {item.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 px-4 sm:px-0 drop-shadow-sm">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />

      {/* Dot Navigation */}
      <div className="absolute bottom-2 sm:bottom-4 left-[85%] transform -translate-x-1/2 flex space-x-1 sm:space-x-2 z-10 backdrop-blur-sm bg-white/30 rounded-full px-2 sm:px-3 py-1 sm:py-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={`dot-${index}`}
            onClick={() => onDotButtonClick(index)}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 hover:scale-125 ${
              index === selectedIndex ? "bg-400dn" : "bg-800dn"
            }`}
          />
        ))}
      </div>
    </section>
  );
};