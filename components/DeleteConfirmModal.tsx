// DeleteConfirmModal.tsx
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  productName?: string;
};

export default function DeleteConfirmModal({
  isVisible,
  onConfirm,
  onCancel,
  productName,
}: Props) {
  if (!isVisible) return null; // Tidak menampilkan modal jika tidak diperlukan

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={s.backdrop}>
        <View style={s.box}>
          <Text style={s.title}>Hapus Produk</Text>
          <Text style={s.text}>
            Apakah kamu yakin ingin menghapus{" "}
            <Text style={{ fontWeight: "bold", color: "#b91c1c" }}>
              {productName ?? "produk ini"}
            </Text>
            ?
          </Text>

          <View style={s.row}>
            <TouchableOpacity style={[s.btn, s.cancel]} onPress={onCancel}>
              <Text style={s.cancelTxt}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[s.btn, s.delete]} onPress={onConfirm}>
              <Text style={s.deleteTxt}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    color: "#0f1e4a",
    textAlign: "center",
    marginBottom: 8,
  },
  text: {
    color: "#111827",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 10,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#e5e7eb",
  },
  cancelTxt: {
    color: "#111827",
    fontWeight: "600",
  },
  delete: {
    backgroundColor: "#b91c1c",
  },
  deleteTxt: {
    color: "white",
    fontWeight: "700",
  },
});
