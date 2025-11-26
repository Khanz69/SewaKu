import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#C0392B" />
      </TouchableOpacity>

      <View style={styles.innerContainer}>
        <Text style={styles.title}>Profile</Text>

        {/* Profile Picture */}
        <Image source={require("../../assets/images/taesan.jpg")} style={styles.profileImage} />

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.textValue}>Han Taesan</Text>

          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.textValue}>080834082545</Text>

          <Text style={styles.label}>E-Mail</Text>
          <Text style={styles.textValue}>HanTaesan@gmail.com</Text>
        </View>

        {/* Logout or Save Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={28} color="#C0392B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A83232",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 40,
    zIndex: 2,
  },
  innerContainer: {
    backgroundColor: "#FBECEC",
    width: "85%",
    height: "85%",
    borderRadius: 25,
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: "SFHeavyItalic",
    color: "#A83232",
    marginBottom: 20,
    marginTop: -15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 30,
  },
  form: {
    width: "80%",
  },
  label: {
    fontSize: 14,
    color: "#A83232",
    marginBottom: 5,
  },
  textValue: {
    fontSize: 14,
    color: "#000",
    marginBottom: 20,
    borderBottomWidth: 1,       
    borderBottomColor: "#C0392B", 
    paddingBottom: 4,          
  },
  logoutButton: {
    marginTop: 20,
    marginLeft: 170,
    backgroundColor: "#FBECEC",
    borderRadius: 50,
    padding: 10,
  },
});
