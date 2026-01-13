import { Responsive } from "@/src/constants/responsive";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CategoryFilterOption = {
  key: string;
  label: string;
};

type CategoryFilterProps = {
  title?: string;
  options: CategoryFilterOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

export default function CategoryFilter({
  title = "Kategori",
  options,
  selectedKey,
  onSelect,
}: CategoryFilterProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((option) => option.key === selectedKey)?.label ?? "Semua";

  const handleSelect = (key: string) => {
    onSelect(key);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity style={styles.dropdownToggle} onPress={() => setOpen(true)}>
        <Text style={styles.dropdownLabel}>{selectedLabel}</Text>
        <Text style={styles.dropdownCaret}>▾</Text>
      </TouchableOpacity>
      <Modal transparent visible={open} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setOpen(false)} activeOpacity={1}>
          <View style={styles.dropdownList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={styles.dropdownItem}
                onPress={() => handleSelect(option.key)}
              >
                <Text style={styles.dropdownItemText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Responsive.containerPadding.horizontal,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 6,
    marginBottom: 8,
  },
  dropdownToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#efbdbd86",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    marginBottom: 7,
  },
  dropdownLabel: {
    color: "#fff",
    fontSize: 16,
  },
  dropdownCaret: {
    color: "#fff",
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  dropdownList: {
    backgroundColor: "#fff",
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  dropdownItem: {
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
    opacity: 0.6,
    marginVertical: 8,
  },
});
