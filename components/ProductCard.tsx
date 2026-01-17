import type { Product } from "@/src/types/product";
import { resolveProductImage } from "@/src/utils/productImage";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const SCALE = width / 375;
const scale = (n: number) => Math.round(n * SCALE);

type Props = {
  item: Product;
  onPressDetail?: () => void;
  onPressEdit?: () => void;
  onRequestDelete?: (id: string) => void;
};

export default function ProductCard({
  item,
  onPressDetail,
  onPressEdit,
  onRequestDelete,
}: Props) {
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
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>

        <Text style={styles.productPrice}>
          Rp{item.pricePerDay.toLocaleString("id-ID")}
          <Text style={styles.pricePerDay}> / hari</Text>
        </Text>

        <Text style={styles.productMeta} numberOfLines={1}>
          Lokasi: {item.lokasi}
        </Text>

        {/* BUTTON ROW */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.btn, styles.btnDetail]}
            onPress={onPressDetail}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Detail</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnEdit]}
            onPress={onPressEdit}
            activeOpacity={0.8}
          >
            <Text style={[styles.btnText, styles.btnEditText]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnDelete]}
            onPress={() => onRequestDelete?.(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: scale(12),
    marginBottom: scale(10),
    paddingVertical: scale(6),
    elevation: 2,
    alignItems: "center",
  },

  img: {
    width: scale(90),
    height: scale(60),
    resizeMode: "cover",
    borderRadius: scale(10),
    marginHorizontal: scale(8),
  },

  verticalLine: {
    width: 0.5,
    height: "75%",
    backgroundColor: "#000",
    opacity: 0.3,
    marginRight: scale(8),
  },

  productInfo: {
    flex: 1,
    paddingRight: scale(10),
  },

  productName: {
    fontSize: scale(12),
    fontWeight: "700",
    color: "#000",
  },

  productPrice: {
    color: "#1A1A8D",
    fontWeight: "700",
    fontSize: scale(11),
    marginVertical: scale(2),
  },

  pricePerDay: {
    fontWeight: "400",
  },

  productMeta: {
    fontSize: scale(10),
    color: "#000",
    marginBottom: scale(6),
  },

  /* RESPONSIVE BUTTON ROW */
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(6),
  },

  btn: {
    flex: 1,
    paddingVertical: scale(6),
    borderRadius: scale(8),
    alignItems: "center",
  },

  btnDetail: {
    backgroundColor: "#0f1e4a",
  },

  btnEdit: {
    backgroundColor: "#eac223",
  },

  btnDelete: {
    backgroundColor: "#b91c1c",
  },

  btnText: {
    color: "#fff",
    fontSize: scale(9),
    fontWeight: "600",
  },

  btnEditText: {
    color: "#0f1e4a",
  },
});
