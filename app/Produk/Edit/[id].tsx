import { productRepository, UpdateProductPayload } from "@/src/repositories/productRepository";
import type { Product } from "@/src/types/product";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProductForm from "../../../components/ProductForm";

export default function EditProduk() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [remoteProduct, setRemoteProduct] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);

    productRepository
      .getById(id)
      .then((product) => {
        if (!mounted) return;
        setRemoteProduct(product);
        setDraft(product);
      })
      .catch((error) => console.warn("Gagal ambil data produk:", error))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const submit = async () => {
    if (!id || !remoteProduct) return;

    if (!draft.name || !draft.pricePerDay || !draft.lokasi) {
      Alert.alert("Lengkapi Data", "Nama, Harga per hari, dan Lokasi wajib diisi.");
      return;
    }

    const payload: UpdateProductPayload = {
      ...remoteProduct,
      ...(draft as Product),
      id: remoteProduct.id,
      createdAt: remoteProduct.createdAt,
    };

    try {
      setSubmitting(true);
      await productRepository.update(payload);
      Alert.alert("Berhasil", "Perubahan produk berhasil disimpan.");
      router.back();
    } catch (error) {
      console.warn("Gagal update produk:", error);
      Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan perubahan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: "#A83232" }} />;
  }

  if (!remoteProduct) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#A83232" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        <Text style={s.h1}>Edit Produk</Text>
        <TouchableOpacity style={s.backBtn} onPress={() => router.push("/ProduKu")}> 
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <ProductForm value={draft} onChange={setDraft} />
        <TouchableOpacity style={s.btn} onPress={submit} disabled={submitting}>
          <Text style={s.btnText}>{submitting ? "Menyimpan..." : "Simpan Perubahan"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  h1: { fontSize: 22, color: "#fff", fontFamily:"SFHeavyItalic", marginBottom: 12, marginTop:24, marginLeft: 75 },
  btn: { backgroundColor: "#429046ff", marginTop: -32, marginHorizontal: 40, paddingTop: 10, paddingBottom: 10, borderRadius: 25, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  backBtn: {  position: "absolute", top: 35, left: 10, zIndex: 1,}
});
