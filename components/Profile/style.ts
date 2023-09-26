import { StyleSheet, Dimensions } from "react-native";

const {  width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  avatar: {
    width: 175,
    height: 175,
    borderRadius: 100,
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 15,
  },
  jeton: {
    backgroundColor: "#323441",
    marginVertical: 10,
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  name: {
    color: "#323441",
    fontFamily: "PoppinsBold",
    fontSize: 17,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#c48cbc",
    padding: 10,
    width: "100%",
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "Poppins",
    textAlign: "center",
  },
  statu: {
    justifyContent: "center",
    textAlign: "center",
    color: "#101010",
    paddingLeft: 4,
  },
  city: {
    padding: 10,
    fontSize: 17,
  },
  cityText: {
    fontSize: 17,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    width: "100%",
    padding: 10,
    elevation: 5,
  },
  profil: {
    color: "#c48cbc",
    padding: 8,
    fontFamily: "PoppinsBold",
    fontSize: 21,
  },
  menuText: {
    color: "#8b8c9b",
    fontFamily: "Poppins",
    padding: 8,
    fontSize: 17,
    borderBottomWidth: 0.5,
    borderColor: "gray",
  },
});
