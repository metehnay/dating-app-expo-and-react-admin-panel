import React from "react";
import { useTranslation } from "./../../TranslationContext";
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


const HobbiesModal: React.FC<Props> = ({
  isVisible,
  onClose,
  onSelectHobbies,
}) => {
  const [selectedHobbies, setSelectedHobbies] = React.useState<string[]>([]);
  const i18n = useTranslation();

  const hobbiesKeys = [
    "camping",
    "watchingMovies",
    "readingBooks",
    "cooking",
    "traveling",
    "listeningToMusic",
    "playingFootball",
    "photography",
    "dancing",
    "doingYoga",
    "fishing",
    "swimming",
    "mountainClimbing",
    "surfing",
    "biking",
    "running",
    "painting",
    "pottery",
    "playingBasketball",
    "playingVolleyball",
    "playingTennis",
    "acting",
    "playingInstrument",
    "gardening",
    "diving",
    "skiing",
    "playingBilliards",
    "playingChess",
    "playingVideoGames",
    "freeDiving",
  ];

const toggleHobby = (hobby: string) => {
  if (selectedHobbies.includes(hobby)) {
    setSelectedHobbies((prev) => prev.filter((h) => h !== hobby));
  } else {
    // Check if 5 hobbies are already selected
    if (selectedHobbies.length === 5) {
       Alert.alert(
         i18n.t("maxHobbiesSelectionAlertTitle"),
         i18n.t("maxHobbiesSelectionAlertMessage")
       );
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
          {hobbiesKeys.map((hobbyKey, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleHobby(hobbyKey)}
              style={[
                styles.hobbyButton,
                selectedHobbies.includes(hobbyKey)
                  ? styles.selectedHobby
                  : styles.unselectedHobby,
              ]}
            >
              <Text
                style={[
                  styles.hobbyText,
                  selectedHobbies.includes(hobbyKey)
                    ? styles.selectedHobbyText
                    : styles.unselectedHobbyText,
                ]}
              >
                {i18n.t(hobbyKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
          <Text style={styles.doneText}>{i18n.t("confirm")}</Text>
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
