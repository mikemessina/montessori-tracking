import { useState } from "react";
import { deleteLessonArea, updateLessonArea } from "../data/repository";
import type { LessonArea } from "../types";

interface Props {
  area: LessonArea;
  lessonCount: number;
  onClose: () => void;
}

export function EditAreaModal({ area, lessonCount, onClose }: Props) {
  const [name, setName] = useState(area.name);
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateLessonArea(area.id, { name: name.trim() });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteLessonArea(area.id);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Lesson Area</h2>
        <label>
          Area name
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        {confirmingDelete ? (
          <div className="delete-confirm">
            <p>
              Delete <strong>{area.name}</strong> and all {lessonCount} lesson
              {lessonCount === 1 ? "" : "s"} in it, including every child's
              recorded progress? This cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setConfirmingDelete(false)}>
                Cancel
              </button>
              <button className="btn-danger" disabled={saving} onClick={handleDelete}>
                {saving ? "Deleting…" : "Delete Area"}
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
