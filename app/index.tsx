import { router } from "expo-router";
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={require("../assets/images/Welcome.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Logo + Judul */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/mobil.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Tulisan SewaKu - overlap logo */}
          <Text style={styles.title}>SewaKu</Text>
        </View>

        {/* Tombol */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => router.push("/Registrasi/SignUp")}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push("/Registrasi/SignIn")}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center", // PINDAH KE TENGAH
    alignItems: "center",
    paddingHorizontal: 32,
  },

  logoContainer: {
    width: 280,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 24,
  },

  logo: {
    width: 260,
    height: 260,
  },

  title: {
    position: "absolute",
    bottom: 18, // overlap lebih ke logo
    fontSize: 42,
    color: "#fff",
    fontFamily: "SFHeavyItalic",
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  buttonGroup: {
    width: "100%",
    maxWidth: 320,
    marginTop: 8, // DEKAT LOGO
  },

  signUpButton: {
    backgroundColor: "#fff",
    height: 48,
    justifyContent: "center",
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 12,
  },

  signUpText: {
    color: "#7B0F14",
    fontSize: 16,
    fontWeight: "600",
  },

  signInButton: {
    backgroundColor: "#A44",
    height: 48,
    justifyContent: "center",
    borderRadius: 30,
    alignItems: "center",
  },

  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
