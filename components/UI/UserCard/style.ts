import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  card: {
    alignItems: "center",
  },
  cardbox: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  abs: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  hobbiesText: {
    fontSize: 12,
    color: "#aaa", // or any other styling you prefer
  },
  hobbyPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#e9e9e9", // a light gray background; adjust as needed
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
   width: "100%",
  },
  nameAgeContainer: {
    flexDirection: "row",
    marginBottom: 5, // To add space between the name/age row and hobbies
  },
  hobbyText: {
    fontSize: 14,
    color: "#333", // dark text color; adjust as needed
  },
  cardtext: {
    color: "#ffffff",
    fontFamily: "Poppins",
  },

  vipIconContainer: {
    position: "absolute",
    top: 10, // Adjust as needed
    left: 10, // Adjust as needed
    zIndex: 2,
  },

  age: {
    backgroundColor: "#C48CBC",
    color: "#ffffff",
    fontFamily: "PoppinsBold",
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
});
