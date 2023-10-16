import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    position: "relative",
  },
  activeIcon: {
    // Instead of color, you can use the color property here
    // to define the color of your active icons.
    color: "red", // Set the desired active color
  },
  pressable: {
    padding: 10,
    marginHorizontal: -5,
  },
});
