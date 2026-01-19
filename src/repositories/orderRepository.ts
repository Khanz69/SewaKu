import { apiClient } from "@/src/api/apiClient";
import type { LocalImageAsset } from "@/src/utils/productRequest";
import { isLocalImageAsset } from "@/src/utils/productRequest";

const RESOURCE = "/pesanan";

export type OrderStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type OrderRecord = {
  id: string;
  productId: string;
  buyerId: string;
  sellerId?: string;
  status: OrderStatus;
  startDate?: string;
  endDate?: string;
  returnTime?: string;
  pickupLocation?: string;
  totalPrice?: number;
  paymentMethod?: string;
  updatedAt?: number;
  ktpImageUrl?: string;
  simImageUrl?: string;
  phoneNumber?: string;
  termsAccepted?: boolean;
  createdAt?: number;
  product?: {
    id: string;
    name?: string;
    pricePerDay?: number;
    lokasi?: string;
    image?: string;
  };
};

type OrderImageValue = string | LocalImageAsset;

export type CreateOrderPayload = {
  productId: string;
  buyerId: string;
  sellerId?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  returnTime?: string;
  pickupLocation?: string;
  totalPrice?: number;
  paymentMethod?: string;
  ktpImageUrl?: OrderImageValue;
  simImageUrl?: OrderImageValue;
  phoneNumber?: string;
  termsAccepted?: boolean;
};

export type UpdateOrderPayload = { id: string } & Partial<CreateOrderPayload>;

type ApiOrder = {
  id: string;
  product: string;
  buyer: string;
  seller?: string;
  status?: OrderStatus;
  start_date?: string;
  end_date?: string;
  return_time?: string;
  pickup_location?: string;
  total_price?: number;
  payment_method?: string;
  ktp_image_url?: string;
  sim_image_url?: string;
  phone_number?: string;
  terms_accepted?: boolean;
  created_at?: number | string;
  updated_at?: number | string;
  product?: {
    id: string;
    name?: string;
    price_per_day?: number;
    lokasi?: string;
    image?: string;
  };
};

const mapApiOrder = (payload: ApiOrder): OrderRecord => ({
  id: payload.id,
  productId: payload.product,
  buyerId: payload.buyer,
  sellerId: payload.seller,
  status: payload.status ?? "pending",
  startDate: payload.start_date,
  endDate: payload.end_date,
  returnTime: payload.return_time,
  pickupLocation: payload.pickup_location,
  totalPrice: payload.total_price,
  paymentMethod: payload.payment_method,
  ktpImageUrl: payload.ktp_image_url,
  simImageUrl: payload.sim_image_url,
  phoneNumber: payload.phone_number,
  termsAccepted: payload.terms_accepted,
  createdAt:
    typeof payload.created_at === "number"
      ? payload.created_at
      : Date.parse(String(payload.created_at)) || undefined,
  updatedAt:
    typeof payload.updated_at === "number"
      ? payload.updated_at
      : Date.parse(String(payload.updated_at)) || undefined,
  product: payload.product
    ? {
        id: payload.product.id,
        name: payload.product.name,
        pricePerDay: payload.product.price_per_day,
        lokasi: payload.product.lokasi,
        image: payload.product.image,
      }
    : undefined,
});

const imageToJsonValue = (image: LocalImageAsset) =>
  image.base64 ? `data:${image.type ?? "image/jpeg"};base64,${image.base64}` : image.uri;

const normalizeImageValue = (value?: OrderImageValue) => {
  if (!value) return undefined;
  if (isLocalImageAsset(value)) return imageToJsonValue(value);
  return value;
};

const normalizeDateValue = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  const match = /^\d{2}\/\d{2}\/\d{4}$/.test(trimmed);
  if (!match) return trimmed;
  const [d, m, y] = trimmed.split("/");
  return `${y}-${m}-${d}`;
};

const toApiPayload = (payload: CreateOrderPayload | UpdateOrderPayload) => {
  const base = {
    product: payload.productId,
    buyer: payload.buyerId,
    seller: payload.sellerId,
    status: payload.status,
    start_date: normalizeDateValue(payload.startDate),
    end_date: normalizeDateValue(payload.endDate),
    return_time: payload.returnTime,
    pickup_location: payload.pickupLocation,
    total_price: payload.totalPrice,
    payment_method: payload.paymentMethod,
    ktp_image_url: normalizeImageValue(payload.ktpImageUrl),
    sim_image_url: normalizeImageValue(payload.simImageUrl),
    phone_number: payload.phoneNumber,
    terms_accepted: payload.termsAccepted,
  } as Record<string, unknown>;

  Object.keys(base).forEach((key) => {
    if (base[key] === undefined || base[key] === "") {
      delete base[key];
    }
  });

  return base;
};

export const orderRepository = {
  async list(params: { buyerId?: string; sellerId?: string }): Promise<OrderRecord[]> {
    const response = await apiClient.get<ApiOrder[]>(RESOURCE, {
      params: {
        buyer: params.buyerId,
        seller: params.sellerId,
      },
    });
    return response.data.map(mapApiOrder);
  },

  async getById(id: string): Promise<OrderRecord> {
    const response = await apiClient.get<ApiOrder>(`${RESOURCE}/${id}`);
    return mapApiOrder(response.data);
  },

  async create(payload: CreateOrderPayload): Promise<OrderRecord> {
    const response = await apiClient.post<ApiOrder>(RESOURCE, toApiPayload(payload));
    return mapApiOrder(response.data);
  },

  async update(payload: UpdateOrderPayload): Promise<OrderRecord> {
    const response = await apiClient.patch<ApiOrder>(
      `${RESOURCE}/${payload.id}`,
      toApiPayload(payload)
    );
    return mapApiOrder(response.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${RESOURCE}/${id}`);
  },
};
