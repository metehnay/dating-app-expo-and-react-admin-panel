import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  Pressable,
  SafeAreaView,
  TextInput,
} from "react-native";

interface CityPickerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectCity: (city: string) => void;
}

const cities = [
  { name: "Turkey", flag: "🇹🇷" },

  { name: "United States", flag: "🇺🇸" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "Ireland", flag: "🇮🇪" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "India", flag: "🇮🇳" }, 
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Philippines", flag: "🇵🇭" }, 
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Malta", flag: "🇲🇹" },
  { name: "Jamaica", flag: "🇯🇲" },

  // Spanish Speaking Countries
  { name: "Spain", flag: "🇪🇸" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Peru", flag: "🇵🇪" },
  { name: "Venezuela", flag: "🇻🇪" },
  { name: "Chile", flag: "🇨🇱" },
  { name: "Colombia", flag: "🇨🇴" },

  // French Speaking Countries
  { name: "France", flag: "🇫🇷" },
  { name: "Canada", flag: "🇨🇦" }, // French is one of the official languages
  { name: "Belgium", flag: "🇧🇪" }, // French is one of the official languages

  // German Speaking Countries
  { name: "Germany", flag: "🇩🇪" },
  { name: "Austria", flag: "🇦🇹" },
  { name: "Switzerland", flag: "🇨🇭" }, // German is one of the official languages

  // Italian Speaking Countries
  { name: "Italy", flag: "🇮🇹" },
  { name: "San Marino", flag: "🇸🇲" },
  { name: "Vatican City", flag: "🇻🇦" },
];


const CityPicker: React.FC<CityPickerProps> = ({
  isVisible,
  onClose,
  onSelectCity,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <TextInput
          style={{
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
          }}
          placeholder="Şehir Ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onSelectCity(item.name);
                onClose();
              }}
            >
              <Text
                style={{
                  padding: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                {item.name}{item.flag}
              </Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default CityPicker;
