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
      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 hover:bg-white/80 rounded-full p-1 sm:p-2 transition-all duration-300 z-10 disabled:opacity-50"
      type="button"
      {...restProps}
    >
      <IoIosArrowBack size={20} className="text-500dn sm:hidden" />
      <IoIosArrowBack size={30} className="hidden sm:block text-500dn" />
    </button>
  );
};

export const NextButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 hover:bg-white/80 rounded-full p-1 sm:p-2 transition-all duration-300 z-10 disabled:opacity-50"
      type="button"
      {...restProps}
    >
      <IoIosArrowForward size={20} className="text-500dn sm:hidden" />
      <IoIosArrowForward size={30} className="hidden sm:block text-500dn" />
    </button>
  );
};