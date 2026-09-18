// One-off script to verify the real Firebase project is reachable and the
// Firestore security rules allow the app's expected read/write patterns.
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
  addDoc,
  deleteDoc,
  doc,
  setDoc,
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

  // 1. Read check (rules must allow read on lessonAreas)
  const areasSnap = await getDocs(query(collection(db, "lessonAreas"), limit(5)));
  console.log(`✓ Read lessonAreas: ${areasSnap.size} doc(s) found`);

  // 2. Write check: create a throwaway test document
  const testRef = await addDoc(collection(db, "children"), {
    firstName: "SmokeTest",
    lastName: "Verify",
    active: true,
    __smokeTest: true,
  });
  console.log(`✓ Wrote test child doc: ${testRef.id}`);

  // 3. Read-back check
  const readBack = await getDocs(query(collection(db, "children"), limit(50)));
  const found = readBack.docs.find((d) => d.id === testRef.id);
  if (!found) throw new Error("Test document not found on read-back");
  console.log("✓ Read back test child doc successfully");

  // 4. Record an observation-style write (childLessonRecords)
  await setDoc(doc(db, "childLessonRecords", `${testRef.id}_smoketest-lesson`), {
    childId: testRef.id,
    lessonId: "smoketest-lesson",
    currentStatus: "Presented",
    updatedAt: new Date().toISOString(),
    history: [{ status: "Presented", date: "2026-01-01", teacherName: "Smoke Test" }],
  });
  console.log("✓ Wrote test childLessonRecords doc");

  // 5. Clean up test data
  await deleteDoc(doc(db, "children", testRef.id));
  await deleteDoc(doc(db, "childLessonRecords", `${testRef.id}_smoketest-lesson`));
  console.log("✓ Cleaned up test documents");

  console.log("\nSMOKE TEST PASSED — Firestore is reachable and rules allow expected access.");
  process.exit(0);
}

main().catch((err) => {
  console.error("SMOKE TEST FAILED:", err.message);
  process.exit(1);
});
