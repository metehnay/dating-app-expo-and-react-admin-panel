import React, { useState, useEffect } from "react";
import { serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "firebase/compat/auth";
import { firebaseApp, functions } from "../../firebaseConfig";
import firebase from "firebase/compat/app";

// Define a type for a User
type User = {
  id: string;
  fullName: string;
};

const UserMessageSender: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [recipientUserId, setRecipientUserId] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [sendToAll, setSendToAll] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      // Fetch only bot users for the sender dropdown
      const botUsersCollection = await db
        .collection("users")
        .where("isBotUser", "==", true)
        .get();
      const botUsersData: User[] = botUsersCollection.docs.map((doc) => ({
        id: doc.id,
        fullName: doc.data().fullName,
      }));
      setUsers(botUsersData);

      if (botUsersData.length) setCurrentUserId(botUsersData[0].id);

      // Fetch all users for the recipient dropdown
      const allUsersCollection = await db.collection("users").get();
      const allUsersData: User[] = allUsersCollection.docs.map((doc) => ({
        id: doc.id,
        fullName: doc.data().fullName,
      }));
      setAllUsers(allUsersData);
    };

    fetchUsers();
  }, []);

    const sendPushNotification = async (
      receiverId: string,
      message: string
    ) => {
      try {
        const sendNotificationFunction =
          functions.httpsCallable("sendNotification");
        await sendNotificationFunction({ receiverId, message });
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    };

    const handleAuthBotUser = async (email: string, password: string) => {
      try {
        const userCredential = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        setCurrentUserId(userCredential.user?.uid || "");
      } catch (error) {
        console.error("Error signing in:", error);
        alert("Failed to login. Please check your credentials.");
      }
    };

    const handleSelectBotUser = async (userId: string) => {
      setCurrentUserId(userId);

      // Fetch the email of the selected bot user
      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) {
        console.error("Bot user not found in the database");
        return;
      }
      const botUserEmail = userDoc.data()?.email;

      if (!botUserEmail) {
        console.error("Bot user email not found");
        return;
      }

      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(botUserEmail, "442442");
      } catch (error) {
        console.error("Error signing in as bot user:", error);
        alert(
          "Failed to login as bot. Please check if the bot credentials are correct."
        );
      }
    };

  const handleSendToAll = async () => {
    if (!message) {
      alert("Hey, fill in the void. Type a message.");
      return;
    }

    setSending(true);

    for (const user of allUsers) {
      const conversationId = [currentUserId, user.id].sort().join("_");
      try {
        await db
          .collection("conversations")
          .doc(conversationId)
          .set(
            {
              userIds: [currentUserId, user.id].sort(),
              latestMessage: message,
              timestamp: serverTimestamp(),
            },
            { merge: true }
          );

        await db.collection("messages").add({
          text: message,
          conversationId,
          senderId: currentUserId,
          receiverId: user.id,
          createdAt: serverTimestamp(),
        });

        // Send push notification after sending the message to each user
        await sendPushNotification(user.id, message);
      } catch (error) {
        console.error("Error sending message:", error);
        setError(true);
      }
    }
    setSending(false);
    setSuccess(true);
    setMessage("");
  };
  
  const handleSendMessage = async () => {
    if (!message) {
      alert("Please enter a message.");
      return;
    }

    setSending(true);

    // If "Send to All" is checked or no recipient is selected
    if (!recipientUserId || sendToAll) {
      for (const user of allUsers) {
        const conversationId = [currentUserId, user.id].sort().join("_");

        try {
          await db
            .collection("conversations")
            .doc(conversationId)
            .set(
              {
                userIds: [currentUserId, user.id].sort(),
                latestMessage: message,
                timestamp: serverTimestamp(),
              },
              { merge: true }
            );

          await db.collection("messages").add({
            text: message,
            conversationId,
            senderId: currentUserId,
            receiverId: user.id,
            createdAt: serverTimestamp(),
          });

          // Send push notification after sending the message
          await sendPushNotification(user.id, message);
        } catch (error) {
          console.error("Error sending message:", error);
          setError(true);
        }
      }
    } else {
      const conversationId = [currentUserId, recipientUserId].sort().join("_");

      try {
        await db
          .collection("conversations")
          .doc(conversationId)
          .set(
            {
              userIds: [currentUserId, recipientUserId].sort(),
              latestMessage: message,
              timestamp: serverTimestamp(),
            },
            { merge: true }
          );

        await db.collection("messages").add({
          text: message,
          conversationId,
          senderId: currentUserId,
          receiverId: recipientUserId,
          createdAt: serverTimestamp(),
        });

        // Send push notification after sending the message
        await sendPushNotification(recipientUserId, message);
      } catch (error) {
        console.error("Error sending message:", error);
        setError(true);
      }
    }

    setSending(false);
    setSuccess(true);

    setMessage("");
    setRecipientUserId("");
  };

  return (
    <div className=" bg-gray-900 text-gray-200 py-8 w-full">
      <h3 className="text-3xl font-extrabold mb-6 border-b pb-3 border-gray-700 text-white">
        📩 Send Message 📩
      </h3>
      <div className="mb-6">
        <label
          htmlFor="sender"
          className="block text-xl font-semibold mb-3 text-gray-400"
        >
          Select a sender bot:
        </label>
        <select
          id="sender"
          className="w-full py-3 px-4 rounded-lg text-black bg-white shadow-inner focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
          value={currentUserId}
          onChange={(e) => handleSelectBotUser(e.target.value)}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.fullName}
            </option>
          ))}
        </select>
      </div>
     
      <div className="mb-6">
        <label
          htmlFor="message"
          className="block text-xl font-semibold mb-3 text-gray-400"
        >
          Enter your message:
        </label>
        <textarea
          id="message"
          rows={4}
          className="w-full py-3 px-4 rounded-lg text-black bg-white shadow-inner focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message..."
        />
      </div>
      <div className="flex space-x-4">
        <button
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-transform duration-200 transform hover:scale-105 ${
            sendToAll ? "cursor-not-allowed" : ""
          }`}
          onClick={handleSendMessage}
          disabled={!message || sendToAll || sending}
        >
          {sending
            ? "🔄 Sending..."
            : success
            ? "Sent ✓"
            : error
            ? "Error ❌"
            : "Send"}
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition-transform duration-200 transform hover:scale-105"
          onClick={handleSendToAll}
          disabled={sending}
        >
          {sending ? "🔄 Sending..." : "Send to All 🌍"}
        </button>
      </div>
    </div>
  );
};

export default UserMessageSender;
