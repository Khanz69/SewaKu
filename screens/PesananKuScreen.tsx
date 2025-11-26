import { usePesananKu } from "@/src/hooks/usePesananKu";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
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
    padding: 10,
  },
  header: {
    alignSelf: "center",
    color: "#fff",
    fontSize: 30,
    fontFamily: "SFHeavyItalic",
    marginTop: 55,
    marginBottom: 15,
  },
  searchBox: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#000",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  tabButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 6,
    paddingHorizontal: 26,
    borderRadius: 20,
    opacity: 0.6,
  },
  tabButtonActive: {
    backgroundColor: "#fff",
    opacity: 1,
  },
  tabText: {
    color: "#fff",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#C0342F",
  },
});
