// src/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';  

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAerN8VO4Vzw1E0dn_rrPeWBgdU-ERlfA4",
  authDomain: "nsut-club-connect.firebaseapp.com",
  projectId: "nsut-club-connect",
  storageBucket: "nsut-club-connect.firebasestorage.app",
  messagingSenderId: "294338947563",
  appId: "1:294338947563:web:826cbbe652a3cb155551ae",
  measurementId: "G-ZCR7D73397"
};

// Validate required config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Missing required Firebase configuration. Please check your environment variables.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export default app;