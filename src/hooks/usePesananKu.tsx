import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { orderRepository } from "../repositories/orderRepository";
import { productRepository } from "../repositories/productRepository";
import { Order } from "../types/order";
import type { Product } from "../types/product";
import type { ProductImageField } from "../utils/productImage";
import { extractProductImageUrl, resolveProductImage } from "../utils/productImage";

export function usePesananKu() {
  const [selectedTab, setSelectedTab] = useState("Semua");
  const [search, setSearch] = useState("");
  const [orderFlow, setOrderFlow] = useState<"seller_to_customer" | "customer_to_seller">(
    "seller_to_customer"
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const buildCacheKey = (id: string) => `@sewaku_orders_cache_${id}`;

  const tabs = ["Semua", "Aktif", "Selesai"];

  const loadOrders = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    try {
      setLoading(true);
      setError(null);
      const rawUser = await AsyncStorage.getItem("@sewaku_user");
      if (!rawUser) {
        setUserId(null);
        setOrders([]);
        return;
      }
      const user = JSON.parse(rawUser) as { id?: string };
      if (!user?.id) {
        setUserId(null);
        setOrders([]);
        return;
      }
      setUserId(user.id);

      const cacheKey = buildCacheKey(user.id);
      if (orders.length === 0) {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached && requestId === requestIdRef.current) {
          try {
            const parsed = JSON.parse(cached) as Array<
              Omit<Order, "image"> & { imageUrl?: string }
            >;
            const fallbackImage = require("@/assets/images/audi.jpg");
            const cachedMapped = parsed.map((item) => ({
              ...item,
              image:
                resolveProductImage(item.imageUrl, fallbackImage) ??
                fallbackImage,
            })) as Order[];
            if (cachedMapped.length > 0) {
              setOrders(cachedMapped);
            }
          } catch {
            // ignore cache parse errors
          }
        }
      }

      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
      const fetchWithRetry = async (type: "buyer" | "seller") => {
        const maxAttempts = 3;
        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
          try {
            return await orderRepository.list(
              type === "buyer" ? { buyerId: user.id } : { sellerId: user.id }
            );
          } catch (err) {
            if (attempt === maxAttempts) throw err;
            await delay(500 * attempt);
          }
        }
        return [] as Awaited<ReturnType<typeof orderRepository.list>>;
      };

      const [buyerResult, sellerResult] = await Promise.allSettled([
        fetchWithRetry("buyer"),
        fetchWithRetry("seller"),
      ]);

      if (requestId !== requestIdRef.current) return;

      const buyerRecords =
        buyerResult.status === "fulfilled" ? buyerResult.value : [];
      const sellerRecords =
        sellerResult.status === "fulfilled" ? sellerResult.value : [];

      if (buyerResult.status === "rejected" && sellerResult.status === "rejected") {
        setError("Gagal memuat pesanan.");
        return;
      }

      const mergedMap = new Map<string, (typeof buyerRecords)[number]>();
      buyerRecords.forEach((record) => mergedMap.set(record.id, record));
      sellerRecords.forEach((record) => mergedMap.set(record.id, record));
      const scoped = Array.from(mergedMap.values()).filter(
        (record) => record.buyerId === user.id || record.sellerId === user.id
      );

      const productCache = new Map<string, Product | null>();
      const productPromiseCache = new Map<string, Promise<Product | null>>();

      const getProduct = async (productId?: string) => {
        if (!productId) return null;
        if (productCache.has(productId)) {
          return productCache.get(productId) ?? null;
        }
        if (productPromiseCache.has(productId)) {
          return productPromiseCache.get(productId) ?? null;
        }
        const promise = productRepository
          .getById(productId)
          .then((product) => {
            productCache.set(productId, product);
            return product;
          })
          .catch(() => {
            productCache.set(productId, null);
            return null;
          });
        productPromiseCache.set(productId, promise);
        return promise;
      };

      const mapped = await Promise.all(
        scoped.map(async (record) => {
          let productName = record.product?.name ?? "-";
          let pricePerDay = record.product?.pricePerDay ?? 0;
          let lokasi = record.product?.lokasi ?? "-";
          let imageValue: ProductImageField | undefined = record.product?.image;

          if (record.productId && !record.product?.name) {
            const product = await getProduct(record.productId);
            if (product) {
              productName = product.name;
              pricePerDay = product.pricePerDay;
              lokasi = product.lokasi;
              imageValue = product.image;
            }
          }

          const price = pricePerDay
            ? `Rp${Number(pricePerDay).toLocaleString("id-ID")} / hari`
            : record.totalPrice
            ? `Rp${Number(record.totalPrice).toLocaleString("id-ID")}`
            : "-";

          const image =
            resolveProductImage(imageValue, require("@/assets/images/audi.jpg")) ??
            require("@/assets/images/audi.jpg");

          const imageUrl = extractProductImageUrl(imageValue);

          const flow =
            record.sellerId === user.id ? "seller_to_customer" : "customer_to_seller";

          return {
            id: record.id,
            name: productName,
            price,
            location: lokasi,
            image,
            status: record.status,
            flow,
            productId: record.productId,
            buyerId: record.buyerId,
            sellerId: record.sellerId,
            startDate: record.startDate,
            endDate: record.endDate,
            returnTime: record.returnTime,
            pickupLocation: record.pickupLocation,
            totalPrice: record.totalPrice,
            paymentMethod: record.paymentMethod,
            ktpImageUrl: record.ktpImageUrl,
            simImageUrl: record.simImageUrl,
            phoneNumber: record.phoneNumber,
            termsAccepted: record.termsAccepted,
            createdAt: record.createdAt,
            imageUrl,
          } as Order & { imageUrl?: string };
        })
      );

      setOrders(mapped as Order[]);
      try {
        const cachePayload = (mapped as Array<Order & { imageUrl?: string }>).map(
          ({ image, imageUrl, ...rest }) => ({
            ...rest,
            imageUrl,
          })
        );
        await AsyncStorage.setItem(cacheKey, JSON.stringify(cachePayload));
      } catch {
        // ignore cache write errors
      }
      if (buyerResult.status === "rejected" || sellerResult.status === "rejected") {
        setError("Sebagian data pesanan gagal dimuat.");
      } else if ((mapped as Order[]).length === 0) {
        setError(null);
      }
    } catch (err) {
      console.warn("Gagal memuat pesanan", err);
      setError("Gagal memuat pesanan");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  useFocusEffect(
    useCallback(() => {
      void loadOrders();
      return () => undefined;
    }, [loadOrders])
  );

  const filteredOrders = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const base = orders.filter((order) => {
      if (userId) {
        const isMine = order.buyerId === userId || order.sellerId === userId;
        if (!isMine) return false;
      }
      if (orderFlow === "seller_to_customer" && order.sellerId !== undefined) {
        return order.flow === "seller_to_customer";
      }
      if (orderFlow === "customer_to_seller" && order.buyerId !== undefined) {
        return order.flow === "customer_to_seller";
      }
      return order.flow === orderFlow;
    }).filter((order) => {
      if (selectedTab === "Aktif") return order.status === "confirmed";
      if (selectedTab === "Selesai") return order.status === "completed";
      return true;
    });
    if (!normalized) return base;
    return base.filter((order) =>
      [order.name, order.location, order.id].some((value) =>
        String(value).toLowerCase().includes(normalized)
      )
    );
  }, [orders, search, selectedTab, orderFlow, userId]);

  return {
    selectedTab,
    setSelectedTab,
    search,
    setSearch,
    tabs,
    orders: filteredOrders,
    loading,
    error,
    orderFlow,
    setOrderFlow,
    reload: loadOrders,
  };
}
