import { TouchableOpacity, Text } from "react-native";
import styles from "./style";
import { ButtonProps } from "../../types/type";

export const Button = ({ title, onPress, color = "#ed5481", textcolor = "#ffffff" }: ButtonProps) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={{color: textcolor, fontSize: 18, fontFamily: "RobotoBold"}}>{title}</Text>
  </TouchableOpacity>
);
