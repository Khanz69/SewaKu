import { apiClient } from '@/src/api/apiClient';
import { userRepository } from '@/src/repositories/userRepository';
import type { AxiosError } from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (loading) return;
    setError(null);
    setSuccessMessage(null);
    // Validation
    if (!fullName.trim()) {
      setError('Full name is required');
      Alert.alert('Error', 'Full name is required');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required');
      Alert.alert('Error', 'Phone number is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      Alert.alert('Error', 'Email is required');
      return;
    }
    const normalizedFullName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const cleanedPhone = phone.replace(/\D/g, '');
    const parsedPhone = Number.parseInt(cleanedPhone, 10);
    if (!cleanedPhone || Number.isNaN(parsedPhone)) {
      setError('Phone number must be numeric');
      Alert.alert('Error', 'Phone number must be numeric');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      Alert.alert('Error', 'Password is required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const existingUser = await userRepository.findByFullName(normalizedFullName);
      if (existingUser) {
        const message = 'Nama sudah digunakan. Gunakan nama lain.';
        setError(message);
        Alert.alert('Error', message);
        return;
      }

      const existingEmail = await userRepository.findByEmail(normalizedEmail);
      if (existingEmail) {
        const message = 'Email sudah digunakan. Gunakan email lain.';
        setError(message);
        Alert.alert('Error', message);
        return;
      }
      await userRepository.create({
        fullName: normalizedFullName,
        phone: parsedPhone,
        email: normalizedEmail,
        password,
      });

      setError(null);
      setSuccessMessage('Akun berhasil dibuat. Silakan masuk.');
      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => router.push('/Registrasi/SignIn'),
        },
      ]);
    } catch (error) {
      console.error('Sign up error:', error);
      const axiosError = error as AxiosError<{ message?: string }>;
      const status = axiosError.response?.status;
      const responseMessage = axiosError.response?.data?.message;
      const debugBaseUrl = apiClient.defaults.baseURL ?? 'unknown baseURL';
      const message =
        responseMessage ||
        axiosError.message ||
        'Failed to create account. Please try again.';
      const debugMessage = status
        ? `${message} (status ${status}, baseURL ${debugBaseUrl})`
        : `${message} (baseURL ${debugBaseUrl})`;
      setError(debugMessage);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/images/SignUp.png')}
      style={styles.background}
      resizeMode="stretch"
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>CREATE YOUR ACCOUNT</Text>

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          editable={!loading}
        />
        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!loading}
        />
        <TextInput
          placeholder="E-mail"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={!loading}
        />
        
        {/* Password Input with Eye Icon */}
        <View style={styles.passwordContainer}>
          <TextInput 
            placeholder="Password" 
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
          <TouchableOpacity 
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '👁️‍🗨️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input with Eye Icon */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
          />
          <TouchableOpacity 
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️‍🗨️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {successMessage ? (
          <Text style={styles.successText}>{successMessage}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
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
    color: '#9E1C1F',
    fontSize: 28,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    color: '#9E1C1F',
    fontSize: 24,
    fontFamily:'SFHeavyItalic',
  },
  subtitle: {
    color: '#9E1C1F',
    fontSize: 12,
    fontFamily:'sfsemibolditalic',
    marginBottom: 30,
    letterSpacing: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#9E1C1F',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginRight: 45,
    marginBottom: 16,
    fontSize: 12,
    fontFamily:'sfsemibolditalic',
    color: '#9E1C1F',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#9E1C1F',
    marginRight: 45,
    marginBottom: 16,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 12,
    fontFamily:'sfsemibolditalic',
    color: '#9E1C1F',
  },
  eyeButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  eyeIcon: {
    fontSize: 16,
    color: '#9E1C1F',
  },
  button: {
    backgroundColor: '#9E1C1F',
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 20,
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily:'SFHeavyItalic',
  },
  errorText: {
    color: '#f44336',
    marginBottom: 8,
  },
  successText: {
    color: '#2e7d32',
    marginBottom: 8,
  },
});