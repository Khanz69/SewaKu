import { PRODUCT_CATEGORIES } from "@/src/constants/productCategories";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PilihKategoriProduk() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Tambah Produk</Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            Pilih kategori kendaraan yang akan ditambahkan.
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {PRODUCT_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/Produk/Tambah",
                params: {
                  categoryKey: category.key,
                },
              })
            }
          >
            <View style={styles.cardRow}>
              <Image source={category.icon} style={styles.cardIcon} />
              <View style={styles.cardText}> 
                <Text style={styles.cardTitle}>{category.label}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 28,
    paddingHorizontal: 20,
    backgroundColor: "#A83232",
  },
  headerContainer: {
    marginBottom: 5,
    paddingBottom: 8,
  },
  headerText: {
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginLeft: 35,
    fontFamily: "SFHeavyItalic",
  },
  subtitle: {
    color: "#fff",
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 25,
    lineHeight: 17,
  },
  backBtn: {
    position: "absolute",
    marginLeft: -10,
    top: 0,
    left: 0,
    padding: 1,
  },
  list: {
    paddingTop: 14,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A8D",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
  cardText: {
    marginLeft: 12,
    flex: 1,
  },
});
