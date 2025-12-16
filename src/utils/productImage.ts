import { ImageSourcePropType, ImageURISource } from "react-native";

export type ProductImageField =
  | string
  | ImageSourcePropType
  | {
      url?: string;
      secure_url?: string;
      image?: string;
    }
  | null
  | undefined;

const hasUri = (value: unknown): value is ImageURISource =>
  typeof value === "object" && value !== null && "uri" in value && typeof (value as ImageURISource).uri === "string";

const pickUrlFromAsset = (value: Record<string, unknown>) => {
  if (typeof value.url === "string") return value.url;
  if (typeof value.secure_url === "string") return value.secure_url;
  if (typeof value.image === "string") return value.image;
  return undefined;
};

export const resolveProductImage = (
  value?: ProductImageField,
  fallback?: ImageSourcePropType
): ImageSourcePropType | undefined => {
  if (!value) return fallback;
  if (typeof value === "string") return { uri: value };
  if (typeof value === "number") return value as ImageSourcePropType;
  if (Array.isArray(value)) return value as ImageSourcePropType;
  if (hasUri(value)) return value;
  if (typeof value === "object") {
    const url = pickUrlFromAsset(value as Record<string, unknown>);
    if (url) return { uri: url };
  }
  return fallback;
};

export const extractProductImageUrl = (value?: ProductImageField): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (hasUri(value)) return value.uri;
  if (typeof value === "object" && !Array.isArray(value)) {
    return pickUrlFromAsset(value as Record<string, unknown>);
  }
  return undefined;
};
