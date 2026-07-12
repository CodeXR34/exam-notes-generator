const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
require('dotenv').config();

let serviceAccount = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  }
} catch (error) {
  console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", error.message);
}

let db = null;
let storage = null;

if (getApps().length === 0) {
  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'pdf-summary-974b0',
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'pdf-summary-974b0.firebasestorage.app'
    });
    console.log("Firebase Admin initialized with service account.");
    db = getFirestore();
    storage = getStorage();
  } else {
    console.error("CRITICAL: FIREBASE_SERVICE_ACCOUNT_KEY is missing. Firebase Admin SDK will not be initialized, and database operations will fail.");
  }
}

module.exports = { db, storage, FieldValue };
