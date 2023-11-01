import React, { useEffect, useState } from "react";
import { firebaseApp } from "../../firebaseConfig";
import { Link } from "react-router-dom";
import CountryFlag from 'react-country-flag'; 
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

interface User {
  id: string;
  fullName: string;
  imageUrl: any;
    regionCode: string; 
    isBotUser?: boolean;

}

interface Conversation {
  id?: string;
  userIds: string[];
  latestMessage: string;
  timestamp?: any;
  users?: User[]; 
  unread?: { [key: string]: boolean };
}

const ConversationsList: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [initialLoad, setInitialLoad] = useState(true);
    const [allConversationIds, setAllConversationIds] = useState<string[]>([]);

  const [initialConversationIds, setInitialConversationIds] = useState<
    string[]
  >([]);

   const [pageRefs, setPageRefs] = useState<
     {
       start: null | firebase.firestore.DocumentSnapshot;
       end: null | firebase.firestore.DocumentSnapshot;
     }[]
   >([]);
  const [lastDoc, setLastDoc] =
    useState<null | firebase.firestore.DocumentSnapshot>(null);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("New conversation started!", {
        body: "Click to view the conversation.",
      });
    }
  };

  


  useEffect(() => {
    if (initialLoad) {
      const initialQuery = firebase
        .firestore(firebaseApp)
        .collection("conversations");
      initialQuery.get().then((snapshot) => {
        const ids: string[] = [];
        snapshot.forEach((doc) => {
          ids.push(doc.id);
        });
        setAllConversationIds(ids);
      });
    }
  }, [initialLoad]);

 useEffect(() => {
   setIsLoading(true);

   let lastFetchedIds: string[] = [];

   let query = firebase
     .firestore(firebaseApp)
     .collection("conversations")
     .orderBy("timestamp", "desc")
     .limit(8);

   if (currentPage > 1) {
     const previousPageEndDoc = pageRefs[currentPage - 2].end;
     query = query.startAfter(previousPageEndDoc);
   }

   const unsubscribe = query.onSnapshot(async (snapshot) => {
     const fetchedConversations: Conversation[] = await Promise.all(
       snapshot.docs.map(async (doc) => {
         const data = doc.data() as Conversation;
         const userIds = data.userIds;
         const userPromises = userIds.map(async (userId) => {
           const userDoc = await firebase
             .firestore(firebaseApp)
             .collection("users")
             .doc(userId)
             .get();
           return userDoc.data() as User;
         });
         const users = await Promise.all(userPromises);
         return {
           ...data,
           users,
           id: doc.id,
         };
       })
     );

     const currentFetchedIds = fetchedConversations.map((c) => c.id || "");

     if (!initialLoad) {
       const newConversations = fetchedConversations.filter(
         (conv) => !allConversationIds.includes(conv.id || "")
       );
       if (newConversations.length > 0) {
         showNotification();
       }
     }

     lastFetchedIds = currentFetchedIds;

     setConversations(fetchedConversations);
     setIsLoading(false);

     const newRef = {
       start: snapshot.docs[0],
       end: snapshot.docs[snapshot.docs.length - 1],
     };

     setPageRefs((prevRefs) => {
       const updatedRefs = [...prevRefs];
       updatedRefs[currentPage - 1] = newRef;
       return updatedRefs;
     });
   });

   return () => unsubscribe();
 }, [currentPage, allConversationIds]);

  const truncateMessage = (message: string) => {
    return message.length > 25 ? message.substring(0, 25) + "..." : message;
  };

 const goToNextPage = () => {
   setCurrentPage((prev) => prev + 1);
 };

 const goToPrevPage = () => {
   if (currentPage > 1) {
     setCurrentPage((prev) => prev - 1);
   }
 };

  return (
    <div className="p-4 bg-gray-800 h-screen w-full text-gray-200">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loader"></div>
        </div>
      ) : conversations.length > 0 ? (
        conversations.map((conversation: Conversation) => (
          <Link
            to={`/chat/${conversation.id}`}
            key={conversation.id}
            className="block mb-6 p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition duration-150 ease-in-out shadow hover:shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 flex space-x-3">
                {conversation.users &&
                  conversation.users.map((user: User) => (
                    <div key={user?.id} className="flex items-center space-x-2">
                      <img
                        src={user?.imageUrl || "default-avatar.png"}
                        alt={user?.fullName || "Default User"}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-700 hover:border-gray-600"
                      />
                      <div className="flex flex-col items-start">
                        <div className="flex items-center space-x-2">
                          <CountryFlag
                            countryCode={user?.regionCode}
                            svg
                            className="w-5 h-5 mr-2"
                          />
                          <span className="font-semibold text-gray-300 text-xs">
                            {user?.fullName}{" "}
                            {user?.isBotUser
                              ? "(BOT)"
                              : `(${user?.regionCode})`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="ml-4 p-3 border border-gray-600 rounded-lg bg-gray-900 shadow hover:shadow-lg transition-shadow duration-300">
                <span className="text-gray-200 text-md font-semibold">
                  {truncateMessage(conversation.latestMessage)}
                </span>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="text-center mt-4 text-gray-500">
          No conversations yet.
        </div>
      )}
      <div className="mt-6 flex justify-between">
        <button
          onClick={goToPrevPage}
          className={`bg-gray-700 px-4 py-2 rounded text-gray-200 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={goToNextPage}
          className="bg-gray-700 px-4 py-2 rounded text-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ConversationsList;
