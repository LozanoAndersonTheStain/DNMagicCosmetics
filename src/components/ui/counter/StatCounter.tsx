"use client";

import { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';

interface StatCounterProps {
  value: string;
  delay?: number;
}

export const StatCounter = ({ value, delay = 0 }: StatCounterProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [numericValue, setNumericValue] = useState(0);
  const [suffix, setSuffix] = useState('');
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Extraer número de forma segura
    if (value && typeof value === 'string') {
      const match = value.match(/^(\d+)(.*)$/);
      if (match) {
        setNumericValue(parseInt(match[1], 10));
        setSuffix(match[2] || '');
      }
    }

    // Intersection Observer para activar la animación solo cuando sea visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value]);

  // Renderizado del lado del servidor
  if (!isClient) {
    return (
      <span className="inline-block min-w-[3ch]">
        {value}
      </span>
    );
  }

  // Si no hay valor numérico válido, mostrar valor original
  if (numericValue <= 0) {
    return (
      <span className="inline-block min-w-[3ch]">
        {value}
      </span>
    );
  }

  return (
    <span ref={elementRef} className="inline-block min-w-[3ch]">
      {isVisible ? (
        <CountUp
          start={0}
          end={numericValue}
          duration={2.5}
          delay={delay}
          preserveValue
          useEasing={true}
          useGrouping={true}
          suffix={suffix}
        />
      ) : (
        <span>0{suffix}</span>
      )}
    </span>
  );
};