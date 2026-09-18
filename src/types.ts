// Core data model for the Montessori lesson-tracking app.

/** Ordered progression a child moves through for any given lesson. */
export const STATUS_STAGES = [
  "Not Introduced",
  "Presented",
  "Practicing",
  "Mastered",
] as const;

export type LessonStatusStage = (typeof STATUS_STAGES)[number];

/** A curriculum area, e.g. Practical Life, Sensorial, Language, Math, Cultural. */
export interface LessonArea {
  id: string;
  name: string;
  order: number;
}

/** A single lesson/work within an area. The catalog is expected to grow over time. */
export interface Lesson {
  id: string;
  areaId: string;
  name: string;
  description?: string;
  order: number;
  /** Optional prerequisite lessons that are typically presented first. */
  prerequisiteLessonIds?: string[];
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string; // ISO date
  active: boolean;
  photoUrl?: string;
  enrollmentDate?: string; // ISO date
}

/** One dated entry in a child's history for a given lesson. */
export interface LessonObservation {
  status: LessonStatusStage;
  date: string; // ISO date
  note?: string;
  teacherName?: string;
}

/**
 * Tracks a single child's progress on a single lesson.
 * Document id convention: `${childId}_${lessonId}`.
 */
export interface ChildLessonRecord {
  id: string;
  childId: string;
  lessonId: string;
  currentStatus: LessonStatusStage;
  updatedAt: string; // ISO datetime
  history: LessonObservation[];
}
