import React, { useState, useEffect, useMemo } from "react";
import { db } from "../../firebaseConfig";
import { serverTimestamp } from "@firebase/firestore";

type User = {
  fullName: string;
  imageUrl?: string;
};

type Message = {
  id: string;
  text: string;
  conversationId: string;
  senderId: string;
  unread: boolean;
  receiverId: string;
  createdAt: {
    toMillis: () => number;
  };
};

const AdminMessageLog: React.FC = () => {
  const NOTIFICATION_SOUND_URL: string = "/sound.mp3";
  const audio: HTMLAudioElement = useMemo(
    () => new Audio(NOTIFICATION_SOUND_URL),
    []
  );
  const [latestMessageTimestamp, setLatestMessageTimestamp] = useState<
    number | null
  >(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [replies, setReplies] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await db.collection("users").limit(10).get();
      let usersData: { [key: string]: User } = {};
      usersCollection.docs.forEach((doc) => {
        usersData[doc.id] = doc.data() as User;
      });
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

 useEffect(() => {
   const unsubscribeMessages = db
     .collection("messages")
     .orderBy("createdAt", "desc")
     
     .limit(10)
     .onSnapshot((snapshot) => {
       const fetchedMessages = snapshot.docs.map((doc) => {
         const data = doc.data() as Message;
         return {
           ...data, 
         };
       });
       setAllMessages(fetchedMessages);
     });

   return () => unsubscribeMessages();
 }, [latestMessageTimestamp, audio]);

  const handleReply = async (
    messageId: string,
    senderId: string,
    receiverId: string
  ) => {
    const replyText = replies[messageId];
    if (!replyText) return;

    const conversationId: string = [senderId, receiverId].sort().join("_");

    try {
      await db.collection("messages").add({
        text: replyText,
        conversationId,
        senderId: receiverId,
        unread: true,
        receiverId: senderId,
        createdAt: serverTimestamp(),
      });

      const conversationsDoc = await db
        .collection("conversations")
        .doc(conversationId)
        .get();
      if (conversationsDoc.exists) {
        await db.collection("conversations").doc(conversationId).update({
          latestMessage: replyText,
          timestamp: serverTimestamp(),
          unread: true,
        });
      }

      setReplies((prev) => ({ ...prev, [messageId]: "" }));
    } catch (error) {
      console.error("Error sending reply:", error);
      alert(
        "An error occurred while sending the reply. Check the console for details."
      );
    }
  };

  return (
    <div className="p-8 bg-gray-200 h-screen">
      <h3 className="text-2xl font-semibold mb-6 text-gray-700">
        All User Messages
      </h3>
      <div className="flex-1 mb-4 overflow-y-auto max-h-[70vh] space-y-4">
        {allMessages.map((message) => (
          <div
            key={message.id}
            className={`bg-white p-6 rounded-lg shadow-md ${
              message.senderId === message.receiverId
                ? "border-2 border-red-500"
                : ""
            }`}
          >
            <div className="flex items-center mb-6">
              <img
                src={
                  users[message.senderId]?.imageUrl ||
                  "https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"
                }
                alt={users[message.senderId]?.fullName}
                className="w-12 h-12 rounded-full mr-6 shadow"
              />
              <p className="text-lg font-medium text-gray-700">
                From: {users[message.senderId]?.fullName}
              </p>
            </div>
            <div className="flex items-center mb-6">
              <img
                src={
                  users[message.receiverId]?.imageUrl ||
                  "https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"
                }
                alt={users[message.receiverId]?.fullName}
                className="w-12 h-12 rounded-full mr-6 shadow"
              />
              <p className="text-lg font-medium text-gray-700">
                To: {users[message.receiverId]?.fullName}
              </p>
            </div>
            <p className="bg-gray-100 p-4 rounded-lg mb-6 text-gray-600">
              <strong className="text-gray-800">Message:</strong> {message.text}
            </p>
            <div className="mt-2 flex items-center">
              <input
                type="text"
                value={replies[message.id] || ""}
                onChange={(e) =>
                  setReplies((prev) => ({
                    ...prev,
                    [message.id]: e.target.value,
                  }))
                }
                placeholder="Reply as receiver..."
                className="border rounded px-4 py-2 w-4/5 mr-6 shadow-sm"
              />
              <button
                onClick={() =>
                  handleReply(message.id, message.senderId, message.receiverId)
                }
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-teal-700 shadow-md"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMessageLog;
