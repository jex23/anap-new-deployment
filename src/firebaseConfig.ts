// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzuLI0nMyKeTmcnGCGgveFyWDLqkLFD3g",
  authDomain: "anap-6b6f4.firebaseapp.com",
  databaseURL: "https://anap-6b6f4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "anap-6b6f4",
  storageBucket: "anap-6b6f4.appspot.com",
  messagingSenderId: "1076102815903",
  appId: "1:1076102815903:web:d746abc19ac4f1cd69c2aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Export the initialized instances
export { db, auth, storage };
