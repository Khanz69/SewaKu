import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function BuatPesanan() {
  const [tanggalSewa, setTanggalSewa] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [waktuKembali, setWaktuKembali] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => setModalVisible(!isModalVisible);

  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      {/* PRODUK */}
      <View style={styles.productContainer}>
        {/* Tombol Back */}
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1b1515ff" />
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Produk</Text>
        <View style={styles.productCard}>
          <Image
            source={require("@/assets/images/audi.jpg")}
            style={styles.carImage}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.carName}>Audi Q3 Sportback</Text>
            <Text style={styles.carInfo}>ID: KDJ4951</Text>
            <Text style={styles.carInfo}>Plat Nomor: F495342</Text>
            <Text style={styles.carPrice}>Harga Sewa: Rp850.000/hari</Text>
            <Text style={styles.carInfo}>Lokasi: Jakarta Selatan</Text>
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
      </View>
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
});
