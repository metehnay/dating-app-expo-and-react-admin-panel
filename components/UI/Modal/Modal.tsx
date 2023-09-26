import React, { useState } from "react";
import { View, Modal, Text, TouchableOpacity, StyleSheet } from "react-native";
import styles from "./style";
import { CustomInput } from "./../Input/Input";

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  const [modalEmail, setModalEmail] = useState("");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>E-posta Adresinizi Girin</Text>
          <CustomInput
            placeholder="Email"
            onChangeText={setModalEmail}
            value={modalEmail}
          />
          <TouchableOpacity onPress={() => onConfirm(modalEmail)}>
            <Text style={styles.modalButton}>Gönder</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalButton}>İptal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
