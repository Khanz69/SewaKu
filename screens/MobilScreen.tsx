import { useMobil } from "@/src/hooks/useMobil";
import { useNavigation } from "@react-navigation/native"; // Impor useNavigation
import React from "react";
import { ActivityIndicator, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { CarCard } from "../components/CarCard";
import { CarTypeFilter } from "../components/CarTypeFilter";
import { SearchBar } from "../components/SearchBar";

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
  } = useMobil();
  const navigation = useNavigation(); // Inisialisasi navigasi

  // Fungsi untuk kembali ke halaman sebelumnya
  const handleBackPress = () => {
    navigation.goBack();  // Navigasi mundur ke halaman sebelumnya
  };

  return (
    <ImageBackground
      source={require("../assets/images/Jenismobilbg.png")}
      style={styles.background}
      resizeMode="stretch"
    >
      <View style={styles.screenContainer}>
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
            <Text style={styles.messageText}>Data mobil tidak tersedia di saat ini.</Text>
          ) : (
            filteredCars.map((car, index) => (
              <CarCard key={`${car.code ?? car.name}-${index}`} car={car} />
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
    padding: 10,
  },
  fixedHeader: {
    marginBottom: 12,
  },
  scrollArea: {
    flex: 1,
  },
  listContainer: {
    marginTop: 0,
  },
  messageText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
  },
});
