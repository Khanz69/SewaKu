import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ConfirmPesanan() {
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
  }>();

  const status = useMemo(
    () => (params.status ?? "pending").toLowerCase(),
    [params.status]
  );
  const isPending = status === "pending";

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
        <Text style={styles.headerTitle}>Konfirmasi Pesanan</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{params.name ?? "Detail Produk"}</Text>
        <Text style={styles.text}>ID: {params.id ?? "-"}</Text>
        <Text style={styles.text}>Harga: {params.price ?? "-"}</Text>
        <Text style={styles.text}>Lokasi: {params.location ?? "-"}</Text>
        <View style={styles.divider} />
        <Text style={styles.text}>Tanggal Sewa: {params.tanggalSewa ?? "-"}</Text>
        <Text style={styles.text}>Tanggal Kembali: {params.tanggalKembali ?? "-"}</Text>
        <Text style={styles.text}>Waktu Kembali: {params.waktuKembali ?? "-"}</Text>
        <Text style={styles.text}>Lokasi Pengambilan: {params.lokasi ?? "-"}</Text>
      </View>

      <TouchableOpacity
        style={[styles.confirmButton, !isPending && styles.disabledButton]}
        disabled={!isPending}
        onPress={() =>
          router.replace({
            pathname: "/Pesanan/DetailPesanan",
            params: {
              id: params.id,
              name: params.name,
              price: params.price,
              location: params.location,
              status: "confirmed",
              tanggalSewa: params.tanggalSewa,
              tanggalKembali: params.tanggalKembali,
              waktuKembali: params.waktuKembali,
              lokasi: params.lokasi,
            },
          })
        }
      >
        <Text style={styles.confirmText}>
          {isPending ? "Konfirmasi Pesanan" : "Pesanan Sudah Dikonfirmasi"}
        </Text>
      </TouchableOpacity>
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
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginVertical: 12,
  },
  confirmButton: {
    backgroundColor: "#1db053",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  confirmText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
