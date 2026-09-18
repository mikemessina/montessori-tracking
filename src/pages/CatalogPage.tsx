import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLessonAreas, useLessons } from "../hooks/useCollections";
import { reorderLessonAreas, reorderLessons } from "../data/repository";
import { AddAreaModal } from "../components/AddAreaModal";
import { AddLessonModal } from "../components/AddLessonModal";
import { EditAreaModal } from "../components/EditAreaModal";
import { EditLessonModal } from "../components/EditLessonModal";
import type { Lesson, LessonArea } from "../types";

export function CatalogPage() {
  const areas = useLessonAreas();
  const lessons = useLessons();

  const [showAddArea, setShowAddArea] = useState(false);
  const [editingArea, setEditingArea] = useState<LessonArea | null>(null);
  const [addingLessonToArea, setAddingLessonToArea] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const lessonsByArea = useMemo(() => {
    const map = new Map<string, Lesson[]>();
    for (const lesson of lessons) {
      const list = map.get(lesson.areaId) ?? [];
      list.push(lesson);
      map.set(lesson.areaId, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.order - b.order);
    return map;
  }, [lessons]);

  async function moveArea(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= areas.length) return;
    const reordered = [...areas];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    await reorderLessonAreas(reordered.map((a) => a.id));
  }

  async function moveLesson(areaId: string, index: number, direction: -1 | 1) {
    const areaLessons = lessonsByArea.get(areaId) ?? [];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= areaLessons.length) return;
    const reordered = [...areaLessons];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    await reorderLessons(reordered.map((l) => l.id));
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <Link to="/" className="back-link">
            ← All Children
          </Link>
          <h1>Lesson Catalog</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowAddArea(true)}>
          + Add Area
        </button>
      </header>

      {areas.length === 0 && (
        <p className="empty-state">
          No lesson areas yet. Add your first area to start building your curriculum.
        </p>
      )}

      {areas.map((area, areaIndex) => {
        const areaLessons = lessonsByArea.get(area.id) ?? [];
        return (
          <section key={area.id} className="lesson-area">
            <div className="catalog-area-header">
              <div className="reorder-controls">
                <button
                  className="reorder-btn"
                  disabled={areaIndex === 0}
                  onClick={() => moveArea(areaIndex, -1)}
                  aria-label={`Move ${area.name} up`}
                >
                  ▲
                </button>
                <button
                  className="reorder-btn"
                  disabled={areaIndex === areas.length - 1}
                  onClick={() => moveArea(areaIndex, 1)}
                  aria-label={`Move ${area.name} down`}
                >
                  ▼
                </button>
              </div>
              <span className="catalog-area-name">{area.name}</span>
              <button className="btn-secondary" onClick={() => setEditingArea(area)}>
                Edit
              </button>
              <button
                className="btn-secondary"
                onClick={() => setAddingLessonToArea(area.id)}
              >
                + Lesson
              </button>
            </div>

            <ul className="lesson-list">
              {areaLessons.map((lesson, lessonIndex) => (
                <li key={lesson.id} className="catalog-lesson-row">
                  <div className="reorder-controls">
                    <button
                      className="reorder-btn"
                      disabled={lessonIndex === 0}
                      onClick={() => moveLesson(area.id, lessonIndex, -1)}
                      aria-label={`Move ${lesson.name} up`}
                    >
                      ▲
                    </button>
                    <button
                      className="reorder-btn"
                      disabled={lessonIndex === areaLessons.length - 1}
                      onClick={() => moveLesson(area.id, lessonIndex, 1)}
                      aria-label={`Move ${lesson.name} down`}
                    >
                      ▼
                    </button>
                  </div>
                  <span className="lesson-name">{lesson.name}</span>
                  <button className="btn-secondary" onClick={() => setEditingLesson(lesson)}>
                    Edit
                  </button>
                </li>
              ))}
              {areaLessons.length === 0 && (
                <li className="empty-state-inline">No lessons in this area yet.</li>
              )}
            </ul>
          </section>
        );
      })}

      {showAddArea && (
        <AddAreaModal
          nextOrder={areas.length + 1}
          onClose={() => setShowAddArea(false)}
        />
      )}
      {editingArea && (
        <EditAreaModal
          area={editingArea}
          lessonCount={(lessonsByArea.get(editingArea.id) ?? []).length}
          onClose={() => setEditingArea(null)}
        />
      )}
      {addingLessonToArea && (
        <AddLessonModal
          areaId={addingLessonToArea}
          nextOrder={(lessonsByArea.get(addingLessonToArea) ?? []).length + 1}
          onClose={() => setAddingLessonToArea(null)}
        />
      )}
      {editingLesson && (
        <EditLessonModal lesson={editingLesson} onClose={() => setEditingLesson(null)} />
      )}
    </div>
  );
}
