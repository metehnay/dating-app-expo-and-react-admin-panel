import React from "react";
import { View, Modal, Image, Pressable, Text, StyleSheet } from "react-native";

interface ImageModalProps {
  isVisible: boolean;
  closeModal: () => void;
  imageUri?: string | null;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isVisible,
  closeModal,
  imageUri,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modal}>
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        )}
        <Pressable onPress={closeModal} style={styles.closeModal}>
          <Text style={styles.closeText}>Kapat</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeModal: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  closeText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ImageModal;
