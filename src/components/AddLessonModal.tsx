import { useState } from "react";
import { addLesson } from "../data/repository";

interface Props {
  areaId: string;
  nextOrder: number;
  onClose: () => void;
}

export function AddLessonModal({ areaId, nextOrder, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addLesson({
        areaId,
        name: name.trim(),
        description: description.trim() || undefined,
        order: nextOrder,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Lesson</h2>
        <label>
          Lesson name
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Pink Tower"
          />
        </label>
        <label>
          Description (optional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </label>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            disabled={saving || !name.trim()}
            onClick={handleSave}
          >
            {saving ? "Saving…" : "Add Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}
