import DatePickerModal from "@/components/DatePickerModal";
import TimePickerModal from "@/components/TimePickerModal";
import { productRepository } from "@/src/repositories/productRepository";
import type { Product, ProductCategoryKey } from "@/src/types/product";
import { resolveProductImage } from "@/src/utils/productImage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Modal from "react-native-modal";

const DAY_MS = 24 * 60 * 60 * 1000;

const parseDateString = (value: string): Date | null => {
  const parts = value.split("/").map(Number);
  if (parts.length !== 3) return null;
  const [d, m, y] = parts;
  const date = new Date(y, m - 1, d);
  return Number.isFinite(date.getTime()) ? date : null;
};

export default function BuatPesanan() {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    pricePerDay?: string;
    price?: string;
    location?: string;
    plateNumber?: string;
  }>();

  const router = useRouter();

  const [tanggalSewa, setTanggalSewa] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [waktuAmbil, setWaktuAmbil] = useState("");
  const [waktuKembali, setWaktuKembali] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [modal, setModal] = useState(false);
  const [agreeTnc, setAgreeTnc] = useState(false);

  const [datePicker, setDatePicker] = useState<{
    visible: boolean;
    type: "sewa" | "kembali" | null;
  }>({ visible: false, type: null });

  const [timePicker, setTimePicker] = useState(false);
  const [remoteProduct, setRemoteProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!params.id) return;
    productRepository.getById(params.id).then(setRemoteProduct).catch(() => {});
  }, [params.id]);

  const fallbackProduct = useMemo<Product>(() => {
    const price = Number(params.pricePerDay ?? params.price ?? 0);
    return {
      id: params.id ?? "",
      name: params.name ?? "",
      pricePerDay: Number.isFinite(price) ? price : 0,
      lokasi: params.location ?? "",
      plateNumber: params.plateNumber,
      categoryKey: "" as ProductCategoryKey,
      createdAt: Date.now(),
    };
  }, [params]);

  const product = remoteProduct ?? fallbackProduct;
  const image = resolveProductImage(product.image);

  const rentalDays = useMemo(() => {
    const a = parseDateString(tanggalSewa);
    const b = parseDateString(tanggalKembali);
    if (!a || !b) return 0;
    const diff = b.getTime() - a.getTime();
    if (diff < 0) return 0;
    return Math.floor(diff / DAY_MS) + 1;
  }, [tanggalSewa, tanggalKembali]);

  const totalPrice = rentalDays * product.pricePerDay;

  const isDetailComplete =
    tanggalSewa &&
    tanggalKembali &&
    waktuAmbil &&
    waktuKembali &&
    lokasi.trim().length > 0;

  return (
    <ScrollView
      style={styles.scrollArea}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.whiteCard}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>

        <Text style={styles.pill}>Produk</Text>

        <View style={styles.productRow}>
          {image ? (
            <Image source={image} style={styles.carImage} />
          ) : (
            <View style={[styles.carImage, { backgroundColor: "#eee" }]} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.carName}>{product.name}</Text>
            <Text style={styles.carInfo}>
              Plat: {product.plateNumber ?? "-"}
            </Text>
            <Text style={styles.carPrice}>
              Rp{product.pricePerDay.toLocaleString("id-ID")}/hari
            </Text>
            <Text style={styles.carInfo}>
              Lokasi: {product.lokasi || "-"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.redCard}>
        <Text style={styles.pill}>Detail Penyewaan</Text>

        <TouchableOpacity
          style={styles.rowInput}
          onPress={() => setDatePicker({ visible: true, type: "sewa" })}
        >
          <Text style={styles.rowText}>
            {tanggalSewa || "Tanggal Penyewaan"}
          </Text>
          <Ionicons name="calendar-outline" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rowInput}
          onPress={() => setDatePicker({ visible: true, type: "kembali" })}
        >
          <Text style={styles.rowText}>
            {tanggalKembali || "Tanggal Pengembalian"}
          </Text>
          <Ionicons name="calendar-outline" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rowInput}
          onPress={() => setTimePicker(true)}
        >
          <Text style={styles.rowText}>
            {waktuAmbil || "Waktu Pengambilan"}
          </Text>
          <Ionicons name="time-outline" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rowInput}
          onPress={() => setTimePicker(true)}
        >
          <Text style={styles.rowText}>
            {waktuKembali || "Waktu Pengembalian"}
          </Text>
          <Ionicons name="time-outline" size={18} color="#fff" />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Lokasi Pengambilan"
          placeholderTextColor="#f1f1f1"
          value={lokasi}
          onChangeText={setLokasi}
        />
      </View>

      <View style={styles.whiteCard}>
        <Text style={styles.pill}>Detail Pembayaran</Text>

        <TouchableOpacity style={[styles.radioRow, styles.disabledOption]} disabled>
          <Text style={styles.radioLabel}>QRIS</Text>
          <View style={styles.radio} />
        </TouchableOpacity>
        <Text style={styles.disabledNotice}>Sedang dalam pengembangan</Text>

        <TouchableOpacity style={[styles.radioRow, styles.disabledOption]} disabled>
          <Text style={styles.radioLabel}>Transfer Bank</Text>
          <View style={styles.radio} />
        </TouchableOpacity>
        <Text style={styles.disabledNotice}>Sedang dalam pengembangan</Text>

        <View style={styles.radioRow}>
          <Text style={styles.radioLabelActive}>COD (Cash on Delivery)</Text>
          <View style={styles.radioActive} />
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Pesanan</Text>
          <Text style={styles.totalValue}>
            Rp{totalPrice.toLocaleString("id-ID")}
          </Text>
        </View>
        <Text style={styles.dayCount}>
          Total Hari: {rentalDays > 0 ? `${rentalDays} hari` : "-"}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.submit,
          !isDetailComplete && { opacity: 0.5 },
        ]}
        disabled={!isDetailComplete}
        onPress={() => setModal(true)}
      >
        <Text style={styles.submitText}>Buat Pesanan</Text>
      </TouchableOpacity>

      <Modal isVisible={modal} onBackdropPress={() => setModal(false)}>
        <View style={styles.modal}>
          <Text style={styles.pill}>Formulir Penyewaan</Text>

          <TextInput style={styles.modalInput} placeholder="Foto KTP" />
          <TextInput style={styles.modalInput} placeholder="Foto SIM" />
          <TextInput style={styles.modalInput} placeholder="No HP" />

          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
            onPress={() => setAgreeTnc(!agreeTnc)}
          >
            <View style={styles.checkbox}>
              {agreeTnc && <View style={styles.checkboxInner} />}
            </View>
            <Text>Syarat dan Ketentuan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submit,
              !agreeTnc && { opacity: 0.5 },
            ]}
            disabled={!agreeTnc}
            onPress={() => {
              setModal(false);
              router.push("/(tabs)/PesananKu");
            }}
          >
            <Text style={styles.submitText}>Kirim Formulir</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <DatePickerModal
        isVisible={datePicker.visible && datePicker.type === "sewa"}
        title="Tanggal Penyewaan"
        onConfirm={(d) => {
          setTanggalSewa(d);
          setDatePicker({ visible: false, type: null });
        }}
        onCancel={() => setDatePicker({ visible: false, type: null })}
      />

      <DatePickerModal
        isVisible={datePicker.visible && datePicker.type === "kembali"}
        title="Tanggal Pengembalian"
        onConfirm={(d) => {
          setTanggalKembali(d);
          setDatePicker({ visible: false, type: null });
        }}
        onCancel={() => setDatePicker({ visible: false, type: null })}
      />

      <TimePickerModal
        isVisible={timePicker}
        title={!waktuAmbil ? "Waktu Pengambilan" : "Waktu Pengembalian"}
        onConfirm={(t) => {
          if (!waktuAmbil) setWaktuAmbil(t);
          else setWaktuKembali(t);
          setTimePicker(false);
        }}
        onCancel={() => setTimePicker(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollArea: { flex: 1, backgroundColor: "#C0342F" },
  scrollContent: { padding: 16, paddingBottom: 160 },
  back: { position: "absolute", left: 10, top: 10 },
  pill: {
    alignSelf: "center",
    backgroundColor: "#B12A26",
    color: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
    fontWeight: "600",
  },
  whiteCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  redCard: {
    backgroundColor: "#CF5757",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  productRow: { flexDirection: "row", gap: 12 },
  carImage: { width: 90, height: 55, borderRadius: 8 },
  carName: { fontWeight: "700" },
  carInfo: { fontSize: 12, color: "#555" },
  carPrice: { fontWeight: "600", color: "#1A1A8D" },
  rowInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    paddingVertical: 12,
    marginBottom: 12,
  },
  rowText: { color: "#fff" },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    color: "#fff",
    paddingVertical: 10,
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  radioLabel: { fontWeight: "600" },
  radioLabelActive: { fontWeight: "600", color: "#000" },
  radio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
  },
  radioActive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#000",
  },
  disabledOption: { opacity: 0.5 },
  disabledNotice: {
    color: "#8b8b8b",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 6,
    marginLeft: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  totalLabel: { fontWeight: "600" },
  totalValue: { fontWeight: "700", color: "#1A1A8D" },
  dayCount: {
    textAlign: "right",
    color: "#555",
    fontSize: 12,
    marginTop: 4,
  },
  submit: {
    backgroundColor: "#34A853",
    alignSelf: "center",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 30,
  },
  submitText: { color: "#fff", fontWeight: "600" },
  modal: { backgroundColor: "#fff", borderRadius: 16, padding: 20 },
  modalInput: { borderBottomWidth: 1, marginBottom: 16 },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxInner: { width: 10, height: 10, backgroundColor: "#333" },
});
