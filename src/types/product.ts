export type Transmission = "Manual" | "Automatic";
export type CarType = "City Car" | "SUV" | "MPV" | "Sedan";

export interface Product {
  id: string;
  name: string;
  pricePerDay: number;     // harga per hari (angka)
  lokasi: string;
  image?: string;
  transmission?: Transmission;
  seats?: number;
  bagCapacity?: string;
  carType?: CarType;
  plateNumber?: string;
  description?: string;
  createdAt: number;
}
