import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  messageBox: {
    backgroundColor: "#4c7287",
    padding: 8,
    borderTopLeftRadius: 8,
    borderBottomEndRadius: 8,
    borderBottomLeftRadius: 8,
    marginBottom: 8,
    maxWidth: "75%",
  },
  senderMessage: {
    alignSelf: "flex-end",
  },
  receiverMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#687888",
  },
  emojiPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    width: "100%",
    backgroundColor: "#ededed",
  },
  emojiInsideInput: {
    position: "absolute",
    left: 10,
    top: "50%",
    opacity: 0.6,
    transform: [{ translateY: -12 }], // adjust this value according to your emoji's height and the input height to vertically center it.
  },
  emoji: {
    fontSize: 24,
    margin: 5,
  },
  messageText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: 10,
    color: "#ddd",
    textAlign: "right",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingLeft: 35,
    width: "80%",
  },
  send: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    margin: "auto",
    backgroundColor: "#4c7287",
    borderRadius: 50,
    marginLeft: 11,
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: "15%",
  },

  input: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 8,
    marginRight: 8,
    padding: 10,
  },

  imageMessage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  modal: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModal: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  uploadingImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  spinner: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    transform: [{ translateX: -0.5 }, { translateY: -0.5 }],
  },
  closeText: {
    fontSize: 16,
    color: "#444",
  },
});
