import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./style";
import { firebaseApp, db } from "../../../firebaseConfig";
import CityPicker from "../../Hooks/CityPicker";
import BirthdayPicker from "../../Hooks/BirthdayPicker";
import LoadingScreen from "./../../UI/Loading/Loading";
import { useTranslation } from "../../../TranslationContext";

export default function SignUp({ navigation }: any) {
  // State variables for user details
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [modalCityVisible, setModalCityVisible] = useState<boolean>(false);
  const [birthDate, setBirthDate] = useState<string>("");
  const [modalBirthdayVisible, setModalBirthdayVisible] =
    useState<boolean>(false);
  const [gender, setGender] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1); // 1 for first step, 2 for second step
  const i18n = useTranslation();

  /**
   * Function to handle the next step button press.
   * If on the first step, it checks if gender is selected.
   * If on the second step, it triggers the registration process.
   */
  const onNextStepPress = () => {
    if (step === 1) {
      if (!gender) {
        alert(i18n.t("genderError"));
        return;
      }
      if (!fullName || !selectedCity || !birthDate) {
                alert(i18n.t("emptyField"));

        return;
      }
      setStep(2);
    } else {
      // Check if any of the required fields are empty for step 2
      if (!email || !password) {
        alert(i18n.t("EmailPasswordEmpty"));
        return;
      }
      onRegisterPress();
    }
  };


  const handleCitySelection = (city: string) => {
    setSelectedCity(city);
    setModalCityVisible(false);
  };

  const handleBirthdaySelection = (
    day: string,
    month: string,
    year: string
  ) => {
    const date = `${day}-${month}-${year}`;
    setBirthDate(date);
    setModalBirthdayVisible(false);
  };

  /**
   * Function to navigate to the Home screen.
   */
  const onFooterLinkPress = () => {
    navigation.navigate("Home");
  };

  /**
   * Function to handle user registration.
   * It uses Firebase to create a new user and then updates the Firestore with user details.
   */
  const onRegisterPress = () => {
    // Check if any of the required fields are empty
    if (
      !fullName ||
      !email ||
      !password ||
      !selectedCity ||
      !birthDate ||
      !gender
    ) {
        alert(i18n.t("emptyField"));
      return;
    }

    setLoading(true); // Start the loading process

    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response: any) => {
        const uid = response.user.uid;
        const data = {
          id: uid,
          email,
          fullName,
          city: selectedCity,
          birthDate,
          gender,
        };
        const usersRef = firebaseApp.firestore().collection("users");
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            response.user
              .updateProfile({
                displayName: fullName,
              })
              .then(() => {
                navigation.navigate("Anasayfa", { user: data });
              });
          })
          .catch((error: any) => {
            setLoading(false); // End the loading process on error
            alert(error);
          });
      })
      .catch((error: any) => {
        setLoading(false); // End the loading process on error
        alert(i18n.t("error"));
      });
  };

  // Render the SignUp component
  return (
    <View style={styles.container}>
      <LoadingScreen loading={loading} />
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          {/* Placeholder for SVG Icon */}
        </View>

        {step === 1 && (
          <>
            {/* Step 1: Collecting user's full name, city, birth date, and gender */}
            <TextInput
              style={styles.input}
              placeholder={i18n.t("yourName")}
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setFullName(text)}
              value={fullName}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setModalCityVisible(true)}
              style={styles.input}
            >
              <Text>{selectedCity || i18n.t("pickCountry")}</Text>
            </TouchableOpacity>
            <CityPicker
              isVisible={modalCityVisible}
              onClose={() => setModalCityVisible(false)}
              onSelectCity={handleCitySelection}
            />
            <TouchableOpacity
              onPress={() => setModalBirthdayVisible(true)}
              style={styles.input}
            >
              <Text>{birthDate || i18n.t("pickBirthday")}</Text>
            </TouchableOpacity>
            <BirthdayPicker
              isVisible={modalBirthdayVisible}
              onClose={() => setModalBirthdayVisible(false)}
              onSelectDate={handleBirthdaySelection}
            />
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "male" && styles.selectedGender,
                ]}
                onPress={() => setGender("male")}
              >
                <Text style={styles.genderText}>{i18n.t("pickMan")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "female" && styles.selectedGender,
                ]}
                onPress={() => setGender("female")}
              >
                <Text style={styles.genderText}>{i18n.t("pickWoman")}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={onNextStepPress}>
              <Text style={styles.buttonTitle}>{i18n.t("continue")}</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            {/* Step 2: Collecting user's email and password */}
            <TextInput
              style={styles.input}
              placeholder={i18n.t("email")}
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setEmail(text)}
              value={email}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#aaaaaa"
              secureTextEntry
              placeholder={i18n.t("password")}
              onChangeText={(text) => setPassword(text)}
              value={password}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={onRegisterPress}>
              <Text style={styles.buttonTitle}>{i18n.t("createAccount")}</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            {i18n.t("alreadyAccount")}{" "}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              {i18n.t("login")}
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
