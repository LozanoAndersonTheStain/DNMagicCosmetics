import { useState, useEffect } from 'react';
import { TestimonialItem } from '@/interfaces';

interface UseTestimonialsReturn {
  testimonials: TestimonialItem[];
  loading: boolean;
  error: string | null;
}

export function useTestimonials(): UseTestimonialsReturn {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/testimonials');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setTestimonials(data);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        console.error('Error al cargar testimonios:', err);
        
        // Fallback a testimonios estáticos en caso de error
        const { testimonialItems } = await import('@/seed/testimonialItem');
        setTestimonials(testimonialItems);
        
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading, error };
}