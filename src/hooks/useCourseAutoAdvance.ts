import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ILessonWithProgress } from "@/types/courseProgress.types";

const AUTO_ADVANCE_DELAY_MS = 1000;
const AUTO_ADVANCE_COUNTDOWN_SECONDS = 5;
const AUTO_ADVANCE_TICK_MS = 100;

interface AutoAdvanceTargetLesson {
  id: string;
  title: string;
}

interface UseCourseAutoAdvanceParams {
  slug?: string;
  activeLessonId?: string;
  basePath?: string;
}

interface UseCourseAutoAdvanceResult {
  isAutoAdvanceVisible: boolean;
  autoAdvanceRemainingSeconds: number;
  autoAdvanceProgressPct: number;
  autoAdvanceTargetLesson: AutoAdvanceTargetLesson | null;
  startAutoAdvance: (
    currentLessonId: string,
    targetLesson: ILessonWithProgress | null,
  ) => void;
  cancelAutoAdvance: () => void;
  navigateToAutoAdvanceTarget: (targetLessonId: string) => void;
  handlePlayerPlay: () => void;
}

export function useCourseAutoAdvance({
  slug,
  activeLessonId,
  basePath = "/mis-cursos",
}: UseCourseAutoAdvanceParams): UseCourseAutoAdvanceResult {
  const [isAutoAdvanceVisible, setIsAutoAdvanceVisible] = useState(false);
  const [autoAdvanceRemainingMs, setAutoAdvanceRemainingMs] = useState(
    AUTO_ADVANCE_COUNTDOWN_SECONDS * 1000,
  );
  const [autoAdvanceTargetLesson, setAutoAdvanceTargetLesson] =
    useState<AutoAdvanceTargetLesson | null>(null);
  const navigate = useNavigate();
  const autoAdvanceDelayTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const autoAdvanceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const autoAdvanceStartedForLessonRef = useRef<string | null>(null);
  const autoAdvanceNavigatedRef = useRef(false);

  const clearAutoAdvanceTimers = useCallback(() => {
    if (autoAdvanceDelayTimeoutRef.current) {
      clearTimeout(autoAdvanceDelayTimeoutRef.current);
      autoAdvanceDelayTimeoutRef.current = null;
    }

    if (autoAdvanceIntervalRef.current) {
      clearInterval(autoAdvanceIntervalRef.current);
      autoAdvanceIntervalRef.current = null;
    }
  }, []);

  const cancelAutoAdvance = useCallback(() => {
    clearAutoAdvanceTimers();
    setIsAutoAdvanceVisible(false);
    setAutoAdvanceRemainingMs(AUTO_ADVANCE_COUNTDOWN_SECONDS * 1000);
    setAutoAdvanceTargetLesson(null);
    autoAdvanceStartedForLessonRef.current = null;
    autoAdvanceNavigatedRef.current = false;
  }, [clearAutoAdvanceTimers]);

  const navigateToAutoAdvanceTarget = useCallback(
    (targetLessonId: string) => {
      if (!slug || autoAdvanceNavigatedRef.current) return;

      autoAdvanceNavigatedRef.current = true;
      clearAutoAdvanceTimers();
      setIsAutoAdvanceVisible(false);
      setAutoAdvanceTargetLesson(null);
      setAutoAdvanceRemainingMs(AUTO_ADVANCE_COUNTDOWN_SECONDS * 1000);
      autoAdvanceStartedForLessonRef.current = null;

      navigate(`${basePath}/${slug}/${targetLessonId}`);
    },
    [basePath, clearAutoAdvanceTimers, navigate, slug],
  );

  const startAutoAdvance = useCallback(
    (currentLessonId: string, targetLesson: ILessonWithProgress | null) => {
      if (!targetLesson?.id) return;
      if (autoAdvanceStartedForLessonRef.current === currentLessonId) return;

      clearAutoAdvanceTimers();
      autoAdvanceStartedForLessonRef.current = currentLessonId;
      autoAdvanceNavigatedRef.current = false;

      setAutoAdvanceRemainingMs(AUTO_ADVANCE_COUNTDOWN_SECONDS * 1000);
      setAutoAdvanceTargetLesson({
        id: targetLesson.id,
        title: targetLesson.title,
      });
      setIsAutoAdvanceVisible(false);

      autoAdvanceDelayTimeoutRef.current = setTimeout(() => {
        setIsAutoAdvanceVisible(true);

        autoAdvanceIntervalRef.current = setInterval(() => {
          setAutoAdvanceRemainingMs((previous) => {
            const nextRemaining = previous - AUTO_ADVANCE_TICK_MS;

            if (nextRemaining <= 0) {
              clearAutoAdvanceTimers();
              navigateToAutoAdvanceTarget(targetLesson.id);
              return 0;
            }

            return nextRemaining;
          });
        }, AUTO_ADVANCE_TICK_MS);
      }, AUTO_ADVANCE_DELAY_MS);
    },
    [clearAutoAdvanceTimers, navigateToAutoAdvanceTarget],
  );

  const handlePlayerPlay = useCallback(() => {
    if (
      isAutoAdvanceVisible ||
      autoAdvanceDelayTimeoutRef.current ||
      autoAdvanceIntervalRef.current
    ) {
      cancelAutoAdvance();
    }
  }, [cancelAutoAdvance, isAutoAdvanceVisible]);

  useEffect(() => {
    cancelAutoAdvance();
  }, [activeLessonId, cancelAutoAdvance]);

  useEffect(() => {
    return () => {
      clearAutoAdvanceTimers();
    };
  }, [clearAutoAdvanceTimers]);

  const autoAdvanceProgressPct =
    ((AUTO_ADVANCE_COUNTDOWN_SECONDS * 1000 - autoAdvanceRemainingMs) /
      (AUTO_ADVANCE_COUNTDOWN_SECONDS * 1000)) *
    100;

  const autoAdvanceRemainingSeconds = Math.max(
    1,
    Math.ceil(autoAdvanceRemainingMs / 1000),
  );

  return {
    isAutoAdvanceVisible,
    autoAdvanceRemainingSeconds,
    autoAdvanceProgressPct,
    autoAdvanceTargetLesson,
    startAutoAdvance,
    cancelAutoAdvance,
    navigateToAutoAdvanceTarget,
    handlePlayerPlay,
  };
}
