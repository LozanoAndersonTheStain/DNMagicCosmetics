import React, {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState
} from 'react';
import { EmblaCarouselType } from 'embla-carousel';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
  onButtonClick?: (emblaApi: EmblaCarouselType) => void
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    if (onButtonClick) onButtonClick(emblaApi);
  }, [emblaApi, onButtonClick]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    if (onButtonClick) onButtonClick(emblaApi);
  }, [emblaApi, onButtonClick]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  };
};

type PropType = ComponentPropsWithRef<'button'>;

export const PrevButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className="absolute left-1 sm:left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-md hover:shadow-lg transition-all duration-300 z-30 disabled:opacity-50 disabled:cursor-not-allowed border border-pink-100"
      type="button"
      {...restProps}
    >
      <IoIosArrowBack 
        size={16} 
        className="text-500dn sm:hidden" 
      />
      <IoIosArrowBack 
        size={20} 
        className="hidden sm:block lg:hidden text-500dn" 
      />
      <IoIosArrowBack 
        size={24} 
        className="hidden lg:block text-500dn" 
      />
    </button>
  );
};

export const NextButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className="absolute right-1 sm:right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-md hover:shadow-lg transition-all duration-300 z-30 disabled:opacity-50 disabled:cursor-not-allowed border border-pink-100"
      type="button"
      {...restProps}
    >
      <IoIosArrowForward 
        size={16} 
        className="text-500dn sm:hidden" 
      />
      <IoIosArrowForward 
        size={20} 
        className="hidden sm:block lg:hidden text-500dn" 
      />
      <IoIosArrowForward 
        size={24} 
        className="hidden lg:block text-500dn" 
      />
    </button>
  );
};