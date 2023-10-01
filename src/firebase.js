// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyARHrQ_9mbJUrOS2Kr-sVc5kReudt73Tws",
  authDomain: "post-1f555.firebaseapp.com",
  projectId: "post-1f555",
  storageBucket: "post-1f555.appspot.com",
  messagingSenderId: "434028352535",
  appId: "1:434028352535:web:adeddbfbbe380116dd7852",
  measurementId: "G-NV4GDH5ZS5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
