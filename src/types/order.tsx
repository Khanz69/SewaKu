import { ImageSourcePropType } from "react-native";

export type OrderStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type OrderFlow = "seller_to_customer" | "customer_to_seller";

export type Order = {
  name: string;
  price: string;
  id: string;
  location: string;
  image: ImageSourcePropType;
  status: OrderStatus;
  flow: OrderFlow;
  productId?: string;
  buyerId?: string;
  sellerId?: string;
  startDate?: string;
  endDate?: string;
  returnTime?: string;
  pickupLocation?: string;
  totalPrice?: number;
  paymentMethod?: string;
  ktpImageUrl?: string;
  simImageUrl?: string;
  phoneNumber?: string;
  termsAccepted?: boolean;
  createdAt?: number;
};
