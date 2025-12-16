// ProdukKuScreen.tsx
import { useUserProducts } from "@/src/hooks/useUserProducts";
import { deleteProductByResource } from "@/src/repositories/productRepository";
import type { Product } from "@/src/types/product";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CategoryFilter from "../../components/CategoryFilter";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import ProductCard from "../../components/ProductCard";
import ProductDetailModal from "../../components/ProductDetailModal";

export default function ProdukKuScreen() {
  const {
    products,
    filteredProducts,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    reload,
    filterOptions,
  } = useUserProducts();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const askDelete = (id: string) => {
    setPendingDelete(id);
    setConfirmVisible(true);
  };

  const openDetail = (item: Product) => {
    setSelectedProduct(item);
    setIsDetailOpen(true);
  };

  const closeDetail = () => setIsDetailOpen(false);

  const handleConfirmDelete = () => {
    if (!pendingDelete) {
      setConfirmVisible(false);
      return;
    }

    const target = products.find((p) => p.id === pendingDelete);
    setConfirmVisible(false);
    setPendingDelete(null);

    if (!target?.resource) {
      console.warn("Produk tidak memiliki resource untuk dihapus.");
      return;
    }

    deleteProductByResource(target.resource, pendingDelete)
      .then(reload)
      .catch((error) => console.warn("Gagal hapus produk:", error));
  };

  const handleCancelDelete = () => {
    setConfirmVisible(false);
    setPendingDelete(null);
  };

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const sortedProducts = useMemo(
    () => [...filteredProducts].sort((a, b) => b.createdAt - a.createdAt),
    [filteredProducts]
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
          onPress={() => router.push("/Produk/Kategori")}
        >
          <Text style={s.addBtnText}>Tambah Produk?</Text>
        </TouchableOpacity>
      </View>
      <CategoryFilter
        options={filterOptions}
        selectedKey={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={s.loader} />
      ) : error ? (
        <Text style={s.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={sortedProducts}
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
      )}

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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 5,
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
    marginTop: 5,
    marginRight: 120,
    borderWidth: 2,
    borderColor: RED_PILL,
  },
  addBtnText: { color: RED_PILL, fontWeight: "700", fontSize: 12 },
  flatListContent: { padding: 16, paddingBottom: 150 },
  empty: {
    marginTop: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  emptyText: { textAlign: "center", color: "#fff", fontSize: 16, fontWeight: "500" },
  loader: {
    marginTop: 40,
  },
  errorText: {
    marginTop: 24,
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
});
