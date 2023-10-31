import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  Pressable,
  Modal,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { firebaseApp, functions } from "../../firebaseConfig";
import { serverTimestamp } from "@firebase/firestore";
import SVGComponent from "../SVGComponent";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import * as ImagePicker from "expo-image-picker";
import styles from "./style";
import EmojiPicker from "./EmojiPicker";
import ImageModal from "./ImageModal";
import InputBoxComponent from "./InputBoxComponent";
import ReusableModal from "./../VIPModal/VIPModal";
import * as Notifications from "expo-notifications";
import { useTranslation } from './../../TranslationContext';
import { useNavigation } from "@react-navigation/native";

interface Message {
  text?: string;
  imageUrl?: string;
  senderId?: string;
  createdAt?: firebase.firestore.Timestamp;
  receiverId?: string;
  unread?: boolean;
}

interface SendingImage {
  imageUrl: string;
  sending: true;
}

type FlatListItem = Message | SendingImage;

const MessageScreen = ({ route }: any) => {
  const { user } = route.params;
  const navigation = useNavigation<any>();

  // State Declarations
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [image, setImage] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendingImages, setSendingImages] = useState<string[]>([]);
  const [messageCount, setMessageCount] = useState<number>(0);
  const [isLimitModalVisible, setLimitModalVisible] = useState(false);
  const i18n = useTranslation();
