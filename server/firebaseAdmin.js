const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let serviceAccount = null;
let initMethod = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const filePath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    console.log(`[Firebase Admin] Attempting to load service account from resolved path: ${filePath}`);
    
    if (fs.existsSync(filePath)) {
      console.log(`[Firebase Admin] Service account file found.`);
      let fileContents = fs.readFileSync(filePath, 'utf8');
      
      // Strip UTF-8 BOM if present
      fileContents = fileContents.replace(/^\uFEFF/, '');
      
      try {
        serviceAccount = JSON.parse(fileContents);
        console.log(`[Firebase Admin] JSON.parse succeeded.`);
        initMethod = 'FILE';
      } catch (parseError) {
        console.error(`[Firebase Admin] JSON.parse failed for file: ${parseError.message}`);
      }
    } else {
      console.error(`[Firebase Admin] Error: Service account file not found at ${filePath}`);
    }
  } 
  
  if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    initMethod = 'inline JSON string';
  }
} catch (error) {
  console.error("Error parsing Firebase Service Account credentials:", error.message);
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
    console.log(`Firebase Admin initialized from service account ${initMethod === 'FILE' ? 'FILE' : 'inline JSON string'}.`);
    db = getFirestore();
    storage = getStorage();
  } else {
    console.error("CRITICAL: Firebase Service Account credentials are missing. Firebase Admin SDK will not be initialized, and database operations will fail.");
  }
}

module.exports = { db, storage, FieldValue };
