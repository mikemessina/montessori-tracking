import { describe, expect, it } from "vitest";
import { seedLessonAreas, seedLessonsByArea } from "./seedLessons";
import { STATUS_STAGES } from "../types";

describe("seed curriculum data", () => {
  it("has no duplicate area names", () => {
    const names = seedLessonAreas.map((a) => a.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("has sequential, unique order values for areas", () => {
    const orders = seedLessonAreas.map((a) => a.order).sort((a, b) => a - b);
    expect(orders).toEqual(seedLessonAreas.map((_, i) => i + 1));
  });

  it("has a lesson list defined for every seeded area", () => {
    for (const area of seedLessonAreas) {
      expect(seedLessonsByArea[area.name]).toBeDefined();
      expect(seedLessonsByArea[area.name].length).toBeGreaterThan(0);
    }
  });

  it("has no lessons defined for an area that doesn't exist", () => {
    const areaNames = new Set(seedLessonAreas.map((a) => a.name));
    for (const key of Object.keys(seedLessonsByArea)) {
      expect(areaNames.has(key)).toBe(true);
    }
  });

  it("has no duplicate lesson names within an area", () => {
    for (const [areaName, lessons] of Object.entries(seedLessonsByArea)) {
      const names = lessons.map((l) => l.name);
      expect(new Set(names).size, `duplicate lesson in ${areaName}`).toBe(names.length);
    }
  });

  it("has sequential, unique order values within each area", () => {
    for (const [areaName, lessons] of Object.entries(seedLessonsByArea)) {
      const orders = lessons.map((l) => l.order).sort((a, b) => a - b);
      expect(orders, `order gap/dup in ${areaName}`).toEqual(
        lessons.map((_, i) => i + 1)
      );
    }
  });
});

describe("status stages", () => {
  it("defines the expected progression in order", () => {
    expect(STATUS_STAGES).toEqual([
      "Not Introduced",
      "Presented",
      "Practicing",
      "Mastered",
    ]);
  });
});
