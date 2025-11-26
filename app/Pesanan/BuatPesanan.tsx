import { productRepository } from "@/src/repositories/productRepository";
import type { Product } from "@/src/types/product";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

export default function BuatPesanan() {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    pricePerDay?: string;
    price?: string;
    location?: string;
    plateNumber?: string;
  }>();

  const [tanggalSewa, setTanggalSewa] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [waktuKembali, setWaktuKembali] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [remoteProduct, setRemoteProduct] = useState<Product | null>(null);
  const toggleModal = () => setModalVisible(!isModalVisible);

  const router = useRouter();

  useEffect(() => {
    if (!params.id) return;
    let mounted = true;

    productRepository
      .getById(params.id)
      .then((item) => {
        if (mounted) {
          setRemoteProduct(item);
        }
      })
      .catch((error) => console.warn("Gagal ambil produk untuk pesanan:", error));

    return () => {
      mounted = false;
    };
  }, [params.id]);

  const fallbackProduct = useMemo<Product>(() => {
    const priceValue = params.pricePerDay ?? params.price ?? "0";
    const numericPrice = Number(priceValue);

    return {
      id: params.id ?? "",
      name: params.name ?? "Detail Produk",
      pricePerDay: Number.isFinite(numericPrice) ? numericPrice : 0,
      lokasi: params.location ?? "",
      plateNumber: params.plateNumber,
      createdAt: Date.now(),
    };
  }, [params.id, params.name, params.pricePerDay, params.price, params.location, params.plateNumber]);

  const displayedProduct = remoteProduct ?? fallbackProduct;

  // Fungsi untuk kembali ke halaman sebelumnya
  const handleBackPress = () => {
    router.back(); // Menggunakan router.back() untuk navigasi mundur
  };

  return (
    <ScrollView style={styles.container}>
      {/* PRODUK */}
      <View style={styles.productContainer}>
        {/* Tombol Back sejajar dengan judul */}
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1b1515ff" />
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Produk</Text>
        <View style={styles.productCard}>
          {displayedProduct.image ? (
            <Image source={{ uri: displayedProduct.image }} style={styles.carImage} />
          ) : (
            <View style={[styles.carImage, styles.emptyImage]} />
          )}
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.carName}>{displayedProduct.name}</Text>
            <Text style={styles.carInfo}>
              Plat Nomor: {displayedProduct.plateNumber ?? "-"}
            </Text>
            <Text style={styles.carPrice}>
              Harga Sewa: Rp{displayedProduct.pricePerDay.toLocaleString("id-ID")} /hari
            </Text>
            <Text style={styles.carInfo}>
              Lokasi: {displayedProduct.lokasi || "-"}
            </Text>
          </View>
        </View>
      </View>

      {/* DETAIL PENYEWAAN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detail Penyewaan</Text>
        <TextInput
          style={styles.input}
          placeholder="Tanggal Penyewaan (mm/dd/yy)"
          placeholderTextColor="#eee"
          value={tanggalSewa}
          onChangeText={setTanggalSewa}
        />
        <TextInput
          style={styles.input}
          placeholder="Tanggal Pengembalian (mm/dd/yy)"
          placeholderTextColor="#eee"
          value={tanggalKembali}
          onChangeText={setTanggalKembali}
        />
        <TextInput
          style={styles.input}
          placeholder="Waktu Pengembalian (07:15)"
          placeholderTextColor="#eee"
          value={waktuKembali}
          onChangeText={setWaktuKembali}
        />
        <TextInput
          style={styles.input}
          placeholder="Lokasi Pengambilan"
          placeholderTextColor="#eee"
          value={lokasi}
          onChangeText={setLokasi}
        />
      </View>

      {/* DETAIL PEMBAYARAN */}
      <Text style={styles.sectionTitle3}>Detail Pembayaran</Text>
      <View style={styles.paymentSection}>
        <View style={styles.paymentCard}>
          <Text style={styles.totalText}>Total Keseluruhan:</Text>
          <Text style={styles.totalPrice}>Rp1.900.000</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={toggleModal}>
          <Text style={styles.buttonText}>Buat Pesanan</Text>
        </TouchableOpacity>
      </View>

      {/* 🔻 MODAL (BOTTOM SHEET) */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Formulir Penyewaan</Text>

          <View style={styles.modalInnerBox}>
            <Text style={styles.modalLabel}>Masukkan Foto KTP Asli</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="KTP.jpg"
              placeholderTextColor="#eee"
            />

            <Text style={styles.modalLabel}>Masukkan Foto SIM Asli</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="SIM.jpg"
              placeholderTextColor="#eee"
            />

            <Text style={styles.modalLabel}>Nomor yang Dapat Dihubungi</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="08xxxxxx"
              placeholderTextColor="#eee"
            />

            {/* ✅ tambahan kecil agar modal tertutup dulu sebelum pindah halaman */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false); // tutup modal dulu
                setTimeout(() => {
                  router.push("/(tabs)/PesananKu"); // baru pindah halaman
                }, 300); // jeda 0.3 detik biar animasi sempat jalan
              }}
            >
              <Text style={styles.modalButtonText}>Kirim Formulir</Text>
            </TouchableOpacity>
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
  emptyImage: {
    backgroundColor: "#eee",
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
  section: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    width: 175,
    alignSelf: "center",
    textAlign: "center",
    backgroundColor: "#C0342F",
    color: "white",
    fontWeight: "600",
    paddingHorizontal: 30,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    paddingVertical: 8,
    color: "white",
    fontSize: 14,
    marginBottom: 10,
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
    flexDirection: "row",
    height: 70,
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
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
  button: {
    backgroundColor: "#34A853",
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "center",
    width: 160,
    height: 35,
    marginTop: -20,
    zIndex: 1,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    paddingLeft: 40,
    paddingBottom: 12,
    fontFamily: "SFMedium",
  },

  // 🔻 Modal Styles
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    alignSelf: "center",
    backgroundColor: "#C0342F",
    color: "white",
    fontWeight: "600",
    paddingHorizontal: 30,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 15,
  },
  modalInnerBox: {
    backgroundColor: "rgba(207, 87, 87, 1)",
    borderRadius: 15,
    padding: 15,
  },
  modalLabel: {
    color: "white",
    marginBottom: 5,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    color: "white",
    marginBottom: 15,
    paddingVertical: 5,
  },
  modalButton: {
    backgroundColor: "#34A853",
    paddingVertical: 10,
    marginLeft: 35,
    borderRadius: 20,
    marginTop: 10,
    width: 150,
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});
