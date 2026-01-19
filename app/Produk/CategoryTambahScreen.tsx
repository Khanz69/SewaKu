import type { ProductCategoryKey } from "@/src/constants/productCategories";
import { findCategoryByKey } from "@/src/constants/productCategories";
import { CreateProductPayload, productRepository } from "@/src/repositories/productRepository";
import type { Product, SubCategory } from "@/src/types/product";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProductForm from "../../components/ProductForm";

type Props = {
  initialCategoryKey?: string;
};

export default function CategoryTambahScreen({ initialCategoryKey }: Props) {
  const resolvedKey = useMemo(() => {
    if (!initialCategoryKey) return undefined;
    try {
      return decodeURIComponent(initialCategoryKey);
    } catch {
      return initialCategoryKey;
    }
  }, [initialCategoryKey]);

  const category = useMemo(
    () => findCategoryByKey(resolvedKey as ProductCategoryKey | undefined),
    [resolvedKey]
  );
  const [draft, setDraft] = useState<Partial<Product>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = async () => {
    setSubmitError(null);
    const missing: string[] = [];
    if (!draft.name?.trim()) missing.push("Nama");
    if (!draft.pricePerDay || draft.pricePerDay <= 0) missing.push("Harga per hari");
    if (!draft.lokasi?.trim()) missing.push("Lokasi");
    const hasImage = typeof draft.image === "string" ? !!draft.image.trim() : Boolean(draft.image);
    if (!hasImage) missing.push("Gambar");
    if (!draft.transmission) missing.push("Transmisi");
    if (draft.seats === undefined || draft.seats <= 0) missing.push("Jumlah Kursi");
    if (!draft.bagCapacity?.trim()) missing.push("Kapasitas Bagasi");
    if (!draft.plateNumber?.trim()) missing.push("Plat Nomor");
    if (!draft.subCategory) missing.push("Subkategori");
    if (!draft.description?.trim()) missing.push("Deskripsi");

    if (missing.length > 0) {
      Alert.alert("Lengkapi Data", `Field wajib diisi: ${missing.join(", ")}.`);
      return;
    }

    const rawUser = await AsyncStorage.getItem("@sewaku_user");
    if (!rawUser) {
      Alert.alert("Perlu login", "Silakan login terlebih dahulu untuk upload produk.");
      return;
    }
    const user = JSON.parse(rawUser) as { id?: string };
    if (!user?.id) {
      Alert.alert("User tidak valid", "Silakan login ulang.");
      return;
    }

    const payload: CreateProductPayload = {
      name: draft.name!.trim(),
      pricePerDay: draft.pricePerDay!,
      lokasi: draft.lokasi!.trim(),
      image: draft.image!,
      sellerId: user.id,
      transmission: draft.transmission!,
      seats: draft.seats!,
      bagCapacity: draft.bagCapacity!,
      subCategory: draft.subCategory!,
      plateNumber: draft.plateNumber!,
      description: draft.description!,
      categoryKey: category.key,
    };

    try {
      setSubmitting(true);
      await productRepository.create(payload);
      Alert.alert("Berhasil", `Produk berhasil dikirim ke kategori ${category.label}.`);
      router.replace("/(tabs)/ProduKu");
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: unknown; status?: number }; message?: string };
      const detail = (() => {
        try {
          if (apiError.response?.data) return JSON.stringify(apiError.response.data);
        } catch {
          // ignore
        }
        return apiError.message ?? "Unknown error";
      })();
      const message = `Upload gagal: ${detail}`;
      console.warn("Gagal mengirim produk:", message);
      setSubmitError(message);
      Alert.alert("Gagal", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={s.wrapper}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={s.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={s.h1}>Tambah Produk</Text>
        <Text style={s.categoryLabel}>Kategori: {category.label}</Text>

        <ProductForm
          value={draft}
          onChange={setDraft}
          subCategoryOptions={category.subCategoryOptions as SubCategory[] | undefined}
        />

        <TouchableOpacity style={s.btn} onPress={submit} disabled={submitting}>
          <Text style={s.btnText}>{submitting ? "Mengirim..." : "Upload Produk"}</Text>
        </TouchableOpacity>
        {!!submitError && <Text style={s.errorText}>{submitError}</Text>}
      </ScrollView>
    </View>
  );
}


const s = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#A83232",
  },
  scrollContainer: {
    padding: 12,
    flexGrow: 1,
  },
  backBtn: {
    position: "absolute",
    top: 30,
    left: 10,
    zIndex: 1,
  },
  h1: {
    fontSize: 24,
    color: "#fff",
    marginLeft: 40,
    fontFamily: "SFHeavyItalic",
    marginBottom: 16,
    marginTop: 16,
  },
  categoryLabel: {
    marginLeft: 10,
    marginBottom: 10,
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  btn: {
    backgroundColor: "#429046ff",
    marginTop: -32,
    marginHorizontal: 40,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
  errorText: {
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
  },
});