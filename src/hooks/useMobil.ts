import { useCategoryProducts } from "@/src/hooks/useCategoryProducts";

const CATEGORY_KEY = "mobil" as const;
const CATEGORY_TYPES = ["City Car", "SUV", "MPV", "Sedan"];

export const useMobil = () =>
  useCategoryProducts({
    categoryKey: CATEGORY_KEY,
    carTypes: CATEGORY_TYPES,
    emptyMessage: "Belum ada mobil yang terdaftar di database.",
  });
