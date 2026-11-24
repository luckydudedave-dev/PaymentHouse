/**
 * Browser-side Firebase SDK. Initialised lazily so server rendering never touches it;
 * call these helpers from event handlers / effects only.
 */
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig, isFirebaseConfigured } from "./config";

export { isFirebaseConfigured };

export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super("Firebase is not connected yet. Add your Firebase web config to finish setup.");
  }
}

export function firebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) throw new FirebaseNotConfiguredError();
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const firebaseAuth = (): Auth => getAuth(firebaseApp());
export const firestore = (): Firestore => getFirestore(firebaseApp());
