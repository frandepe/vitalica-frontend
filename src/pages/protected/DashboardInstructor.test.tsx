import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import DashboardInstructor from "./DashboardInstructor";

const mocks = vi.hoisted(() => ({ getInstructorDashboardCounts: vi.fn() }));

vi.mock("@/api", () => ({
  getInstructorDashboardCounts: mocks.getInstructorDashboardCounts,
}));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      firstName: "Ana",
      lastName: "Instructora",
      email: "ana@test.com",
    },
  }),
}));
vi.mock("@/hooks/useStickyTop", () => ({ useStickyTop: () => 0 }));

describe("DashboardInstructor count labels", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1024,
    });
    mocks.getInstructorDashboardCounts.mockResolvedValue({
      success: true,
      data: {
        managedCourses: 7,
        courses: 99,
        reviews: 4,
        practices: 2,
      },
    });
  });

  afterEach(cleanup);

  it("labels the private count as managed courses and uses managedCourses", async () => {
    render(
      <MemoryRouter initialEntries={["/instructor/panel-administrativo"]}>
        <DashboardInstructor />
      </MemoryRouter>,
    );

    const label = await screen.findByText("Cursos gestionados");
    const navigationItem = label.closest("li");
    expect(navigationItem).not.toBeNull();
    expect(within(navigationItem!).getByText("7")).toBeInTheDocument();
    expect(within(navigationItem!).queryByText("99")).not.toBeInTheDocument();
  });
});
