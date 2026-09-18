import { useState } from "react";
import { deleteLesson, updateLesson } from "../data/repository";
import type { Lesson } from "../types";

interface Props {
  lesson: Lesson;
  onClose: () => void;
}

export function EditLessonModal({ lesson, onClose }: Props) {
  const [name, setName] = useState(lesson.name);
  const [description, setDescription] = useState(lesson.description ?? "");
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateLesson(lesson.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteLesson(lesson.id);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Lesson</h2>
        <label>
          Lesson name
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Description (optional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </label>

        {confirmingDelete ? (
          <div className="delete-confirm">
            <p>
              Delete <strong>{lesson.name}</strong>? This also removes every
              child's recorded progress for this lesson. This cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setConfirmingDelete(false)}>
                Cancel
              </button>
              <button className="btn-danger" disabled={saving} onClick={handleDelete}>
                {saving ? "Deleting…" : "Delete Lesson"}
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-actions modal-actions-split">
            <button className="btn-danger-text" onClick={() => setConfirmingDelete(true)}>
              Delete
            </button>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn-primary"
                disabled={saving || !name.trim()}
                onClick={handleSave}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
