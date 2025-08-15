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
    
    if (value && typeof value === 'string') {
      
      // Remover cualquier caracter no numérico al inicio y extraer número
      const cleanValue = value.trim();
      const match = cleanValue.match(/(\d+)/); // Buscar cualquier secuencia de dígitos
      
      if (match) {
        const number = parseInt(match[1], 10);
        const restOfString = cleanValue.replace(match[1], '');

        setNumericValue(number);
        setSuffix(restOfString);
      } else {
        setNumericValue(0);
        setSuffix(value);
      }
    }

    // ✅ MEJORADO: Intersection Observer más permisivo
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { 
        threshold: 0.1, // Cuando el 10% del elemento sea visible
        rootMargin: '50px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value]);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!isVisible && isClient) {
        setIsVisible(true);
      }
    }, 2000);

    return () => clearTimeout(fallbackTimer);
  }, [isVisible, isClient]);

  // Renderizado del lado del servidor
  if (!isClient) {
    return (
      <span className="inline-block min-w-[3ch]">
        0
      </span>
    );
  }

  // Si no hay valor numérico válido, mostrar valor original
  if (numericValue <= 0) {
    return (
      <span className="inline-block min-w-[3ch]">
        {value || '0'}
      </span>
    );
  }

  return (
    <span ref={elementRef} className="inline-block min-w-[3ch]">
      {isVisible ? (
        <CountUp
          start={0}
          end={numericValue}
          duration={3.5}
          delay={delay}
          preserveValue
          useEasing={true}
          useGrouping={false}
          suffix={suffix}
          onStart={() => console.log('🚀 CountUp iniciado')} // Debug
          onEnd={() => console.log('🏁 CountUp terminado')} // Debug
        />
      ) : (
        <span>0{suffix}</span>
      )}
    </span>
  );
};