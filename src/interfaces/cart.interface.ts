import { Product } from "./product.interface";

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
}