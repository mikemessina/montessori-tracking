import { useEffect, useState } from "react";

const KEY = "montessori-teacher-name";

/** Persists the current teacher's display name in localStorage so it can be
 * auto-filled on every observation without re-typing it each time. */
export function useTeacherName(): [string, (name: string) => void] {
  const [name, setName] = useState(() => localStorage.getItem(KEY) ?? "");

  useEffect(() => {
    localStorage.setItem(KEY, name);
  }, [name]);

  return [name, setName];
}
