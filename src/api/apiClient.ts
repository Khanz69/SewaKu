import axios from "axios";

const DEFAULT_BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:4MMWlGal";
const BASE_URL = process.env.EXPO_PUBLIC_XANO_BASE_URL || DEFAULT_BASE_URL;

if (!process.env.EXPO_PUBLIC_XANO_BASE_URL) {
  console.warn("EXPO_PUBLIC_XANO_BASE_URL is not set; using DEFAULT_BASE_URL.");
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Interceptor respons untuk penanganan kesalahan sederhana
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    console.error("Terjadi kesalahan pada API. Status:", status);
    return Promise.reject(error);
  }
);