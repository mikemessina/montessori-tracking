import { useEffect, useState } from "react";
import {
  subscribeToChildren,
  subscribeToChildRecords,
  subscribeToLessonAreas,
  subscribeToLessons,
} from "../data/repository";
import type { Child, ChildLessonRecord, Lesson, LessonArea } from "../types";

/** Live list of all children, updates in real time across devices. */
export function useChildren(): Child[] {
  const [children, setChildren] = useState<Child[]>([]);
  useEffect(() => subscribeToChildren(setChildren), []);
  return children;
}

/** Live list of lesson areas, ordered. */
export function useLessonAreas(): LessonArea[] {
  const [areas, setAreas] = useState<LessonArea[]>([]);
  useEffect(() => subscribeToLessonAreas(setAreas), []);
  return areas;
}

/** Live list of all lessons across every area, ordered. */
export function useLessons(): Lesson[] {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  useEffect(() => subscribeToLessons(setLessons), []);
  return lessons;
}

/** Live progress records for a single child; empty until childId is set. */
export function useChildRecords(childId: string | undefined): ChildLessonRecord[] {
  const [records, setRecords] = useState<ChildLessonRecord[]>([]);
  useEffect(() => {
    if (!childId) return;
    // Clear stale data from the previous child before the new subscription loads.
    setRecords([]);
    return subscribeToChildRecords(childId, setRecords);
  }, [childId]);
  return childId ? records : [];
}
