import axios from "axios";

const BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:4MMWlGal"; // Base URL Xano milik proyek

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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