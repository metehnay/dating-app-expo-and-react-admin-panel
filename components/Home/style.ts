import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // add this
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
    color: "#2cc1d7",
    marginLeft: "auto",
    fontFamily: "RobotoBold",
    fontSize: 13,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#2cc1d7",
  },
  emailButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#d4d2d2",
  },
  iconStyle: {
    position: "absolute",
    left: 20,
  },
  iconContainer: {
    position: "absolute",
    left: 20,
  },
  customGoogleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 40, // increase the horizontal padding to make room for the icon
    marginBottom: 10,
    marginTop: 20,
    backgroundColor: "#2cc1d7",
    position: "relative",
    borderRadius: 12,
  },
  customEmailButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 40, // increase the horizontal padding to make room for the icon
    marginBottom: 10,
    backgroundColor: "#101626",
    position: "relative",
  },
  buttonText: {
    color: "#fff",
  },

  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginLink: {
    color: "#2cc1d7",
  },

  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    height: "100%",
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
