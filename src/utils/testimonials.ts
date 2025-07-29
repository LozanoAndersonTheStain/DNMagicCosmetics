import { getGoogleSheets } from './googleSheets';
import { TestimonialItem } from '@/interfaces';

export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const doc = await getGoogleSheets();
    
    // Buscar la hoja de testimonios por nombre
    const sheet = doc.sheetsByTitle['Testimonios'] || doc.sheetsByIndex[1];
    
    if (!sheet) {
      console.warn('No se encontró la hoja de testimonios');
      return [];
    }

    const rows = await sheet.getRows();

    return rows.map(row => ({
      id: parseInt(row.get('id') as string) || 0,
      text: (row.get('text') as string || '').trim(),
      author: (row.get('author') as string || '').trim(),
      location: (row.get('location') as string || '').trim(),
      highlight: (row.get('highlight') as string || '').trim(),
    })).filter(testimonial => 
      testimonial.text && 
      testimonial.author && 
      testimonial.id > 0
    ); // Filtrar testimonios válidos
    
  } catch (error) {
    console.error('Error al obtener testimonios desde Google Sheets:', error);
    
    // Fallback a testimonios estáticos
    const { testimonialItems } = await import('@/seed/testimonialItem');
    return testimonialItems;
  }
}