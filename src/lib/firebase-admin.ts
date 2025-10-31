// Firebase Admin SDK configuration
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminDb: FirebaseFirestore.Firestore | null = null;

// Check if required environment variables are available
const hasRequiredEnvVars = () => {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
};

// Initialize Firebase Admin only if environment variables are available
const initializeFirebaseAdmin = () => {
  if (getApps().length > 0) {
    // Already initialized
    return getFirestore();
  }

  if (!hasRequiredEnvVars()) {
    console.warn('Firebase Admin: Required environment variables not available. Skipping initialization.');
    return null;
  }

  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    };

    initializeApp({
      credential: cert(serviceAccount),
    });

    const db = getFirestore();
    db.settings({
      ignoreUndefinedProperties: true,
    });

    return db;
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
    return null;
  }
};

// Initialize on module load
adminDb = initializeFirebaseAdmin();

// Export a getter function that ensures DB is initialized
export const getAdminDb = (): FirebaseFirestore.Firestore => {
  if (!adminDb) {
    adminDb = initializeFirebaseAdmin();
    if (!adminDb) {
      throw new Error('Firebase Admin is not initialized. Check that all required environment variables are set.');
    }
  }
  return adminDb;
};

// Keep backward compatibility
export { adminDb };
