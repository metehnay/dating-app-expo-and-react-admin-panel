import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
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

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebaseApp.storage();
const functions = firebaseApp.functions();



export { db, auth, firebaseApp, storage, functions };
