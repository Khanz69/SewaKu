import { apiClient } from "@/src/api/apiClient";
import { findCategoryByResource } from "@/src/constants/productCategories";
import { toMotorApi } from "@/src/repositories/motorRepository";
import { CreateProductPayload, toApi } from "@/src/repositories/productRepository";
import type { Product } from "@/src/types/product";
import { buildProductRequestBody } from "@/src/utils/productRequest";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProductForm from "../../components/ProductForm";

type Props = {
  initialResource?: string;
};

export default function CategoryTambahScreen({ initialResource }: Props) {
  const resolvedResource = useMemo(() => {
    if (!initialResource) return undefined;
    try {
      return decodeURIComponent(initialResource);
    } catch {
      return initialResource;
    }
  }, [initialResource]);

  const category = useMemo(() => findCategoryByResource(resolvedResource), [resolvedResource]);
  const [draft, setDraft] = useState<Partial<Product>>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!draft.name || !draft.pricePerDay || !draft.lokasi) {
      Alert.alert("Lengkapi Data", "Nama, Harga per hari, dan Lokasi wajib diisi.");
      return;
    }

    const payload: CreateProductPayload = {
      name: draft.name,
      pricePerDay: draft.pricePerDay,
      lokasi: draft.lokasi,
      image: draft.image,
      transmission: draft.transmission,
      seats: draft.seats,
      bagCapacity: draft.bagCapacity,
      carType: draft.carType,
      plateNumber: draft.plateNumber,
      description: draft.description,
    };

    try {
      setSubmitting(true);
      const apiPayload = category.key === "motor" ? toMotorApi(payload) : toApi(payload);
      const { body, headers } = buildProductRequestBody(apiPayload, category);
      const config = headers ? { headers } : undefined;
      await apiClient.post(category.resource, body, config);
      Alert.alert("Berhasil", `Produk berhasil dikirim ke kategori ${category.label}.`);
      router.replace("/(tabs)/ProduKu");
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: unknown }; message?: string };
      console.warn("Gagal mengirim produk:", apiError.response?.data ?? apiError.message ?? error);
      Alert.alert("Gagal", "Terjadi kesalahan saat mengirim produk. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={s.wrapper}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={s.scrollContainer}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={s.h1}>Tambah Produk</Text>
        <Text style={s.categoryLabel}>Kategori: {category.label}</Text>

        <ProductForm value={draft} onChange={setDraft} carTypeOptions={category.carTypeOptions} />

        <TouchableOpacity style={s.btn} onPress={submit} disabled={submitting}>
          <Text style={s.btnText}>{submitting ? "Mengirim..." : "Upload Produk"}</Text>
        </TouchableOpacity>
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
});