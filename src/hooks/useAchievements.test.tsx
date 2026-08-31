import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAchievements } from "./useAchievements";

const { getMyAchievements } = vi.hoisted(() => ({
  getMyAchievements: vi.fn(),
}));

vi.mock("@/api", () => ({ getMyAchievements }));

describe("useAchievements", () => {
  beforeEach(() => vi.clearAllMocks());

  it("hace una request y permite reintentar luego de un error", async () => {
    getMyAchievements
      .mockResolvedValueOnce({ success: false, message: "Error temporal" })
      .mockResolvedValueOnce({
        success: true,
        data: {
          experience: "USER",
          completedCount: 1,
          total: 5,
          milestones: [],
        },
      });

    const { result } = renderHook(() => useAchievements());
    await waitFor(() => expect(result.current.error).toBe("Error temporal"));
    expect(getMyAchievements).toHaveBeenCalledTimes(1);

    await act(async () => result.current.retry());
    expect(result.current.data?.experience).toBe("USER");
    expect(getMyAchievements).toHaveBeenCalledTimes(2);
  });

  it("no consulta para roles sin experiencia", async () => {
    const { result } = renderHook(() => useAchievements(false));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getMyAchievements).not.toHaveBeenCalled();
  });
});
