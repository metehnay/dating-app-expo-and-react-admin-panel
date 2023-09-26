import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ed5481",
    padding: 10,
    width: "100%",
    borderRadius: 12,
    marginTop: 20,
  },

  card: {
    backgroundColor: "#f1e9f5",
    borderRadius: 12,
    margin: 10,
    padding: 20,
  },
  cardbio: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 10,
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  between: {
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    paddingVertical: 5,
  },
  row: {
    alignItems: "center",
    margin: 8,
    display: "flex",
  },
  icon: {
    backgroundColor: "#04a512",
    borderRadius: 50,
    padding: 10,
  },
  iconkahve: {
    backgroundColor: "#e57d03",
    borderRadius: 50,
    padding: 10,
  },
  iconfavori: {
    backgroundColor: "#7010f6",
    borderRadius: 50,
    padding: 10,
    marginTop: 20,
  },
  iconheart: {
    backgroundColor: "#fb0100",
    borderRadius: 50,
    padding: 10,
    marginTop: 20,
  },

  rowLiked: {
    padding: 10, // padding for touchable space
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent", // Ensure there's no background
    borderColor: "transparent", // No border color
    // Other custom styles if needed
  },
  rowTex: {
    fontFamily: "Poppins",
    color: "#101010",
    textAlign: "center",
    maxWidth: 80,
    fontSize: 12,
    paddingTop: 4,
  },
  hobbyPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#e9e9e9", // a light gray background; adjust as needed
    marginRight: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  hobbyText: {
    fontSize: 14,
    color: "#333", // dark text color; adjust as needed
  },
  likedHeartEmoji: {
    color: "red", // Color for when the heart is liked
  },
  rowheart: {
    padding: 10, // padding for touchable space
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent", // Ensure there's no background
    borderColor: "transparent", // No border color
    // Other custom styles if needed
  },
  rowfirst: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7e8e8",
    margin: 8,
    borderRadius: 50,
  },
  heartEmoji: {
    fontSize: 27, // Adjust this value to your desired size
  },
  rowfirstText: {
    fontFamily: "PoppinsBold",
    color: "#ddb6bb",
  },
  title: {
    fontFamily: "PoppinsBold",
    fontSize: 17,
    color: "#ba6683",
  },
  profil: {
    color: "#101010",
    padding: 8,
    fontFamily: "PoppinsBold",
    fontSize: 21,
  },
  row1: {
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",

    paddingHorizontal: 25,
  },
  menuText: {
    color: "#101010",
    fontFamily: "Poppins",
    padding: 8,
    fontSize: 17,
    borderBottomWidth: 0.5,
  },
});
