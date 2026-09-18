import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import {
  useChildRecords,
  useChildren,
  useLessonAreas,
  useLessons,
} from "../hooks/useCollections";
import { LessonAreaSection } from "../components/LessonAreaSection";

export function ChildDetailPage() {
  const { childId } = useParams<{ childId: string }>();
  const children = useChildren();
  const areas = useLessonAreas();
  const lessons = useLessons();
  const records = useChildRecords(childId);

  const child = children.find((c) => c.id === childId);

  const lessonsByArea = useMemo(() => {
    const map = new Map<string, typeof lessons>();
    for (const lesson of lessons) {
      const list = map.get(lesson.areaId) ?? [];
      list.push(lesson);
      map.set(lesson.areaId, list);
    }
    return map;
  }, [lessons]);

  const recordsByLessonId = useMemo(() => {
    const map = new Map<string, (typeof records)[number]>();
    for (const record of records) map.set(record.lessonId, record);
    return map;
  }, [records]);

  if (!childId) return null;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <Link to="/" className="back-link">
            ← All Children
          </Link>
          <h1>{child ? `${child.firstName} ${child.lastName}` : "Loading…"}</h1>
        </div>
      </header>

      {areas.map((area) => (
        <LessonAreaSection
          key={area.id}
          childId={childId}
          area={area}
          lessons={lessonsByArea.get(area.id) ?? []}
          recordsByLessonId={recordsByLessonId}
        />
      ))}
    </div>
  );
}
