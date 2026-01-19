import { PRODUCT_CATEGORIES } from "@/src/constants/productCategories";
import { productRepository } from "@/src/repositories/productRepository";
import { Product } from "@/src/types/product";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

const FILTER_OPTIONS = [
  { key: "all", label: "Semua Kategori" },
  ...PRODUCT_CATEGORIES.map((category) => ({
    key: category.key,
    label: category.label,
  })),
];

type FilterKey = typeof FILTER_OPTIONS[number]["key"];

type UseUserProductsResult = {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  selectedCategory: FilterKey;
  setSelectedCategory: (key: FilterKey) => void;
  reload: () => Promise<void>;
  filterOptions: typeof FILTER_OPTIONS;
};

export const useUserProducts = (): UseUserProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FilterKey>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rawUser = await AsyncStorage.getItem("@sewaku_user");
      if (!rawUser) {
        setProducts([]);
        return;
      }
      const user = JSON.parse(rawUser) as { id?: string };
      if (!user?.id) {
        setProducts([]);
        return;
      }

      const response = await productRepository.getAll();
      const mine = response.filter((product) => product.sellerId === user.id);
      setProducts(mine);
    } catch (globalError) {
      console.warn("Gagal memuat daftar produk:", globalError);
      setError("Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((product) => product.categoryKey === selectedCategory);
  }, [products, selectedCategory]);

  return {
    products,
    filteredProducts,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    reload: loadProducts,
    filterOptions: FILTER_OPTIONS,
  };
};
