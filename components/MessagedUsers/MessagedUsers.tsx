// Required imports
import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Assuming the firebaseApp is correctly initialized in your firebaseConfig.js
import { firebaseApp } from "../../firebaseConfig";
import styles from "./style";
import SVGComponent from "../SVGComponent";

// Interface definitions for TypeScript
interface User {
  id: string;
  fullName: string;
  imageUrl: string;
}

interface Conversation {
  id?: string;
  userIds: string[];
  latestMessage: string;
  latestMessageSenderId?: string; // Add this line
  timestamp?: firebase.firestore.Timestamp;
  otherUser?: User;
  unread?: { [key: string]: boolean };
}


const ConversationsList = ({ navigation }: any) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Authentication state observer to get the current user's ID.
  useEffect(() => {
    const unsubscribe = firebaseApp.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setCurrentUserId(authUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch the conversations that involve the current user.
  useEffect(() => {
    if (currentUserId) {
      setIsLoading(true);

      const unsubscribe = firebaseApp
        .firestore()
        .collection("conversations")
        .where("userIds", "array-contains", currentUserId)
        .orderBy("timestamp", "desc")
        .onSnapshot(async (snapshot) => {
          const fetchedConversations: Conversation[] = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data() as Conversation;
                  const conversationId = doc.id;
              const otherUserId = data.userIds.find(
                (id) => id !== currentUserId
              );
              let unreadStatusForCurrentUser = false;

              if (data.unread && data.unread[currentUserId]) {
                unreadStatusForCurrentUser = data.unread[currentUserId];
              }

              if (otherUserId) {
                const userDoc = await firebaseApp
                  .firestore()
                  .collection("users")
                  .doc(otherUserId)
                  .get();
                const otherUser = userDoc.data() as User;
                return {
                  ...data,
                  otherUser,
                  conversationId, unread: {
                    ...data.unread,
                    [currentUserId]: unreadStatusForCurrentUser,
                  },
                };
              }
              return data;
            })
          );
          setConversations(fetchedConversations);
          setIsLoading(false);
        });

      return () => unsubscribe();
    }
  }, [currentUserId]);

  // Handles the logic when a conversation is pressed.
 const handleConversationPress = (conversation: Conversation) => {
   if (conversation.otherUser) {
     // Ensure we have both currentUserId and conversation.id before updating
     if (
       currentUserId &&
       conversation.id &&
       conversation.unread &&
       conversation.unread[currentUserId]
     ) {
       // Update the unread status for the current user to false
       firebaseApp
         .firestore()
         .collection("conversations")
         .doc(conversation.id)
         .update({
           [`unread.${currentUserId as string}`]: false,
         });
     }

     // Navigate to the MessageScreen with the other user's details
     navigation.navigate("MessageScreen", { user: conversation.otherUser });
   }
 };
  // Helper function to truncate the latest message in the conversation preview.
  const truncateMessage = (message: string) => {
    return message.length > 25 ? message.substring(0, 25) + "..." : message;
  };

  // Main rendering logic for the component.
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#F5F5F5" }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : conversations.length > 0 ? (
        <FlatList
          data={conversations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleConversationPress(item)}
              style={styles.messages}
            >
              <View style={styles.row}>
                <Image
                  source={
                    item.otherUser?.imageUrl
                      ? { uri: item.otherUser?.imageUrl }
                      : require("../../assets/images/home/avatar.jpg")
                  }
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    resizeMode: "cover",
                  }}
                />
                <View style={styles.column}>
                  <Text
                    style={{
                      fontWeight:
                        item.unread &&
                        currentUserId &&
                        item.unread[currentUserId]
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {item.otherUser?.fullName}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <SVGComponent
                      iconName="seen"
                      color={
                        item.unread &&
                        currentUserId &&
                        item.unread[currentUserId]
                          ? "#34B7F1"
                          : "#101010"
                      }
                      color2={
                        item.unread &&
                        currentUserId &&
                        item.unread[currentUserId]
                          ? "#34B7F1"
                          : "#101010"
                      }
                    />
                    <Text
                      style={{
                        fontWeight:
                          item.unread &&
                          currentUserId &&
                          item.unread[currentUserId]
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {truncateMessage(item.latestMessage)}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      ) : (
        <Text>Henüz bir mesajınız yok.</Text>
      )}
    </View>
  );
};

export default ConversationsList;