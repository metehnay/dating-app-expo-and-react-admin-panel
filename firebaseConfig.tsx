import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import "firebase/compat/functions";

const firebaseConfig = {
  apiKey: "AIzaSyC6ich2q0gwwbSbYiKd3XVKbGUFC1yFykM",
  authDomain: "loveify-db.firebaseapp.com",
  projectId: "loveify-db",
  storageBucket: "loveify-db.appspot.com",
  messagingSenderId: "1043146951050",
  appId: "1:1043146951050:web:e7229988b1a8bd5e192073",
};


const firebaseApp = firebase.initializeApp(firebaseConfig);

initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage(); 
const functions = firebase.functions();


export { db, auth, firebaseApp, storage, functions}; 
