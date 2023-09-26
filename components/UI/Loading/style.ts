import { StyleSheet } from "react-native";

export default StyleSheet.create({
  logo: {
    width: 244,
    height: 190,
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    zIndex: 1000,
    backgroundColor: "#ffffff",
  },
  activityIndicatorWrapper: {
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
