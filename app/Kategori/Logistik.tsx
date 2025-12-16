import { Responsive } from "@/src/constants/responsive";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { CarCard } from "../../components/CarCard";
import { CarTypeFilter } from "../../components/CarTypeFilter";
import { SearchBar } from "../../components/SearchBar";

const { height } = Dimensions.get("window");

// Dummy data untuk Logistik
const dummyLogistik = [
  {
    id: "LOG001",
    code: "LOG001",
    name: "Pickup Box 1 Ton Mitsubishi",
    price: "600.000",
    pricePerDay: 600000,
    location: "Jakarta Pusat",
    lokasi: "Jakarta Pusat",
    image: require("@/assets/images/audi.jpg"),
    imageName: "mitsubishi-pickup-1ton",
    transmission: "Manual" as const,
    seats: 2,
    bagCapacity: "1000 kg",
    description: "Pickup box dengan kapasitas 1 ton, cocok untuk pengiriman barang dalam kota.",
    carType: "City Car" as const,
  },
  {
    id: "LOG002",
    code: "LOG002",
    name: "Truk Engkel 5 Ton Hino",
    price: "1.200.000",
    pricePerDay: 1200000,
    location: "Surabaya",
    lokasi: "Surabaya",
    image: require("@/assets/images/audi.jpg"),
    imageName: "hino-engkel-5ton",
    transmission: "Manual" as const,
    seats: 2,
    bagCapacity: "5000 kg",
    description: "Truk engkel dengan kapasitas 5 ton, ideal untuk logistik regional dan pengiriman barang berat.",
    carType: "City Car" as const,
  },
  {
    id: "LOG003",
    code: "LOG003",
    name: "Truk Box Double Cabin Isuzu 6 Ton",
    price: "1.500.000",
    pricePerDay: 1500000,
    location: "Bandung",
    lokasi: "Bandung",
    image: require("@/assets/images/audi.jpg"),
    imageName: "isuzu-box-6ton",
    transmission: "Manual" as const,
    seats: 3,
    bagCapacity: "6000 kg",
    description: "Truk box double cabin dengan kapasitas 6 ton, nyaman dan powerful untuk pengiriman jarak jauh.",
    carType: "City Car" as const,
  },
  {
    id: "LOG004",
    code: "LOG004",
    name: "Pickup Bak Terbuka Toyota 2 Ton",
    price: "750.000",
    pricePerDay: 750000,
    location: "Medan",
    lokasi: "Medan",
    image: require("@/assets/images/audi.jpg"),
    imageName: "toyota-pickup-2ton",
    transmission: "Manual" as const,
    seats: 2,
    bagCapacity: "2000 kg",
    description: "Pickup bak terbuka 2 ton, fleksibel untuk berbagai jenis pengiriman dan muatan.",
    carType: "City Car" as const,
  },
  {
    id: "LOG005",
    code: "LOG005",
    name: "Truk Colt Double Cabin 3.5 Ton",
    price: "950.000",
    pricePerDay: 950000,
    location: "Yogyakarta",
    lokasi: "Yogyakarta",
    image: require("@/assets/images/audi.jpg"),
    imageName: "colt-double-cabin-3.5ton",
    transmission: "Manual" as const,
    seats: 3,
    bagCapacity: "3500 kg",
    description: "Truk Colt double cabin 3.5 ton dengan ruang kabin luas dan lega untuk pengiriman efisien.",
    carType: "City Car" as const,
  },
  {
    id: "LOG006",
    code: "LOG006",
    name: "Truk Tangki Pertamina 5000 Liter",
    price: "2.000.000",
    pricePerDay: 2000000,
    location: "Lampung",
    lokasi: "Lampung",
    image: require("@/assets/images/audi.jpg"),
    imageName: "tangki-5000liter",
    transmission: "Manual" as const,
    seats: 2,
    bagCapacity: "5000 L",
    description: "Truk tangki dengan kapasitas 5000 liter, spesial untuk pengangkutan cairan dan bahan kimia.",
    carType: "City Car" as const,
  },
];

const carTypes = ["All", "Pickup", "Truk", "Box", "Double Cabin", "Tangki"];

export default function Logistik() {
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [loading] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Filter berdasarkan search dan type
  const filteredLogistik = dummyLogistik.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.lokasi.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "All" || 
                       item.name.toLowerCase().includes(selectedType.toLowerCase());
    return matchesSearch && matchesType;
  });

  // Hitung padding top responsif berdasarkan tinggi screen
  const getResponsivePaddingTop = () => {
    if (height < 700) return 8;
    if (height < 800) return 12;
    if (height < 900) return 16;
    return 20;
  };

  return (
    <ImageBackground
      source={require("../../assets/images/Jenismobilbg.png")}
      style={styles.background}
      resizeMode="stretch"
    >
      <View style={[styles.screenContainer, { paddingTop: getResponsivePaddingTop() }]}>
        <View style={styles.fixedHeader}>
          <SearchBar value={search} onChangeText={setSearch} onBackPress={handleBackPress} />
          <CarTypeFilter
            carTypes={carTypes}
            selectedType={selectedType}
            onSelect={setSelectedType}
          />
        </View>
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : filteredLogistik.length === 0 ? (
            <Text style={styles.messageText}>Logistik tidak tersedia di saat ini.</Text>
          ) : (
            filteredLogistik.map((item, index) => (
              <CarCard key={`${item.code ?? item.name}-${index}`} car={item} />
            ))
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  screenContainer: {
    flex: 1,
    padding: Responsive.containerPadding.horizontal,
  },
  fixedHeader: {
    marginBottom: Responsive.spacing.md,
  },
  scrollArea: {
    flex: 1,
  },
  listContainer: {
    marginTop: 0,
    paddingBottom: 100,
  },
  messageText: {
    color: "#fff",
    textAlign: "center",
    marginTop: Responsive.spacing.lg,
    fontSize: Responsive.fontSize.lg,
  },
});
