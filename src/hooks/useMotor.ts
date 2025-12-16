import { MOTOR_RESOURCE, motorRepository } from "@/src/repositories/motorRepository";
import { Car } from "@/src/types/car";
import { Product } from "@/src/types/product";
import { resolveProductImage } from "@/src/utils/productImage";
import { useEffect, useMemo, useState } from "react";
import { ImageSourcePropType } from "react-native";

const placeholderImage = require("@/assets/images/audi.jpg");

const buildMotor = (product: Product): Car => ({
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
  resource: MOTOR_RESOURCE,
});

const MOTOR_TYPES = ["All", "Sport", "Skuter", "Touring", "Cruiser", "Matic"];

export const useMotor = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carTypes = useMemo(() => MOTOR_TYPES, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setError(null);
        const products = await motorRepository.getAll();
        if (!mounted) return;
        const mapped = products.map(buildMotor);
        setCars(mapped);
        if (!mapped.length) {
          setError("Belum ada motor yang terdaftar di database.");
        }
      } catch (error) {
        console.warn("⚠️ Gagal memuat daftar motor:", error);
        if (mounted) {
          setError(error instanceof Error ? error.message : "Gagal memuat data motor.");
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
    const typeQuery = selectedType.toLowerCase();
    return cars.filter((car) => {
      const matchesType =
        selectedType === "All" ||
        [car.carType, car.name, car.description]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(typeQuery));
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
