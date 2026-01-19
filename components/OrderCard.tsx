import { Order } from "@/src/types/order";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  order: Order;
};

export default function OrderCard({ order }: Props) {
  const router = useRouter();
  const statusLabel = useMemo(() => {
    if (order.status === "completed") return "Selesai";
    if (order.status === "confirmed") return "Confirmed";
    if (order.status === "cancelled") return "Cancelled";
    return "Pending";
  }, [order.status]);

  return (
    <View style={styles.orderCard}>
      <Image source={order.image} style={styles.orderImage} />
      <View style={styles.verticalLine} />
      <View style={styles.orderInfo}>
        <Text style={styles.orderName}>{order.name}</Text>
        <Text style={styles.orderPrice}>{order.price}</Text>
        <Text style={styles.orderDetail}>ID: {order.id}</Text>
        <Text style={styles.orderDetail}>Lokasi: {order.location}</Text>

        <View style={styles.actionRow}>
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
                  status: order.status,
                  flow: order.flow,
                },
              })
            }
          >
            <Text style={styles.detailText}>Lihat Detail</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.statusButton,
              order.status === "completed"
                ? styles.statusCompleted
                : order.status === "cancelled"
                ? styles.statusCancelled
                : order.status === "confirmed"
                ? styles.statusConfirmed
                : styles.statusPending,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                order.status === "confirmed" || order.status === "completed"
                  ? styles.statusTextLight
                  : styles.statusTextDark,
              ]}
            >
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    marginTop: 6,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
    elevation: 2,
    alignItems: "center",
  },
  verticalLine: {
    width: 0.5,
    height: "80%",
    backgroundColor: "#000000ff",
    opacity: 0.7,
    marginRight: 8,
  },
  orderImage: {
    width: 100,
    height: 80,
    resizeMode: "cover",
    marginLeft: 8,
    marginRight: 8,
    marginTop: 6,
    marginBottom: 6,
    borderRadius: 12,
  },
  orderInfo: {
    flex: 1,
    paddingRight: 10,
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  orderName: {
    fontFamily: "SFBold",
    fontSize: 12,
    color: "#000",
    flexShrink: 1,
  },
  statusPending: {
    backgroundColor: "#f4a261",
  },
  statusConfirmed: {
    backgroundColor: "#2a9d8f",
  },
  statusCancelled: {
    backgroundColor: "#b53d3d",
  },
  statusCompleted: {
    backgroundColor: "#16a34a",
  },
  orderPrice: {
    color: "#1A1A8D",
    fontWeight: "bold",
    marginVertical: 4,
    fontSize: 10,
  },
  orderDetail: {
    color: "#000000ff",
    fontSize: 8,
    fontFamily: "SFRegular",
    lineHeight: 12,
  },
  detailButton: {
    flex: 1,
    backgroundColor: "#1A1A8D",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 26,
  },
  detailText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
    alignItems: "center",
  },
  statusButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 26,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statusTextLight: {
    color: "#fff",
  },
  statusTextDark: {
    color: "#111",
  },
});
