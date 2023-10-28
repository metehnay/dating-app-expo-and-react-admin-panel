import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  Pressable,
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
import  LottieView  from 'lottie-react-native';
const buttonStyles = {
  backgroundColor: "#2cc1d7",
  paddingHorizontal: 20, // Adds horizontal padding
  paddingVertical: 12,   // Adds vertical padding
  borderRadius: 12,      // Rounded corners
  elevation: 5,          // Adds shadow for Android
  shadowColor: "#000",   // Shadow color
  shadowOffset: { width: 0, height: 2 }, // X-Y offset of shadow
  shadowOpacity: 0.3,    // Shadow opacity
  shadowRadius: 5,       // Radius of the shadow
};
export default function SignUp({ navigation, route }: any) {
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
const [isGoogleSignIn, setIsGoogleSignIn] = useState<boolean>(false);

useEffect(() => {
  if (route.params?.googleSignIn) {
    setIsGoogleSignIn(true);
    const currentUser = firebaseApp.auth().currentUser;
    if (currentUser && currentUser.email) {
      setEmail(currentUser.email); // Setting the email for Google signed-in users
    }
  }
}, [route.params]);

  const [locationModalVisible, setLocationModalVisible] =
    useState<boolean>(true); // show modal by default when the user comes to step 1

  // Use of modular functions
  const locationPermission = () =>
    askForLocationPermission(setSelectedCity, t, setSelectedCode); // Corrected the order of parameters.
  
    const locationPermissionModal = (
      <Modal
        animationType="slide"
        transparent={false}
        visible={locationModalVisible}
        onRequestClose={() => {
          setLocationModalVisible(false); // for Android back button
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View style={{ position: "relative", width: 275, height: 375 }}>
            {/* LottieView as the background */}
            <LottieView
              source={require("./ani.json")}
              autoPlay
              loop
              style={{ width: 275, height: 375, position: "absolute" }}
            />

            {/* Wrapper for the First SVG Icon */}
            <View
              style={{
                position: "absolute",
                top: 100, // Adjust this value as needed
                left: 25, // Adjust this value as needed
              }}
            >
              <SVGComponent
                iconName="turkey"
                customWidth="45"
                customHeight="45"
              />
            </View>

            {/* Wrapper for the Second SVG Icon */}
            <View
              style={{
                position: "absolute",
                top: 100, // Adjust this value as needed, or position them side by side, etc.
                right: 20, // Adjust this value as needed
              }}
            >
              <SVGComponent
                iconName="turkey"
                customWidth="45"
                customHeight="45"
              />
            </View>
          </View>
          <Text
            style={{
              marginVertical: 20,
              textAlign: "center",
              fontFamily: "PoppinsBold",
              fontSize: 28,
              color: "gray",
            }}
          >
            {i18n.t("locationPermissionTitle")}
          </Text>

          <Text
            style={{
              marginVertical: 20,
              textAlign: "center",
              fontFamily: "Poppins",
            }}
          >
            {i18n.t("locationPermissionDescription")}
          </Text>
          <Pressable
            onPress={() => {
              locationPermission();
              setLocationModalVisible(false);
            }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#1aa5b9" : "#2cc1d7", // Darken the button when pressed
                padding: 15,
                borderRadius: 10,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {i18n.t("askPermission")}
            </Text>
          </Pressable>
        </View>
      </Modal>
    );
  /**
   * Function to handle the next step button press.
   * If on the first step, it checks if gender is selected.
   * If on the second step, it triggers the registration process.
   */
 
  const onNextStepPress = () => {
    // If on step 1
    if (step === 1) {
      setLocationModalVisible(false);

      // Check if all fields are filled
      if (!gender || !fullName || !birthDate) {
        alert(i18n.t("emptyField"));
        return;
      }

      // If the user is signing up with Google, immediately try to register
      if (isGoogleSignIn) {
        onRegisterPress();
        return;
      }

      // If not using Google sign-in, proceed to the next step for regular sign-up
      setStep(2);
    }
    // If on step 2
    else if (step === 2) {
      // Check if email and password fields are filled (only if not using Google sign-in)
      if (!isGoogleSignIn && (!email || !password)) {
        alert(i18n.t("emptyField"));
        return;
      }

      // Continue the registration process,
      // if Google sign-in this will have already been done in step 1
      onRegisterPress();
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
    // Common checks for both Google Sign-In and regular sign-up
    if (!fullName || !birthDate || !gender) {
      alert(i18n.t("emptyField"));
      return;
    }

    setLoading(true); // Start the loading process
if (isGoogleSignIn) {
  const currentUser = firebaseApp.auth().currentUser;

  if (!currentUser) {
    // Handle the scenario when there's no current user (e.g., show an error or redirect)
    alert("Error");
    setLoading(false);
    return;
  }

  const uid = currentUser.uid;
  const registeredTime = new Date().toISOString();

  const data = {
    id: uid,
    email, // Google signed-in users' email can be fetched from Firebase Auth
    fullName,
    regionCode: selectedCode,
    city: selectedCity,
    birthDate,
    gender,
    registeredTime: registeredTime,
  };
  const usersRef = firebaseApp.firestore().collection("users");
  usersRef
    .doc(uid)
    .set(data)
    .then(() => {
      navigation.navigate("Homepage", { user: data });
    })
    .catch((error: any) => {
      setLoading(false);
      alert(error);
    });
} else {
  // For regular sign-up, also check for email and password
  if (!email || !password) {
    alert(i18n.t("emptyField"));
    return;
  }

  firebaseApp
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((response: any) => {
      const uid = response.user.uid;
      const registeredTime = new Date().toISOString();

      const data = {
        id: uid,
        email,
        fullName,
        regionCode: selectedCode,
        city: selectedCity,
        birthDate,
        gender,
        registeredTime: registeredTime,
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
              navigation.navigate("Homepage", { user: data });
            });
        })
        .catch((error: any) => {
          setLoading(false);
          alert(error);
        });
    })
    .catch((error: any) => {
      setLoading(false);
      alert(i18n.t("error"));
    });
}
  };

  return (
    <View style={styles.container}>
      <LoadingScreen loading={loading} />
      {locationPermissionModal}
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
    {!isGoogleSignIn && (
            <>
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
            </>
            )}
            <TouchableOpacity style={styles.button} onPress={onNextStepPress}>
              <Text style={styles.buttonTitle}>{i18n.t("confirmText")}</Text>
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
