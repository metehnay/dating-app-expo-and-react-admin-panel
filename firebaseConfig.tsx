import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage"; // <-- Add this line
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import "firebase/compat/functions";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC6ich2q0gwwbSbYiKd3XVKbGUFC1yFykM",
  authDomain: "loveify-db.firebaseapp.com",
  projectId: "loveify-db",
  storageBucket: "loveify-db.appspot.com",
  messagingSenderId: "1043146951050",
  appId: "1:1043146951050:web:e7229988b1a8bd5e192073",
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
const functions = firebase.functions();


export { db, auth, firebaseApp, storage, functions}; // <
