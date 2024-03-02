// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8_SS1QpzbgAxnxg9tbocw1w95tbmq47Y",
  authDomain: "super-ticatctoe.firebaseapp.com",
  projectId: "super-ticatctoe",
  storageBucket: "super-ticatctoe.appspot.com",
  messagingSenderId: "722091707862",
  appId: "1:722091707862:web:754c6be756df3a0d1a6877",
  measurementId: "G-GF630MBN4H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;