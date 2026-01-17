import { userRepository } from '@/src/repositories/userRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AxiosError } from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignIn() {
  const USER_STORAGE_KEY = '@sewaku_user';
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <ImageBackground
      source={require('../../assets/images/SignIn.png')}
      style={styles.background}
      resizeMode="stretch"
    >
      {/* BACK BUTTON */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        {/* TITLE */}
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>TO YOUR ACCOUNT</Text>

        {/* INPUT */}
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#f2dede"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(value) => setForm((prev) => ({ ...prev, email: value }))}
          style={styles.input}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#f2dede"
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(value) => setForm((prev) => ({ ...prev, password: value }))}
            style={styles.passwordInput}
          />
          <TouchableOpacity 
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '👁️‍🗨️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>

        {/* BUTTON */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
          onPress={async () => {
            if (!form.email || !form.password) {
              setError("Masukkan email dan password");
              return;
            }

            setLoading(true);
            setError(null);

            try {
              const user = await userRepository.authenticate(
                form.email.trim(),
                form.password
              );
              await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
              router.replace("/(tabs)");
            } catch (err) {
              const axiosError = err as AxiosError<{ message?: string }>;
              setError(axiosError.response?.data?.message || axiosError.message || "Gagal masuk");
              console.error("Sign in failed", err);
            } finally {
              setLoading(false);
            }
          }}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontFamily:'SFHeavyItalic',
    marginLeft: 45,
  },
  subtitle: {
    color: '#fff',
    fontSize: 12,
    fontFamily:'sfsemibolditalic',
    marginBottom: 40,
    marginLeft: 45,
    letterSpacing: 1,
  },
  input: {
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingVertical: 8,
    marginBottom: 24,
    marginLeft: 45,
    fontSize: 12,
    fontFamily:'sfsemibolditalic',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 10,
    marginLeft: 70,
    width: '70%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#7B0F14',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginLeft: 45,
    marginBottom: 24,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 12,
    fontFamily:'sfsemibolditalic',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    color: '#f44336',
    marginBottom: 8,
    marginLeft: 5,
  },
  eyeButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  eyeIcon: {
    fontSize: 16,
    color: '#fff',
  },
});