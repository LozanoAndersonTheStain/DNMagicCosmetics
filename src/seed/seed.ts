export interface ColorVariant {
  color: string;
  images: string[];
  inStock: number;
}

export interface SeedProduct {
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: ValidSizes[];
  slug: string;
  tags: string[];
  title: string;
  type: ValidTypes;
  gender: "men" | "women" | "kid" | "unisex";
  colorVariants?: ColorVariant[];
}

export type ValidSizes =
  | "3ml"
  | "10ml"
  | "13ml"
  | "15ml"
  | "20ml"
  | "30ml"
  | "35ml"
  | "40ml"
  | "45ml"
  | "50ml"
  | "55ml"
  | "59ml"
  | "60ml"
  | "70ml"
  | "75ml"
  | "80ml"
  | "90ml"
  | "100ml"
  | "105ml"
  | "110ml"
  | "115ml"
  | "120ml"
  | "125ml"
  | "130ml"
  | "140ml"
  | "145ml"
  | "150ml"
  | "160ml"
  | "180ml"
  | "190ml"
  | "200ml"
  | "210ml"
  | "220ml"
  | "230ml"
  | "240ml"
  | "250ml"
  | "255ml"
  | "260ml"
  | "290ml"
  | "300ml"
  | "350ml"
  | "400ml"
  | "450ml"
  | "500ml"
  | "515ml"
  | "600ml"
  | "650ml"
  | "1000ml"
  | "3.5g"
  | "4.8g"
  | "10g"
  | "10.5g"
  | "20g"
  | "25g"
  | "26g"
  | "30g"
  | "35g"
  | "40g"
  | "45g"
  | "50g"
  | "60g"
  | "80g"
  | "100g"
  | "120g"
  | "150g"
  | "170g"
  | "200g"
  | "220g"
  | "250g"
  | "300g"
  | "unitario"
  | "set";

export type ValidTypes =
  | "accesorios"
  | "cuidado-capilar"
  | "cuidado-facial"
  | "piel"
  | "unas"
  | "brochas"
  | "labios"
  | "ojos";

export interface SeedData {
  products: SeedProduct[];
}

// Datos seguros en caso de que falle la conexión con Google Sheets
export const initialData: SeedData = {
  products: [],
};
