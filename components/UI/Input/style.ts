import { StyleSheet } from "react-native";

export default StyleSheet.create({
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f4e7ff",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 5,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16,
  },

  inputIcon: {
    marginRight: 8, // Adjust this value to increase/decrease spacing between the icon and the text input.
  },

  inputField: {
    flex: 1,
    height: "100%",
    paddingLeft: 5,
  },
});
