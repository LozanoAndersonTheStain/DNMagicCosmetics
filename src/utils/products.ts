import { getGoogleSheets } from "./googleSheets";
import {
  SeedProduct,
  ValidSizes,
  ValidTypes,
  ColorVariant,
} from "../seed/seed";

export async function getProducts(): Promise<SeedProduct[]> {
  try {
    const doc = await getGoogleSheets();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const products = rows.map((row, index) => {
      // Procesar imágenes - agregar la ruta completa y validar
      const imagesData = row.get("images") as string;
      const images =
        imagesData
          ?.split(",")
          .map((img) => img.trim())
          .filter((img) => img && img.length > 0) // ← Filtrar imágenes vacías
          .map((img) => `/assets/products/${img}`) || [];

      // Procesar variantes de color si existen
      let colorVariants: ColorVariant[] | undefined;
      const colorVariantsData = row.get("colorVariants") as string;

      if (colorVariantsData && colorVariantsData.trim()) {
        colorVariants = colorVariantsData.split(";").map((variant) => {
          const [color, imagesStr, stockStr] = variant.split("|");
          return {
            color: color?.trim() || "",
            images:
              imagesStr
                ?.split(",")
                .map((img) => img.trim())
                .filter((img) => img && img.length > 0)
                .map((img) => `/assets/products/${img}`) || [],
            inStock: parseInt(stockStr?.trim() || "0"),
          };
        });
      }

      return {
        title: (row.get("title") as string) || `Producto ${index + 1}`,
        description: (row.get("description") as string) || "",
        price: parseFloat(row.get("price") as string) || 0,
        images,
        slug: (row.get("slug") as string) || `producto-${index}`,
        tags:
          (row.get("tags") as string)
            ?.split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag) || [],
        type: (row.get("type") as ValidTypes) || "shirts",
        inStock: parseInt(row.get("inStock") as string) || 0,
        sizes:
          ((row.get("sizes") as string)
            ?.split(",")
            .map((size) => size.trim())
            .filter((size) => size) as ValidSizes[]) || [],
        gender:
          (row.get("gender") as "men" | "women" | "kid" | "unisex") || "unisex",
        colorVariants,
      };
    });

    // Ordenar productos alfabéticamente por título y filtrar duplicados
    const uniqueProducts = products.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.slug === product.slug)
    );

    return uniqueProducts.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}
