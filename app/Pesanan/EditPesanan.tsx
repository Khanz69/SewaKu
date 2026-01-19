import DatePickerModal from "@/components/DatePickerModal";
import TimePickerModal from "@/components/TimePickerModal";
import { orderRepository } from "@/src/repositories/orderRepository";
import { productRepository } from "@/src/repositories/productRepository";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function EditPesanan() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    price?: string;
    location?: string;
    status?: string;
    tanggalSewa?: string;
    tanggalKembali?: string;
    waktuKembali?: string;
    lokasi?: string;
    flow?: "seller_to_customer" | "customer_to_seller";
  }>();

  const status = useMemo(
    () => (params.status ?? "pending").toLowerCase(),
    [params.status]
  );
  const isPending = status === "pending";

  const [tanggalSewa, setTanggalSewa] = useState(params.tanggalSewa ?? "");
  const [tanggalKembali, setTanggalKembali] = useState(params.tanggalKembali ?? "");
  const [waktuKembali, setWaktuKembali] = useState(params.waktuKembali ?? "");
  const [lokasi, setLokasi] = useState(params.lokasi ?? "");
  const [pricePerDay, setPricePerDay] = useState<number | null>(null);

  const [datePickerState, setDatePickerState] = useState<{ visible: boolean; type: "sewa" | "kembali" }>({
    visible: false,
    type: "sewa",
  });
  const [timePickerVisible, setTimePickerVisible] = useState(false);

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

  const parsePriceText = (value?: string) => {
    if (!value) return null;
    const cleaned = value.replace(/[^0-9]/g, "");
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  };

  useEffect(() => {
    if (!params.id) {
      setPricePerDay(parsePriceText(params.price));
      return;
    }
    let mounted = true;
    const loadPrice = async () => {
      try {
        const record = await orderRepository.getById(params.id ?? "");
        if (!mounted) return;
        if (typeof record.product?.pricePerDay === "number") {
          setPricePerDay(record.product.pricePerDay);
          return;
        }
        if (record.productId) {
          const product = await productRepository.getById(record.productId);
          if (mounted) setPricePerDay(product.pricePerDay);
          return;
        }
      } catch {
        // ignore
      }
      if (mounted) setPricePerDay(parsePriceText(params.price));
    };

    void loadPrice();

    return () => {
      mounted = false;
    };
  }, [params.id, params.price]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Pesanan</Text>
        <View style={{ width: 24 }} />
      </View>

      {!isPending && (
        <View style={styles.lockedBox}>
          <Text style={styles.lockedText}>Pesanan sudah dikonfirmasi dan tidak bisa diubah.</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Tanggal Sewa</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => isPending && setDatePickerState({ visible: true, type: "sewa" })}
          disabled={!isPending}
        >
          <Text style={styles.inputText}>{tanggalSewa || "Pilih Tanggal"}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Tanggal Kembali</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => isPending && setDatePickerState({ visible: true, type: "kembali" })}
          disabled={!isPending}
        >
          <Text style={styles.inputText}>{tanggalKembali || "Pilih Tanggal"}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Waktu Kembali</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => isPending && setTimePickerVisible(true)}
          disabled={!isPending}
        >
          <Text style={styles.inputText}>{waktuKembali || "Pilih Waktu"}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Lokasi Pengambilan</Text>
        <TextInput
          style={styles.inputTextField}
          placeholder="Lokasi Pengambilan"
          placeholderTextColor="#bbb"
          value={lokasi}
          onChangeText={setLokasi}
          editable={isPending}
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, !isPending && styles.disabledButton]}
        disabled={!isPending}
        onPress={async () => {
          try {
            if (params.id) {
              const totalPrice =
                typeof totalHari === "number" && typeof pricePerDay === "number"
                  ? totalHari * pricePerDay
                  : undefined;
              await orderRepository.update({
                id: params.id,
                startDate: tanggalSewa,
                endDate: tanggalKembali,
                returnTime: waktuKembali,
                pickupLocation: lokasi,
                totalPrice,
              });
            }
          } catch (error) {
            console.warn("Gagal update pesanan", error);
          } finally {
            router.replace({
              pathname: "/Pesanan/DetailPesanan",
              params: {
                id: params.id,
                name: params.name,
                price: params.price,
                location: params.location,
                status: "pending",
                tanggalSewa,
                tanggalKembali,
                waktuKembali,
                lokasi,
                flow: params.flow,
              },
            });
          }
        }}
      >
        <Text style={styles.saveText}>Simpan Perubahan</Text>
      </TouchableOpacity>

      <DatePickerModal
        isVisible={datePickerState.visible}
        onCancel={() => setDatePickerState({ ...datePickerState, visible: false })}
        onConfirm={(date) => {
          if (datePickerState.type === "sewa") {
            setTanggalSewa(date);
          } else {
            setTanggalKembali(date);
          }
          setDatePickerState({ ...datePickerState, visible: false });
        }}
      />

      <TimePickerModal
        isVisible={timePickerVisible}
        onCancel={() => setTimePickerVisible(false)}
        onConfirm={(time) => {
          setWaktuKembali(time);
          setTimePickerVisible(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C0342F",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 14,
    padding: 16,
  },
  label: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  inputText: {
    color: "#fff",
  },
  inputTextField: {
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 16,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.5,
  },
  lockedBox: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  lockedText: {
    color: "#fff",
    textAlign: "center",
  },
});
