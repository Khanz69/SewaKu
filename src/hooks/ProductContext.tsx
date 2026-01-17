// hooks/ProductContext.tsx
import { productRepository } from "@/src/repositories/productRepository";
import type { Product } from "@/src/types/product";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type CreateInput = Omit<Product, "id" | "createdAt">;

type Ctx = {
  products: Product[];
  addProduct: (data: CreateInput) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getById: (id: string) => Product | undefined;
  reset: () => Promise<void>;
  hydrated: boolean; // true kalau sudah baca dari storage

  // state & actions untuk modal detail
  selectedProduct: Product | null;
  isDetailOpen: boolean;
  openDetail: (p: Product) => void;
  closeDetail: () => void;
};

const ProductContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "@sewaku_products_v1";

const seed: Product[] = [
  {
    id: "1",
    name: "Audi Q3 Sportback",
    pricePerDay: 850000,
    lokasi: "Jakarta Selatan",
    image: "https://picsum.photos/seed/audi/600/360",
    transmission: "Automatic",
    seats: 5,
    bagCapacity: "1 small bag",
    subCategory: "SUV",
    plateNumber: "B 1 Q3",
    description: "Unit bersih & terawat",
    createdAt: Date.now() - 86400_000,
  },
  {
    id: "2",
    name: "Ford F150 Raptor",
    pricePerDay: 250000,
    lokasi: "Depok",
    image: "https://picsum.photos/seed/ford/600/360",
    transmission: "Manual",
    seats: 5,
    bagCapacity: "Medium",
    subCategory: "SUV",
    plateNumber: "F 150 RP",
    description: "Siap medan berat",
    createdAt: Date.now() - 43200_000,
  },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const ProductProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(seed);
  const [hydrated, setHydrated] = useState(false);

  // Ambil data awal dari API remote
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const remote = await productRepository.getAll();
        if (mounted && Array.isArray(remote) && remote.length > 0) {
          setProducts(remote);
          console.log("🌐 Produk dimuat dari API Xano:", remote.length);
        }
      } catch (error) {
        console.warn("⚠️ Gagal memuat data produk dari API:", error);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // UI state modal detail
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Hydrate dari AsyncStorage (load data awal)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (mounted && raw) {
          const parsed: Product[] = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setProducts(parsed);
            console.log("📦 Products loaded from AsyncStorage:", parsed.length);
          }
        } else {
          console.log("📦 No saved products, using seed data");
        }
      } catch (e) {
        console.warn("⚠️ Gagal load products:", e);
      } finally {
        if (mounted) setHydrated(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ✅ Persist ke AsyncStorage (dengan debounce)
  useEffect(() => {
    if (!hydrated) return;

    const timeout = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        console.log(
          `%c💾 Disimpan ke AsyncStorage (${products.length} produk)`,
          "color: green; font-weight: bold;"
        );
      } catch (e) {
        console.warn("⚠️ Gagal save products:", e);
      }
    }, 400); // tunggu 400ms sebelum simpan

    return () => clearTimeout(timeout);
  }, [products, hydrated]);

  // Semua fungsi utama context
  const value = useMemo<Ctx>(
    () => ({
      products,
      hydrated,
      addProduct: (data) => {
        const item: Product = { id: uid(), createdAt: Date.now(), ...data };
        setProducts((prev) => [...prev, item]);
        console.log("🆕 Produk ditambahkan:", item.name);
        return item;
      },
      updateProduct: (id, patch) => {
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
        console.log("✏️ Produk diperbarui:", id);
      },
      deleteProduct: (id) => {
        console.log("🗑️ Menghapus produk dengan ID:", id);
        setProducts((prev) => {
          const next = prev.filter((p) => p.id !== id);
          console.log("✅ Sisa produk setelah hapus:", next.length);
          return next;
        });
      },
      getById: (id) => products.find((p) => p.id === id),
      reset: async () => {
        try {
          await AsyncStorage.removeItem(STORAGE_KEY);
          console.log("♻️ Data produk direset ke default");
        } finally {
          setProducts(seed);
        }
      },

      // State Modal Detail
      selectedProduct,
      isDetailOpen,
      openDetail: (p: Product) => {
        console.log("🔍 Membuka detail produk:", p.name);
        setSelectedProduct(p);
        setIsDetailOpen(true);
      },
      closeDetail: () => {
        console.log("❌ Menutup detail modal");
        setIsDetailOpen(false);
      },
    }),
    [products, hydrated, selectedProduct, isDetailOpen]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

// Hook pemanggil context
export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
