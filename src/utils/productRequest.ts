import type { ProductCategory } from "@/src/constants/productCategories";
import { MOTOR_RESOURCE } from "@/src/repositories/motorRepository";
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
  category: ProductCategory
) => {
  const maybeUseFormData = isLocalImageAsset(apiPayload.image) && category.key !== "mobil";
  if (maybeUseFormData && isLocalImageAsset(apiPayload.image)) {
    const formData = new FormData();
    Object.entries(apiPayload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (key === "image") return;
      formData.append(key, String(value));
    });

    if (category.resource === MOTOR_RESOURCE && typeof apiPayload.car_type === "string") {
      formData.append("type_motor", apiPayload.car_type);
    }

    appendMotorImageMetadata(formData, apiPayload.image, category.resource);
    formData.append(
      "image",
      {
        uri: apiPayload.image.uri,
        name: apiPayload.image.name ?? `photo-${Date.now()}.jpg`,
        type: apiPayload.image.type ?? "image/jpeg",
      } as any
    );

    return { body: formData };
  }

  const jsonBody = buildJsonBody(apiPayload, category);
  return { body: jsonBody, headers: { "Content-Type": "application/json" } };
};

const buildJsonBody = (
  payload: Record<string, unknown> & { image?: ProductImageField },
  category: ProductCategory
) => {
  const hasImage = payload.image;
  const basePayload = { ...payload };
  if (isLocalImageAsset(hasImage)) {
    basePayload.image = imageToJsonValue(hasImage);
  }

  if (category.resource === MOTOR_RESOURCE && typeof basePayload.car_type === "string") {
    return { ...basePayload, type_motor: basePayload.car_type };
  }

  return basePayload;
};

const imageToJsonValue = (image: LocalImageAsset) =>
  image.base64 ? `data:${image.type ?? "image/jpeg"};base64,${image.base64}` : image.uri;

const appendMotorImageMetadata = (formData: FormData, image: LocalImageAsset, resource: string) => {
  if (resource !== MOTOR_RESOURCE) return;
  const safeName = (image.name ?? `photo-${Date.now()}.jpg`).replace(/\s+/g, "_");
  const path = `/vault/${Date.now()}-${safeName}`;
  const mime = image.type ?? "image/jpeg";
  const primaryType = mime.split("/")[0] || "image";
  formData.append("image[path]", path);
  formData.append("image[name]", safeName);
  formData.append("image[type]", primaryType);
  formData.append("image[mime]", mime);
  if (typeof image.size === "number" && image.size > 0) {
    formData.append("image[size]", String(image.size));
  }
  if (typeof image.width === "number" && image.width > 0) {
    formData.append("image[meta][width]", String(image.width));
  }
  if (typeof image.height === "number" && image.height > 0) {
    formData.append("image[meta][height]", String(image.height));
  }
  formData.append("image[access]", "public");
};
