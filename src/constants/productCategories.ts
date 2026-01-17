const ICON_MOBIL = require("@/assets/icons/mobil.png");
const ICON_MOTOR = require("@/assets/icons/motor.png");
const ICON_ALAT_KONSTRUKSI = require("@/assets/icons/beko.png");
const ICON_BUS = require("@/assets/icons/bus.png");
const ICON_LOGISTIK = require("@/assets/icons/logistik.png");
const ICON_LAINNYA = require("@/assets/icons/lainnya.png");

export type ProductCategoryKey =
  | "mobil"
  | "motor"
  | "alat_konstruksi"
  | "bus"
  | "logistik"
  | "lainnya";

export type ProductCategory = {
  key: ProductCategoryKey;
  label: string;
  description: string;
  icon: number;
  subCategoryOptions?: string[];
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    key: "mobil",
    label: "Mobil",
    description: "Sewa mobil untuk berbagai kegiatan harian atau travel.",
    icon: ICON_MOBIL,
    subCategoryOptions: ["City Car", "SUV", "MPV", "Sedan"],
  },
  {
    key: "motor",
    label: "Motor",
    description: "Kendaraan roda dua untuk mobilitas lebih cepat.",
    icon: ICON_MOTOR,
    subCategoryOptions: ["Sports", "Skuter", "Touring", "Cruiser", "Matic"],
  },
  {
    key: "alat_konstruksi",
    label: "Alat Konstruksi",
    description: "Peralatan berat untuk proyek bangunan atau jalan.",
    icon: ICON_ALAT_KONSTRUKSI,
    subCategoryOptions: ["Excavator", "Loader", "Compactor", "Mixer", "Generator"],
  },
  {
    key: "bus",
    label: "Bus",
    description: "Bus pariwisata, antar kota, atau shuttle perusahaan.",
    icon: ICON_BUS,
    subCategoryOptions: ["Pariwisata", "Mewah", "Medium", "Mini", "VIP"],
  },
  {
    key: "logistik",
    label: "Logistik",
    description: "Unit angkutan logistik dengan kapasitas besar.",
    icon: ICON_LOGISTIK,
    subCategoryOptions: ["Pickup", "Truck", "Box", "Double Cabin", "Tangki"],
  },
  {
    key: "lainnya",
    label: "Lainnya",
    description: "Kategori khusus sesuai kebutuhan Anda.",
    icon: ICON_LAINNYA,
    subCategoryOptions: ["Sepeda", "Perahu", "Pesawat", "ATV/Roda Tiga", "Rekreasi"],
  },
];

export const DEFAULT_CATEGORY = PRODUCT_CATEGORIES[0];

export const findCategoryByKey = (key?: ProductCategoryKey) =>
  PRODUCT_CATEGORIES.find((category) => category.key === key) || DEFAULT_CATEGORY;

export const normalizeProductCategoryKey = (value?: string): ProductCategoryKey => {
  const normalized = String(value ?? "").toLowerCase();
  const matched = PRODUCT_CATEGORIES.find((category) => category.key === normalized);
  return matched?.key || DEFAULT_CATEGORY.key;
};