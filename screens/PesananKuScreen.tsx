import { Responsive } from "@/src/constants/responsive";
import { usePesananKu } from "@/src/hooks/usePesananKu";
import { Ionicons } from "@expo/vector-icons";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import OrderCard from "../components/OrderCard";

export default function PesananKuScreen() {
  const { selectedTab, setSelectedTab, search, setSearch, tabs, orders } =
    usePesananKu();

  return (
    <ImageBackground
      source={require("@/assets/images/PesananKu.png")}
      style={styles.background}
      resizeMode="stretch"
    >
      <ScrollView style={styles.container}>
        <Text style={styles.header}>PesananKu</Text>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#000" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pesanan"
            placeholderTextColor="#555"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {orders.map((order, index) => (
          <OrderCard key={index} order={order} />
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "110%",
  },
  container: {
    flex: 1,
    padding: Responsive.containerPadding.horizontal,
    paddingBottom: 150,
  },
  header: {
    alignSelf: "center",
    color: "#fff",
    fontSize: Responsive.fontSize.display,
    fontFamily: "SFHeavyItalic",
    marginTop: Responsive.spacing.xxxl,
    marginBottom: Responsive.spacing.lg,
  },
  searchBox: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Responsive.borderRadius.xl,
    paddingHorizontal: Responsive.spacing.md,
    paddingVertical: Responsive.spacing.sm,
    marginBottom: Responsive.spacing.lg,
  },
  searchInput: {
    flex: 1,
    marginLeft: Responsive.spacing.sm,
    color: "#000",
    fontSize: Responsive.fontSize.md,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Responsive.spacing.lg,
  },
  tabButton: {
    backgroundColor: "#8B0000",
    paddingVertical: Responsive.spacing.xs,
    paddingHorizontal: Responsive.spacing.xxl,
    borderRadius: Responsive.borderRadius.xl,
    opacity: 0.6,
  },
  tabButtonActive: {
    backgroundColor: "#fff",
    opacity: 1,
  },
  tabText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: Responsive.fontSize.sm,
  },
  tabTextActive: {
    color: "#C0342F",
    fontSize: Responsive.fontSize.sm,
  },
});
