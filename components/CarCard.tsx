import { Car } from "@/src/types/car";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CarCardProps = {
  car: Car;
};

export const CarCard = ({ car }: CarCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/Detail/DetailMobil",
          params: {
            id: car.id,
            name: car.name,
            price: car.price,
            pricePerDay: car.pricePerDay.toString(),
            code: car.code,
            location: car.location,
            image: car.imageName,
            seats: car.seats?.toString(),
            bagCapacity: car.bagCapacity,
            transmission: car.transmission,
            carType: car.carType,
            description: car.description,
          },
        })
      }
    >
      <Image source={car.image} style={styles.carImage} />
      <View style={styles.verticalLine} />
      <View style={styles.carInfo}>
        <Text style={styles.carName}>{car.name}</Text>
        <Text style={styles.carPrice}>{car.price}</Text>
        <Text style={styles.carCode}>{car.code}</Text>
        <Text style={styles.carLocation}>{car.location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 6,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
    elevation: 2,
    alignItems: "center",
  },
  carImage: {
    width: 100,
    height: 65,
    resizeMode: "stretch",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 15,
  },
  verticalLine: {
    width: 0.5,
    height: "80%",
    backgroundColor: "#000000ff",
    opacity: 0.7,
    marginRight: 8,
  },
  carInfo: {
    flex: 1,
    paddingRight: 10,
  },
  carName: {
    fontFamily: "SFBold",
    fontSize: 12,
    color: "#000",
  },
  carPrice: {
    color: "#1A1A8D",
    fontWeight: "bold",
    marginVertical: 4,
    fontSize: 10,
  },
  carCode: {
    color: "#000000ff",
    fontSize: 8,
    fontFamily: "SFRegular",
  },
  carLocation: {
    color: "#000000ff",
    fontSize: 8,
    fontFamily: "SFRegular",
  },
});
