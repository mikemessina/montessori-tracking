import {
  collection,
  doc,
  writeBatch,
  getDocs,
  query,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import { seedLessonAreas, seedLessonsByArea } from "./seedLessons";

const AREAS_COLLECTION = "lessonAreas";
const LESSONS_COLLECTION = "lessons";

/**
 * Populates Firestore with the starter Montessori curriculum the first
 * time the app is run against a fresh project. Safe to call on every
 * app launch — it no-ops if lesson areas already exist.
 */
export async function seedCurriculumIfEmpty(): Promise<void> {
  const existing = await getDocs(query(collection(db, AREAS_COLLECTION), limit(1)));
  if (!existing.empty) return;

  const batch = writeBatch(db);

  for (const area of seedLessonAreas) {
    const areaRef = doc(collection(db, AREAS_COLLECTION));
    batch.set(areaRef, area);

    const lessonsForArea = seedLessonsByArea[area.name] ?? [];
    for (const lesson of lessonsForArea) {
      const lessonRef = doc(collection(db, LESSONS_COLLECTION));
      batch.set(lessonRef, { ...lesson, areaId: areaRef.id });
    }
  }

  await batch.commit();
}
