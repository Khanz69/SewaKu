import { useRouter } from "expo-router";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Dashboard() {
  const router = useRouter();

  const categories = [
    { name: "Alat Konstruksi", icon: require("@/assets/icons/beko.png") },
    { name: "Mobil", icon: require("@/assets/icons/mobil.png"), route: "/Kategori/Mobil" },
    { name: "Bus", icon: require("@/assets/icons/bus.png") },
    { name: "Motor", icon: require("@/assets/icons/motor.png") },
    { name: "Logistik", icon: require("@/assets/icons/logistik.png") },
    { name: "Lainnya", icon: require("@/assets/icons/lainnya.png") },
  ];

  return (
    <ImageBackground
      source={require("@/assets/images/HalUbg.png")}
      style={styles.background}
      resizeMode= "stretch" 
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.subtitle}>Kategori</Text>

        {/* Grid Kategori */}
        <View style={styles.grid}>
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => item.route && router.push(item.route)}
            >
              <Image source={item.icon} style={styles.icon} />
              <Text style={styles.cardText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Versi Aplikasi: 1.0.0 {"\n"}2025 SewaKu</Text>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 230,
  },
  subtitle: {
    color: "rgba(164, 44, 44, 1)",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 40,
    fontFamily:"sfregular"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
    marginTop: 30,
    fontSize: 8,
    opacity: 0.8,
  },
});
