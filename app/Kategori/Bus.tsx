import { Responsive } from "@/src/constants/responsive";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { CarCard } from "../../components/CarCard";
import { CarTypeFilter } from "../../components/CarTypeFilter";
import { SearchBar } from "../../components/SearchBar";

const { height } = Dimensions.get("window");

// Dummy data untuk Bus
const dummyBus = [
  {
    id: "BUS001",
    code: "BUS001",
    name: "Bus Pariwisata Mercedes 50 Penumpang",
    price: "3.500.000",
    pricePerDay: 3500000,
    location: "Jakarta Pusat",
    lokasi: "Jakarta Pusat",
    image: require("@/assets/images/audi.jpg"),
    imageName: "bus-mercedes-50",
    transmission: "Automatic" as const,
    seats: 50,
    bagCapacity: "Large",
    description: "Bus Pariwisata Mercedes dengan kapasitas 50 penumpang, AC, dan fasilitas lengkap untuk perjalanan jauh.",
    carType: "MPV" as const,
  },
  {
    id: "BUS002",
    code: "BUS002",
    name: "Bus Mewah Hino 47 Penumpang",
    price: "3.200.000",
    pricePerDay: 3200000,
    location: "Surabaya",
    lokasi: "Surabaya",
    image: require("@/assets/images/audi.jpg"),
    imageName: "bus-hino-47",
    transmission: "Automatic" as const,
    seats: 47,
    bagCapacity: "Large",
    description: "Bus Mewah Hino dengan kursi empuk, AC powerful, dan toilet. Cocok untuk perjalanan wisata.",
    carType: "MPV" as const,
  },
  {
    id: "BUS003",
    code: "BUS003",
    name: "Bus Medium Isuzu 30 Penumpang",
    price: "2.200.000",
    pricePerDay: 2200000,
    location: "Bandung",
    lokasi: "Bandung",
    image: require("@/assets/images/audi.jpg"),
    imageName: "bus-isuzu-30",
    transmission: "Manual" as const,
    seats: 30,
    bagCapacity: "Medium",
    description: "Bus Medium Isuzu dengan kapasitas 30 penumpang, cocok untuk rombongan kelas atau acara perusahaan.",
    carType: "MPV" as const,
  },
  {
    id: "BUS004",
    code: "BUS004",
    name: "Bus Mini Mitsubishi 20 Penumpang",
    price: "1.500.000",
    pricePerDay: 1500000,
    location: "Medan",
    lokasi: "Medan",
    image: require("@/assets/images/audi.jpg"),
    imageName: "bus-mitsubishi-20",
    transmission: "Manual" as const,
    seats: 20,
    bagCapacity: "Medium",
    description: "Bus Mini Mitsubishi dengan kapasitas 20 penumpang, ekonomis dan fleksibel untuk berbagai keperluan.",
    carType: "MPV" as const,
  },
  {
    id: "BUS005",
    code: "BUS005",
    name: "Bus Sekolah Toyota 45 Penumpang",
    price: "2.800.000",
    pricePerDay: 2800000,
    location: "Yogyakarta",
    lokasi: "Yogyakarta",
    image: require("@/assets/images/audi.jpg"),
    imageName: "bus-toyota-45",
    transmission: "Automatic" as const,
    seats: 45,
    bagCapacity: "Large",
    description: "Bus Sekolah Toyota dengan kursi nyaman, AC, dan sistem keamanan terbaik untuk perjalanan aman.",
    carType: "MPV" as const,
  },
  {
    id: "BUS006",
    code: "BUS006",
    name: "Bus VIP Scania 40 Penumpang",
    price: "4.000.000",
    pricePerDay: 4000000,
    location: "Lampung",
    lokasi: "Lampung",
    image: require("@/assets/images/audi.jpg"),
    imageName: "bus-scania-40",
    transmission: "Automatic" as const,
    seats: 40,
    bagCapacity: "Large",
    description: "Bus VIP Scania dengan interior mewah, kursi semi bed, pantry, dan toilet. Premium untuk liburan istimewa.",
    carType: "MPV" as const,
  },
];

const carTypes = ["All", "Pariwisata", "Mewah", "Medium", "Mini", "VIP"];

export default function Bus() {
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
  const filteredBus = dummyBus.filter((bus) => {
    const matchesSearch = bus.name.toLowerCase().includes(search.toLowerCase()) ||
                         bus.lokasi.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "All" || 
                       bus.name.toLowerCase().includes(selectedType.toLowerCase());
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
          ) : filteredBus.length === 0 ? (
            <Text style={styles.messageText}>Bus tidak tersedia di saat ini.</Text>
          ) : (
            filteredBus.map((bus, index) => (
              <CarCard key={`${bus.code ?? bus.name}-${index}`} car={bus} />
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
