import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {},
  logo: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: "center",
    margin: 30,
  },
  input: {
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
    padding: 10,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  genderButton: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#aaa",
    borderWidth: 1,
    marginHorizontal: 5,
  },
  selectedGender: {
    backgroundColor: "#f1e9f5", // or any color to indicate selection
  },
  genderText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#c48cbc",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
    color: "#c48cbc",
    fontWeight: "bold",
    fontSize: 16,
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
