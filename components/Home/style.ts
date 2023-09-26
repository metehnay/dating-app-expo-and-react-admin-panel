import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: "center",
    margin: 30,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16,
  },
  box: {
    backgroundColor: "#65372B",
    height: 80,
  },
  pass: {
    color: "#c48cbc",
    marginLeft: "auto",
    fontFamily: "PoppinsBold",
    fontSize: 13,
  },

  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
  footerLink: {
    color: "#ebbf99",
    fontWeight: "bold",
    fontSize: 16,
  },
});
