import React, { useState, useCallback, useTransition } from "react";
import { View, Text, Pressable } from "react-native";
import styles from "./style";
import { firebaseApp } from "../../firebaseConfig";
import { Logo } from "./../UI/Logo/Logo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CustomInput } from "../UI/Input/Input";
import { Button } from "../UI/Button/Button";
import LoadingScreen from "../UI/Loading/Loading";
import { CustomModal } from "./../UI/Modal/Modal";
import { useTranslation } from './../../TranslationContext';

export const Home = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const i18n = useTranslation();


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

  return (
    <View style={styles.container}>
      <LoadingScreen loading={loading} />
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Logo />
        <CustomInput
          iconName="mailicon"
          placeholder={i18n.t("email")} // Updated to use i18n
          onChangeText={setEmail}
          value={email}
        />
        <CustomInput
          placeholder={i18n.t("password")} // Updated to use i18n
          onChangeText={setPassword}
          value={password}
          iconName="passicon"
          secureTextEntry
        />
        <Pressable onPress={() => setModalVisible(true)}>
          <Text style={styles.pass}>{i18n.t("forgotPassword")}</Text>
        </Pressable>
        <CustomModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={sendPasswordReset}
        />
        <Button
          title={i18n.t("login")} // Updated to use i18n
          onPress={onLoginPress}
          textcolor="#fff" // Consider using a constant/theme
          color="#b46ca8" // Consider using a constant/theme
        />
        <Button
          title={i18n.t("signUp")} // Updated to use i18n
          onPress={() => navigation.navigate("Sign Up")}
          color="#f1e9f5" // Consider using a constant/theme
          textcolor="#c48cbc" // Consider using a constant/theme
        />
      </KeyboardAwareScrollView>
    </View>
  );
};
