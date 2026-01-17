import { useCategoryProducts } from "@/src/hooks/useCategoryProducts";

const CATEGORY_KEY = "motor" as const;
const CATEGORY_TYPES = ["Sports", "Skuter", "Touring", "Cruiser", "Matic"];

export const useMotor = () =>
  useCategoryProducts({
    categoryKey: CATEGORY_KEY,
    carTypes: CATEGORY_TYPES,
    emptyMessage: "Motor tidak tersedia di saat ini.",
  });
