// ProdukKuScreen.tsx
import { productRepository } from "@/src/repositories/productRepository";
import type { Product } from "@/src/types/product";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import ProductCard from "../../components/ProductCard";
import ProductDetailModal from "../../components/ProductDetailModal";

export default function ProdukKuScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const askDelete = (id: string) => {
    setPendingDelete(id); // Menyimpan id produk yang akan dihapus
    setConfirmVisible(true); // Menampilkan modal konfirmasi
  };

  const openDetail = (item: Product) => {
    setSelectedProduct(item);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
  };

  const loadProducts = useCallback(async () => {
    try {
      const items = await productRepository.getAll();
      setProducts(items);
    } catch (error) {
      console.warn("Gagal memuat produk:", error);
    }
  }, []);

  const handleConfirmDelete = () => {
    if (!pendingDelete) {
      setConfirmVisible(false);
      return;
    }

    setConfirmVisible(false);
    setPendingDelete(null);
    productRepository
      .delete(pendingDelete)
      .then(loadProducts)
      .catch((error) => console.warn("Gagal hapus produk:", error));
  };

  const handleCancelDelete = () => {
    setConfirmVisible(false);
    setPendingDelete(null);
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts])
  );

  return (
    <ImageBackground
      source={require("../../assets/images/PesananKu.png")}
      style={s.wrap}
      resizeMode="stretch"
    >
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <Text style={s.title}>ProduKu</Text>
        <TouchableOpacity
          style={s.addBtn}
          onPress={() => router.push("/Produk/Tambah")}
        >
          <Text style={s.addBtnText}>Tambah Produk?</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[...products].sort((a, b) => b.createdAt - a.createdAt)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.flatListContent}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPressEdit={() => router.push(`/Produk/Edit/${item.id}`)}
            onRequestDelete={askDelete}
            onPressDetail={() => openDetail(item)}
          />
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyText}>Belum ada produk. Yuk, tambah dulu!</Text>
          </View>
        }
      />

      {/* Modal detail produk */}
      <ProductDetailModal
        visible={isDetailOpen}
        product={selectedProduct ?? undefined}
        onClose={closeDetail}
      />

      {/* Modal konfirmasi hapus */}
      <DeleteConfirmModal
        isVisible={confirmVisible} // Pastikan 'isVisible' digunakan
        onCancel={handleCancelDelete} // Menangani pembatalan
        onConfirm={handleConfirmDelete} // Menangani konfirmasi penghapusan
        productName={
          products.find((p) => p.id === pendingDelete)?.name ?? "produk ini"
        }
      />
    </ImageBackground>
  );
}

const RED_PILL = "#A93226";
const s = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "flex-start", width: "100%", height: "110%" },
  header: {
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "rgba(0,0,0,0)",
    alignItems: "center",
    zIndex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 6,
    fontFamily: "SFHeavyItalic",
  },
  addBtn: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginTop: 12,
    marginRight: 120,
    borderWidth: 2,
    borderColor: RED_PILL,
  },
  addBtnText: { color: RED_PILL, fontWeight: "700", fontSize: 12 },
  flatListContent: { padding: 16, paddingBottom: 24 },
  empty: {
    marginTop: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  emptyText: { textAlign: "center", color: "#fff", fontSize: 16, fontWeight: "500" },
});
