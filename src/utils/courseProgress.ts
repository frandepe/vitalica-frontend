export interface LessonCompletionInput {
  totalLessons: number;
  completedLessonIds: ReadonlySet<string>;
  lessonIds: readonly string[];
}

export interface LessonCompletionResult {
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  isComplete: boolean;
}

/** Pure pedagogical calculation shared by Student and Preview. */
export function calculateLessonCompletion({
  totalLessons,
  completedLessonIds,
  lessonIds,
}: LessonCompletionInput): LessonCompletionResult {
  const currentLessonIds = new Set(lessonIds);
  const completedLessons = [...completedLessonIds].filter((id) =>
    currentLessonIds.has(id),
  ).length;
  const safeTotal = Math.max(0, totalLessons);
  const percentage =
    safeTotal === 0 ? 0 : Math.round((completedLessons / safeTotal) * 100);

  return {
    totalLessons: safeTotal,
    completedLessons,
    percentage,
    isComplete: safeTotal > 0 && completedLessons === safeTotal,
  };
}

export function hasMinimumReviewProgress(completion: LessonCompletionResult) {
  return (
    completion.totalLessons > 0 && completion.completedLessons * 100 >= completion.totalLessons * 50
  );
}
