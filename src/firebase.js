// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMw7rmRNMzj2aS4ThCuL_J4TjiBVjDmJU",
  authDomain: "process-automation-3000.firebaseapp.com",
  databaseURL: "https://process-automation-3000-default-rtdb.firebaseio.com",
  projectId: "process-automation-3000",
  storageBucket: "process-automation-3000.firebasestorage.app",
  messagingSenderId: "789949375648",
  appId: "1:789949375648:web:3ad084e90bd0b01161d5c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
