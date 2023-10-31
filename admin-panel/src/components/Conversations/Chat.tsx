import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { firebaseApp, functions } from "../../firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  createdAt?: firebase.firestore.Timestamp;
  unread?: boolean;
}

interface UserDetail {
  id: string;
  email: string;
  isBotUser: boolean;
}

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const chatEndRef = useRef(null);
  const [usersDetails, setUsersDetails] = useState<UserDetail[]>([]);
  const [password, setPassword] = useState<string>("");

 useEffect(() => {
   if (!id) return;

   const parts = id.split("_");

   // Fetching user details
   Promise.all(
     parts.map((userId) =>
       firebaseApp.firestore().collection("users").doc(userId).get()
     )
   )
     .then((docs) => {
       const userDetails: UserDetail[] = docs.map((doc) => ({
         id: doc.id,
         email: doc.data()?.email || "Unknown Email",
         isBotUser: doc.data()?.isBotUser || false,
       }));
       setUsersDetails(userDetails);

       // Find bot user and auto-login
       const botUser = userDetails.find((userDetail) => userDetail.isBotUser);
       if (botUser) {
         firebase
           .auth()
           .signInWithEmailAndPassword(botUser.email, "442442")
           .then((userCredential) => {
             setCurrentUserId(userCredential.user?.uid || null);
           })
           .catch((error) => {
             console.error("Error auto-logging in as bot:", error);
           });
       }
     })
     .catch((error) => {
       console.error("Error fetching user details:", error);
     });

   // Setting up message listener
   const unsubscribe = firebaseApp
     .firestore()
     .collection("messages")
     .where("conversationId", "==", id)
     .orderBy("createdAt", "desc")
     .limit(5)
     .onSnapshot((snapshot) => {
       const fetchedMessages = snapshot.docs.map((doc) => ({
         ...(doc.data() as Message),
         id: doc.id,
       }));
       setMessages(fetchedMessages);
     });

   return () => unsubscribe();
 }, [id]);

  const handleLoginAsBot = (email: string) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setCurrentUserId(userCredential.user?.uid || null);
      })
      .catch((error) => {
        console.error("Error signing in:", error);
        alert("Failed to login. Please check your credentials.");
      });
  };

  const sendPushNotification = async (receiverId: string, message: string) => {
    try {
      const sendNotificationFunction =
        functions.httpsCallable("sendNotification");
      await sendNotificationFunction({ receiverId, message });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleSend = async () => {
    if (inputValue.trim() !== "") {
      if (!id) {
        console.error("Error: conversationId (id) is undefined.");
        alert("An error occurred: conversationId is undefined.");
        return;
      }

      try {
       const parts = id.split("_");

       // Extract both potential user ids
       const userId1 = parts[0];
       const userId2 = parts.length > 1 ? parts[1] : null;

       // Find which of these ids corresponds to the non-bot user
       const nonBotUserId =
         usersDetails.find(
           (userDetail) => userDetail.id === userId1 && !userDetail.isBotUser
         )?.id ||
         usersDetails.find(
           (userDetail) => userDetail.id === userId2 && !userDetail.isBotUser
         )?.id;

       let receiverId = nonBotUserId || null;
        if (!receiverId) throw new Error("Receiver ID cannot be determined");

        await firebaseApp.firestore().collection("messages").add({
          text: inputValue,
          senderId: currentUserId,
          conversationId: id,
          receiverId: receiverId,
          unread: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        await firebaseApp
          .firestore()
          .collection("conversations")
          .doc(id)
          .set(
            {
              latestMessage: inputValue,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              unread: {
                [currentUserId as string]: false,
                [receiverId as string]: true,
              },
            },
            { merge: true }
          );

        await sendPushNotification(receiverId, inputValue);
        setInputValue("");
      } catch (error) {
        console.error("Error sending message:", error);
        alert(
          "An error occurred while sending the message. Check the console for details."
        );
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full px-18 py-14 ">
     
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {[...messages].reverse().map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg ${
                message.senderId === currentUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
