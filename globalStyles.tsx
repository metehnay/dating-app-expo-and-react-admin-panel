import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  greenButton: {
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#1dd2a2",
    color: "#fff",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    fontFamily: "Poppins",
  },
  buttonContainer: {
    marginTop: "auto",
    paddingVertical: 10,
  },
  borderBox: {
    backgroundColor: "#ebf9fb",
    height: 50,
    width: 50,
    borderRadius: 12,
    alignItems: "center",
    display: "flex",
    marginVertical: "auto",
    justifyContent: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 24,
  },
});
