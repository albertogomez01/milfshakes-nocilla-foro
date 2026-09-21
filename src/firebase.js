// Firebase SDK Integration for Milfshakes x Nocilla Forum
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, TwitterAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

// Firebase Configuration template using Environment Variables or direct config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_SAMPLE_KEY_FOR_FORUM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "milfshakes-nocilla.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "milfshakes-nocilla",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "milfshakes-nocilla.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:sampleappid"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

// Auth Helper Functions
export const loginWithTwitterFirebase = async () => {
  try {
    const result = await signInWithPopup(auth, twitterProvider);
    return result.user;
  } catch (error) {
    console.warn("Firebase Twitter Auth popup handling fallback:", error.message);
    throw error;
  }
};

export const logoutFirebase = async () => {
  return await signOut(auth);
};

export default app;
