import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { firebaseApp } from "../../firebaseConfig";
import UserCard from "../UI/UserCard/UserCard";
import LoadingScreen from "../UI/Loading/Loading";
import firebase from "firebase/compat/app";
import Slider from "./Slider";
import CityPicker from "./../Hooks/CityPicker";

type FilterPreferences = {
  gender: string;
  city: string;
  age: any;
};

const FilterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  // State for preferences
  const [preferences, setPreferences] = useState<FilterPreferences>({
    gender: "",
    city: "",
    age: { start: 18, end: 30 },
  });

  // State for users
  const [users, setUsers] = useState<any[]>([]);
  // State for loading state
  const [loading, setLoading] = useState(false);
  // State for gender dropdown visibility
  const [isGenderDropdownVisible, setIsGenderDropdownVisible] = useState(false);
  // State for city picker visibility
  const [isCityPickerVisible, setIsCityPickerVisible] = useState(false);
  // New state for controlling filter visibility
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  // Helper function to get birthdate range based on age
  const getBirthdateRange = (
    ageStart: number,
    ageEnd: number
  ): [string, string] => {
    const currentYear = new Date().getFullYear();
    const endBirthYearStart = currentYear - ageStart;
    const endBirthYearEnd = currentYear - ageEnd;
    return [`1-1-${endBirthYearEnd}`, `31-12-${endBirthYearStart}`];
  };

  // Function to apply filters
  const applyFilters = async () => {
    setLoading(true);
    let usersRef: firebase.firestore.Query<firebase.firestore.DocumentData> =
      firebaseApp.firestore().collection("users");

    // Gender filter logic
    if (preferences.gender !== "any" && preferences.gender !== "") {
      usersRef = usersRef.where("gender", "==", preferences.gender);
    }

    // City filter logic
    if (preferences.city) {
      usersRef = usersRef.where("city", "==", preferences.city);
    }

    // Birthdate range filter based on age
    if (preferences.age) {
      const [startDate, endDate] = getBirthdateRange(
        preferences.age.start,
        preferences.age.end
      );
      usersRef = usersRef
        .where("birthDate", ">=", startDate)
        .where("birthDate", "<=", endDate);
    }

    try {
      const snapshot = await usersRef.get();
      const filteredUsers = snapshot.docs.map((doc) => doc.data());
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setIsFilterVisible(false); // Hide the filter after applying
    }
  };

  // Function to translate gender for display purposes
  const translateGender = (gender: string) => {
    switch (gender) {
      case "male":
        return "Erkek";
      case "female":
        return "Kadın";
      default:
        return "Hepsi";
    }
  };

  // The main render function
  return (
    <View style={styles.container}>
      {loading && <LoadingScreen loading={true} />}

      <FlatList
        data={users}
        extraData={users}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        key={2}
        renderItem={({ item }) => (
          <UserCard item={item} navigation={navigation} />
        )}
      />

      {isFilterVisible && (
        <View style={styles.filtersContainer}>
          {/* Gender Filter */}
          <Text>Cinsiyet:</Text>
          <TouchableOpacity
            onPress={() => setIsGenderDropdownVisible(!isGenderDropdownVisible)}
          >
            <Text style={styles.dropdownPlaceholder}>
              {translateGender(preferences.gender) || "Cinsiyet Seçin"}
            </Text>
          </TouchableOpacity>
          {isGenderDropdownVisible && (
            <View style={styles.dropdown}>
              {["male", "female", "any"].map((g, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setPreferences((prev) => ({ ...prev, gender: g }));
                    setIsGenderDropdownVisible(false);
                  }}
                >
                  <Text>{translateGender(g)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* City Filter */}
          <Text>Şehir:</Text>
          <TouchableOpacity onPress={() => setIsCityPickerVisible(true)}>
            <Text style={styles.dropdownPlaceholder}>
              {preferences.city || "Şehir Seçin"}
            </Text>
          </TouchableOpacity>
          <CityPicker
            isVisible={isCityPickerVisible}
            onClose={() => setIsCityPickerVisible(false)}
            onSelectCity={(selectedCity) => {
              setPreferences((prev) => ({ ...prev, city: selectedCity }));
            }}
          />

          {/* Age Filter */}
          <Text>Yaş aralığı:</Text>
          <View style={styles.sliderContainer}>
            <Slider
              onChange={(startAge, endAge) => {
                setPreferences((prev) => ({
                  ...prev,
                  age: { start: startAge, end: endAge },
                }));
              }}
            />
          </View>

          {/* Apply Filters Button */}
          <TouchableOpacity
            style={styles.showFiltersButton}
            onPress={applyFilters}
          >
            <Text style={{color: "#ffffff"}}>Seçimleri Uygula</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Button to Toggle Filters */}
      {!isFilterVisible && (
        <TouchableOpacity
          style={styles.showFiltersButton}
          onPress={() => setIsFilterVisible(true)}
        >
          <Text style={{color: "#ffffff"}}>Filtrelemeyi Aç</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  showFiltersButton: {
    padding: 15,
    backgroundColor: "#ff95d3", // Example color for visibility. Adjust as needed.
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    elevation: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  filtersContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    elevation: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sliderContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: "100%",
    maxHeight: 200,
    marginTop: 10,
    borderRadius: 5,
  },
  dropdownPlaceholder: {
    padding: 10,
    width: "100%",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
});

export default FilterScreen;
