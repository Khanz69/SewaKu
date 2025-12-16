import { Colors } from "@/constants/theme";
import { Responsive } from "@/src/constants/responsive";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { MOTOR_RESOURCE, motorRepository } from "@/src/repositories/motorRepository";
import { productRepository } from "@/src/repositories/productRepository";
import type { CarType, Product, Transmission } from "@/src/types/product";
import { extractProductImageUrl, resolveProductImage } from "@/src/utils/productImage";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Mapping dummy images untuk kategori Alat Konstruksi, Bus, Motor, Logistik, dan Lainnya
const placeholderImage = require("@/assets/images/audi.jpg");
const dummyImageMap: { [key: string]: any } = {
  "excavator-cat-320": placeholderImage,
  "backhoe-jcb": placeholderImage,
  "wheel-loader-komatsu": placeholderImage,
  "vibrating-roller": placeholderImage,
  "concrete-mixer": placeholderImage,
  "power-generator": placeholderImage,
  "bus-mercedes-50": placeholderImage,
  "bus-hino-47": placeholderImage,
  "bus-isuzu-30": placeholderImage,
  "bus-mitsubishi-20": placeholderImage,
  "bus-toyota-45": placeholderImage,
  "bus-scania-40": placeholderImage,
  "honda-cb150r": placeholderImage,
  "yamaha-nmax": placeholderImage,
  "kawasaki-ninja": placeholderImage,
  "suzuki-gsx-r150": placeholderImage,
  "honda-pcx": placeholderImage,
  "yamaha-yzf-r15": placeholderImage,
  "mitsubishi-pickup-1ton": placeholderImage,
  "hino-engkel-5ton": placeholderImage,
  "isuzu-box-6ton": placeholderImage,
  "toyota-pickup-2ton": placeholderImage,
  "colt-double-cabin-3.5ton": placeholderImage,
  "tangki-5000liter": placeholderImage,
  "ambulans-toyota-hiace": placeholderImage,
  "mobil-jenazah-isuzu": placeholderImage,
  "salon-mobile-van": placeholderImage,
  "escape-room-mobile": placeholderImage,
  "food-truck-kuliner": placeholderImage,
  "perpustakaan-keliling": placeholderImage,
};

const detailTabs = [
  { name: "index", icon: require("@/assets/images/home.png"), label: "Home" },
  { name: "PesananKu", icon: require("@/assets/images/list.png"), label: "Pesanan" },
  { name: "ProduKu", icon: require("@/assets/images/tambah.png"), label: "Tambah", size: 22 },
  { name: "Profile", icon: require("@/assets/images/profile.png"), label: "Profil" },
];

