import { Responsive } from "@/src/constants/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  isVisible: boolean;
  onConfirm: (time: string) => void;
  onCancel: () => void;
  title?: string;
};

export default function TimePickerModal({
  isVisible,
  onConfirm,
  onCancel,
  title = "Pilih Waktu",
}: Props) {
  const [selectedHour, setSelectedHour] = useState<number>(7);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);

  const incrementHour = () => setSelectedHour((h) => (h + 1) % 24);
  const decrementHour = () => setSelectedHour((h) => (h - 1 + 24) % 24);
  const incrementMinute = () => setSelectedMinute((m) => (m + 1) % 60);
  const decrementMinute = () => setSelectedMinute((m) => (m - 1 + 60) % 60);

  const formatTime = (hour: number, minute: number) => {
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  const handleConfirm = () => {
    onConfirm(formatTime(selectedHour, selectedMinute));
  };

  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <View style={s.backdrop}>
        <View style={s.container}>
          <Text style={s.title}>{title}</Text>

          <View style={s.timeDisplay}>
            <Text style={s.timeValue}>{formatTime(selectedHour, selectedMinute)}</Text>
          </View>

          {/* Hour and Minute Picker with Arrows */}
          <View style={s.pickerContainer}>
            {/* Hour Picker */}
            <View style={s.pickerSection}>
              <Text style={s.pickerLabel}>Jam</Text>
              <TouchableOpacity 
                style={s.arrowButton}
                onPress={incrementHour}
              >
                <Ionicons name="chevron-up" size={32} color="#0f1e4a" />
              </TouchableOpacity>
              
              <View style={s.valueDisplay}>
                <Text style={s.valueText}>{String(selectedHour).padStart(2, "0")}</Text>
              </View>
              
              <TouchableOpacity 
                style={s.arrowButton}
                onPress={decrementHour}
              >
                <Ionicons name="chevron-down" size={32} color="#0f1e4a" />
              </TouchableOpacity>
            </View>

            {/* Separator */}
            <Text style={s.separator}>:</Text>

            {/* Minute Picker */}
            <View style={s.pickerSection}>
              <Text style={s.pickerLabel}>Menit</Text>
              <TouchableOpacity 
                style={s.arrowButton}
                onPress={incrementMinute}
              >
                <Ionicons name="chevron-up" size={32} color="#0f1e4a" />
              </TouchableOpacity>
              
              <View style={s.valueDisplay}>
                <Text style={s.valueText}>{String(selectedMinute).padStart(2, "0")}</Text>
              </View>
              
              <TouchableOpacity 
                style={s.arrowButton}
                onPress={decrementMinute}
              >
                <Ionicons name="chevron-down" size={32} color="#0f1e4a" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Select Buttons */}
          <View style={s.quickSelectContainer}>
            <TouchableOpacity
              style={s.quickSelectBtn}
              onPress={() => {
                setSelectedHour(7);
                setSelectedMinute(0);
              }}
            >
              <Text style={s.quickSelectText}>07:00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.quickSelectBtn}
              onPress={() => {
                setSelectedHour(12);
                setSelectedMinute(0);
              }}
            >
              <Text style={s.quickSelectText}>12:00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.quickSelectBtn}
              onPress={() => {
                setSelectedHour(17);
                setSelectedMinute(0);
              }}
            >
              <Text style={s.quickSelectText}>17:00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.quickSelectBtn}
              onPress={() => {
                setSelectedHour(20);
                setSelectedMinute(0);
              }}
            >
              <Text style={s.quickSelectText}>20:00</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={s.buttonGroup}>
            <TouchableOpacity style={[s.button, s.cancelBtn]} onPress={onCancel}>
              <Text style={s.cancelText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.button, s.confirmBtn]}
              onPress={handleConfirm}
            >
              <Text style={s.confirmText}>Pilih</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: Responsive.borderRadius.lg,
    padding: Responsive.spacing.lg,
    elevation: 5,
  },
  title: {
    fontWeight: "700",
    fontSize: Responsive.fontSize.xl,
    color: "#0f1e4a",
    textAlign: "center",
    marginBottom: Responsive.spacing.lg,
  },
  timeDisplay: {
    backgroundColor: "#f3f4f6",
    borderRadius: Responsive.borderRadius.md,
    paddingVertical: Responsive.spacing.md,
    paddingHorizontal: Responsive.spacing.lg,
    marginBottom: Responsive.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: "#0f1e4a",
    alignItems: "center",
  },
  timeValue: {
    fontSize: Responsive.fontSize.display,
    fontWeight: "700",
    color: "#0f1e4a",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: Responsive.spacing.xl,
    paddingVertical: Responsive.spacing.md,
  },
  pickerSection: {
    alignItems: "center",
    gap: Responsive.spacing.sm,
  },
  pickerLabel: {
    fontSize: Responsive.fontSize.sm,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: Responsive.spacing.md,
  },
  arrowButton: {
    paddingHorizontal: Responsive.spacing.md,
    paddingVertical: Responsive.spacing.sm,
    borderRadius: Responsive.borderRadius.md,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  valueDisplay: {
    backgroundColor: "#0f1e4a",
    borderRadius: Responsive.borderRadius.md,
    paddingHorizontal: Responsive.spacing.lg,
    paddingVertical: Responsive.spacing.md,
    minWidth: Responsive.size(70),
    justifyContent: "center",
    alignItems: "center",
  },
  valueText: {
    fontSize: Responsive.fontSize.display,
    fontWeight: "700",
    color: "#fff",
  },
  separator: {
    fontSize: Responsive.fontSize.display,
    fontWeight: "700",
    color: "#0f1e4a",
    marginHorizontal: Responsive.spacing.sm,
  },
  quickSelectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Responsive.spacing.sm,
    marginBottom: Responsive.spacing.lg,
  },
  quickSelectBtn: {
    width: "48%",
    backgroundColor: "#f3f4f6",
    paddingVertical: Responsive.spacing.sm,
    borderRadius: Responsive.borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  quickSelectText: {
    fontSize: Responsive.fontSize.sm,
    fontWeight: "600",
    color: "#0f1e4a",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Responsive.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: Responsive.spacing.md,
    borderRadius: Responsive.borderRadius.lg,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#e5e7eb",
  },
  cancelText: {
    color: "#111827",
    fontWeight: "600",
  },
  confirmBtn: {
    backgroundColor: "#0f1e4a",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
  },
});
