import { useState } from "react";
import type { ChildLessonRecord, Lesson, LessonArea } from "../types";
import { statusClass } from "../utils/status";
import { ObservationModal } from "./ObservationModal";

interface Props {
  childId: string;
  area: LessonArea;
  lessons: Lesson[];
  recordsByLessonId: Map<string, ChildLessonRecord>;
}

/** Date of the most recent observation entry, i.e. when the current status was set. */
function latestObservationDate(record: ChildLessonRecord | undefined): string | undefined {
  if (!record || record.history.length === 0) return undefined;
  return record.history.reduce((latest, entry) =>
    entry.date > latest.date ? entry : latest
  ).date;
}

export function LessonAreaSection({ childId, area, lessons, recordsByLessonId }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const masteredCount = lessons.filter(
    (l) => recordsByLessonId.get(l.id)?.currentStatus === "Mastered"
  ).length;

  return (
    <section className="lesson-area">
      <button className="lesson-area-header" onClick={() => setExpanded((e) => !e)}>
        <span>{expanded ? "▾" : "▸"} {area.name}</span>
        <span className="lesson-area-progress">
          {masteredCount}/{lessons.length} mastered
        </span>
      </button>

      {expanded && (
        <ul className="lesson-list">
          {lessons.map((lesson) => {
            const record = recordsByLessonId.get(lesson.id);
            const status = record?.currentStatus ?? "Not Introduced";
            const lastDate = latestObservationDate(record);
            return (
              <li key={lesson.id}>
                <button
                  className="lesson-row"
                  onClick={() => setActiveLesson(lesson)}
                >
                  <span className="lesson-name">{lesson.name}</span>
                  {lastDate && <span className="lesson-date">{lastDate}</span>}
                  <span className={`status-badge ${statusClass(status)}`}>
                    {status}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {activeLesson && (
        <ObservationModal
          childId={childId}
          lesson={activeLesson}
          record={recordsByLessonId.get(activeLesson.id)}
          onClose={() => setActiveLesson(null)}
        />
      )}
    </section>
  );
}
