import type { Transmission } from "@/src/types/product";
import { ImageSourcePropType } from "react-native";

export type Car = {
  id: string;
  name: string;
  price: string;
  pricePerDay: number;
  code: string;
  location: string;
  image: ImageSourcePropType;
  imageName: string;
  carType?: string;
  transmission?: Transmission;
  description?: string;
  seats?: number;
  bagCapacity?: string;
  resource?: string;
};
