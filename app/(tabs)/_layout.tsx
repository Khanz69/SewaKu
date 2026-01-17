import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [pressedTab, setPressedTab] = useState<string | null>(null);

  // Fungsi untuk menampilkan icon dengan efek klik
  const renderIcon = (icon: any, name: string, size = 28): React.ReactNode => (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => {
        setPressedTab(name);
        setTimeout(() => setPressedTab(null), 300);
      }}
    >
      <Image
        source={icon}
        style={{
          width: size,
          height: size,
          tintColor: pressedTab === name ? '#636363ff' : '#fff',
        }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          backgroundColor: '#ac2f2fff',
          height: 60,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 6,
          color: '#fff',
        },
        tabBarButton: HapticTab,
      }}
    >
      {/* 🏠 Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: () =>
            renderIcon(require('../../assets/images/home.png'), 'home'),
        }}
      />

      {/* Hidden index alias */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      {/* 📦 PesananKu */}
      <Tabs.Screen
        name="PesananKu"
        options={{
          title: 'Pesanan',
          tabBarIcon: () =>
            renderIcon(require('../../assets/images/list.png'), 'pesanan'),
        }}
      />

      {/* ➕ Tambah Produk (Kecilkan Icon) */}
      <Tabs.Screen
        name="ProduKu"
        options={{
          title: 'Tambah',
          tabBarIcon: () =>
            renderIcon(require('../../assets/images/tambah.png'), 'tambah', 22), // ubah ukuran di sini
        }}
      />

      {/* 👤 Profil */}
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profil',
          tabBarIcon: () =>
            renderIcon(require('../../assets/images/profile.png'), 'profil'),
        }}
      />
    </Tabs>
  );
}
