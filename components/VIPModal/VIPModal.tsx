import React from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import SVGComponent from "../SVGComponent";

const ReusableModal = ({
  isVisible,
  onClose,
  onConfirm,
  iconName,
  message,
  buttonText,
}: any) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <SVGComponent
            iconName={iconName}
            customWidth="75"
            customHeight="75"
          />
          <Text style={styles.modalText}>{message}</Text>
          <Pressable style={styles.modalButton} onPress={onConfirm}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    width: 300,
    padding: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#333333",
    marginVertical: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#c48cbc",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default ReusableModal;
