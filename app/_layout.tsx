import { ProductProvider } from "@/src/hooks/ProductContext";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

// 🔹 IMPORT REDUX & PERSIST
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    SFRegular: require("../assets/fonts/sfregular.otf"),
    SFBold: require("../assets/fonts/sfbold.otf"),
    SFMedium: require("../assets/fonts/sfmedium.otf"),
    SFThinItalic: require("../assets/fonts/sfthinitalic.otf"),
    SFSemiboldItalic: require("../assets/fonts/sfsemibolditalic.otf"),
    SFLightItalic: require("../assets/fonts/sflightitalic.otf"),
    SFUltraLightItalic: require("../assets/fonts/sfultralightitalic.otf"),
    SFHeavyItalic: require("../assets/fonts/sfheavyitalic.otf"),
    SFBlackItalic: require("../assets/fonts/sfblackitalic.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    // 🔹 WRAP SEMUA DENGAN REDUX PROVIDER + PERSISTGATE
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          {/* ProductProvider masih dipakai, jadi tidak aku hapus */}
          <ProductProvider>
            <Stack
              initialRouteName="index"
              screenOptions={{
                headerShown: false,
                headerTitleAlign: "center",
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              {/* TAB utama */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/* ===== Halaman di MAIN ===== */}
              <Stack.Screen
                name="Kategori/Mobil"
                options={{ title: "Daftar Mobil", headerShown: false }}
              />

              <Stack.Screen
                name="Detail/DetailMobil"
                options={{ title: "Detail Mobil", headerShown: false }}
              />

              {/* ===== Halaman PESANAN ===== */}
              <Stack.Screen
                name="Pesanan/BuatPesanan"
                options={{ title: "Buat Pesanan", headerShown: false }}
              />
              <Stack.Screen
                name="Pesanan/DetailPesanan"
                options={{ title: "Detail Pesanan", headerShown: false }}
              />

              {/* ===== Halaman PRODUK (CRUD) ===== */}
              <Stack.Screen
                name="Produk/Tambah"
                options={{ title: "Tambah Produk", headerShown: false }}
              />
              <Stack.Screen
                name="Produk/Edit/[id]"
                options={{ title: "Edit Produk", headerShown: false }}
              />
            </Stack>
          </ProductProvider>

          <StatusBar style="auto" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
