import { Responsive } from "@/src/constants/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  isVisible: boolean;
  onConfirm: (time: string) => void;
  onCancel: () => void;
  title?: string;
  minTime?: { hour: number; minute: number };
};

export default function TimePickerModal({
  isVisible,
  onConfirm,
  onCancel,
  title = "Pilih Waktu",
  minTime,
}: Props) {
  const [selectedHour, setSelectedHour] = useState<number>(7);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);

  const clampTime = useCallback(
    (hour: number, minute: number) => {
      if (!minTime) {
        return { hour, minute };
      }
      if (hour > minTime.hour) {
        return { hour, minute };
      }
      if (hour < minTime.hour) {
        return { hour: minTime.hour, minute: minTime.minute };
      }
      if (minute >= minTime.minute) {
        return { hour, minute };
      }
      return { hour, minute: minTime.minute };
    },
    [minTime]
  );

  useEffect(() => {
    if (!minTime) return;
    const { hour, minute } = clampTime(selectedHour, selectedMinute);
    if (hour !== selectedHour || minute !== selectedMinute) {
      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  }, [minTime, selectedHour, selectedMinute, clampTime]);

  const adjustTime = (deltaMinutes: number) => {
    const totalMinutes = (selectedHour * 60 + selectedMinute + deltaMinutes + 24 * 60) % (24 * 60);
    const candidateHour = Math.floor(totalMinutes / 60);
    const candidateMinute = totalMinutes % 60;
    const { hour, minute } = clampTime(candidateHour, candidateMinute);
    setSelectedHour(hour);
    setSelectedMinute(minute);
  };

  const formatTime = (hour: number, minute: number) => {
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  const handleConfirm = () => {
    const { hour, minute } = clampTime(selectedHour, selectedMinute);
    if (hour !== selectedHour || minute !== selectedMinute) {
      setSelectedHour(hour);
      setSelectedMinute(minute);
      return;
    }
    onConfirm(formatTime(hour, minute));
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
                  onPress={() => adjustTime(60)}
                >
                <Ionicons name="chevron-up" size={32} color="#0f1e4a" />
              </TouchableOpacity>
              
              <View style={s.valueDisplay}>
                <Text style={s.valueText}>{String(selectedHour).padStart(2, "0")}</Text>
              </View>
              
              <TouchableOpacity 
                style={s.arrowButton}
                onPress={() => adjustTime(-60)}
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
                onPress={() => adjustTime(1)}
              >
                <Ionicons name="chevron-up" size={32} color="#0f1e4a" />
              </TouchableOpacity>
              
              <View style={s.valueDisplay}>
                <Text style={s.valueText}>{String(selectedMinute).padStart(2, "0")}</Text>
              </View>
              
              <TouchableOpacity 
                style={s.arrowButton}
                onPress={() => adjustTime(-1)}
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
                const { hour, minute } = clampTime(7, 0);
                setSelectedHour(hour);
                setSelectedMinute(minute);
              }}
            >
              <Text style={s.quickSelectText}>07:00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.quickSelectBtn}
              onPress={() => {
                const { hour, minute } = clampTime(12, 0);
                setSelectedHour(hour);
                setSelectedMinute(minute);
              }}
            >
              <Text style={s.quickSelectText}>12:00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.quickSelectBtn}
              onPress={() => {
                const { hour, minute } = clampTime(17, 0);
                setSelectedHour(hour);
                setSelectedMinute(minute);
              }}
            >
              <Text style={s.quickSelectText}>17:00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.quickSelectBtn}
              onPress={() => {
                const { hour, minute } = clampTime(20, 0);
                setSelectedHour(hour);
                setSelectedMinute(minute);
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
