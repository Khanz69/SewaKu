import type {
    ProductCategoryKey as ImportedCategoryKey,
} from "@/src/constants/productCategories";
import type { ProductImageField } from "@/src/utils/productImage";

export type ProductCategoryKey = ImportedCategoryKey;
export type Transmission = "Manual" | "Automatic";

export const SUBCATEGORY_OPTIONS = [
  "City Car",
  "SUV",
  "MPV",
  "Sedan",
  "Sports",
  "Skuter",
  "Touring",
  "Cruiser",
  "Matic",
  "Excavator",
  "Loader",
  "Compactor",
  "Mixer",
  "Generator",
  "Pariwisata",
  "Mewah",
  "Medium",
  "Mini",
  "VIP",
  "Pickup",
  "Truck",
  "Box",
  "Double Cabin",
  "Tangki",
  "Sepeda",
  "Perahu",
  "Pesawat",
  "ATV/Roda Tiga",
  "Rekreasi",
] as const;

export type SubCategory = (typeof SUBCATEGORY_OPTIONS)[number];

export interface Product {
  id: string;
  name: string;
  pricePerDay: number;
  lokasi: string;
  image?: ProductImageField;
  transmission?: Transmission;
  seats?: number;
  bagCapacity?: string;
  subCategory?: SubCategory;
  plateNumber?: string;
  description?: string;
  createdAt: number;
  categoryKey: ProductCategoryKey;
}
