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
    setLoading(true);

    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
    const firebaseAuth = getAuth(firebaseApp);
    const result = await signInWithCredential(firebaseAuth, googleCredential);

    const db = firebaseApp.firestore();
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef
      .where("email", "==", userInfo.user.email)
      .get();

    if (userSnapshot.empty) {
      await usersRef.add({
        email: userInfo.user.email,
      });
      setLoading(false);
      navigation.navigate("Sign Up", {
        userData: userInfo.user,
        googleSignIn: true,
      });
    } else {
      setLoading(false);
      navigation.navigate("Homepage");
    }
  } catch (error) {
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
   const termsURL =
     "https://firebasestorage.googleapis.com/v0/b/loveify-db.appspot.com/o/terms.html?alt=media&token=bec81aff-4504-4679-ba01-e816a24460ef";
   Linking.openURL(termsURL);
 };

  const handlePrivacyPolicyLinkPress = () => {

      const policyUrl =
        "https://firebasestorage.googleapis.com/v0/b/loveify-db.appspot.com/o/policy.html?alt=media&token=788df175-3417-45db-9434-44cd1f39e9bb";
      Linking.openURL(policyUrl);
  };

  const renderLoginView = () => (
    <View>
      <Logo />
      <CustomInput
        iconName="mailicon"
        placeholder={i18n.t("emailPlaceholder")}
        onChangeText={setEmail}
        value={email}
      />
      <CustomInput
        placeholder={i18n.t("passwordPlaceholder")}
        onChangeText={setPassword}
        value={password}
        iconName="passicon"
        secureTextEntry
      />
      <Button
        title={i18n.t("loginButton")}
        onPress={onLoginPress}
        textcolor="#fff"
        color="#2cc1d7"
      />
      <Pressable onPress={() => setLoginPressed(false)}>
        <Text style={{ textAlign: "center", marginTop: 10, color: "#2cc1d7" }}>
          {i18n.t("goBack")}
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
      
      <Pressable style={styles.customGoogleButton} onPress={signInWithGoogle}>
        <View style={styles.iconContainer}>
          <SVGComponent iconName="google" customWidth="35" customHeight="35" />
        </View>
        <Text style={styles.buttonText}>{i18n.t("continueWithGoogle")}</Text>
      </Pressable>

      <Pressable
        style={styles.customEmailButton}
        onPress={() => navigation.navigate("Sign Up")}
      >
        <View style={styles.iconContainer}>
          <SVGComponent iconName="mail" customWidth="35" customHeight="35" />
        </View>
        <Text style={styles.buttonText}>{i18n.t("continueWithEmail")}</Text>
      </Pressable>

      <View style={styles.loginLinkContainer}>
        <Text>{i18n.t("alreadyHaveAccount")} </Text>
        <Pressable onPress={() => setLoginPressed(true)}>
          <Text style={styles.loginLink}>{i18n.t("loginNow")}</Text>
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
