import { useState } from "react";
import { recordLessonObservation } from "../data/repository";
import { STATUS_STAGES } from "../types";
import type { ChildLessonRecord, Lesson, LessonStatusStage } from "../types";
import { useTeacherName } from "../hooks/useTeacherName";

interface Props {
  childId: string;
  lesson: Lesson;
  record: ChildLessonRecord | undefined;
  onClose: () => void;
}

export function ObservationModal({ childId, lesson, record, onClose }: Props) {
  const [teacherName, setTeacherName] = useTeacherName();
  const [status, setStatus] = useState<LessonStatusStage>(
    record?.currentStatus ?? "Not Introduced"
  );
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await recordLessonObservation(childId, lesson.id, {
        status,
        date: new Date().toISOString().slice(0, 10),
        note: note.trim() || undefined,
        teacherName: teacherName.trim() || undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const history = [...(record?.history ?? [])].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{lesson.name}</h2>

        <label>
          Status
          <div className="status-picker">
            {STATUS_STAGES.map((stage) => (
              <button
                key={stage}
                type="button"
                className={`status-option status-${stage === status ? "selected" : "unselected"}`}
                data-status={stage}
                onClick={() => setStatus(stage)}
              >
                {stage}
              </button>
            ))}
          </div>
        </label>

        <label>
          Teacher
          <input
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="Your name"
          />
        </label>

        <label>
          Note (optional)
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Observations about this presentation…"
          />
        </label>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" disabled={saving} onClick={handleSave}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        {history.length > 0 && (
          <div className="history">
            <h3>History</h3>
            <ul>
              {history.map((h, i) => (
                <li key={i}>
                  <strong>{h.date}</strong> — {h.status}
                  {h.teacherName ? ` (${h.teacherName})` : ""}
                  {h.note ? `: ${h.note}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
