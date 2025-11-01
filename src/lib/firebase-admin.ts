// Firebase Admin SDK configuration
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminDb: FirebaseFirestore.Firestore | null = null;

// Check if required environment variables are available
const hasRequiredEnvVars = () => {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    (process.env.ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY)
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
    // Support both ADMIN_PRIVATE_KEY (for Firebase secrets) and FIREBASE_PRIVATE_KEY (for local .env)
    let privateKey = process.env.ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY!;
    
    // Remove surrounding quotes if present (common mistake when setting secrets)
    privateKey = privateKey.replace(/^["']|["']$/g, '');
    
    // Handle escaped newlines - replace literal \n with actual newlines
    // This handles both \\n (double escaped) and \n (single escaped)
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    // Trim any surrounding whitespace AFTER processing newlines
    privateKey = privateKey.trim();
    
    // Debug logging (will be visible in production logs)
    console.log('Private key length:', privateKey.length);
    console.log('Starts with header:', privateKey.startsWith('-----BEGIN PRIVATE KEY-----'));
    console.log('First 50 chars:', privateKey.substring(0, 50));
    console.log('Last 50 chars:', privateKey.substring(privateKey.length - 50));
    
    // Ensure the key starts and ends properly
    if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
      throw new Error('Private key does not start with correct header');
    }
    if (!privateKey.endsWith('-----END PRIVATE KEY-----')) {
      throw new Error(`Private key does not end with correct footer. Last 30 chars: "${privateKey.substring(privateKey.length - 30)}"`);
    }
    
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
