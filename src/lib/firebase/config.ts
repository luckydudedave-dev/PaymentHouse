/**
 * Firebase web app config. These values are PUBLIC (they identify your project, they are
 * not secrets) — security comes from Firestore/Storage rules and Cloud Functions.
 * Find them in Firebase Console → Project settings → Your apps → Web app → SDK setup.
 * Values come from VITE_FIREBASE_* env vars (e.g. a .env.local file) when set, otherwise
 * from WEB_CONFIG below. Never put the Admin SDK service-account key anywhere in the app.
 */
const WEB_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

const env = import.meta.env as Record<string, string | undefined>;

export const firebaseConfig = {
  apiKey: env["VITE_FIREBASE_API_KEY"] || WEB_CONFIG.apiKey,
  authDomain: env["VITE_FIREBASE_AUTH_DOMAIN"] || WEB_CONFIG.authDomain,
  projectId: env["VITE_FIREBASE_PROJECT_ID"] || WEB_CONFIG.projectId,
  storageBucket: env["VITE_FIREBASE_STORAGE_BUCKET"] || WEB_CONFIG.storageBucket,
  messagingSenderId: env["VITE_FIREBASE_MESSAGING_SENDER_ID"] || WEB_CONFIG.messagingSenderId,
  appId: env["VITE_FIREBASE_APP_ID"] || WEB_CONFIG.appId,
};

/** Region your Cloud Functions are deployed to (must match functions/src/index.ts). */
export const functionsRegion = env["VITE_FIREBASE_FUNCTIONS_REGION"] || "us-central1";

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

/** Without a Firebase config the dashboards run as a read-only preview on sample data. */
export const isDemoMode = !isFirebaseConfigured;
