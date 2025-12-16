import { apiClient } from "@/src/api/apiClient";
import type { Product } from "@/src/types/product";

type ImageField =
  | string
  | {
      url?: string;
      secure_url?: string;
      image?: string;
    }
  | null
  | undefined;

type ApiMotor = {
  id: string;
  created_at: string | number;
  name: string;
  price_per_day: number;
  lokasi: string;
  image?: ImageField;
  transmission?: Product["transmission"];
  seats?: number;
  bag_capacity?: string;
  car_type?: Product["carType"];
  plate_number?: string;
  description?: string;
};

const RESOURCE = "/produk_motor";
export const MOTOR_RESOURCE = RESOURCE;

const resolveImageUrl = (value?: ImageField) => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (typeof value.url === "string") return value.url;
    if (typeof value.secure_url === "string") return value.secure_url;
    if (typeof value.image === "string") return value.image;
  }
  return undefined;
};

const fromApi = (payload: ApiMotor): Product => ({
  id: payload.id,
  name: payload.name,
  pricePerDay: Number(payload.price_per_day) || 0,
  lokasi: payload.lokasi,
  image: resolveImageUrl(payload.image),
  transmission: payload.transmission,
  seats: payload.seats,
  bagCapacity: payload.bag_capacity,
  carType: payload.car_type,
  plateNumber: payload.plate_number,
  description: payload.description,
  createdAt:
    typeof payload.created_at === "number"
      ? payload.created_at
      : Date.parse(String(payload.created_at)) || Date.now(),
});

const toApi = (payload: CreateMotorPayload | UpdateMotorPayload) => ({
  name: payload.name,
  price_per_day: payload.pricePerDay,
  lokasi: payload.lokasi,
  image: payload.image,
  transmission: payload.transmission,
  seats: payload.seats,
  bag_capacity: payload.bagCapacity,
  car_type: payload.carType,
  plate_number: payload.plateNumber,
  description: payload.description,
});

export type CreateMotorPayload = Omit<Product, "id" | "createdAt">;
export type UpdateMotorPayload = Product;

export const motorRepository = {
  async getAll(): Promise<Product[]> {
    const response = await apiClient.get<ApiMotor[]>(RESOURCE);
    return response.data.map(fromApi);
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<ApiMotor>(`${RESOURCE}/${id}`);
    return fromApi(response.data);
  },

  async create(payload: CreateMotorPayload): Promise<Product> {
    const response = await apiClient.post<ApiMotor>(RESOURCE, toApi(payload));
    return fromApi(response.data);
  },

  async update(payload: UpdateMotorPayload): Promise<Product> {
    const { id, createdAt, ...body } = payload;
    const response = await apiClient.put<ApiMotor>(`${RESOURCE}/${id}`, toApi(body as CreateMotorPayload));
    return fromApi(response.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${RESOURCE}/${id}`);
  },
};
