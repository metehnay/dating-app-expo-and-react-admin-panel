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
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Aksaray",
  "Amasya",
  "Ankara",
  "Antalya",
  "Ardahan",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bartın",
  "Batman",
  "Bayburt",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Düzce",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Iğdır",
  "Isparta",
  "İstanbul",
  "İzmir",
  "Kahramanmaraş",
  "Karabük",
  "Karaman",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kırıkkale",
  "Kırklareli",
  "Kırşehir",
  "Kilis",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Mardin",
  "Mersin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Osmaniye",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Şanlıurfa",
  "Şırnak",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Uşak",
  "Van",
  "Yalova",
  "Yozgat",
  "Zonguldak",
];

const CityPicker: React.FC<CityPickerProps> = ({
  isVisible,
  onClose,
  onSelectCity,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
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
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onSelectCity(item);
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
                {item}
              </Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default CityPicker;
