import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./style";
import { firebaseApp } from "../../../firebaseConfig";
import BirthdayPicker from "../../Hooks/BirthdayPicker";
import LoadingScreen from "./../../UI/Loading/Loading";
import { useTranslation } from "../../../TranslationContext";
import SVGComponent from "../../SVGComponent";
import { askForLocationPermission, handleImageUpload } from "./SignUpHelpers";
import * as Notifications from "expo-notifications";

export default function SignUp({ navigation }: any) {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedCode, setSelectedCode] = useState<any>(null);
  const [birthDate, setBirthDate] = useState<string>("");
  const [modalBirthdayVisible, setModalBirthdayVisible] =
    useState<boolean>(false);
  const [gender, setGender] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const i18n = useTranslation();
  const { t } = useTranslation(); // Destructure the translation function from the useTranslation hook

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Use of modular functions
  const locationPermission = () =>
    askForLocationPermission(setSelectedCity, t, setSelectedCode); // Corrected the order of parameters.
  const uploadImage = () =>
    handleImageUpload(setIsUploading, setSelectedImageUri, t, setImageUrl); // Corrected the order of parameters.

  /**
   * Function to handle the next step button press.
   * If on the first step, it checks if gender is selected.
   * If on the second step, it triggers the registration process.
   */
  const onNextStepPress = () => {
    if (step === 1) {
      // Existing conditions for step 1
      if (!gender || !fullName || !selectedCity || !birthDate) {
        alert(i18n.t("emptyField"));
        return;
      }
      setStep(2); // Move to step 2 if step 1 conditions are satisfied
    } else if (step === 2) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email)) {
        alert(i18n.t("InvalidEmail")); // Please add an appropriate message in your i18n files.
        return;
      }
      if (!password.trim() || password.length < 6) {
        alert(i18n.t("InvalidPassword")); // Alert user if password is less than 6 characters
        return;
      }
      setStep(3); // Move to step 3 if step 2 conditions are satisfied
    } else if (step === 3) {
      if (!imageUrl) {
        alert(i18n.t("imageError"));
        return;
      }
      onRegisterPress(); // Initiate the registration process in step 3 after the image is uploaded
    }
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
      !gender ||
      !imageUrl
    ) {
      if (!imageUrl) {
        alert(i18n.t("imageError")); // Alert user if image is not uploaded
        return;
      }
      alert(i18n.t("emptyField"));
      return;
    }

    setLoading(true); // Start the loading process

    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response: any) => {
        const uid = response.user.uid;
        const registeredTime = new Date().toISOString(); // Get the current time in ISO string format

        const data = {
          id: uid,
          email,
          fullName,
          city: selectedCity,
          regionCode: selectedCode,
          birthDate,
          gender,
          imageUrl: imageUrl, // Include the imageUrl in user data
          registeredTime: registeredTime, // Add the registered time to the user data
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
            <TouchableOpacity onPress={locationPermission} style={styles.input}>
              <Text>
                {selectedCity ? selectedCity : i18n.t("askPermission")}
              </Text>
            </TouchableOpacity>

            <BirthdayPicker
              isVisible={modalBirthdayVisible}
              onClose={() => setModalBirthdayVisible(false)}
              onSelectDate={handleBirthdaySelection}
            />
            <TouchableOpacity
              onPress={() => setModalBirthdayVisible(true)}
              style={styles.input}
            >
              <Text>{birthDate || i18n.t("pickBirthday")}</Text>
            </TouchableOpacity>
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
            <TouchableOpacity style={styles.button} onPress={onNextStepPress}>
              <Text style={styles.buttonTitle}>{i18n.t("confirmText")}</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={{ textAlign: "center", padding: 10 }}>
              {i18n.t("welcomeMessage")}
            </Text>
            {!(imageUrl || selectedImageUri) ? (
              <TouchableOpacity style={styles.input2} onPress={uploadImage}>
                <SVGComponent
                  iconName="photoupload"
                  customWidth="55"
                  customHeight="55"
                />
                <Text>{i18n.t("uploadImage")}</Text>
              </TouchableOpacity>
            ) : null}
            {/* Image Preview */}
            {selectedImageUri && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 8,
                }}
              >
                <Image
                  source={{
                    uri: `${selectedImageUri}?timestamp=${Date.now()}`,
                  }}
                  style={styles.imagePreview}
                />
                <TouchableOpacity
                  onPress={uploadImage}
                  style={{
                    backgroundColor: "#2cc1d7",
                    padding: 10,
                    borderRadius: 14,
                  }}
                >
                  <Text style={{ color: "#fff" }}>{i18n.t("changeImage")}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Loading Indicator */}
            {isUploading && <ActivityIndicator size="large" color="#0000ff" />}

            <TouchableOpacity
              style={[styles.button, isUploading && styles.disabledButton]}
              onPress={onRegisterPress}
              disabled={isUploading} // Disable button when isUploading is true
            >
              <Text style={styles.buttonTitle}>
                {i18n.t("completeRegistration")}
              </Text>
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
