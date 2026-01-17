import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

export default function Dashboard() {
  const router = useRouter();

  const categories = [
    { name: "Alat Konstruksi", icon: require("@/assets/icons/beko.png"), route: "/Kategori/AlatKonstruksi" },
    { name: "Mobil", icon: require("@/assets/icons/mobil.png"), route: "/Kategori/Mobil" },
    { name: "Bus", icon: require("@/assets/icons/bus.png"), route: "/Kategori/Bus" },
    { name: "Motor", icon: require("@/assets/icons/motor.png"), route: "/Kategori/Motor" },
    { name: "Logistik", icon: require("@/assets/icons/logistik.png"), route: "/Kategori/Logistik" },
    { name: "Lainnya", icon: require("@/assets/icons/lainnya.png"), route: "/Kategori/Lainnya" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("@/assets/images/HalUbg.png")}
        style={styles.background}
        resizeMode= "stretch" 
      >
        <View style={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.subtitle}>Kategori</Text>

        {/* Grid Kategori */}
        <View style={styles.grid}>
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => item.route && router.push(item.route as any)}
            >
              <Image source={item.icon} style={styles.icon} />
              <Text style={styles.cardText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Versi Aplikasi: 1.0.0 {"\n"}2025 SewaKu</Text>
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    flex: 1,
    padding: 20,
    paddingTop: height * 0.42,
    paddingBottom: 90,
    justifyContent: "space-between",
  },
  subtitle: {
    color: "rgba(164, 44, 44, 1)",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
    fontFamily:"sfbold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 0,
  },
  card: {
    backgroundColor: "rgba(164, 44, 44, 1)",
    width: "30%",
    height: 80,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginBottom: 8,
  },
  cardText: {
    color: "#fff",
    fontWeight: "light",
    textAlign: "center",
    fontSize: 8,
  },
  footer: {
    color: "#000000ff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 8,
    opacity: 0.8,
  },
});
