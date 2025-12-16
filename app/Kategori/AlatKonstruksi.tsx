import { Responsive } from "@/src/constants/responsive";
import { useNavigation } from "@react-navigation/native";
import { useState, useLayoutEffect } from "react";
import { ActivityIndicator, Dimensions, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { CarCard } from "../../components/CarCard";
import { CarTypeFilter } from "../../components/CarTypeFilter";
import { SearchBar } from "../../components/SearchBar";

const { height } = Dimensions.get("window");

// Dummy data untuk Alat Konstruksi
const dummyAlatKonstruksi = [
  {
    id: "EXC001",
    code: "EXC001",
    name: "Excavator CAT 320",
    price: "2.500.000",
    pricePerDay: 2500000,
    location: "Jakarta Timur",
    lokasi: "Jakarta Timur",
    image: require("@/assets/images/audi.jpg"),
    imageName: "excavator-cat-320",
    transmission: "Manual" as const,
    seats: 2,
    bagCapacity: "Heavy Equipment",
    description: "Excavator CAT 320 dengan kondisi prima, cocok untuk proyek konstruksi besar.",
    carType: "City Car" as const,
  },
  {
    id: "BKL001",
    code: "BKL001",
    name: "Backhoe Loader JCB",
    price: "1.800.000",
    pricePerDay: 1800000,
    location: "Surabaya",
    lokasi: "Surabaya",
    image: require("@/assets/images/audi.jpg"),
    imageName: "backhoe-jcb",
    transmission: "Manual" as const,
    seats: 2,
    bagCapacity: "Heavy Equipment",
    description: "Backhoe Loader JCB 3CX, efisien untuk penggalian dan pembongkaran.",
    carType: "City Car" as const,
  },
  {
    id: "WHL001",
    code: "WHL001",
    name: "Wheel Loader Komatsu",
    price: "2.200.000",
    pricePerDay: 2200000,
    location: "Bandung",
    lokasi: "Bandung",
    image: require("@/assets/images/audi.jpg"),
    imageName: "wheel-loader-komatsu",
    transmission: "Manual" as const,
    seats: 2,
    bagCapacity: "Heavy Equipment",
    description: "Wheel Loader Komatsu untuk pengangkutan material dan pengerukan tanah.",
    carType: "City Car" as const,
  },
  {
    id: "VIB001",
    code: "VIB001",
    name: "Vibrating Roller Dynapac",
    price: "1.200.000",
    pricePerDay: 1200000,
    location: "Medan",
    lokasi: "Medan",
    image: require("@/assets/images/audi.jpg"),
    imageName: "vibrating-roller",
    transmission: "Manual" as const,
    seats: 1,
    bagCapacity: "Medium Equipment",
    description: "Vibrating Roller untuk pemadatan aspal dan tanah pada proyek jalan.",
    carType: "City Car" as const,
  },
  {
    id: "MIX001",
    code: "MIX001",
    name: "Concrete Mixer 500L",
    price: "500.000",
    pricePerDay: 500000,
    location: "Jakarta Pusat",
    lokasi: "Jakarta Pusat",
    image: require("@/assets/images/audi.jpg"),
    imageName: "concrete-mixer",
    transmission: "Manual" as const,
    seats: 1,
    bagCapacity: "Small Equipment",
    description: "Concrete Mixer dengan kapasitas 500 liter untuk pekerjaan beton.",
    carType: "City Car" as const,
  },
  {
    id: "POW001",
    code: "POW001",
    name: "Power Generator 15 kVA",
    price: "800.000",
    pricePerDay: 800000,
    location: "Yogyakarta",
    lokasi: "Yogyakarta",
    image: require("@/assets/images/audi.jpg"),
    imageName: "power-generator",
    transmission: "Manual" as const,
    seats: 1,
    bagCapacity: "Small Equipment",
    description: "Power Generator 15 kVA untuk supply listrik di lokasi proyek.",
    carType: "City Car" as const,
  },
];

const carTypes = ["All", "Excavator", "Loader", "Compactor", "Mixer", "Generator"];

export default function AlatKonstruksi() {
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
  const filteredTools = dummyAlatKonstruksi.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
                         tool.lokasi.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "All" || 
                       tool.name.toLowerCase().includes(selectedType.toLowerCase());
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
          ) : filteredTools.length === 0 ? (
            <Text style={styles.messageText}>Alat konstruksi tidak tersedia di saat ini.</Text>
          ) : (
            filteredTools.map((tool, index) => (
              <CarCard key={`${tool.code ?? tool.name}-${index}`} car={tool} />
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
