import { getGoogleSheets } from './googleSheets';
import { SeedProduct, ValidSizes, ValidTypes, ColorVariant } from '../seed/seed';

export async function getProducts(): Promise<SeedProduct[]> {
  try {
    const doc = await getGoogleSheets();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    return rows.map(row => {
      // Procesar imágenes - agregar la ruta completa
      const imagesData = row.get('images') as string;
      const images = imagesData?.split(',').map(img => `/assets/products/${img.trim()}`) || [];

      // Procesar variantes de color si existen
      let colorVariants: ColorVariant[] | undefined;
      const colorVariantsData = row.get('colorVariants') as string;
      
      if (colorVariantsData && colorVariantsData.trim()) {
        colorVariants = colorVariantsData.split(';').map(variant => {
          const [color, imagesStr, stockStr] = variant.split('|');
          return {
            color: color.trim(),
            images: imagesStr.split(',').map(img => `/assets/products/${img.trim()}`),
            inStock: parseInt(stockStr.trim())
          };
        });
      }

      return {
        title: row.get('title') as string,
        description: row.get('description') as string,
        price: parseFloat(row.get('price') as string),
        images,
        slug: row.get('slug') as string,
        tags: (row.get('tags') as string)?.split(',').map(tag => tag.trim()) || [],
        type: row.get('type') as ValidTypes,
        inStock: parseInt(row.get('inStock') as string),
        sizes: (row.get('sizes') as string)?.split(',').map(size => size.trim()) as ValidSizes[] || [],
        gender: row.get('gender') as "men" | "women" | "kid" | "unisex",
        colorVariants
      };
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}