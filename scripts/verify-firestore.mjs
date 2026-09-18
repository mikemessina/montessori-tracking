// Verifies that the real Firebase project rejects unauthenticated data access.
// Run with: node scripts/verify-firestore.mjs
// Requires .env.local to be populated (loaded manually below).

import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";

function loadEnvLocal() {
  const content = readFileSync(new URL("../.env.local", import.meta.url), "utf-8");
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) env[match[1]] = match[2];
  }
  return env;
}

const env = loadEnvLocal();

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  console.log(`Connecting to Firestore project: ${firebaseConfig.projectId}`);

  try {
    await getDocs(query(collection(db, "lessonAreas"), limit(1)));
  } catch (error) {
    if (error instanceof Error && error.message.includes("Missing or insufficient permissions")) {
      console.log("✓ Unauthenticated Firestore access was denied");
      console.log("\nSECURITY CHECK PASSED — published rules require authentication.");
      process.exit(0);
    }
    throw error;
  }

  throw new Error("Unauthenticated Firestore access was unexpectedly allowed");
}

main().catch((err) => {
  console.error("SMOKE TEST FAILED:", err.message);
  process.exit(1);
});
