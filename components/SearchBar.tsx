import { Responsive } from "@/src/constants/responsive";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onBackPress?: () => void; // Fungsi untuk aksi back
};

export const SearchBar = ({ value, onChangeText, onBackPress }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      {/* Tombol Back */}
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={18} color="#220f0fff" />
        </TouchableOpacity>
      )}

      {/* SearchBar dengan ikon Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#220f0fff" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Kendaraan apa yang anda cari?"
          placeholderTextColor="rgba(97, 90, 90, 0.67)"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center", 
    marginTop: Responsive.size(40),
    marginBottom: Responsive.spacing.xxxl,
    gap: Responsive.spacing.sm,
  },
  backButton: {
    backgroundColor: "#efd0d0ff",
    borderRadius: Responsive.borderRadius.md,
    height: Responsive.size(40),
    width: Responsive.size(40),
    justifyContent: "center",
    alignItems: "center",
  },
  searchBox: {
    flex: 1,
    backgroundColor: "#efd0d0ff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Responsive.borderRadius.md,
    paddingHorizontal: Responsive.spacing.sm,
    height: Responsive.size(40),
    maxWidth: Responsive.size(290),
  },
  searchIcon: {
    marginRight: Responsive.spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: "black",
    fontSize: Responsive.fontSize.sm,
    paddingVertical: 0,
    height: "100%",
  },
});
