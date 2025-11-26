import { CarType, Product, Transmission } from "@/src/types/product";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = { value: Partial<Product>; onChange: (data: Partial<Product>) => void };

const TRANSMISSIONS: Transmission[] = ["Manual", "Automatic"];
const CARTYPES: CarType[] = ["City Car", "SUV", "MPV", "Sedan"];

export default function ProductForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<Partial<Product>>(value);

  const set = <K extends keyof Product>(k: K, v: Product[K]) => {
    const next = { ...local, [k]: v };
    setLocal(next);
    onChange(next);
  };

  return (
    <View style={s.container}>
      {/* Hanya label "Gambar Produk" yang dipisah */}
      <Text style={s.labelG}>Gambar Produk</Text>
      <TextInput
        style={s.input}
        placeholder="URL Gambar"
        value={local.image}
        onChangeText={(t) => set("image", t)}
      />

      <Field label="Nama Produk">
        <TextInput style={s.input} placeholder="Masukkan Nama Mobil" value={local.name} onChangeText={(t) => set("name", t)} />
      </Field>

      <Field label="Transmisi">
        <Pills options={TRANSMISSIONS} value={local.transmission} onChange={(v) => set("transmission", v)} />
      </Field>

      <Field label="Jumlah Kursi">
        <TextInput
          style={s.input}
          keyboardType="numeric"
          placeholder="Jumlah Kursi"
          value={local.seats?.toString()}
          onChangeText={(t) => set("seats", Number(t) || 0)}
        />
      </Field>

      <Field label="Harga / hari">
        <TextInput
          style={s.input}
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
        <Pills options={CARTYPES} value={local.carType} onChange={(v) => set("carType", v)} />
      </Field>

      <Field label="Lokasi">
        <TextInput style={s.input} placeholder="Masukkan Lokasi Anda" value={local.lokasi} onChangeText={(t) => set("lokasi", t)} />
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.fieldContainer}>
      <Text style={s.label}>{label}</Text>
      {children}
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
  labelG: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop:8
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
