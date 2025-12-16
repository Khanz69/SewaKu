import type { ProductCategoryKey } from "@/src/constants/productCategories";
import type { ProductImageField } from "@/src/utils/productImage";

export type Transmission = "Manual" | "Automatic";
export type CarType = "City Car" | "SUV" | "MPV" | "Sedan";

export interface Product {
  id: string;
  name: string;
  pricePerDay: number;     // harga per hari (angka)
  lokasi: string;
  image?: ProductImageField;
  transmission?: Transmission;
  seats?: number;
  bagCapacity?: string;
  carType?: CarType;
  plateNumber?: string;
  description?: string;
  createdAt: number;
  resource?: string;
  categoryKey?: ProductCategoryKey;
}
