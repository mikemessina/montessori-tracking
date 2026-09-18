import { useState } from "react";
import { addLessonArea } from "../data/repository";

interface Props {
  nextOrder: number;
  onClose: () => void;
}

export function AddAreaModal({ nextOrder, onClose }: Props) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addLessonArea({ name: name.trim(), order: nextOrder });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Lesson Area</h2>
        <label>
          Area name
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Practical Life"
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
            {saving ? "Saving…" : "Add Area"}
          </button>
        </div>
      </div>
    </div>
  );
}
