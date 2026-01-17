import { Responsive } from "@/src/constants/responsive";
import { useMobil } from "@/src/hooks/useMobil";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CarCard } from "../components/CarCard";
import { CarTypeFilter } from "../components/CarTypeFilter";
import { SearchBar } from "../components/SearchBar";

const { height } = Dimensions.get("window");

const getResponsivePaddingTop = () => {
  if (height < 700) return 8;
  if (height < 800) return 12;
  if (height < 900) return 16;
  return 20;
};

export default function MobilScreen() {
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
  } = useMobil();

  const navigation = useNavigation();
  const firstFocusRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstFocusRef.current) {
        firstFocusRef.current = false;
        return;
      }
      reload();
    }, [reload])
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require("../assets/images/Jenismobilbg.png")}
      style={styles.background}
      resizeMode="stretch"
    >
      <View
        style={[
          styles.screenContainer,
          { paddingTop: getResponsivePaddingTop() },
        ]}
      >
        {/* HEADER FIX */}
        <View style={styles.fixedHeader}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            onBackPress={handleBackPress}
          />
          <CarTypeFilter
            carTypes={carTypes}
            selectedType={selectedType}
            onSelect={setSelectedType}
          />
        </View>

        {/* SCROLL AREA – disamakan dengan ProdukKu */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : error ? (
            <Text style={styles.messageText}>{error}</Text>
          ) : filteredCars.length === 0 ? (
            <Text style={styles.messageText}>
              Data mobil tidak tersedia di saat ini.
            </Text>
          ) : (
            filteredCars.map((car, index) => (
              <CarCard
                key={`${car.code ?? car.name}-${index}`}
                car={car}
              />
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
    paddingBottom: 160, // konsisten dengan ProdukKu
  },
  messageText: {
    color: "#fff",
    textAlign: "center",
    marginTop: Responsive.spacing.lg,
    fontSize: Responsive.fontSize.lg,
  },
});
