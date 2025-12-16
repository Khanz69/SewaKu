import { Responsive } from "@/src/constants/responsive";
import { useNavigation } from "@react-navigation/native";
import { useState, useLayoutEffect } from "react";
import { ActivityIndicator, Dimensions, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { CarCard } from "../../components/CarCard";
import { CarTypeFilter } from "../../components/CarTypeFilter";
import { SearchBar } from "../../components/SearchBar";

const { height } = Dimensions.get("window");

// Dummy data untuk Lainnya
const dummyLainnya = [
  {
    id: "LIN001",
    code: "LIN001",
    name: "Ambulans Toyota Hiace",
    price: "800.000",
    pricePerDay: 800000,
    location: "Jakarta Pusat",
    lokasi: "Jakarta Pusat",
    image: require("@/assets/images/audi.jpg"),
    imageName: "ambulans-toyota-hiace",
    transmission: "Automatic" as const,
    seats: 3,
    bagCapacity: "Large",
    description: "Ambulans standar dengan peralatan medical lengkap untuk kedaraan darurat medis.",
    carType: "MPV" as const,
  },
  {
    id: "LIN002",
    code: "LIN002",
    name: "Mobil Jenazah Isuzu",
    price: "1.000.000",
    pricePerDay: 1000000,
    location: "Surabaya",
    lokasi: "Surabaya",
    image: require("@/assets/images/audi.jpg"),
    imageName: "mobil-jenazah-isuzu",
    transmission: "Manual" as const,
    seats: 2,
    bagCapacity: "Large",
    description: "Mobil jenazah dengan interior khusus dan handling profesional untuk kebutuhan pemakaman.",
    carType: "City Car" as const,
  },
  {
    id: "LIN003",
    code: "LIN003",
    name: "Mobil Salon Kecantikan Mobile",
    price: "1.200.000",
    pricePerDay: 1200000,
    location: "Bandung",
    lokasi: "Bandung",
    image: require("@/assets/images/audi.jpg"),
    imageName: "salon-mobile-van",
    transmission: "Automatic" as const,
    seats: 2,
    bagCapacity: "Medium",
    description: "Mobil salon mobile dengan peralatan kecantikan lengkap untuk layanan ke lokasi.",
    carType: "City Car" as const,
  },
  {
    id: "LIN004",
    code: "LIN004",
    name: "Mobil Escape Room Premium",
    price: "900.000",
    pricePerDay: 900000,
    location: "Medan",
    lokasi: "Medan",
    image: require("@/assets/images/audi.jpg"),
    imageName: "escape-room-mobile",
    transmission: "Automatic" as const,
    seats: 5,
    bagCapacity: "Large",
    description: "Mobil escape room dengan desain interior interaktif untuk hiburan keluarga dan grup.",
    carType: "MPV" as const,
  },
  {
    id: "LIN005",
    code: "LIN005",
    name: "Food Truck Kuliner",
    price: "1.500.000",
    pricePerDay: 1500000,
    location: "Yogyakarta",
    lokasi: "Yogyakarta",
    image: require("@/assets/images/audi.jpg"),
    imageName: "food-truck-kuliner",
    transmission: "Manual" as const,
    seats: 2,
    bagCapacity: "Large",
    description: "Food truck lengkap dengan dapur mobile untuk usaha kuliner dan catering event.",
    carType: "City Car" as const,
  },
  {
    id: "LIN006",
    code: "LIN006",
    name: "Mobil Perpustakaan Keliling",
    price: "1.100.000",
    pricePerDay: 1100000,
    location: "Lampung",
    lokasi: "Lampung",
    image: require("@/assets/images/audi.jpg"),
    imageName: "perpustakaan-keliling",
    transmission: "Manual" as const,
    seats: 2,
    bagCapacity: "Large",
    description: "Mobil perpustakaan keliling dengan koleksi buku dan fasilitas baca untuk edukasi masyarakat.",
    carType: "City Car" as const,
  },
];

const carTypes = ["All", "Medis", "Salon", "Hiburan", "Kuliner", "Edukasi"];

export default function Lainnya() {
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
  const filteredLainnya = dummyLainnya.filter((item) => {
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
          ) : filteredLainnya.length === 0 ? (
            <Text style={styles.messageText}>Kendaraan lainnya tidak tersedia di saat ini.</Text>
          ) : (
            filteredLainnya.map((item, index) => (
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
