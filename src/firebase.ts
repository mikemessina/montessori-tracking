import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

// Firebase project config — read from environment variables so real
// credentials never need to be committed to source control.
// Copy `.env.example` to `.env.local` and fill in your Firebase project's
// values (Firebase console > Project settings > General > Your apps > SDK setup).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const authPersistenceReady = setPersistence(auth, browserLocalPersistence);

// Persistent local cache enables full offline read/write support: changes
// made with no network connection are queued and synced automatically
// once connectivity returns. The multi-tab manager lets the app also be
// opened in more than one browser tab/window without cache conflicts.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
