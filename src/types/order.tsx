import { ImageSourcePropType } from "react-native";

export type Order = {
  name: string;
  price: string;
  id: string;
  location: string;
  image: ImageSourcePropType;
};
