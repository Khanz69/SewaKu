import { apiClient } from "@/src/api/apiClient";
import { userRepository } from "@/src/repositories/userRepository";
import type { User } from "@/src/types/user";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const router = useRouter();
  const USER_STORAGE_KEY = "@sewaku_user";
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
        if (parsed?.id) {
          try {
            const remoteUser = await userRepository.getById(parsed.id);
            setUser(remoteUser);
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(remoteUser));
          } catch (error) {
            console.warn("Failed to refresh user profile", error);
          }
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.warn("Failed to load user profile", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadUser();
    }, [loadUser])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    router.replace("/Registrasi/SignIn");
  };

  const handlePickAvatar = async () => {
    if (!user?.id || updatingAvatar) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin dibutuhkan", "Izinkan akses galeri untuk memilih foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.4,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    const previewUri = asset.base64
      ? `data:${asset.mimeType ?? "image/jpeg"};base64,${asset.base64}`
      : asset.uri;
    setLocalAvatar(previewUri);
    setAvatarError(null);

    try {
      setUpdatingAvatar(true);
      const updated = await userRepository.updateAvatar(user.id, {
        uri: asset.uri,
        base64: asset.base64 ?? undefined,
        name: asset.fileName ?? undefined,
        type: asset.mimeType,
      });
      setUser(updated);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      setAvatarVersion((value) => value + 1);
      setLocalAvatar(null);
      Alert.alert("Berhasil", "Foto profil diperbarui.");
    } catch (error) {
      console.warn("Gagal update avatar", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      const status = axiosError.response?.status;
      const responseMessage = axiosError.response?.data?.message;
      const debugBaseUrl = apiClient.defaults.baseURL ?? "unknown baseURL";
      const message =
        responseMessage ||
        axiosError.message ||
        "Tidak bisa memperbarui foto profil.";
      const debugMessage = status
        ? `${message} (status ${status}, baseURL ${debugBaseUrl})`
        : `${message} (baseURL ${debugBaseUrl})`;
      setAvatarError(debugMessage);
      Alert.alert("Gagal", debugMessage);
    } finally {
      setUpdatingAvatar(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#C0392B" />
      </TouchableOpacity>

      <View style={styles.innerContainer}>
        <Text style={styles.title}>Profile</Text>

        {/* Profile Picture */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            style={styles.avatarTouchable}
            onPress={handlePickAvatar}
            disabled={updatingAvatar}
          >
            {localAvatar || user?.avatar ? (
              <Image
                source={
                  localAvatar
                    ? { uri: localAvatar }
                    : {
                        uri: user?.avatar?.startsWith("data:")
                          ? user.avatar
                          : `${user?.avatar}${user?.avatar?.includes("?") ? "&" : "?"}v=${avatarVersion}`,
                      }
                }
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Ionicons name="person" size={42} color="#C0392B" />
              </View>
            )}
            <View style={styles.editAvatarButton}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {avatarError ? <Text style={styles.errorText}>{avatarError}</Text> : null}

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.textValue}>
            {loading ? "Memuat..." : user?.fullName ?? "-"}
          </Text>

          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.textValue}>
            {loading ? "Memuat..." : user?.phone?.toString() ?? "-"}
          </Text>

          <Text style={styles.label}>E-Mail</Text>
          <Text style={styles.textValue}>
            {loading ? "Memuat..." : user?.email ?? "-"}
          </Text>
        </View>

        {/* Logout or Save Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 30,
    backgroundColor: "#F0DADA",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTouchable: {
    alignItems: "center",
    justifyContent: "center",
  },
  editAvatarButton: {
    position: "absolute",
    right: -2,
    bottom: 20,
    backgroundColor: "#C0392B",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "80%",
  },
  label: {
    fontSize: 14,
    color: "#A83232",
    marginBottom: 5,
  },
  errorText: {
    color: "#f44336",
    marginBottom: 12,
    marginTop: -12,
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
