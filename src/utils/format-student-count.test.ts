import { describe, expect, it } from "vitest";
import { formatStudentCount } from "./format-student-count";

describe("formatStudentCount", () => {
  it.each([
    [0, "0 estudiantes"],
    [1, "1 estudiante"],
    [2, "2 estudiantes"],
  ])("formats %i students as %s", (totalStudents, expected) => {
    expect(formatStudentCount(totalStudents)).toBe(expected);
  });
});
