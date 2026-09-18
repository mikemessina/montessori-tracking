import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
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

export async function addLesson(lesson: Omit<Lesson, "id">): Promise<string> {
  const ref = await addDoc(collection(db, LESSONS), lesson);
  return ref.id;
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
