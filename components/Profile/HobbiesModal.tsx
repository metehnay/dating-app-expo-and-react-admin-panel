import React from "react";
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSelectHobbies: (selectedHobbies: string[]) => void;
}

const hobbies = [
  "Kamp yapma", // Camping
  "Sinema", // Watching movies
  "Kitap okuma", // Reading books
  "Yemek yapma", // Cooking
  "Seyahat", // Traveling
  "Müzik dinleme", // Listening to music
  "Futbol", // Soccer/football
  "Fotoğrafçılık", // Photography
  "Dans", // Dancing
  "Yoga", // Yoga
  "Balık tutma", // Fishing
  "Yüzme", // Swimming
  "Dağcılık", // Mountain climbing
  "Sörf", // Surfing
  "Bisiklet sürme", // Biking/cycling
  "Koşu", // Running
  "Resim yapma", // Painting
  "Seramik yapma", // Pottery
  "Basketbol", // Basketball
  "Voleybol", // Volleyball
  "Tenis", // Tennis
  "Tiyatro", // Theater/acting
  "Müzik aleti çalma", // Playing a musical instrument
  "Bahçıvanlık", // Gardening
  "Dalış", // Diving
  "Kayak", // Skiing
  "Bilardo", // Billiards
  "Satranç", // Chess
  "Video oyunları", // Video games
  "Serbest dalış", // Free diving
];

const HobbiesModal: React.FC<Props> = ({
  isVisible,
  onClose,
  onSelectHobbies,
}) => {
  const [selectedHobbies, setSelectedHobbies] = React.useState<string[]>([]);

const toggleHobby = (hobby: string) => {
  if (selectedHobbies.includes(hobby)) {
    setSelectedHobbies((prev) => prev.filter((h) => h !== hobby));
  } else {
    // Check if 5 hobbies are already selected
    if (selectedHobbies.length === 5) {
      Alert.alert("Bilgi", "En fazla 5 hobi seçebilirsiniz.");
      return; // Prevent adding more hobbies
    }
    setSelectedHobbies((prev) => [...prev, hobby]);
  }
};

  const handleDone = () => {
    onSelectHobbies(selectedHobbies);
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.hobbyContainer}>
          {hobbies.map((hobby, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleHobby(hobby)}
              style={[
                styles.hobbyButton,
                selectedHobbies.includes(hobby)
                  ? styles.selectedHobby
                  : styles.unselectedHobby,
              ]}
            >
              <Text
                style={[
                  styles.hobbyText,
                  selectedHobbies.includes(hobby)
                    ? styles.selectedHobbyText
                    : styles.unselectedHobbyText,
                ]}
              >
                {hobby}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
          <Text style={styles.doneText}>Onayla</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  hobbyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  hobbyButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    margin: 8,
    borderRadius: 25, // Increase for rounded edges
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedHobby: {
    backgroundColor: "#FF5864", // Tinder's pinkish color
    borderColor: "#FF5864",
  },
  unselectedHobby: {
    backgroundColor: "white",
  },
  hobbyText: {
    fontSize: 14,
  },
  selectedHobbyText: {
    color: "white",
  },
  unselectedHobbyText: {
    color: "#333", // Dark gray
  },
  doneButton: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: "#FF5864",
    marginTop: 20,
    width: 150,
    alignItems: "center",
  },
  doneText: {
    fontSize: 16,
    color: "white",
  },
});

export default HobbiesModal;
