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
    // Handle private key - it might have literal \n or actual newlines
    let privateKey = process.env.FIREBASE_PRIVATE_KEY!;
    
    // Remove surrounding quotes if present (common mistake when setting secrets)
    privateKey = privateKey.replace(/^["']|["']$/g, '');
    
    // If the key contains literal \n strings, replace them with actual newlines
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    // Trim any extra whitespace that might cause parsing issues
    privateKey = privateKey.trim();
    
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: privateKey,
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
