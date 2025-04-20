// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import for Google Cloud Storage
import { getFirestore } from "firebase/firestore";
// Import for Firestore Database

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Added databaseURL
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Added measurementId
// };

const firebaseConfig = {
  apiKey: "AIzaSyC2F9Dq85JOlUKVolKYK_MruABZU1tsdsA",
  authDomain: "daniel-ecom-1077f.firebaseapp.com",
  databaseURL:
    "https://daniel-ecom-1077f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "daniel-ecom-1077f",
  storageBucket: "daniel-ecom-1077f.firebasestorage.app",
  messagingSenderId: "112445996938",
  appId: "1:112445996938:web:7a54a532c8b89356619273",
  measurementId: "G-Z32J2DYBYL",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app); // Initialize Google Cloud Storage
const firestore = getFirestore(app); // Initialize Firestore Database

export { auth, googleProvider, storage, firestore };
export default app;
