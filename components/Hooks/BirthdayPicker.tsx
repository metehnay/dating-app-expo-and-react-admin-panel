import React, { useState } from "react";
import {
  View,
  Modal,
  Button,
  SafeAreaView,
  Text,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

interface BirthdayPickerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectDate: (day: string, month: string, year: string) => void;
}

const BirthdayPicker: React.FC<BirthdayPickerProps> = ({
  isVisible,
  onClose,
  onSelectDate,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>("1");
  const [selectedMonth, setSelectedMonth] = useState<string>("1");
  const [selectedYear, setSelectedYear] = useState<string>("1984");

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) =>
    (currentYear - i).toString()
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Gün</Text>
          <Picker
            selectedValue={selectedDay}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedDay(itemValue.toString())}
          >
            {days.map((day) => (
              <Picker.Item key={day} label={day} value={day} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Ay</Text>
          <Picker
            selectedValue={selectedMonth}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setSelectedMonth(itemValue.toString())
            }
          >
            {months.map((month) => (
              <Picker.Item key={month} label={month} value={month} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Yıl</Text>
          <Picker
            selectedValue={selectedYear}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedYear(itemValue.toString())}
          >
            {years.map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>
        </View>
        <Button
          title="Onayla"
          onPress={() => {
            onSelectDate(selectedDay, selectedMonth, selectedYear);
            onClose();
          }}
          color="#c48cbc" // Use a modern blue color
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F4F4", // Light gray background
  },
  pickerContainer: {
    width: "80%",
    marginVertical: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF", // White background
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0", // Light gray border
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333333", // Dark gray text color
  },
  picker: {
    width: "100%",
    height: 40,
  },
});

export default BirthdayPicker;
