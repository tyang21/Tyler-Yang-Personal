// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApX9v3WZC0dAh4js0Z5YiUisHJXFVrogM",
  authDomain: "interestingproblems-d02ec.firebaseapp.com",
  projectId: "interestingproblems-d02ec",
  storageBucket: "interestingproblems-d02ec.appspot.com",
  messagingSenderId: "993317446068",
  appId: "1:993317446068:web:3a2d640693d9bd091112e1",
  measurementId: "G-WE8VP67HW5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);