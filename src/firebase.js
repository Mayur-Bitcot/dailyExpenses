import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth"; // ✅ Add this line

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCu6W6GTx71ropdNq9atg9CIP1fcIq1NWA",
  authDomain: "dailexpenses.firebaseapp.com",
  projectId: "dailexpenses",
  storageBucket: "dailexpenses.firebasestorage.app",
  messagingSenderId: "309362209080",
  appId: "1:309362209080:web:5ee2b7f4ce6a5342d591cd"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference
const database = getDatabase(app);

const auth = getAuth(app);

export { database, ref, push, onValue, auth }; // ✅ Export auth
