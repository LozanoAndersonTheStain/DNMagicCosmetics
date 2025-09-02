"use client";

import { useEffect, useRef, useState } from 'react';
import { useIOSDetection } from '@/hooks/useIOSDetection';

interface TouchHandlerProps {
  children: React.ReactNode;
  onTouchStart?: (e: TouchEvent) => void;
  onTouchMove?: (e: TouchEvent) => void;
  onTouchEnd?: (e: TouchEvent) => void;
  
  // ✅ Gestos específicos para tu tienda
  onSwipeLeft?: () => void;           // Siguiente producto
  onSwipeRight?: () => void;          // Producto anterior
  onDoubleTap?: () => void;           // Zoom rápido en imágenes
  onPinchZoom?: (scale: number) => void; // Zoom con pellizco
  onLongPress?: () => void;           // Añadir a favoritos
  
  className?: string;
  disabled?: boolean;
  
  // ✅ Configuraciones específicas
  enableSwipe?: boolean;              // Para carousels
  enableZoom?: boolean;               // Para imágenes de productos
  enableLongPress?: boolean;          // Para acciones secundarias
  swipeThreshold?: number;            // Sensibilidad del swipe
}

export const TouchHandler: React.FC<TouchHandlerProps> = ({
  children,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onSwipeLeft,
  onSwipeRight,
  onDoubleTap,
  onPinchZoom,
  onLongPress,
  className = '',
  disabled = false,
  enableSwipe = true,
  enableZoom = false,
  enableLongPress = false,
  swipeThreshold = 50,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isIOS, isSafari } = useIOSDetection();
  
  // ✅ Estados para gestos avanzados
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);

  // ✅ Calcular distancia entre dos puntos (para pinch zoom)
  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const now = Date.now();
      
      setTouchStart({ 
        x: touch.clientX, 
        y: touch.clientY, 
        time: now 
      });

      // ✅ Detectar pinch zoom (2 dedos)
      if (enableZoom && e.touches.length === 2) {
        const distance = getDistance(e.touches[0], e.touches[1]);
        setInitialPinchDistance(distance);
        e.preventDefault(); // Prevenir zoom nativo en iOS
      }

      // ✅ Iniciar timer para long press
      if (enableLongPress && onLongPress) {
        const timer = setTimeout(() => {
          onLongPress();
          setLongPressTimer(null);
        }, 500); // 500ms para long press
        setLongPressTimer(timer);
      }

      onTouchStart?.(e);
    };

    const handleTouchMove = (e: TouchEvent) => {
      // ✅ Cancelar long press si hay movimiento
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }

      // ✅ Manejar pinch zoom
      if (enableZoom && e.touches.length === 2 && initialPinchDistance && onPinchZoom) {
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const scale = currentDistance / initialPinchDistance;
        onPinchZoom(scale);
        e.preventDefault();
        return;
      }

      // ✅ Prevenir scroll en iOS cuando sea necesario
      if (isIOS && enableSwipe && e.touches.length === 1) {
        e.preventDefault();
      }

      onTouchMove?.(e);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // ✅ Limpiar long press timer
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }

      // ✅ Reset pinch zoom
      if (enableZoom && e.touches.length === 0) {
        setInitialPinchDistance(null);
      }

      // ✅ Procesar gestos
      if (touchStart && e.touches.length === 0) {
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;
        const deltaTime = Date.now() - touchStart.time;
        
        // ✅ Detectar swipes (solo si está habilitado)
        if (enableSwipe && Math.abs(deltaX) > swipeThreshold && Math.abs(deltaY) < 100) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        }
        
        // ✅ Detectar doble tap (solo para movimientos pequeños)
        if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
          const now = Date.now();
          if (now - lastTap < 300 && onDoubleTap) {
            onDoubleTap();
          }
          setLastTap(now);
        }
        
        setTouchStart(null);
      }
      
      onTouchEnd?.(e);
    };

    // ✅ Opciones optimizadas para iOS Safari
    const touchStartOptions = { passive: !enableZoom };
    const touchMoveOptions = { passive: !(isIOS && (enableSwipe || enableZoom)) };
    const touchEndOptions = { passive: true };
    
    container.addEventListener('touchstart', handleTouchStart, touchStartOptions);
    container.addEventListener('touchmove', handleTouchMove, touchMoveOptions);
    container.addEventListener('touchend', handleTouchEnd, touchEndOptions);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [
    onTouchStart, onTouchMove, onTouchEnd, onSwipeLeft, onSwipeRight, 
    onDoubleTap, onPinchZoom, onLongPress, disabled, isIOS, enableSwipe, 
    enableZoom, enableLongPress, swipeThreshold, touchStart, lastTap, 
    longPressTimer, initialPinchDistance
  ]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: disabled ? 'auto' : 
                    enableZoom ? 'none' : 
                    enableSwipe ? 'pan-y' : 'manipulation',
        userSelect: 'none',
        // ✅ Mejorar rendimiento en iOS
        transform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
      }}
    >
      {children}
    </div>
  );
};