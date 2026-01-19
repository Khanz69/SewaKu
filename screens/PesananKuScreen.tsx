import { Responsive } from "@/src/constants/responsive";
import { usePesananKu } from "@/src/hooks/usePesananKu";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    ImageBackground,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import OrderCard from "../components/OrderCard";

export default function PesananKuScreen() {
  const {
    selectedTab,
    setSelectedTab,
    search,
    setSearch,
    tabs,
    orders,
    orderFlow,
    setOrderFlow,
    loading,
  } = usePesananKu();

  const [flowDropdownOpen, setFlowDropdownOpen] = useState(false);
  const flowLabel = useMemo(
    () => (orderFlow === "seller_to_customer" ? "Pesanan Masuk" : "Pesanan Keluar"),
    [orderFlow]
  );

  const filteredOrders = orders;

  return (
    <ImageBackground
      source={require("@/assets/images/PesananKu.png")}
      style={styles.background}
      resizeMode="stretch"
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

        <Text style={styles.sectionTitle}>Filter Pesanan</Text>
        <TouchableOpacity
          style={styles.dropdownToggle}
          onPress={() => setFlowDropdownOpen(true)}
        >
          <Text style={styles.dropdownLabel}>{flowLabel}</Text>
          <Text style={styles.dropdownCaret}>▾</Text>
        </TouchableOpacity>

        <Modal
          transparent
          animationType="fade"
          visible={flowDropdownOpen}
          onRequestClose={() => setFlowDropdownOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setFlowDropdownOpen(false)}
          >
            <View style={styles.dropdownList}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setOrderFlow("seller_to_customer");
                  setFlowDropdownOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Pesanan Masuk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setOrderFlow("customer_to_seller");
                  setFlowDropdownOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Pesanan Keluar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

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

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Belum ada pesanan. Yuk, buat pesanan dulu!
            </Text>
          </View>
        ) : (
          filteredOrders.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))
        )}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 6,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Responsive.spacing.lg,
  },
  dropdownToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#efbdbd86",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    marginBottom: 20,
  },
  dropdownLabel: {
    color: "#fff",
    fontSize: 16,
  },
  dropdownCaret: {
    color: "#fff",
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  dropdownList: {
    backgroundColor: "#fff",
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  tabButton: {
    backgroundColor: "#8B0000",
    paddingVertical: Responsive.spacing.sm,
    paddingHorizontal: Responsive.spacing.xxxl,
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
    fontSize: Responsive.fontSize.md,
  },
  tabTextActive: {
    color: "#C0342F",
    fontSize: Responsive.fontSize.md,
  },
  emptyState: {
    marginTop: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 16,
    borderRadius: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  loader: {
    marginTop: 24,
  },
});