const [jetons, setJetons] = useState<number>(0);

  const toggleImageModal = (uri?: string) => {
    setModalImage(uri || null);
    setImageModalVisible(!isImageModalVisible);
  };

  const formatDate = (timestamp: firebase.firestore.Timestamp) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Istanbul",
    }).format(date);
  };

  useEffect(() => {
    // This listener is fired whenever a notification is interacted with (received or clicked)
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { action } = response.notification.request.content.data;

        if (action === "go_to_home") {
          navigation.navigate("Homepage");
        }
      });

    return () => {
      responseListener.remove(); // Unsubscribe on unmount
    };
  }, []);

  useEffect(() => {
    let authUnsubscribe: (() => void) | undefined;
    let firestoreUnsubscribe: (() => void) | undefined;
    let userUnsubscribe: (() => void) | undefined;

    authUnsubscribe = firebaseApp
      .auth()
      .onAuthStateChanged(async (authUser) => {
        if (authUser) {
          setCurrentUserId(authUser.uid);
          const conversationId = [authUser.uid, user.id].sort().join("_");

          // Fetching messages for the current conversation
          firestoreUnsubscribe = firebaseApp
            .firestore()
            .collection("messages")
            .where("conversationId", "==", conversationId)
            .orderBy("createdAt", "desc")
            .limit(10)
            .onSnapshot((snapshot) => {
              const fetchedMessages = snapshot.docs.map((doc) => {
                const data = doc.data() as Message;
                if (data.receiverId === authUser.uid && data.unread) {
                  doc.ref.update({ unread: false });
                }
                return data;
              });
              setMessages(fetchedMessages);
            });

          // Fetching the isVip status for the current user
          const userDocRef = firebaseApp
            .firestore()
            .collection("users")
            .doc(authUser.uid);
          userUnsubscribe = userDocRef.onSnapshot((doc) => {
            if (doc.exists) {
              const userData = doc.data();
              setJetons(userData?.jetons || 0);
              setMessageCount(userData?.messageCount || 0); // setting the messageCount from firestore
            }
          });

          // Get Expo push token without checking permissions
           // Get Expo push token without checking permissions
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const expoPushToken = tokenData.data; // this is your token

        // Store this token in your Firebase user document
        if (authUser.uid && expoPushToken) {
          firebaseApp.firestore().collection("users").doc(authUser.uid).update({
            expoPushToken: expoPushToken,
          });
        }
      } catch (error) {
       // Add this line to track the error
      }
    }
        
      });

    // Cleanup on component unmount or when the dependencies change
    return () => {
      if (authUnsubscribe) authUnsubscribe();
      if (firestoreUnsubscribe) firestoreUnsubscribe();
      if (userUnsubscribe) userUnsubscribe();
    };
  }, [user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      setSendingImages((prevImages) => [...prevImages, selectedImage]);
      handleSend(selectedImage);
    }
  };

  const uriToBlob = (uri: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const uploadImageToFirebase = async (uri: string) => {
    let blob;
    try {
      blob = await uriToBlob(uri);
    } catch (error) {
      throw error;
    }
    const ref = firebaseApp
      .storage()
      .ref()
      .child(`user-images/${new Date().toISOString()}`);
    await ref.put(blob);
    const downloadURL = await ref.getDownloadURL();
    return downloadURL;
  };

  const generateConversationId = (userId1: any, userId2: any) => {
    const sortedUserIds = [userId1, userId2].sort();
    return sortedUserIds.join("_");
  };

  const handleSend = async (pickedImageUri?: string) => {
    if (isSending || (!text && !image && !pickedImageUri)) return;

    setIsSending(true);

  if (jetons <= 0) {
    setLimitModalVisible(true);
    setIsSending(false);
    return;
  }

    try {
      let imageUrl = null;

      if (pickedImageUri || image) {
        imageUrl = await uploadImageToFirebase(pickedImageUri || image);

        // Remove the uploaded image URI from sendingImages state
        setSendingImages((prevImages) =>
          prevImages.filter((uri) => uri !== (pickedImageUri || image))
        );
      }

      const conversationId = generateConversationId(currentUserId, user.id);
      const conversationRef = firebaseApp
        .firestore()
        .collection("conversations")
        .doc(conversationId);

      await conversationRef.set(
        {
          userIds: [currentUserId, user.id].sort(),
          latestMessage: text,
          timestamp: serverTimestamp(),
          unread: {
            [currentUserId as string]: false,
            [user.id as string]: true,
          },
        },
        { merge: true }
      );

      const message = {
        text,
        imageUrl,
        senderId: currentUserId,
        receiverId: user.id,
        createdAt: serverTimestamp(),
        unread: true,
        conversationId,
      };

      await firebaseApp.firestore().collection("messages").add(message);

      // Send push notification
      sendPushNotification(user.id, text); // <-- Added this line

      if (!currentUserId) {
        return;
      }
      // After the message is sent, if the user is not VIP, increment their message count in both the state and Firestore.
    const userDocRef = firebaseApp
      .firestore()
      .collection("users")
      .doc(currentUserId);
    setJetons(jetons - 1);
    userDocRef.update({
      jetons: firebase.firestore.FieldValue.increment(-1),
    });

      if (!pickedImageUri) {
        setText("");
        setImage(null);
      }

      setIsSending(false);
    } catch (error) {
      // Fallback for failed images
      if (pickedImageUri || image) {
        // Remove the image URI from sendingImages state to no longer display it as "sending"
        setSendingImages((prevImages) =>
          prevImages.filter((uri) => uri !== (pickedImageUri || image))
        );

        // Notify the user about the failure (you can modify this to fit your design)
        i18n.t("error");
      }

      setIsSending(false);
    }
  };

 const sendPushNotification = async (receiverId: string, message: string) => {
   const sendNotification = functions.httpsCallable("sendNotification");

   sendNotification({ receiverId, message })
     .then((result) => {})
     .catch((error) => {});
 };


  const flatListRef = useRef<FlatList<FlatListItem>>(null);
  flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const addEmoji = (emoji: any) => {
    setText((prevText) => prevText + emoji);
  };

  const [isVip, setIsVip] = useState(false);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={[...messages]}
        inverted
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }: { item: FlatListItem }) => {
          if ("sending" in item) {
            return (
              <View style={[styles.messageBox, styles.senderMessage]}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ ...styles.imageMessage, opacity: 0.5 }} // Set opacity for blurring effect
                  blurRadius={5} // Add blur to the image to indicate it's uploading
                />

                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  style={styles.spinner}
                />
              </View>
            );
          } else {
            // Now TypeScript knows that item is of type Message.
            return (
              <View
                style={[
                  styles.messageBox,
                  item.senderId === currentUserId
                    ? styles.senderMessage
                    : styles.receiverMessage,
                ]}
              >
                {item.text && (
                  <Text style={styles.messageText}>{item.text}</Text>
                )}
                {item.imageUrl && item.imageUrl !== "null" && (
                  <Pressable onPress={() => toggleImageModal(item.imageUrl)}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.imageMessage}
                    />
                  </Pressable>
                )}
                <Text style={styles.timestamp}>
                  {item.createdAt ? formatDate(item.createdAt) : "N/A"}
                </Text>
              </View>
            );
          }
        }}
      />
      <InputBoxComponent
        text={text}
        setText={setText}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleSend={handleSend}
        pickImage={pickImage}
        isVip={isVip}
      />
      {/* Emoji Picker */}
      {showEmojiPicker && <EmojiPicker addEmoji={addEmoji} />}
      {/* Full-Screen Image Modal */}
      <ImageModal
        isVisible={isImageModalVisible}
        closeModal={() => setImageModalVisible(false)}
        imageUri={modalImage}
      />
      <ReusableModal
        isVisible={isLimitModalVisible}
        onClose={() => setLimitModalVisible(false)}
        onConfirm={() => {
          setLimitModalVisible(false);
        }}
        iconName="vip1" // replace with your actual icon name
        message={i18n.t("dailyLimitGetVip")}
        buttonText={i18n.t("closeText")} // replace with your desired button text
      />
    </View>
  );
};
export default MessageScreen;
