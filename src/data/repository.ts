import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import type {
  Child,
  ChildLessonRecord,
  Lesson,
  LessonArea,
  LessonObservation,
  LessonStatusStage,
} from "../types";

const CHILDREN = "children";
const AREAS = "lessonAreas";
const LESSONS = "lessons";
const RECORDS = "childLessonRecords";

type Unsubscribe = () => void;

// --- Live query subscriptions -------------------------------------------------

export function subscribeToChildren(
  onChange: (children: Child[]) => void
): Unsubscribe {
  const q = query(collection(db, CHILDREN), orderBy("lastName"));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Child)));
  });
}

export function subscribeToLessonAreas(
  onChange: (areas: LessonArea[]) => void
): Unsubscribe {
  const q = query(collection(db, AREAS), orderBy("order"));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() } as LessonArea)));
  });
}

export function subscribeToLessons(
  onChange: (lessons: Lesson[]) => void
): Unsubscribe {
  const q = query(collection(db, LESSONS), orderBy("order"));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Lesson)));
  });
}

export function subscribeToChildRecords(
  childId: string,
  onChange: (records: ChildLessonRecord[]) => void
): Unsubscribe {
  const q = query(collection(db, RECORDS), where("childId", "==", childId));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChildLessonRecord)));
  });
}

// --- Mutations -----------------------------------------------------------------

export async function addChild(child: Omit<Child, "id">): Promise<string> {
  const ref = await addDoc(collection(db, CHILDREN), child);
  return ref.id;
}

export async function updateChild(
  childId: string,
  updates: Partial<Omit<Child, "id">>
): Promise<void> {
  await updateDoc(doc(db, CHILDREN, childId), updates);
}

export async function addLessonArea(area: Omit<LessonArea, "id">): Promise<string> {
  const ref = await addDoc(collection(db, AREAS), area);
  return ref.id;
}

export async function updateLessonArea(
  areaId: string,
  updates: Partial<Omit<LessonArea, "id">>
): Promise<void> {
  await updateDoc(doc(db, AREAS, areaId), updates);
}

/** Deletes a lesson area and all lessons within it (and their child records). */
export async function deleteLessonArea(areaId: string): Promise<void> {
  const lessonsSnap = await getDocs(
    query(collection(db, LESSONS), where("areaId", "==", areaId))
  );
  const batch = writeBatch(db);
  for (const lessonDoc of lessonsSnap.docs) {
    batch.delete(lessonDoc.ref);
  }
  batch.delete(doc(db, AREAS, areaId));
  await batch.commit();
}

/** Persists a new relative order for a list of lesson areas. */
export async function reorderLessonAreas(
  orderedAreaIds: string[]
): Promise<void> {
  const batch = writeBatch(db);
  orderedAreaIds.forEach((areaId, index) => {
    batch.update(doc(db, AREAS, areaId), { order: index + 1 });
  });
  await batch.commit();
}

export async function addLesson(lesson: Omit<Lesson, "id">): Promise<string> {
  const ref = await addDoc(collection(db, LESSONS), lesson);
  return ref.id;
}

export async function updateLesson(
  lessonId: string,
  updates: Partial<Omit<Lesson, "id">>
): Promise<void> {
  await updateDoc(doc(db, LESSONS, lessonId), updates);
}

/** Deletes a lesson and any child progress records tied to it. */
export async function deleteLesson(lessonId: string): Promise<void> {
  const recordsSnap = await getDocs(
    query(collection(db, RECORDS), where("lessonId", "==", lessonId))
  );
  const batch = writeBatch(db);
  for (const recordDoc of recordsSnap.docs) {
    batch.delete(recordDoc.ref);
  }
  batch.delete(doc(db, LESSONS, lessonId));
  await batch.commit();
}

/** Persists a new relative order for a list of lessons (typically within one area). */
export async function reorderLessons(orderedLessonIds: string[]): Promise<void> {
  const batch = writeBatch(db);
  orderedLessonIds.forEach((lessonId, index) => {
    batch.update(doc(db, LESSONS, lessonId), { order: index + 1 });
  });
  await batch.commit();
}

/**
 * Records a new observation for a child on a given lesson, updating the
 * current status and appending to history. Creates the record on first use.
 */
export async function recordLessonObservation(
  childId: string,
  lessonId: string,
  observation: LessonObservation
): Promise<void> {
  const recordId = `${childId}_${lessonId}`;
  const ref = doc(db, RECORDS, recordId);

  await setDoc(
    ref,
    {
      childId,
      lessonId,
      currentStatus: observation.status,
      updatedAt: new Date().toISOString(),
      history: arrayUnion(observation),
    },
    { merge: true }
  );
}

export function defaultStatusFor(): LessonStatusStage {
  return "Not Introduced";
}
