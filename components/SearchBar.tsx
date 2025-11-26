import { Ionicons } from "@expo/vector-icons";
import React from "react";
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
          <Ionicons name="arrow-back" size={20} color="#220f0fff" />
        </TouchableOpacity>
      )}

      {/* SearchBar dengan ikon Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#220f0fff" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Mobil apa yang anda cari?"
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
    marginTop: 26,
    marginBottom: 24,
  },
  backButton: {
    left: 5, 
    backgroundColor: "#efd0d0ff",
    padding: 8, 
    borderRadius: 10,
    marginRight: 12
  },
  searchBox: {
    width: 225,
    backgroundColor: "#efd0d0ff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingRight: 24
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "black",
  },
});
