import { apiClient } from "@/src/api/apiClient";
import { Product } from "@/src/types/product";

export type CreateProductPayload = Omit<Product, "id" | "createdAt">;
export type UpdateProductPayload = Product;

type ApiProduct = {
  id: string;
  created_at: string | number;
  name: string;
  price_per_day: number;
  lokasi: string;
  image?: string;
  transmission?: Product["transmission"];
  seats?: number;
  bag_capacity?: string;
  car_type?: Product["carType"];
  plate_number?: string;
  description?: string;
};

const RESOURCE = "/produk";

const fromApi = (payload: ApiProduct): Product => ({
  id: payload.id,
  name: payload.name,
  pricePerDay: Number(payload.price_per_day) || 0,
  lokasi: payload.lokasi,
  image: payload.image,
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

const toApi = (payload: CreateProductPayload | UpdateProductPayload) => ({
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

export const productRepository = {
  async getAll(): Promise<Product[]> {
    const response = await apiClient.get<ApiProduct[]>(RESOURCE);
    return response.data.map(fromApi);
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<ApiProduct>(`${RESOURCE}/${id}`);
    return fromApi(response.data);
  },

  async create(payload: CreateProductPayload): Promise<Product> {
    const response = await apiClient.post<ApiProduct>(RESOURCE, toApi(payload));
    return fromApi(response.data);
  },

  async update(payload: UpdateProductPayload): Promise<Product> {
    const { id, createdAt, ...body } = payload;
    const response = await apiClient.put<ApiProduct>(`${RESOURCE}/${id}`, toApi(body as CreateProductPayload));
    return fromApi(response.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${RESOURCE}/${id}`);
  },
};
