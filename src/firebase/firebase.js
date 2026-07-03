// Firestore rules to set in Firebase Console:
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /notes/{noteId} {
//       allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
//       allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
//     }
//   }
// }

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Configure Firebase using environment variables (Vite uses VITE_ prefix)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Setup Google Provider
const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
const db = getFirestore(app);

export { auth, googleProvider, db };
