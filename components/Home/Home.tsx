import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Image, Linking } from "react-native";
import styles from "./style";
import { firebaseApp, auth } from "../../firebaseConfig";
import { Logo } from "./../UI/Logo/Logo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CustomInput } from "../UI/Input/Input";
import { Button } from "../UI/Button/Button";
import LoadingScreen from "../UI/Loading/Loading";
import { CustomModal } from "./../UI/Modal/Modal";
import { useTranslation } from "./../../TranslationContext";
import "firebase/compat/auth";
import LottieView from "lottie-react-native";
import SVGComponent from "../SVGComponent";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";


export const Home = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const i18n = useTranslation();
  const [loginPressed, setLoginPressed] = useState(false);

const signInWithGoogle = async () => {
  try {
    // Start the loading animation
    setLoading(true);

    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    // Firebase authentication
    const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
    const firebaseAuth = getAuth(firebaseApp);
    const result = await signInWithCredential(firebaseAuth, googleCredential);

    // Check Firestore if user's email already exists
    const db = firebaseApp.firestore();
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef
      .where("email", "==", userInfo.user.email)
      .get();

    if (userSnapshot.empty) {
      // Store the user's email (or any other required info) in Firestore
      await usersRef.add({
        email: userInfo.user.email,
        // ...any other data you want to store
      });
      // Stop the loading animation before navigating
      setLoading(false);
      navigation.navigate("Sign Up", {
        userData: userInfo.user,
        googleSignIn: true,
      });
    } else {
      // Stop the loading animation before navigating
      setLoading(false);
      navigation.navigate("Homepage");
    }
  } catch (error) {
    // Stop the loading animation in case of error
    setLoading(false);
    alert(i18n.t("invalid"));
  }
};

  const sendPasswordReset = async (modalEmail: string) => {
    if (modalEmail === "") {
      alert(i18n.t("error"));
      return;
    }

    setLoading(true);
    try {
      await firebaseApp.auth().sendPasswordResetEmail(modalEmail);
      alert(i18n.t("resetPassword"));
    } catch (error) {
      alert(i18n.t("error"));
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  const onLoginPress = async () => {
    setLoading(true);
    try {
      await firebaseApp.auth().signInWithEmailAndPassword(email, password);
      navigation.navigate("Homepage");
    } catch (error) {
      alert(i18n.t("invalid"));
    } finally {
      setLoading(false);
    }
  };

 const handleTermsLinkPress = () => {
   // Replace "https://www.yourwebsite.com/terms" with the actual URL of your terms page.
   const termsURL =
     "https://firebasestorage.googleapis.com/v0/b/loveify-db.appspot.com/o/terms.html?alt=media&token=bec81aff-4504-4679-ba01-e816a24460ef";
   Linking.openURL(termsURL);
 };

  const handlePrivacyPolicyLinkPress = () => {
    // Define the action you want to take when the "Gizlilik Politikası" link is pressed.
    // For example, you can navigate to a "Privacy Policy" screen.
      const policyUrl =
        "https://firebasestorage.googleapis.com/v0/b/loveify-db.appspot.com/o/policy.html?alt=media&token=788df175-3417-45db-9434-44cd1f39e9bb";
      Linking.openURL(policyUrl);
  };

  const renderLoginView = () => (
    <View>
      <Logo />
      <CustomInput
        iconName="mailicon"
        placeholder={i18n.t("email")}
        onChangeText={setEmail}
        value={email}
      />
      <CustomInput
        placeholder={i18n.t("password")}
        onChangeText={setPassword}
        value={password}
        iconName="passicon"
        secureTextEntry
      />
      <Button
        title={i18n.t("login")}
        onPress={onLoginPress}
        textcolor="#fff"
        color="#2cc1d7"
      />
      <Pressable onPress={() => setLoginPressed(false)}>
        <Text style={{ textAlign: "center", marginTop: 10, color: "#2cc1d7" }}>
          Geri Dön
        </Text>
      </Pressable>
    </View>
  );

  const renderInitialView = () => (
    <View>
      <Logo />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("./couple.png")}
          style={{
            resizeMode: "cover",
            height: 250,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </View>
      <Text
        style={{
          paddingTop: 8,
          fontSize: 10,
          textAlign: "center",
          fontFamily: "Roboto",
        }}
      >
        Oturum açarak{" "}
        <Text style={{ color: "#2cc1d7" }}>
          <Text onPress={handleTermsLinkPress}>Koşullar</Text>
        </Text>{" "}
        ve{" "}
        <Text style={{ color: "#2cc1d7" }}>
          <Text onPress={handlePrivacyPolicyLinkPress}>
            Gizlilik Politikası
          </Text>
        </Text>{" "}
        şartlarını kabul etmiş olursunuz{" "}
      </Text>
      <Pressable style={styles.customGoogleButton} onPress={signInWithGoogle}>
        <View style={styles.iconContainer}>
          <SVGComponent iconName="google" customWidth="35" customHeight="35" />
        </View>
        <Text style={styles.buttonText}>Google ile devam et</Text>
      </Pressable>

      <Pressable
        style={styles.customEmailButton}
        onPress={() => navigation.navigate("Sign Up")}
      >
        <View style={styles.iconContainer}>
          <SVGComponent iconName="mail" customWidth="35" customHeight="35" />
        </View>
        <Text style={styles.buttonText}>E-posta ile devam et</Text>
      </Pressable>

      <View style={styles.loginLinkContainer}>
        <Text>Zaten hesabın var mı? </Text>
        <Pressable onPress={() => setLoginPressed(true)}>
          <Text style={styles.loginLink}>GİRİŞ YAP</Text>
        </Pressable>
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
    
   
      <LoadingScreen loading={loading} />
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        {loginPressed ? renderLoginView() : renderInitialView()}
        <CustomModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={sendPasswordReset}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};
