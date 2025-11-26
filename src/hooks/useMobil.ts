import { productRepository } from "@/src/repositories/productRepository";
import { Car } from "@/src/types/car";
import { Product } from "@/src/types/product";
import { useEffect, useMemo, useState } from "react";
import { ImageSourcePropType } from "react-native";

const placeholderImage = require("@/assets/images/audi.jpg");

const buildCar = (product: Product): Car => ({
  id: product.id,
  name: product.name,
  price: `Rp${product.pricePerDay.toLocaleString("id-ID")} / hari`,
  pricePerDay: product.pricePerDay,
  code: product.plateNumber ?? product.id,
  location: product.lokasi,
  image: product.image ? { uri: product.image } : (placeholderImage as ImageSourcePropType),
  imageName: product.image ?? "",
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

  const carTypes = useMemo(() => CAR_TYPES, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setError(null);
        const products = await productRepository.getAll();
        if (!mounted) return;
        const mapped = products.map(buildCar);
        setCars(mapped);
        if (!mapped.length) {
          setError("Belum ada mobil yang terdaftar di database.");
        }
      } catch (error) {
        console.warn("⚠️ Gagal memuat daftar mobil:", error);
        if (mounted) {
          setError(error instanceof Error ? error.message : "Gagal memuat data mobil.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

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
    filteredCars,
    loading,
    error,
  };
};
