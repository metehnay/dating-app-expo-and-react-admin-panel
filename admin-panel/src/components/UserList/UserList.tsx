"use client";
import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebaseConfig";
import Modal
 from "./Modal";
import { QueryDocumentSnapshot } from "@firebase/firestore-types";


 interface User {
   id: string;
   fullName: string;
   email: string;
   imageUrl?: string;
   height?: string;
   weight?: string;
 }

 interface FirebaseDoc {
   id: string;
   data: () => any;
 }

const UsersList = () => {
const [users, setUsers] = useState<User[]>([]);
const [currentUser, setCurrentUser] = useState<User | null>(null);
const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
const [startAfter, setStartAfter] = useState<QueryDocumentSnapshot | null>(
  null
);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  useEffect(() => {
    fetchUsers(); 
  }, []);

  const fetchUsers = async () => {
    try {
      let query = db.collection("users").orderBy("fullName");

      if (startAfter) {
        query = query.startAfter(startAfter);
      }

      const usersCollection = await query.limit(15).get();

      const newUsers = usersCollection.docs.map((doc: FirebaseDoc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      if (newUsers.length < 15) {
        setHasMoreUsers(false);
      } else {
        setStartAfter(
          usersCollection.docs[newUsers.length - 1] as QueryDocumentSnapshot
        );
      }

setUsers((prevUsers) => {
  const uniqueUsers = newUsers.filter(
    (newUser) => !prevUsers.some((user) => user.id === newUser.id)
  );
  return [...prevUsers, ...uniqueUsers];
});
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLoadMore = () => {
    fetchUsers(); 
  };

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files && e.target.files[0];
  if (file) {
    setSelectedImage(file);
  }
};

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (currentUser) {
        let updatedUser = { ...currentUser };

        if (selectedImage) {
          const storageRef = storage.ref();
          const fileRef = storageRef.child(selectedImage.name);
          await fileRef.put(selectedImage);
          const fileURL = await fileRef.getDownloadURL();

          updatedUser.imageUrl = fileURL; 
        }

        await db.collection("users").doc(updatedUser.id).update(updatedUser);

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );

        setSelectedImage(null);
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await db.collection("users").doc(userId).delete();

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-gray-100 w-full shadow-lg">
      <h2 className="text-2xl font-bold mb-4">📜 Users List:</h2>

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow overflow-y-auto relative">
        <table className="border-collapse table-auto w-full whitespace-no-wrap table-striped relative">
          <thead>
            <tr className="text-left bg-gray-700">
              <th className="py-2 px-3 border-b border-gray-700">📸 Image</th>
              <th className="py-2 px-3 border-b border-gray-700">👤 Name</th>
              <th className="py-2 px-3 border-b border-gray-700">💌 Email</th>
              <th className="py-2 px-3 border-b border-gray-700">🔧 Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-700 transition ease-in-out duration-150"
              >
                <td className="py-2 px-3 border-b border-gray-800">
                  <img
                    src={user.imageUrl || "/default-avatar.png"}
                    alt={user.fullName}
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="py-2 px-3 border-b border-gray-800">
                  {user.fullName}
                </td>
                <td className="py-2 px-3 border-b border-gray-800">
                  {user.email}
                </td>
                <td className="py-2 px-3 border-b border-gray-800">
                  <button
                    onClick={() => handleEdit(user)}
                    className="px-3 py-1 bg-blue-500 text-gray-900 rounded-full hover:bg-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemove(user.id)}
                    className="px-3 py-1 bg-red-500 text-gray-900 rounded-full hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleLoadMore}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full"
        >
          Load More
        </button>
      </div>

      <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-2xl font-semibold mb-4 text-gray-100">
          🖋️ Edit User
        </h3>
        <div className="mb-4">
          <label className="block font-semibold text-gray-200">
            Full Name:
          </label>
          <input
            value={currentUser?.fullName || ""}
            onChange={(e) =>
              currentUser &&
              setCurrentUser({ ...currentUser, fullName: e.target.value })
            }
            className="w-full p-2 mt-1 border bg-gray-800 rounded text-gray-200"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-200">
            Change User Image:
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 mt-1 border bg-gray-800 rounded text-gray-200"
          />
        </div>
       
        
        <div className="mb-4">
          <label className="block font-semibold text-gray-200">Height:</label>
          <input
            value={currentUser?.height || ""}
            onChange={(e) =>
              currentUser &&
              setCurrentUser({ ...currentUser, height: e.target.value })
            }
            className="w-full p-2 mt-1 border bg-gray-800 rounded text-gray-200"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-200">Weight:</label>
          <input
            value={currentUser?.weight || ""}
            onChange={(e) =>
              currentUser &&
              setCurrentUser({ ...currentUser, weight: e.target.value })
            }
            className="w-full p-2 mt-1 border bg-gray-800 rounded text-gray-200"
          />
        </div>
        
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-gray-900 rounded-full hover:bg-green-600"
        >
          Save Changes
        </button>
      </Modal>
    </div>
  );
};

export default UsersList;
