import React, { useState } from "react";
import { firebaseApp } from "../../firebaseConfig";

const UpdateBotUsers: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string>("");

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const usersRef = firebaseApp.firestore().collection("users");
      const snapshot = await usersRef.where("isBotUser", "==", true).get();

      const batch = firebaseApp.firestore().batch();

      snapshot.forEach((doc) => {
        const userRef = usersRef.doc(doc.id);
        batch.update(userRef, { expoPushToken });
      });

      await batch.commit();
      setCompleted(true);
    } catch (error) {
      console.error("Error updating users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" p-8 space-y-6 bg-gray-800 w-full shadow-2xl text-gray-200">
      <h1 className="text-center text-3xl font-bold text-gray-100">
        Update Bot Users' Push Token
      </h1>

      <input
        type="text"
        placeholder="Enter New Expo Push Token"
        value={expoPushToken}
        onChange={(e) => setExpoPushToken(e.target.value)}
        className="w-full p-2 bg-gray-700 placeholder-gray-500 text-gray-300 border rounded-md focus:border-blue-500 focus:bg-gray-600 focus:outline-none transition duration-200"
      />

      {completed && (
        <div className="bg-green-800 p-4 rounded-md border-l-4 border-green-400 text-green-200">
          Successfully updated all bot users' push tokens!
        </div>
      )}

      <button
        onClick={handleUpdate}
        className={`w-full py-2 mt-4 text-lg font-semibold rounded-md transition duration-200 ${
          loading
            ? "bg-gray-600 cursor-wait"
            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-600 focus:ring-opacity-30"
        }`}
        disabled={loading || !expoPushToken.trim()}
      >
        {loading ? "Updating..." : "Update All Bot Users"}
      </button>
    </div>
  );
};

export default UpdateBotUsers;
