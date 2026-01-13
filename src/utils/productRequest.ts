import type { ProductCategoryKey } from "@/src/constants/productCategories";
import type { ProductImageField } from "@/src/utils/productImage";

export type LocalImageAsset = {
  uri: string;
  base64?: string;
  name?: string;
  type?: string;
  width?: number;
  height?: number;
  size?: number;
};

const hasImageUri = (value: unknown): value is { uri: string } =>
  typeof value === "object" && value !== null && "uri" in value && typeof (value as any).uri === "string";

export const isLocalImageAsset = (value?: ProductImageField): value is LocalImageAsset =>
  hasImageUri(value);

export const buildProductRequestBody = (
  apiPayload: Record<string, unknown> & { image?: ProductImageField },
  categoryKey: ProductCategoryKey
) => {
  const jsonBody = buildJsonBody(apiPayload);
  return {
    body: {
      ...jsonBody,
      category_key: categoryKey,
    },
    headers: { "Content-Type": "application/json" },
  };
};

const buildJsonBody = (
  payload: Record<string, unknown> & { image?: ProductImageField }
) => {
  const cloned = { ...payload };
  if (isLocalImageAsset(cloned.image)) {
    cloned.image = imageToJsonValue(cloned.image);
  }
  return cloned;
};

const imageToJsonValue = (image: LocalImageAsset) =>
  image.base64 ? `data:${image.type ?? "image/jpeg"};base64,${image.base64}` : image.uri;
