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
import SVGComponent from "../SVGComponent";


export const Home = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const i18n = useTranslation();
  const [loginPressed, setLoginPressed] = useState(false);

  

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
      navigation.navigate("Anasayfa");
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
      <Button
        title={i18n.t("signUp")}
        onPress={() => navigation.navigate("Sign Up")}
        color="#2cc1d7"
        textcolor="#fff"
      />
      <Button
        title={i18n.t("login")}
        onPress={() => setLoginPressed(true)}
        textcolor="#101010"
        color="#d4d2d2"
      />
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
