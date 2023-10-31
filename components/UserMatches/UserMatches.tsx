import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { firebaseApp } from "../../firebaseConfig";
import { useTranslation } from "../../TranslationContext";



const UserMatches = ({ navigation }: any) => {
  const [matches, setMatches] = useState<any[]>([]);
  const currentUser = firebaseApp.auth().currentUser;
  const i18n = useTranslation();

  useEffect(() => {
    if (!currentUser) return;

    const fetchMatches = async () => {
      try {
        const userDoc = await firebaseApp
          .firestore()
          .doc(`users/${currentUser.uid}`)
          .get();
        const userMatches = userDoc.get("matches") || [];

        const matchDocs = await Promise.all(
          userMatches.map((userId: string) =>
            firebaseApp.firestore().doc(`users/${userId}`).get()
          )
        );

        setMatches(matchDocs.map((doc) => doc.data()).filter(Boolean));
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, [currentUser]);

  return (
    <View style={styles.container}>
      {matches.length > 0 ? (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (!item || !item.id) {
              console.error("Invalid item:", item);
              return null;
            }

            return (
              <TouchableOpacity
                style={styles.matchContainer}
                onPress={() =>
                  navigation.navigate("UserProfile", { user: item })
                }
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.matchImage}
                />
                <Text style={styles.matchName}>{item.fullName}</Text>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View style={styles.noMatchesContainer}>
          <Text style={styles.noMatchesText}>{i18n.t("noMatchesText")}</Text>
        </View>
      )}
    </View>
  );

  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
  },
  matchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  },
  matchName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMatchesText: {
    fontSize: 20,
    textAlign: "center",
    color: "#999",
    paddingHorizontal: 20,
  },
});

export default UserMatches;