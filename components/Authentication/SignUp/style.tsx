import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
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
  input2: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 16,
    padding: 10,
    paddingVertical: 50,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  buttonStyles: {
  backgroundColor: "#2cc1d7",
  paddingHorizontal: 20, // Adds horizontal padding
  paddingVertical: 12,   // Adds vertical padding
  borderRadius: 12,      // Rounded corners
  elevation: 5,          // Adds shadow for Android
  shadowColor: "#000",   // Shadow color
  shadowOffset: { width: 0, height: 2 }, // X-Y offset of shadow
  shadowOpacity: 0.3,    // Shadow opacity
  shadowRadius: 5,       // Radius of the shadow
},
  focusedInput: {
    borderWidth: 4,
    borderColor: "red",
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
    backgroundColor: "#2cc1d7", // or any color to indicate selection
  },
  disabledButton: {
    backgroundColor: "#d3d3d3", // Greyed out color or whatever you prefer
  },
  genderText: {
    fontSize: 16,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#2cc1d7",
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
    color: "#2cc1d7",
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
