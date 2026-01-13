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
import DatePickerModal from "@/components/DatePickerModal";
import TimePickerModal from "@/components/TimePickerModal";

export default function BuatPesanan() {
  const [tanggalSewa, setTanggalSewa] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [waktuKembali, setWaktuKembali] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [datePickerState, setDatePickerState] = useState<{
    visible: boolean;
    type: "sewa" | "kembali" | null;
  }>({ visible: false, type: null });
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const toggleModal = () => setModalVisible(!isModalVisible);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!tanggalSewa.trim()) newErrors.tanggalSewa = "Tanggal sewa wajib diisi";
    if (!tanggalKembali.trim()) newErrors.tanggalKembali = "Tanggal kembali wajib diisi";
    if (!waktuKembali.trim()) newErrors.waktuKembali = "Waktu kembali wajib diisi";
    if (!lokasi.trim()) newErrors.lokasi = "Lokasi pengambilan wajib diisi";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        
        <TouchableOpacity
          style={[styles.input, styles.touchableInput, errors.tanggalSewa && styles.inputError]}
          onPress={() => setDatePickerState({ visible: true, type: "sewa" })}
        >
          <Text style={[styles.inputText, !tanggalSewa && styles.placeholderText]}>
            {tanggalSewa || "Tanggal Penyewaan (dd/mm/yyyy)"}
          </Text>
        </TouchableOpacity>
        {errors.tanggalSewa && <Text style={styles.errorText}>{errors.tanggalSewa}</Text>}
        
        <TouchableOpacity
          style={[styles.input, styles.touchableInput, errors.tanggalKembali && styles.inputError]}
          onPress={() => setDatePickerState({ visible: true, type: "kembali" })}
        >
          <Text style={[styles.inputText, !tanggalKembali && styles.placeholderText]}>
            {tanggalKembali || "Tanggal Pengembalian (dd/mm/yyyy)"}
          </Text>
        </TouchableOpacity>
        {errors.tanggalKembali && <Text style={styles.errorText}>{errors.tanggalKembali}</Text>}
        
        <TouchableOpacity
          style={[styles.input, styles.touchableInput, errors.waktuKembali && styles.inputError]}
          onPress={() => setTimePickerVisible(true)}
        >
          <Text style={[styles.inputText, !waktuKembali && styles.placeholderText]}>
            {waktuKembali || "Waktu Pengembalian (HH:mm)"}
          </Text>
        </TouchableOpacity>
        {errors.waktuKembali && <Text style={styles.errorText}>{errors.waktuKembali}</Text>}
        
        <TextInput
          style={[styles.input, errors.lokasi && styles.inputError]}
          placeholder="Lokasi Pengambilan"
          placeholderTextColor="#eee"
          value={lokasi}
          onChangeText={(t) => { setLokasi(t); setErrors({...errors, lokasi: ""}); }}
        />
        {errors.lokasi && <Text style={styles.errorText}>{errors.lokasi}</Text>}
      </View>

      {/* DETAIL PEMBAYARAN */}
      <Text style={styles.sectionTitle3}>Detail Pembayaran</Text>
      <View style={styles.paymentSection}>
        <View style={styles.paymentCard}>
          <Text style={styles.totalText}>Total Keseluruhan:</Text>
          <Text style={styles.totalPrice}>Rp1.900.000</Text>
        </View>
      </View>

      {/* Date Picker Modal untuk Tanggal Sewa */}
      <DatePickerModal
        isVisible={datePickerState.visible && datePickerState.type === "sewa"}
        title="Pilih Tanggal Penyewaan"
        onConfirm={(date) => {
          setTanggalSewa(date);
          setErrors({...errors, tanggalSewa: ""});
          setDatePickerState({ visible: false, type: null });
        }}
        onCancel={() => setDatePickerState({ visible: false, type: null })}
      />

      {/* Date Picker Modal untuk Tanggal Kembali */}
      <DatePickerModal
        isVisible={datePickerState.visible && datePickerState.type === "kembali"}
        title="Pilih Tanggal Pengembalian"
        onConfirm={(date) => {
          setTanggalKembali(date);
          setErrors({...errors, tanggalKembali: ""});
          setDatePickerState({ visible: false, type: null });
        }}
        onCancel={() => setDatePickerState({ visible: false, type: null })}
      />

      {/* Time Picker Modal untuk Waktu Kembali */}
      <TimePickerModal
        isVisible={timePickerVisible}
        title="Pilih Waktu Pengembalian"
        onConfirm={(time) => {
          setWaktuKembali(time);
          setErrors({...errors, waktuKembali: ""});
          setTimePickerVisible(false);
        }}
        onCancel={() => setTimePickerVisible(false)}
      />
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
