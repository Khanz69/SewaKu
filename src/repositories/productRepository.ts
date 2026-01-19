import { apiClient } from "@/src/api/apiClient";
import type { ProductCategoryKey } from "@/src/constants/productCategories";
import { normalizeProductCategoryKey } from "@/src/constants/productCategories";
import type { Product } from "@/src/types/product";
import type { ProductImageField } from "@/src/utils/productImage";
import { buildProductRequestBody } from "@/src/utils/productRequest";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  seller_id?: string;
  user_id?: string;
  owner_id?: string;
  seller?: string;
  transmission?: Product["transmission"];
  seats?: number;
  bag_capacity?: string;
  car_type?: Product["subCategory"];
  subcategory?: Product["subCategory"];
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
  sellerId: payload.seller_id ?? payload.user_id ?? payload.owner_id ?? payload.seller,
  transmission: payload.transmission,
  seats: payload.seats,
  bagCapacity: payload.bag_capacity,
  subCategory: payload.subcategory ?? payload.car_type,
  plateNumber: payload.plate_number,
  description: payload.description,
  createdAt:
    typeof payload.created_at === "number"
      ? payload.created_at
      : Date.parse(String(payload.created_at)) || Date.now(),
  categoryKey: normalizeProductCategoryKey(payload.category_key),
});

const normalizeSubcategory = (
  value?: Product["subCategory"],
  categoryKey?: ProductCategoryKey
) => {
  if (!value) return value;
  if (categoryKey === "motor" && value === "Sports") return "Sports ";
  return value;
};

const toApi = (payload: CreateProductPayload | UpdateProductPayload) => ({
  name: payload.name,
  price_per_day: payload.pricePerDay,
  lokasi: payload.lokasi,
  image: payload.image,
  seller: payload.sellerId,
  transmission: payload.transmission,
  seats: payload.seats,
  bag_capacity: payload.bagCapacity,
  subcategory: normalizeSubcategory(payload.subCategory, payload.categoryKey),
  plate_number: payload.plateNumber,
  description: payload.description,
});

const attachSellerId = async <T extends CreateProductPayload | UpdateProductPayload>(
  payload: T
): Promise<T> => {
  if (payload.sellerId) return payload;
  try {
    const rawUser = await AsyncStorage.getItem("@sewaku_user");
    if (!rawUser) return payload;
    const user = JSON.parse(rawUser) as { id?: string };
    if (!user?.id) return payload;
    return { ...payload, sellerId: user.id } as T;
  } catch {
    return payload;
  }
};

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
    const normalizedPayload = await attachSellerId(payload);
    const { body, headers } = buildProductRequestBody(
      toApi(normalizedPayload),
      normalizedPayload.categoryKey
    );
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
