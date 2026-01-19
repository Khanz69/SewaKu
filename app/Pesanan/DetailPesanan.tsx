import { orderRepository } from "@/src/repositories/orderRepository";
import { productRepository } from "@/src/repositories/productRepository";
import { userRepository } from "@/src/repositories/userRepository";
import type { Product } from "@/src/types/product";
import type { User } from "@/src/types/user";
import { resolveProductImage } from "@/src/utils/productImage";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function BuatPesanan() {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    price?: string;
    location?: string;
    status?: string;
    flow?: "seller_to_customer" | "customer_to_seller";
    tanggalSewa?: string;
    tanggalKembali?: string;
    waktuKembali?: string;
    lokasi?: string;
  }>();
  const [tanggalSewa, setTanggalSewa] = useState(params.tanggalSewa ?? "");
  const [tanggalKembali, setTanggalKembali] = useState(params.tanggalKembali ?? "");
  const [waktuKembali, setWaktuKembali] = useState(params.waktuKembali ?? "");
  const [lokasi, setLokasi] = useState(params.lokasi ?? "");
  const [productName, setProductName] = useState(params.name ?? "Detail Produk");
  const [productPrice, setProductPrice] = useState(params.price ?? "-");
  const [productLocation, setProductLocation] = useState(params.location ?? "-");
  const [productImage, setProductImage] = useState(
    resolveProductImage(undefined, require("@/assets/images/audi.jpg"))
  );
  const [productId, setProductId] = useState<string | null>(null);
  const [productPricePerDay, setProductPricePerDay] = useState<number | null>(null);
  const [totalHarga, setTotalHarga] = useState<number | null>(null);
  const [statusOverride, setStatusOverride] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [completeVisible, setCompleteVisible] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [sellerUser, setSellerUser] = useState<User | null>(null);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [buyerUser, setBuyerUser] = useState<User | null>(null);
  const [buyerLoading, setBuyerLoading] = useState(false);
  const [orderFlow, setOrderFlow] = useState<
    "seller_to_customer" | "customer_to_seller" | null
  >(params.flow ?? null);

  const router = useRouter();
  const status = useMemo(
    () => (statusOverride ?? params.status ?? "pending").toLowerCase(),
    [params.status, statusOverride]
  );
  const isPending = status === "pending";
  const isConfirmed = status === "confirmed";
  const isCompleted = status === "completed";
  const isCancelled = status === "cancelled";
  const isSellerFlow = orderFlow === "seller_to_customer";

  const handleBackPress = () => {
    router.back();
  };

  const parseDate = (value?: string) => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      const [d, m, y] = trimmed.split("/").map(Number);
      const date = new Date(y, m - 1, d);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [y, m, d] = trimmed.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const totalHari = useMemo(() => {
    const start = parseDate(tanggalSewa);
    const end = parseDate(tanggalKembali);
    if (!start || !end) return null;
    const diff = end.getTime() - start.getTime();
    if (diff < 0) return null;
    return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
  }, [tanggalSewa, tanggalKembali]);

  useEffect(() => {
    if (!params.id) return;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const loadOrder = async () => {
      try {
        const record = await orderRepository.getById(params.id ?? "");
        setStatusOverride(record.status);
        setTanggalSewa(record.startDate ?? "");
        setTanggalKembali(record.endDate ?? "");
        setWaktuKembali(record.returnTime ?? "");
        setLokasi(record.pickupLocation ?? "");
        setTotalHarga(record.totalPrice ?? null);
        setProductId(record.productId ?? record.product?.id ?? null);

        try {
          const rawUser = await AsyncStorage.getItem("@sewaku_user");
          if (rawUser) {
            const parsed = JSON.parse(rawUser) as { id?: string };
            if (parsed?.id && record.sellerId) {
              const flowValue =
                record.sellerId === parsed.id
                  ? "seller_to_customer"
                  : "customer_to_seller";
              setOrderFlow(flowValue);
            }
          }
        } catch {
          // ignore
        }

        if (record.buyerId) {
          try {
            setBuyerLoading(true);
            const buyer = await userRepository.getById(record.buyerId);
            setBuyerUser(buyer);
          } catch (error) {
            console.warn("Gagal memuat data pemesan", error);
            setBuyerUser(null);
          } finally {
            setBuyerLoading(false);
          }
        }

        let resolvedSellerId = record.sellerId;
        let fetchedProduct: Product | null = null;

        if (record.product?.name) {
          setProductName(record.product.name ?? "Detail Produk");
          setProductPricePerDay(
            typeof record.product.pricePerDay === "number" ? record.product.pricePerDay : null
          );
          const price = record.product.pricePerDay
            ? `Rp${Number(record.product.pricePerDay).toLocaleString("id-ID")} / hari`
            : record.totalPrice
            ? `Rp${Number(record.totalPrice).toLocaleString("id-ID")}`
            : "-";
          setProductPrice(price);
          setProductLocation(record.product.lokasi ?? "-");
          setProductImage(
            resolveProductImage(record.product.image, require("@/assets/images/audi.jpg"))
          );
        } else if (record.productId) {
          try {
            const product = await productRepository.getById(record.productId);
            fetchedProduct = product;
            setProductName(product.name ?? "Detail Produk");
            setProductPricePerDay(
              typeof product.pricePerDay === "number" ? product.pricePerDay : null
            );
            const price = product.pricePerDay
              ? `Rp${Number(product.pricePerDay).toLocaleString("id-ID")} / hari`
              : record.totalPrice
              ? `Rp${Number(record.totalPrice).toLocaleString("id-ID")}`
              : "-";
            setProductPrice(price);
            setProductLocation(product.lokasi ?? "-");
            setProductImage(
              resolveProductImage(product.image, require("@/assets/images/audi.jpg"))
            );
          } catch {
            // ignore
          }
        }

        if (!resolvedSellerId && record.productId && !fetchedProduct) {
          try {
            const product = await productRepository.getById(record.productId);
            fetchedProduct = product;
          } catch {
            // ignore
          }
        }

        if (!resolvedSellerId && fetchedProduct?.sellerId) {
          resolvedSellerId = fetchedProduct.sellerId;
        }

        if (resolvedSellerId) {
          try {
            setSellerLoading(true);
            const seller = await userRepository.getById(resolvedSellerId);
            setSellerUser(seller);
          } catch (error) {
            console.warn("Gagal memuat data penjual", error);
            setSellerUser(null);
          } finally {
            setSellerLoading(false);
          }
        }
        const hasProduct = !!(record.product?.name || record.productId);
        const hasDates = !!(record.startDate || record.endDate);
        return hasProduct && hasDates;
      } catch (error) {
        console.warn("Gagal memuat detail pesanan", error);
        return false;
      }
    };

    const retryFetch = async () => {
      const loaded = await loadOrder();
      if (!loaded && !cancelled) {
        timeoutId = setTimeout(retryFetch, 2000);
      }
    };

    void retryFetch();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [params.id]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* PRODUK */}
      <View style={styles.productContainer}>
        {/* Tombol Back */}
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1b1515ff" />
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Produk</Text>
        <TouchableOpacity
          style={styles.productCard}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/Produk/DetailMobil",
              params: {
                id: productId ?? undefined,
                name: productName,
                pricePerDay: productPricePerDay?.toString(),
                location: productLocation,
              },
            })
          }
        >
          <Image source={productImage} style={styles.carImage} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.carName}>{productName}</Text>
            <Text style={styles.carInfo}>ID: {productId ?? "-"}</Text>
            <Text style={styles.carPrice}>Harga Sewa: {productPrice}</Text>
            <Text style={styles.carInfo}>Lokasi: {productLocation}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.userCard}>
        <Text style={styles.userTitle}>{isSellerFlow ? "Pemesan" : "Penjual"}</Text>
        <View style={styles.userRow}>
          <Image
            source={
              isSellerFlow
                ? buyerUser?.avatar
                  ? { uri: buyerUser.avatar }
                  : require("@/assets/images/profile.png")
                : sellerUser?.avatar
                ? { uri: sellerUser.avatar }
                : require("@/assets/images/profile.png")
            }
            style={styles.userAvatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {isSellerFlow
                ? buyerLoading
                  ? "Memuat..."
                  : buyerUser?.fullName ?? "-"
                : sellerLoading
                ? "Memuat..."
                : sellerUser?.fullName ?? "-"}
            </Text>
            <Text style={styles.userMeta}>
              {isSellerFlow
                ? buyerUser?.phone
                  ? `+${buyerUser.phone}`
                  : "-"
                : sellerUser?.phone
                ? `+${sellerUser.phone}`
                : "-"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Status Pesanan</Text>
        <Text
          style={[
            styles.statusBadge,
            isCompleted
              ? styles.statusCompleted
              : isCancelled
              ? styles.statusCancelled
              : isPending
              ? styles.statusPending
              : styles.statusConfirmed,
          ]}
        >
          {isCompleted
            ? "Selesai"
            : isCancelled
            ? "Cancelled"
            : isPending
            ? "Pending"
            : "Confirmed"}
        </Text>
      </View>

      {/* DETAIL PENYEWAAN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detail Penyewaan</Text>

        <View style={styles.readOnlyRow}>
          <Text style={styles.readOnlyLabel}>Tanggal Penyewaan</Text>
          <Text style={styles.readOnlyValue}>{tanggalSewa || "-"}</Text>
        </View>

        <View style={styles.readOnlyRow}>
          <Text style={styles.readOnlyLabel}>Tanggal Pengembalian</Text>
          <Text style={styles.readOnlyValue}>{tanggalKembali || "-"}</Text>
        </View>

        <View style={styles.readOnlyRow}>
          <Text style={styles.readOnlyLabel}>Waktu Pengembalian</Text>
          <Text style={styles.readOnlyValue}>{waktuKembali || "-"}</Text>
        </View>

        <View style={styles.readOnlyRow}>
          <Text style={styles.readOnlyLabel}>Lokasi Pengambilan</Text>
          <Text style={styles.readOnlyValue}>{lokasi || "-"}</Text>
        </View>
      </View>

      {/* DETAIL PEMBAYARAN */}
      <Text style={styles.sectionTitle3}>Detail Pembayaran</Text>
      <View style={styles.paymentSection}>
        <View style={styles.paymentCard}>
          <View style={styles.paymentRow}>
            <Text style={styles.totalText}>Total Hari:</Text>
            <Text style={styles.totalPrice}>
              {typeof totalHari === "number" ? `${totalHari} hari` : "-"}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.totalText}>Total Keseluruhan:</Text>
            <Text style={styles.totalPrice}>
              {typeof totalHarga === "number"
                ? `Rp${totalHarga.toLocaleString("id-ID")}`
                : "-"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        {!isSellerFlow && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, !isPending && styles.actionDisabled]}
              disabled={!isPending}
              onPress={() =>
                router.push({
                  pathname: "/Pesanan/EditPesanan",
                  params: {
                    id: params.id,
                    name: productName,
                    price: productPrice,
                    location: productLocation,
                    status,
                    tanggalSewa,
                    tanggalKembali,
                    waktuKembali,
                    lokasi,
                    flow: orderFlow ?? params.flow,
                  },
                })
              }
            >
              <Text style={styles.actionText}>Edit Pesanan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, !isPending && styles.actionDisabled]}
              disabled={!isPending}
              onPress={() => setCancelVisible(true)}
            >
              <Text style={styles.actionText}>Batalkan</Text>
            </TouchableOpacity>
          </>
        )}
        {isSellerFlow && (
          <TouchableOpacity
            style={[styles.confirmButton, !isPending && styles.actionDisabled]}
            disabled={!isPending}
            onPress={() => setConfirmVisible(true)}
          >
            <Text style={styles.actionText}>Konfirmasi</Text>
          </TouchableOpacity>
        )}
        {!isSellerFlow && isConfirmed && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => setCompleteVisible(true)}
          >
            <Text style={styles.actionText}>Selesaikan</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        transparent
        visible={confirmVisible}
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Konfirmasi Pesanan</Text>
              <TouchableOpacity onPress={() => setConfirmVisible(false)}>
                <Ionicons name="close" size={22} color="#111" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{params.name ?? "Detail Produk"}</Text>
              <Text style={styles.modalText}>ID: {params.id ?? "-"}</Text>
              <Text style={styles.modalText}>Harga: {params.price ?? "-"}</Text>
              <Text style={styles.modalText}>Lokasi: {params.location ?? "-"}</Text>
              <View style={styles.modalDivider} />
              <Text style={styles.modalText}>Tanggal Sewa: {tanggalSewa || "-"}</Text>
              <Text style={styles.modalText}>Tanggal Kembali: {tanggalKembali || "-"}</Text>
              <Text style={styles.modalText}>Waktu Kembali: {waktuKembali || "-"}</Text>
              <Text style={styles.modalText}>Lokasi Pengambilan: {lokasi || "-"}</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirm, !isPending && styles.actionDisabled]}
                disabled={!isPending}
                onPress={() => {
                  const finalize = async () => {
                    try {
                      if (params.id) {
                        await orderRepository.update({
                          id: params.id,
                          status: "confirmed",
                        });
                      }
                    } catch (error) {
                      console.warn("Gagal konfirmasi pesanan", error);
                    } finally {
                      setConfirmVisible(false);
                      router.replace({
                        pathname: "/Pesanan/DetailPesanan",
                        params: {
                          id: params.id,
                          name: params.name,
                          price: params.price,
                          location: params.location,
                          status: "confirmed",
                          tanggalSewa,
                          tanggalKembali,
                          waktuKembali,
                          lokasi,
                          flow: orderFlow ?? params.flow,
                        },
                      });
                    }
                  };
                  void finalize();
                }}
              >
                <Text style={styles.modalConfirmText}>Konfirmasi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={completeVisible}
        animationType="fade"
        onRequestClose={() => setCompleteVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selesaikan Pesanan</Text>
              <TouchableOpacity onPress={() => setCompleteVisible(false)}>
                <Ionicons name="close" size={22} color="#111" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalText}>
              Pastikan kendaraan sudah diterima dan sesuai sebelum menyelesaikan pesanan.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setCompleteVisible(false)}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={() => {
                  const finalize = async () => {
                    try {
                      if (params.id) {
                        await orderRepository.update({
                          id: params.id,
                          status: "completed",
                        });
                      }
                    } catch (error) {
                      console.warn("Gagal selesaikan pesanan", error);
                    } finally {
                      setCompleteVisible(false);
                      router.replace({
                        pathname: "/Pesanan/DetailPesanan",
                        params: {
                          id: params.id,
                          name: params.name,
                          price: params.price,
                          location: params.location,
                          status: "completed",
                          tanggalSewa,
                          tanggalKembali,
                          waktuKembali,
                          lokasi,
                          flow: orderFlow ?? params.flow,
                        },
                      });
                    }
                  };
                  void finalize();
                }}
              >
                <Text style={styles.modalConfirmText}>Selesaikan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={cancelVisible}
        animationType="fade"
        onRequestClose={() => setCancelVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Batalkan Pesanan</Text>
              <TouchableOpacity onPress={() => setCancelVisible(false)}>
                <Ionicons name="close" size={22} color="#111" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalText}>
              Pesanan akan dibatalkan. Lanjutkan?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setCancelVisible(false)}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={() => {
                  const finalize = async () => {
                    try {
                      if (params.id) {
                        await orderRepository.update({
                          id: params.id,
                          status: "cancelled",
                        });
                      }
                    } catch (error) {
                      console.warn("Gagal batalkan pesanan", error);
                    } finally {
                      setCancelVisible(false);
                      router.replace({
                        pathname: "/Pesanan/DetailPesanan",
                        params: {
                          id: params.id,
                          name: params.name,
                          price: params.price,
                          location: params.location,
                          status: "cancelled",
                          tanggalSewa,
                          tanggalKembali,
                          waktuKembali,
                          lokasi,
                          flow: orderFlow ?? params.flow,
                        },
                      });
                    }
                  };
                  void finalize();
                }}
              >
                <Text style={styles.modalConfirmText}>Batalkan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C0342F",
    padding: 10,
    paddingTop: 30,
  },
  productContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 8,
    marginBottom: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute", 
    left: 10, 
    top: 5, 
    borderRadius: 25,
    padding: 8,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  carImage: {
    width: 100,
    height: 60,
    borderRadius: 10,
  },
  carName: {
    fontFamily: "SFBold",
    fontSize: 14,
  },
  carInfo: {
    fontSize: 8,
    color: "#555",
  },
  carPrice: {
    fontSize: 10,
    color: "#1A1A8D",
    fontFamily: "SFMedium",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  statusLabel: {
    color: "#390000",
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  userCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 12,
    marginBottom: 20,
  },
  userTitle: {
    color: "#390000",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#e5e7eb",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },
  userMeta: {
    fontSize: 11,
    color: "#555",
    marginTop: 2,
  },
  statusPending: {
    backgroundColor: "#f4a261",
    color: "#5e0000",
  },
  statusConfirmed: {
    backgroundColor: "#2a9d8f",
    color: "#fff",
  },
  statusCancelled: {
    backgroundColor: "#9ca3af",
    color: "#111",
  },
  statusCompleted: {
    backgroundColor: "#16a34a",
    color: "#fff",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 5,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#eac223",
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#34A853",
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  completeButton: {
    flex: 1,
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  actionText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
  },
  actionDisabled: {
    opacity: 0.5,
  },
  section: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    alignSelf: "center",
    backgroundColor: "#C0342F",
    color: "white",
    fontWeight: "600",
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  readOnlyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.4)",
  },
  readOnlyLabel: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  readOnlyValue: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    paddingVertical: 8,
    color: "white",
    fontSize: 14,
    marginBottom: 10,
  },
  touchableInput: {
    justifyContent: "center",
    paddingVertical: 12,
  },
  inputText: {
    color: "white",
    fontSize: 14,
  },
  placeholderText: {
    color: "#eee",
  },
  inputError: {
    borderBottomColor: "#ff6b6b",
    borderBottomWidth: 2,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 11,
    marginTop: -8,
    marginBottom: 6,
    fontWeight: "600",
  },
  sectionTitle3: {
    alignSelf: "center",
    backgroundColor: "#C0342F",
    color: "white",
    fontFamily: "SFMedium",
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 6,
    marginBottom: -12,
    zIndex: 1,
    elevation: 2,
  },
  paymentSection: {
    backgroundColor: "transparent",
  },
  paymentCard: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    gap: 8,
  },
  paymentRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: {
    fontWeight: "600",
    color: "#333",
    paddingTop: 10,
  },
  totalPrice: {
    fontWeight: "700",
    color: "#000",
    paddingTop: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  modalContent: {
    gap: 6,
  },
  modalText: {
    color: "#111",
    fontSize: 13,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  modalCancel: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 10,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#111",
    fontWeight: "600",
  },
  modalConfirm: {
    flex: 1,
    backgroundColor: "#1db053",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalConfirmText: {
    color: "#fff",
    fontWeight: "700",
  },
});
