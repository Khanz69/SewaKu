import { CarType, Product, Transmission } from "@/src/types/product";
import { resolveProductImage } from "@/src/utils/productImage";
import type { LocalImageAsset } from "@/src/utils/productRequest";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  value: Partial<Product>;
  onChange: (data: Partial<Product>) => void;
  carTypeOptions?: string[];
};

const TRANSMISSIONS: Transmission[] = ["Manual", "Automatic"];
const DEFAULT_CARTYPES: CarType[] = ["City Car", "SUV", "MPV", "Sedan"];
export default function ProductForm({ value, onChange, carTypeOptions }: Props) {
  const [local, setLocal] = useState<Partial<Product>>(value);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const carTypes = carTypeOptions ?? DEFAULT_CARTYPES;
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        setPermissionError("Izin galeri diperlukan untuk memilih gambar.");
      } else {
        setPermissionError(null);
      }
    })();
  }, []);

  const validate = (data: Partial<Product>) => {
    const newErrors: Record<string, string> = {};
    
    if (!data.name?.trim()) newErrors.name = "Nama produk wajib diisi";
    if (!data.pricePerDay || data.pricePerDay <= 0) newErrors.pricePerDay = "Harga harus lebih dari 0";
    if (!data.lokasi?.trim()) newErrors.lokasi = "Lokasi wajib diisi";
    const hasImage =
      typeof data.image === "string"
        ? !!data.image.trim()
        : Boolean(data.image);
    if (!hasImage) newErrors.image = "Gambar produk wajib dipilih";
    if (data.seats && data.seats <= 0) newErrors.seats = "Jumlah kursi harus lebih dari 0";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const set = <K extends keyof Product>(k: K, v: Product[K]) => {
    const next = { ...local, [k]: v };
    setLocal(next);
    validate(next);
    onChange(next);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      const request = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (request.status !== ImagePicker.PermissionStatus.GRANTED) {
        setPermissionError("Izin galeri diperlukan untuk memilih gambar.");
        return;
      }
    }
    setPermissionError(null);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (result.canceled) return;
    const asset = result.assets[0];
    const enriched: LocalImageAsset = {
      uri: asset.uri,
      base64: asset.base64,
      name: asset.fileName ?? `photo-${Date.now()}.jpg`,
      type: asset.type ?? "image/jpeg",
      width: asset.width,
      height: asset.height,
      size: asset.fileSize,
    };
    set("image", enriched);
  };

  return (
    <View style={s.container}>
      <Field label="Gambar Produk" error={errors.image}>
        {permissionError ? (
          <Text style={s.errorText}>{permissionError}</Text>
        ) : (
          <TouchableOpacity style={s.imagePicker} onPress={pickImage} activeOpacity={0.7}>
            <Text style={s.imagePickerText}>
              {local.image ? "Ganti gambar" : "Pilih gambar dari galeri"}
            </Text>
            {local.image && (
              <Image source={resolveProductImage(local.image)} style={s.imagePreview} />
            )}
          </TouchableOpacity>
        )}
      </Field>

      <Field label="Nama Produk" error={errors.name}>
        <TextInput style={[s.input, errors.name && s.inputError]} placeholder="Masukkan Nama Mobil" value={local.name} onChangeText={(t) => set("name", t)} />
      </Field>

      <Field label="Transmisi">
        <Pills options={TRANSMISSIONS} value={local.transmission} onChange={(v) => set("transmission", v)} />
      </Field>

      <Field label="Jumlah Kursi" error={errors.seats}>
        <TextInput
          style={[s.input, errors.seats && s.inputError]}
          keyboardType="numeric"
          placeholder="Jumlah Kursi"
          value={local.seats?.toString()}
          onChangeText={(t) => set("seats", Number(t) || 0)}
        />
      </Field>

      <Field label="Harga / hari" error={errors.pricePerDay}>
        <TextInput
          style={[s.input, errors.pricePerDay && s.inputError]}
          keyboardType="numeric"
          placeholder="Dalam Rupiah"
          value={local.pricePerDay?.toString()}
          onChangeText={(t) => set("pricePerDay", Number(t) || 0)}
        />
      </Field>

      <Field label="Plat Nomor">
        <TextInput style={s.input} placeholder="Masukkan Plat Anda" value={local.plateNumber} onChangeText={(t) => set("plateNumber", t)} />
      </Field>

      <Field label="Kapasitas Bagasi">
        <TextInput style={s.input} placeholder="Contoh: 1 Tas Besar" value={local.bagCapacity} onChangeText={(t) => set("bagCapacity", t)} />
      </Field>

      <Field label="Jenis Mobil">
        <Pills options={carTypes} value={local.carType} onChange={(v) => set("carType", v)} />
      </Field>

      <Field label="Lokasi" error={errors.lokasi}>
        <TextInput style={[s.input, errors.lokasi && s.inputError]} placeholder="Masukkan Lokasi Anda" value={local.lokasi} onChangeText={(t) => set("lokasi", t)} />
      </Field>

      <Field label="Deskripsi Singkat">
        <TextInput
          style={[s.input, { height: 100 }]}
          multiline
          placeholder="Deskripsi kondisi model"
          value={local.description}
          onChangeText={(t) => set("description", t)}
        />
      </Field>
    </View>
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <View style={s.fieldContainer}>
      <Text style={s.label}>{label}</Text>
      {children}
      {error && <Text style={s.errorText}>{error}</Text>}
    </View>
  );
}

function Pills<T extends string>({ options, value, onChange }: { options: T[]; value?: T; onChange: (v: T) => void }) {
  return (
    <View style={s.pillsWrap}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <TouchableOpacity key={opt} onPress={() => onChange(opt)} style={[s.pill, active && s.pillActive]}>
            <Text style={[s.pillText, active && { color: "#fff" }]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: "#E5E5E5", // Grey background for form container
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  imagePickerText: {
    color: "#0f1e4a",
    fontWeight: "600",
    marginBottom: 8,
  },
  imagePreview: {
    width: 180,
    height: 120,
    borderRadius: 12,
    marginTop: 8,
  },
  inputError: {
    borderColor: "#dc2626",
    borderWidth: 2,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 8,
    fontWeight: "600",
  },
  pillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  pillActive: {
    backgroundColor: "#0f1e4a",
  },
  pillText: {
    color: "#0f1e4a",
    fontWeight: "600",
  },
  label: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  fieldContainer: {
    marginBottom: 8,
  },
});
