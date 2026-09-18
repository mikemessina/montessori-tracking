import type { LessonStatusStage } from "../types";

/** Maps each status stage to a CSS class suffix used for color coding. */
export function statusClass(status: LessonStatusStage): string {
  switch (status) {
    case "Not Introduced":
      return "status-none";
    case "Presented":
      return "status-presented";
    case "Practicing":
      return "status-practicing";
    case "Mastered":
      return "status-mastered";
  }
}
