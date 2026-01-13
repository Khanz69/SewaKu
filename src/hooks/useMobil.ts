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
  image: resolveProductImage(product.image, placeholderImage as ImageSourcePropType) ?? (placeholderImage as ImageSourcePropType),
  imageName: typeof product.image === "string" ? product.image : "",
  carType: product.carType,
  transmission: product.transmission,
  description: product.description,
  seats: product.seats,
  bagCapacity: product.bagCapacity,
});

const CAR_TYPES = ["All", "City Car", "SUV", "MPV", "Sedan"];

export const useMobil = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const carTypes = useMemo(() => CAR_TYPES, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const products = await productRepository.getAll();
      if (!mountedRef.current) return;
      const mobilProducts = products.filter((product) => product.categoryKey === "mobil");
      const mapped = mobilProducts.map(buildCar);
      setCars(mapped);
      if (!mapped.length) {
        setError("Belum ada mobil yang terdaftar di database.");
      }
    } catch (error) {
      console.warn("⚠️ Gagal memuat daftar mobil:", error);
      if (mountedRef.current) {
        setError(error instanceof Error ? error.message : "Gagal memuat data mobil.");
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    reload();
    return () => {
      mountedRef.current = false;
    };
  }, [reload]);

  const filterQuery = search.trim().toLowerCase();
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesType =
        selectedType === "All" || (car.carType ?? "") === selectedType;
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
    reload,
    filteredCars,
    loading,
    error,
  };
};
