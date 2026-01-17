// components/ui/ProductDetailModal.tsx
import type { Product } from "@/src/types/product";
import { resolveProductImage } from "@/src/utils/productImage";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  product?: Partial<Product>;
  onClose: () => void;
};

export default function ProductDetailModal({ visible, product, onClose }: Props) {
  if (!visible || !product) return null;

  const heroImage = resolveProductImage(product.image);

  const rows: { label: string; value?: string | number }[] = [
    { label: "Nama Produk", value: product.name },
    { label: "Harga / hari", value: product.pricePerDay != null ? `Rp${Number(product.pricePerDay).toLocaleString("id-ID")}` : undefined },
    { label: "Lokasi", value: product.lokasi },
    { label: "Transmisi", value: product.transmission },
    { label: "Jumlah Kursi", value: product.seats },
    { label: "Plat Nomor", value: product.plateNumber },
    { label: "Kapasitas Bagasi", value: product.bagCapacity },
    { label: "Subkategori", value: product.subCategory },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.header}>
            <Text style={s.title}>Detail Produk</Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Text style={s.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={s.content}>
            {heroImage ? (
              <Image source={heroImage} style={s.heroImg} />
            ) : (
              <View style={[s.heroImg, s.heroPlaceholder]} />
            )}

            <View style={s.summary}>
              <Text style={s.name}>{product.name ?? "-"}</Text>
              <Text style={s.price}>
                {product.pricePerDay != null
                  ? `Rp${Number(product.pricePerDay).toLocaleString("id-ID")} `
                  : "- "}
                <Text style={s.pricePerDay}>/ hari</Text>
              </Text>
            </View>

            <View style={s.infoTable}>
              {rows.map((r) => (
                <View key={r.label} style={s.row}>
                  <Text style={s.cellLabel}>{r.label}</Text>
                  <Text style={s.cellValue}>
                    {r.value !== undefined && r.value !== "" ? String(r.value) : "-"}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={s.sectionTitle}>Deskripsi</Text>
              <Text style={s.descText}>
                {product.description?.trim() ? product.description : "-"}
              </Text>
            </View>
          </ScrollView>

          <View style={s.footer}>
            <TouchableOpacity onPress={onClose} style={s.primaryBtn}>
              <Text style={s.primaryTxt}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  sheet: { maxHeight: "85%", backgroundColor: "white", borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: "hidden" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#e5e7eb" },
  title: { fontSize: 16, fontWeight: "700", color: "#0f1e4a", flex: 1 },
  closeBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  closeTxt: { fontSize: 16, color: "#111" },
  content: { padding: 16 },
  heroImg: { width: "100%", height: 180, borderRadius: 12, backgroundColor: "#f3f4f6" },
  heroPlaceholder: { alignItems: "center", justifyContent: "center" },
  summary: { marginTop: 12 },
  name: { fontSize: 16, fontWeight: "700", color: "#000" },
  price: { color: "#1A1A8D", fontWeight: "bold", marginTop: 4, fontSize: 14 },
  pricePerDay: { color: "#1A1A8D", fontSize: 12 },
  infoTable: { marginTop: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb", borderRadius: 10, overflow: "hidden" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "white", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#e5e7eb" },
  cellLabel: { color: "#6b7280", fontSize: 12, width: "45%" },
  cellValue: { color: "#111827", fontSize: 12, width: "55%", textAlign: "right" },
  sectionTitle: { fontWeight: "700", color: "#111827", marginBottom: 6 },
  descText: { color: "#374151", fontSize: 12, lineHeight: 18 },
  footer: { padding: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#e5e7eb" },
  primaryBtn: { backgroundColor: "#0f1e4a", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  primaryTxt: { color: "white", fontWeight: "700" },
});
