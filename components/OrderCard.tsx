import { Order } from "@/src/types/order";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  order: Order;
};

export default function OrderCard({ order }: Props) {
  const router = useRouter();

  return (
    <View style={styles.orderCard}>
      <Image source={order.image} style={styles.orderImage} />
      <View style={styles.verticalLine} />
      <View style={styles.orderInfo}>
        <Text style={styles.orderName}>{order.name}</Text>
        <Text style={styles.orderPrice}>{order.price}</Text>
        <Text style={styles.orderDetail}>ID: {order.id}</Text>
        <Text style={styles.orderDetail}>Lokasi: {order.location}</Text>

        <TouchableOpacity
          style={styles.detailButton}
          onPress={() =>
            router.push({
              pathname: "/Pesanan/DetailPesanan",
              params: {
                name: order.name,
                price: order.price,
                id: order.id,
                location: order.location,
              },
            })
          }
        >
          <Text style={styles.detailText}>Lihat Detail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  verticalLine: {
    width: 0.5,
    height: "100%",
    backgroundColor: "#000000ff",
    opacity: 0.7,
    marginRight: 8,
  },
  orderImage: {
    width: 110,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 3,
  },
  orderInfo: {
    flex: 1,
  },
  orderName: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#000",
  },
  orderPrice: {
    fontSize: 11,
    color: "#1A1A8D",
    fontWeight: "600",
  },
  orderDetail: {
    fontSize: 10,
    color: "#333",
  },
  detailButton: {
    backgroundColor: "#1A1A8D",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  detailText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});
