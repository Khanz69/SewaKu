import { useState } from "react";
import { Order } from "../types/order";

export function usePesananKu() {
  const [selectedTab, setSelectedTab] = useState("Semua");
  const [search, setSearch] = useState("");

  const tabs = ["Semua", "Aktif", "Selesai"];

  const orders: Order[] = [
    {
      name: "Audi Q3 Sportback",
      price: "Rp850.000 / hari",
      id: "KDJ4951",
      location: "Jakarta Selatan",
      image: require("@/assets/images/audi.jpg"),
    },
    {
      name: "Ford F150 Raptor",
      price: "Rp250.000 / hari",
      id: "KDJ4952",
      location: "Depok",
      image: require("@/assets/images/raptor.jpg"),
    },
  ];

  return {
    selectedTab,
    setSelectedTab,
    search,
    setSearch,
    tabs,
    orders,
  };
}
