import { apiClient } from "@/src/api/apiClient";
import type { ProductCategoryKey } from "@/src/constants/productCategories";
import { normalizeProductCategoryKey } from "@/src/constants/productCategories";
import type { Product } from "@/src/types/product";
import type { ProductImageField } from "@/src/utils/productImage";
import { buildProductRequestBody } from "@/src/utils/productRequest";

const RESOURCE = "/produk";

type ProductPayloadBase = Omit<Product, "createdAt"> & {
  categoryKey: ProductCategoryKey;
};

export type CreateProductPayload = Omit<ProductPayloadBase, "id">;
export type UpdateProductPayload = ProductPayloadBase;

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
  category_key: ProductCategoryKey;
};

const mapApiProduct = (payload: ApiProduct): Product => ({
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
  categoryKey: normalizeProductCategoryKey(payload.category_key),
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
    return response.data.map(mapApiProduct);
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<ApiProduct>(`${RESOURCE}/${id}`);
    return mapApiProduct(response.data);
  },

  async create(payload: CreateProductPayload): Promise<Product> {
    const { body, headers } = buildProductRequestBody(toApi(payload), payload.categoryKey);
    const config = headers ? { headers } : undefined;
    const response = await apiClient.post<ApiProduct>(RESOURCE, body, config);
    return mapApiProduct(response.data);
  },

  async update(payload: UpdateProductPayload): Promise<Product> {
    const { body, headers } = buildProductRequestBody(toApi(payload), payload.categoryKey);
    const config = headers ? { headers } : undefined;
    const response = await apiClient.put<ApiProduct>(`${RESOURCE}/${payload.id}`, body, config);
    return mapApiProduct(response.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${RESOURCE}/${id}`);
  },
};
