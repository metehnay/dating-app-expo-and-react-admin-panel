"use client";
import React from "react";
import { db, storage } from "../../firebaseConfig";


const AdminManageData: React.FC = () => {
  const handleDeleteMessages = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all messages? This cannot be undone!"
      )
    ) {
      const messagesSnapshot = await db.collection("messages").get();
      const batch = db.batch();

      messagesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      alert("All messages have been deleted!");
    }
  };

  // Usage in your component
  const deleteImagesInFolder = async (folderPath: string) => {
    try {
      const storageRef = storage.ref(); // Use the imported storage
      const folderRef = storageRef.child(folderPath);

      folderRef
        .listAll()
        .then((res) => {
          // Collect promises to delete each file in the folder
          const deletePromises = res.items.map((itemRef) => {
            return itemRef.delete().catch((err) => {
              console.error(`Error deleting file ${itemRef.name}:`, err);
              return err; // Returning error to not break the Promise.all
            });
          });

          return Promise.all(deletePromises);
        })
        .then((results) => {
          // Filter for errors to identify failed deletions
          const errors = results.filter((result) => result instanceof Error);
          if (errors.length === 0) {
            console.log(`All files in folder ${folderPath} have been deleted.`);
          } else {
            console.error(`${errors.length} files failed to delete.`);
          }
        })
        .catch((error) => {
          console.error("Error listing files:", error);
        });
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };

  // Usage in your component
  const handleDeleteImages = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all images in the 'images/' folder? This cannot be undone!"
      )
    ) {
      // Call the function to delete images in the 'images/' folder
      await deleteImagesInFolder("images/");
      alert("All images have been deleted!");
    }
  };

  const handleDeleteConversations = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all conversations? This cannot be undone!"
      )
    ) {
      const conversationsSnapshot = await db.collection("conversations").get();
      const batch = db.batch();

      conversationsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      alert("All conversations have been deleted!");
    }
  };

  return (
    <div className="p-8 bg-gray-900 shadow-2xl text-white w-full">
      <h1 className="text-4xl font-extrabold mb-8 border-b border-gray-700 pb-4">
        🛠 Manage Data 🛠
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-1 gap-8 mt-6 w-full">
        <button
          onClick={handleDeleteMessages}
          className="flex items-center justify-center bg-red-700 text-white px-6 py-3 rounded-xl hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 transition-transform duration-200 transform hover:scale-101"
        >
          <i className="far fa-envelope text-xl mr-3"></i>
          Delete All Messages
        </button>

        <button
          onClick={handleDeleteConversations}
          className="flex items-center justify-center bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition-transform duration-200 transform hover:scale-101"
        >
          <i className="far fa-comments text-xl mr-3"></i>
          Delete All Conversations
        </button>

        <button
          onClick={handleDeleteImages}
          className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-transform duration-200 transform hover:scale-101"
        >
          <i className="far fa-images text-xl mr-3"></i>
          Delete All Images
        </button>
      </section>
    </div>
  );
};

export default AdminManageData;
