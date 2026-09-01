import { useCallback, useEffect, useState } from "react";
import { getMyAchievements } from "@/api";
import type { AchievementsData } from "@/types/achievement.types";

export function useAchievements(enabled = true) {
  const [data, setData] = useState<AchievementsData | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    const response = await getMyAchievements();

    if (response.success && response.data) {
      setData(response.data);
    } else {
      setData(null);
      setError(response.message || "No pudimos cargar tu recorrido");
    }
    setIsLoading(false);
  }, [enabled]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, isLoading, error, retry: load };
}
