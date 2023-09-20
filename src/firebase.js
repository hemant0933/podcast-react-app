// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore } from "firebase/firestore";
import {getStorage } from "firebase/storage";
import {getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDqwrcz2etfzsrGiAVz0EGPkGkefKRzwI",
  authDomain: "podcast-app-e4604.firebaseapp.com",
  projectId: "podcast-app-e4604",
  storageBucket: "podcast-app-e4604.appspot.com",
  messagingSenderId: "918256059698",
  appId: "1:918256059698:web:81776cd3ab7a2e8a4e032b",
  measurementId: "G-X3FFB0592X"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export {auth,analytics, storage, db};