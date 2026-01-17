import { ProductCategoryKey } from "@/src/constants/productCategories";
import { productRepository } from "@/src/repositories/productRepository";
import { Car } from "@/src/types/car";
import { Product } from "@/src/types/product";
import { resolveProductImage } from "@/src/utils/productImage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageSourcePropType } from "react-native";

const placeholderImage = require("@/assets/images/audi.jpg");

const buildCar = (product: Product): Car => ({
  id: product.id,
  name: product.name,
  price: `Rp${product.pricePerDay.toLocaleString("id-ID")} / hari`,
  pricePerDay: product.pricePerDay,
  code: product.plateNumber ?? product.id,
  location: product.lokasi,
  image:
    resolveProductImage(product.image, placeholderImage as ImageSourcePropType) ??
    (placeholderImage as ImageSourcePropType),
  imageName: typeof product.image === "string" ? product.image : "",
  subCategory: product.subCategory,
  transmission: product.transmission,
  description: product.description,
  seats: product.seats,
  bagCapacity: product.bagCapacity,
});

type UseCategoryProductsOptions = {
  categoryKey: ProductCategoryKey;
  carTypes?: string[];
  emptyMessage?: string;
};

export const useCategoryProducts = ({
  categoryKey,
  carTypes: carTypeList = [],
  emptyMessage,
}: UseCategoryProductsOptions) => {
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const carTypes = useMemo(() => {
    const normalized = new Set<string>();
    const ordered: string[] = [];
    const add = (value?: string) => {
      const trimmed = value?.trim();
      if (!trimmed || normalized.has(trimmed)) return;
      normalized.add(trimmed);
      ordered.push(trimmed);
    };
    carTypeList.forEach(add);
    return ["All", ...ordered];
  }, [carTypeList]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const products = await productRepository.getAll();
      if (!mountedRef.current) return;
      const categoryProducts = products.filter((product) => product.categoryKey === categoryKey);
      const mapped = categoryProducts.map(buildCar);
      setCars(mapped);
      if (!mapped.length) {
        setError(emptyMessage ?? "Belum ada data yang terdaftar di database.");
      }
    } catch (err) {
      console.warn(`⚠️ Gagal memuat daftar ${categoryKey}:`, err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Gagal memuat data kategori ini.");
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [categoryKey, emptyMessage]);

  useEffect(() => {
    mountedRef.current = true;
    reload();
    return () => {
      mountedRef.current = false;
    };
  }, [reload]);

  const filterQuery = search.trim().toLowerCase();
  const filteredCars = useMemo(() => {
    const typeQuery = selectedType.trim().toLowerCase();
    return cars.filter((car) => {
      const matchesType =
        selectedType === "All" ||
        (car.subCategory?
          car.subCategory.trim().toLowerCase() === typeQuery : false);
      const matchesSearch = filterQuery
        ? [car.name, car.location, car.price, car.description]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(filterQuery))
        : true;
      return matchesType && matchesSearch;
    });
  }, [cars, selectedType, filterQuery]);

  return {
    selectedType,
    setSelectedType,
    search,
    setSearch,
    carTypes,
    cars,
    filteredCars,
    loading,
    error,
    reload,
  };
};