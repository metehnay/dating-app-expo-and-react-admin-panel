import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage"; // <-- Add this line
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDgXA6pPqhrfsC_TlW5tK6qyX-qAjd1-Zc",
  authDomain: "loveify-1cc90.firebaseapp.com",
  projectId: "loveify-1cc90",
  storageBucket: "loveify-1cc90.appspot.com",
  messagingSenderId: "991388239175",
  appId: "1:991388239175:web:6a7d8727d7066a5be13862",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Use these for db, auth & storage
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage(); // <-- Add this line


export { db, auth, firebaseApp, storage }; // <
