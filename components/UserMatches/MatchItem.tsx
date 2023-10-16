import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const MatchItem = ({ match }: any) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: match.matchedUserImage }} style={styles.image} />
      <Text style={styles.name}>{match.matchedUserName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MatchItem;
