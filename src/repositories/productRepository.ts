import { apiClient } from "@/src/api/apiClient";
import { findCategoryByResource } from "@/src/constants/productCategories";
import { Product } from "@/src/types/product";
import type { ProductImageField } from "@/src/utils/productImage";

export type CreateProductPayload = Omit<Product, "id" | "createdAt">;
export type UpdateProductPayload = Product;
export type ApiProduct = {
  id: string;
  created_at: string | number;
  name: string;
  price_per_day: number;
  lokasi: string;
  image?: ProductImageField;
  transmission?: Product["transmission"];
  seats?: number;
  bag_capacity?: string;
  car_type?: Product["carType"];
  plate_number?: string;
  description?: string;
};

const RESOURCE = "/produk";

export const mapApiProduct = (payload: ApiProduct, resource: string): Product => ({
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
  resource,
  categoryKey: findCategoryByResource(resource).key,
});

export const toApi = (payload: CreateProductPayload | UpdateProductPayload) => ({
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
    return response.data.map((item) => mapApiProduct(item, RESOURCE));
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<ApiProduct>(`${RESOURCE}/${id}`);
    return mapApiProduct(response.data, RESOURCE);
  },

  async create(payload: CreateProductPayload): Promise<Product> {
    const response = await apiClient.post<ApiProduct>(RESOURCE, toApi(payload));
    return mapApiProduct(response.data, RESOURCE);
  },

  async update(payload: UpdateProductPayload): Promise<Product> {
    const { id, createdAt, ...body } = payload;
    const response = await apiClient.put<ApiProduct>(`${RESOURCE}/${id}`, toApi(body as CreateProductPayload));
    return mapApiProduct(response.data, RESOURCE);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${RESOURCE}/${id}`);
  },
};

export const deleteProductByResource = (resource: string, id: string) =>
  apiClient.delete(`${resource}/${id}`);
