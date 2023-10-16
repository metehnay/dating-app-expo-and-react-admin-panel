import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTranslation } from "../../TranslationContext";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  selectedHeight: string;
  setSelectedHeight: (value: string) => void;
  selectedWeight: string;
  setSelectedWeight: (value: string) => void;
  selectedEyeColor: string;
  setSelectedEyeColor: (value: string) => void;
  selectedHairColor: string;
  setSelectedHairColor: (value: string) => void;
  handleSavePhysicalAttributes: () => void;
}

const CustomDropdown: React.FC<{
  label: string;
  selectedValue: string;
  onPress: () => void;
}> = ({ label, selectedValue, onPress }) => {
  return (
    <View style={styles.selectInputContainer}>
      <Text style={styles.labelText}>{label}:</Text>
      <TouchableOpacity style={styles.selectInput} onPress={onPress}>
        <Text style={styles.selectedValueText}>{selectedValue}</Text>
      </TouchableOpacity>
    </View>
  );
};

const PhysicalAttributesModal: React.FC<Props> = ({
  isVisible,
  onClose,
  selectedHeight,
  setSelectedHeight,
  selectedWeight,
  setSelectedWeight,
  selectedEyeColor,
  setSelectedEyeColor,
  selectedHairColor,
  setSelectedHairColor,
  handleSavePhysicalAttributes,
}) => {
    const { t } = useTranslation();

  const heightOptions = Array.from(
    { length: 71 },
    (_, i) => (i + 140) / 100 // Generate heights from 1.40m to 2.10m
  ).map((height) => height.toFixed(2)); // Format heights to two decimal places

  const weightOptions = Array.from({ length: 131 }, (_, i) => 30 + i).map(
    (weight) => weight.toString()
  ); // Generate weights from 30 to 160


  const [showHeightDropdown, setShowHeightDropdown] = useState(false);
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);
  const [showEyeColorDropdown, setShowEyeColorDropdown] = useState(false);
  const [showHairColorDropdown, setShowHairColorDropdown] = useState(false);

  const closeDropdowns = () => {
    setShowHeightDropdown(false);
    setShowWeightDropdown(false);
    setShowEyeColorDropdown(false);
    setShowHairColorDropdown(false);
  };

  return (
     
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('MyPhysicalStats')}</Text>

          {/* Dynamic rendering of dropdowns */}
          {[
            {
              label: t("HeightM"),
              value: selectedHeight,
              toggle: setShowHeightDropdown,
              show: showHeightDropdown,
              options: heightOptions,
              setter: setSelectedHeight,
            },
            {
              label: t("Weightkg"),
              value: selectedWeight,
              toggle: setShowWeightDropdown,
              show: showWeightDropdown,
              options: weightOptions,
              setter: setSelectedWeight,
            },
          ].map((dropdown, index) => (
            <React.Fragment key={index}>
              <CustomDropdown
                label={dropdown.label}
                selectedValue={dropdown.value}
                onPress={() => {
                  closeDropdowns();
                  dropdown.toggle(!dropdown.show);
                }}
              />
              {dropdown.show && (
                <ScrollView
                  style={styles.dropdownOptions}
                  contentContainerStyle={styles.scrollContainer}
                >
                  {dropdown.options.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.optionItem}
                      onPress={() => {
                        dropdown.setter(option);
                        dropdown.toggle(false);
                      }}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </React.Fragment>
          ))}

          <View style={styles.buttonContainer}>
            <Button
              title={t("saveModal")}
              onPress={handleSavePhysicalAttributes}
              color="#c48cbc"
            />
            <Button title={t("closeModal")} onPress={onClose} color="gray" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  optionItemHovered: {
    backgroundColor: "#f5f5f5",
  },
  optionItemSelected: {
    backgroundColor: "#eee",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Shadow for Android
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  selectInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  labelText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  selectInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  selectedValueText: {
    fontSize: 16,
  },
  dropdownOptions: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    maxHeight: 150,
    backgroundColor: "#FFFFFF", // Dropdown background color
  },
  scrollContainer: {
    flexGrow: 1,
  },
  optionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default PhysicalAttributesModal;
