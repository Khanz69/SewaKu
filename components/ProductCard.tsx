import type { Product } from "@/src/types/product";
import { resolveProductImage } from "@/src/utils/productImage";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  item: Product;
  onPressDetail?: () => void;
  onPressEdit?: () => void;
  onRequestDelete?: (id: string) => void; // ganti nama supaya jelas: ini hanya MINTA konfirmasi
};

export default function ProductCard({ item, onPressDetail, onPressEdit, onRequestDelete }: Props) {
  const imageSource = resolveProductImage(item.image);

  return (
    <View style={styles.card}>
      {imageSource ? (
        <Image source={imageSource} style={styles.img} />
      ) : (
        <View style={[styles.img, { backgroundColor: "#eee" }]} />
      )}
      <View style={styles.verticalLine} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>
          Rp{item.pricePerDay.toLocaleString("id-ID")} <Text style={styles.pricePerDay}>/ hari</Text>
        </Text>
        <Text style={styles.productMeta}>Lokasi: {item.lokasi}</Text>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.btnDetail]} onPress={onPressDetail}>
            <Text style={styles.btnText}>Detail</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.btnEdit]} onPress={onPressEdit}>
            <Text style={[styles.btnText, { color: "#0f1e4a" }]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnDelete]}
            onPress={() => onRequestDelete?.(item.id)} // hanya memicu parent untuk buka modal
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ===== styles kamu apa adanya =====
const styles = StyleSheet.create({
  card: {
    width: 255,
    marginTop: 2,
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
    elevation: 2,
    alignItems: "center",
  },
  img: {
    width: 100,
    height: 70,
    resizeMode: "stretch",
    marginLeft: 8,
    marginRight: 8,
    marginTop: 6,
    marginBottom: 6,
    borderRadius: 12,
  },
  verticalLine: {
    width: 0.5,
    height: "80%",
    backgroundColor: "#000000ff",
    opacity: 0.7,
    marginRight: 8,
  },
  productInfo: {
    flex: 1,
    paddingRight: 10,
  },
  productName: {
    fontFamily: "SFBold",
    fontSize: 12,
    color: "#000",
  },
  productPrice: {
    color: "#1A1A8D",
    fontWeight: "bold",
    marginVertical: 4,
    fontSize: 10,
  },
  pricePerDay: {
    color: "#1A1A8D",
  },
  productMeta: {
    color: "#000000ff",
    fontSize: 10,
    fontFamily: "SFRegular",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 4,
    marginTop: 4,
  },
  btnDetail: {
    backgroundColor: "#0f1e4a",
  },
  btnDelete: {
    backgroundColor: "#b91c1c",
  },
  btnEdit: {
    backgroundColor: "#eac223ff",
  },
  btnText: {
    color: "#fff",
    fontFamily: "SFSemiBoldItalic",
    fontSize: 8,
  },
});
