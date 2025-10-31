// Firebase Admin SDK configuration
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminDb: FirebaseFirestore.Firestore;

// Initialize Firebase Admin only if it hasn't been initialized yet
if (getApps().length === 0) {
  // In Firebase App Hosting, use Application Default Credentials
  if (process.env.K_SERVICE) {
    // Running in Cloud Run (App Hosting)
    initializeApp();
  } else {
    // Running locally with environment variables
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  
  // Get Firestore instance and configure it immediately after initialization
  adminDb = getFirestore();
  adminDb.settings({
    ignoreUndefinedProperties: true,
  });
} else {
  // If already initialized, just get the instance
  adminDb = getFirestore();
}

export { adminDb };
