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
import * as Notifications from "expo-notifications";
import { firebaseApp } from "../../firebaseConfig";
import styles from "./style";
import SVGComponent from "../SVGComponent";
import { useTranslation } from "../../TranslationContext";

interface User {
  id: string;
  fullName: string;
  imageUrl: string;
}

interface Conversation {
  id?: string;
  userIds: string[];
  latestMessage: string;
  latestMessageSenderId?: string; 
  timestamp?: firebase.firestore.Timestamp;
  otherUser?: User;
  unread?: { [key: string]: boolean };
}


const ConversationsList = ({ navigation }: any) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const i18n = useTranslation();

  useEffect(() => {
    const unsubscribe = firebaseApp.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setCurrentUserId(authUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

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
                  conversationId,
                  unread: {
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

  useEffect(() => {
    const registerForPushNotifications = async () => {
      let token;
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.warn("Failed to get push token for push notification!");
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;

      if (currentUserId) {
        firebaseApp.firestore().collection("users").doc(currentUserId).update({
          expoPushToken: token,
        });
      }
    };

    registerForPushNotifications();
  }, [currentUserId]);

    useEffect(() => {
      const subscription =
        Notifications.addNotificationResponseReceivedListener((response) => {
          const data = response.notification.request.content.data;
          navigation.navigate("MessageScreen", { user: data.user });
        });

      return () => subscription.remove();
    }, [navigation]);

  const handleConversationPress = (conversation: Conversation) => {
    if (conversation.otherUser) {
      if (
        currentUserId &&
        conversation.id &&
        conversation.unread &&
        conversation.unread[currentUserId]
      ) {
        firebaseApp
          .firestore()
          .collection("conversations")
          .doc(conversation.id)
          .update({
            [`unread.${currentUserId as string}`]: false,
          });
      }

      navigation.navigate("MessageScreen", { user: conversation.otherUser });
    }
  };
  const truncateMessage = (message: string) => {
    return message.length > 25 ? message.substring(0, 25) + "..." : message;
  };

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
        <Text>{i18n.t("NoMessageYet")}</Text>
      )}
    </View>
  );
};

export default ConversationsList;