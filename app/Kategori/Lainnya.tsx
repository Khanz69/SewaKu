import { ProductCategoryKey } from "@/src/constants/productCategories";
import { Responsive } from "@/src/constants/responsive";
import { useCategoryProducts } from "@/src/hooks/useCategoryProducts";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useLayoutEffect, useRef } from "react";
import { ActivityIndicator, Dimensions, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { CarCard } from "../../components/CarCard";
import { CarTypeFilter } from "../../components/CarTypeFilter";
import { SearchBar } from "../../components/SearchBar";

const { height } = Dimensions.get("window");
const CATEGORY_KEY: ProductCategoryKey = "lainnya";
const CATEGORY_CAR_TYPES = ["Medis", "Salon", "Hiburan", "Kuliner", "Edukasi"];

export default function Lainnya() {
  const navigation = useNavigation();
  const focusRef = useRef(true);
  const {
    selectedType,
    setSelectedType,
    search,
    setSearch,
    carTypes,
    filteredCars,
    loading,
    error,
    reload,
  } = useCategoryProducts({
    categoryKey: CATEGORY_KEY,
    carTypes: CATEGORY_CAR_TYPES,
    emptyMessage: "Kendaraan lainnya tidak tersedia di saat ini.",
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      if (focusRef.current) {
        focusRef.current = false;
        return;
      }
      reload();
    }, [reload])
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

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
          ) : error ? (
            <Text style={styles.messageText}>{error}</Text>
          ) : filteredCars.length === 0 ? (
            <Text style={styles.messageText}>Kendaraan lainnya tidak tersedia di saat ini.</Text>
          ) : (
            filteredCars.map((item, index) => (
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
