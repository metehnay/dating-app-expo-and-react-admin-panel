import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import styles from "./style"; // assuming your styles for emojis are in this file

interface EmojiPickerProps {
  addEmoji: (emoji: string) => void;
}


const emojis = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇", // happy and laughing faces
  "😍",
  "😘",
  "😚",
  "😋",
  "😜",
  "😝",
  "😛",
  "🤩",
  "🥰",
  "😎", // affectionate and playful faces
  "🙈",
  "🙉",
  "🙊",
  "🥺",
  "😏",
  "😌",
  "😓",
  "😔",
  "😒",
  "🙄", // shy, relieved, and skeptical faces
  "❤️",
  "💔",
  "💕",
  "💖",
  "💗",
  "💓",
  "💞",
  "💝",
  "💘",
  "💌", // hearts and affection symbols
  "💋",
  "🌹",
  "🍫",
  "🍷",
  "🥂",
  "🎉",
  "🕯️",
  "💍",
  "🎁",
  "💐", // romantic and celebration symbols
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ addEmoji }) => {
  return (
    <View style={styles.emojiPicker}>
      {emojis.map((emoji, index) => (
        <Pressable key={index} onPress={() => addEmoji(emoji)}>
          <Text style={styles.emoji}>{emoji}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default EmojiPicker;
