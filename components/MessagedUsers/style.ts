import { StyleSheet } from "react-native";

export default StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: 10,
  },
  messages: {
    backgroundColor: "#ffffff",
    marginVertical: 10,
    borderRadius: 4,
    borderTopEndRadius: 8,
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  conversationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
  },
  latestMessage: {
    flex: 3,
    color: "#666",
    fontSize: 14,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    marginLeft: 10,
  },
});
