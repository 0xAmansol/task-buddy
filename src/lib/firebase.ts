import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBnKsxV7jejz7sEK9td-T_JmWE8mLjqvqM",
  authDomain: "taskmanager-30369.firebaseapp.com",
  projectId: "taskmanager-30369",
  storageBucket: "taskmanager-30369.appspot.com", // Corrected this line
  messagingSenderId: "44585153556",
  appId: "1:44585153556:web:e21ea7733625c21091a301",
  measurementId: "G-HN2DMT6ZSZ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
