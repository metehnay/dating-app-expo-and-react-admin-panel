import React from "react";
import { View, TextInput } from "react-native";
import styles from "./style";
import SVGComponent from "../../SVGComponent";

export const CustomInput = ({
  iconName,
  placeholder,
  onChangeText,
  value,
  secureTextEntry,
}: any & { iconName?: string }) => (
  <View style={styles.inputContainer}>
    {iconName && (
      <SVGComponent
        iconName={iconName}
        style={styles.inputIcon}
        customWidth="20"
        customHeight="20"
      />
    )}
    <TextInput
      style={styles.inputField}
      placeholder={placeholder}
      placeholderTextColor="#aaaaaa"
      onChangeText={onChangeText}
      value={value}
      underlineColorAndroid="transparent"
      autoCapitalize="none"
      secureTextEntry={secureTextEntry}
    />
  </View>
);