export default function DetailMobil() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    price?: string;
    pricePerDay?: string;
    location?: string;
    image?: string;
    seats?: string;
    bagCapacity?: string;
    transmission?: string;
    description?: string;
    carType?: string;
    code?: string;
    plateNumber?: string;
    resource?: string;
  }>();

  const [remoteProduct, setRemoteProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [pressedTab, setPressedTab] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  const normalizeTransmission = (value?: string): Transmission | undefined =>
    value === "Manual" || value === "Automatic" ? value : undefined;

  const normalizeCarType = (value?: string): CarType | undefined => {
    const allowed: CarType[] = ["City Car", "SUV", "MPV", "Sedan"];
    return value && allowed.includes(value as CarType) ? (value as CarType) : undefined;
  };

  const fallbackProduct = useMemo<Product | null>(() => {
    if (!params.name && !params.id) return null;
    const numericPrice = params.pricePerDay
      ? Number(params.pricePerDay)
      : params.price
          ? Number(params.price.replace(/[^0-9]/g, ""))
          : 0;

    return {
      id: params.id ?? params.code ?? "",
      name: params.name ?? "Detail Mobil",
      pricePerDay: Number.isFinite(numericPrice) ? numericPrice : 0,
      lokasi: params.location ?? "",
      image: params.image,
      transmission: normalizeTransmission(params.transmission),
      seats: params.seats ? Number(params.seats) : undefined,
      bagCapacity: params.bagCapacity,
      description: params.description,
      carType: normalizeCarType(params.carType),
      plateNumber: params.plateNumber ?? params.code,
      createdAt: Date.now(),
    };
  }, [params]);

  useEffect(() => {
    if (!params.id) return;
    let mounted = true;
    setLoading(true);
    const repository = params.resource === MOTOR_RESOURCE ? motorRepository : productRepository;

    repository
      .getById(params.id)
      .then((item) => {
        if (mounted) setRemoteProduct(item);
      })
      .catch((error) => console.warn("Gagal ambil detail mobil:", error))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params.id, params.resource]);

  const displayedProduct = remoteProduct ?? fallbackProduct;
  const resolvedImageUrl = extractProductImageUrl(displayedProduct?.image);
  const dummyImage = resolvedImageUrl ? dummyImageMap[resolvedImageUrl] : undefined;
  const carImageSource = dummyImage ?? resolveProductImage(displayedProduct?.image, placeholderImage) ?? placeholderImage;

  return (
    <View style={{ flex: 1, backgroundColor: "#B71C1C" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Kontainer 1: Gambar + Tombol Kembali */}
        <View style={{ position: "relative" }}>
          <Image
            source={carImageSource}
            style={{
              width: width * 0.91,
              height: height * 0.22,
              marginLeft: 12,
              marginRight: 6,
              borderRadius: 16,
              marginTop: 26,
            }}
            resizeMode="cover"
          />
          {loading && !displayedProduct ? (
            <View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
            >
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : null}

          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: "absolute",
              top: 40,
              left: 20,
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 8,
              borderRadius: 20,
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Kontainer 2: Detail Deskripsi */}
        <View
          style={{
            backgroundColor: "#fff",
            marginHorizontal: 12,
            marginTop: -24,
            borderRadius: 20,
            padding: 16,
            elevation: 3,
          }}
        >
          {/* Nama Mobil */}
          <Text
            style={{
              fontSize: Responsive.fontSize.lg,
              fontFamily: "SFBold",
              color: "#000",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {displayedProduct?.name ?? "Detail Mobil"}
          </Text>

          {/* Detail singkat (2x2 grid) */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
            {/* Item 1 */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "50%",
                marginVertical: 4,
              }}
            >
              <FontAwesome5 name="users" size={Responsive.fontSize.md} color="#333" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: Responsive.fontSize.sm, color: "#333" }}>
                {displayedProduct?.seats ? `${displayedProduct.seats} Seats` : "- Seats"}
              </Text>
            </View>

            {/* Item 2 */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "50%",
                marginVertical: 4,
              }}
            >
              <Ionicons name="briefcase" size={Responsive.fontSize.md} color="#333" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: Responsive.fontSize.sm, color: "#333" }}>
                {displayedProduct?.bagCapacity ?? "Bagasi tidak tersedia"}
              </Text>
            </View>

            {/* Item 3 */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "50%",
                marginVertical: 4,
              }}
            >
              <MaterialIcons name="settings" size={Responsive.fontSize.md} color="#333" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: Responsive.fontSize.sm, color: "#333" }}>
                {displayedProduct?.transmission ?? "Transmisi belum tersedia"}
              </Text>
            </View>

            {/* Item 4 */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "50%",
                marginVertical: 4,
              }}
            >
              <Ionicons name="location-outline" size={Responsive.fontSize.md} color="#333" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: Responsive.fontSize.sm, color: "#333" }}>
                {displayedProduct?.lokasi ?? "-"}
              </Text>
            </View>
          </View>

          {/* Harga */}
          <Text style={{ fontWeight: "bold", fontSize: Responsive.fontSize.md, color: "#1A1A8D", marginBottom: 12 }}>
            {displayedProduct
              ? `Rp${displayedProduct.pricePerDay.toLocaleString("id-ID")} / hari`
              : params.price ?? "Rp0 / hari"}
          </Text>

          {/* Deskripsi */}
          <View style={{ borderTopWidth: 1, borderColor: "#ccc", paddingTop: 8 }}>
            <Text style={{ fontWeight: "bold", color: "#000", marginBottom: 4, fontSize: Responsive.fontSize.md }}>Deskripsi</Text>
            <Text style={{ fontSize: Responsive.fontSize.sm, lineHeight: 20, color: "#333" }}>
              {displayedProduct?.description ?? "Deskripsi tidak tersedia."}
            </Text>
          </View>

          {/* Tombol Pesan Sekarang */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/Pesanan/BuatPesanan",
                params: {
                  id: displayedProduct?.id ?? "",
                  name: displayedProduct?.name ?? "",
                  plateNumber: displayedProduct?.plateNumber ?? "",
                  pricePerDay: displayedProduct ? displayedProduct.pricePerDay.toString() : "",
                  location: displayedProduct?.lokasi ?? "",
                },
              })
            }
            style={{
              backgroundColor: "#429046ff",
              width: width * 0.45,
              height: 40,
              borderRadius: 12,
              marginTop: 20,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: Responsive.fontSize.sm, fontFamily: "SFBold", textAlign: "center" }}>
              Pesan Sekarang
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomNavContainer}>
        {detailTabs.map((tab) => {
          const targetRoute = tab.name === "index" ? "/(tabs)/index" : `/(tabs)/${tab.name}`;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.bottomTab}
              activeOpacity={1}
              onPressIn={() => {
                setPressedTab(tab.name);
                setTimeout(() => setPressedTab(null), 300);
              }}
              onPress={() =>
                router.push({
                  pathname: targetRoute as RelativePathString,
                })
              }
            >
              <Image
                source={tab.icon}
                style={{
                  width: tab.size ?? 28,
                  height: tab.size ?? 28,
                  tintColor: pressedTab === tab.name ? "#636363ff" : "#fff",
                }}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.bottomLabel,
                  { color: Colors[colorScheme ?? "light"].tint },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#ac2f2fff",
    height: 60,
    borderTopWidth: 0,
  },
  bottomTab: {
    alignItems: "center",
    justifyContent: "center",
  },
  bottomLabel: {
    fontSize: 11,
    marginTop: 4,
    color: "#fff",
  },
});
