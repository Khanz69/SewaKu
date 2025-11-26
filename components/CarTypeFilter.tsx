import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CarTypeFilterProps = {
  carTypes: string[];
  selectedType: string;
  onSelect: (type: string) => void;
};

export const CarTypeFilter = ({
  carTypes,
  selectedType,
  onSelect,
}: CarTypeFilterProps) => {
  const [open, setOpen] = useState(false);
  const label = selectedType || "Semua Jenis";

  const handleSelect = (type: string) => {
    onSelect(type);
    setOpen(false);
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Jenis Mobil</Text>
      <TouchableOpacity style={styles.dropdownToggle} onPress={() => setOpen(true)}>
        <Text style={styles.dropdownLabel}>{label}</Text>
        <Text style={styles.dropdownCaret}>▾</Text>
      </TouchableOpacity>
      <Modal transparent visible={open} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setOpen(false)} activeOpacity={1}>
          <View style={styles.dropdownList}>
            {carTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.dropdownItem}
                onPress={() => handleSelect(type)}
              >
                <Text style={styles.dropdownItemText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
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
