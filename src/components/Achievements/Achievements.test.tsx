import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Achievements } from "./Achievements";
import type { AchievementsData } from "@/types/achievement.types";

const renderAchievements = (data: AchievementsData) =>
  render(
    <MemoryRouter>
      <Achievements data={data} isLoading={false} error={null} onRetry={vi.fn()} />
    </MemoryRouter>,
  );

const nonLinearUserData: AchievementsData = {
  experience: "USER",
  completedCount: 4,
  total: 5,
  milestones: [
    { key: "JOINED_VITALICA", achieved: true, achievedAt: "2026-01-01T10:00:00.000Z" },
    { key: "STARTED_FIRST_COURSE", achieved: true, achievedAt: "2026-01-02T10:00:00.000Z" },
    { key: "COMPLETED_FIRST_COURSE", achieved: true, achievedAt: "2026-01-03T10:00:00.000Z" },
    { key: "COMPLETED_FIRST_PRACTICE", achieved: false, achievedAt: null },
    { key: "COMPLETED_THREE_COURSES", achieved: true, achievedAt: "2026-03-03T10:00:00.000Z" },
  ],
};

afterEach(cleanup);

describe("Achievements", () => {
  it("representa hitos fuera de orden sin bloquear los posteriores", () => {
    renderAchievements(nonLinearUserData);

    expect(screen.getByLabelText("4 de 5 hitos alcanzados")).toBeInTheDocument();
    expect(screen.getByLabelText(/Completaste tu primera práctica: próximo hito sugerido/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ampliaste tu formación: alcanzado/)).toBeInTheDocument();
    expect(screen.getAllByText("Tu próximo hito")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Ver mis prácticas" })).toHaveAttribute(
      "href",
      "/mis-cursos?tab=practico",
    );
    expect(screen.getByRole("list", { name: "Hitos de tu recorrido" })).toHaveClass(
      "lg:grid-cols-5",
    );
  });

  it("muestra Logrado cuando un hito legacy no tiene fecha", () => {
    renderAchievements({
      experience: "INSTRUCTOR",
      completedCount: 2,
      total: 5,
      milestones: [
        { key: "JOINED_VITALICA", achieved: true, achievedAt: "2025-01-01T10:00:00.000Z" },
        { key: "BECAME_VERIFIED_INSTRUCTOR", achieved: true, achievedAt: null },
        { key: "PUBLISHED_FIRST_COURSE", achieved: false, achievedAt: null },
        { key: "RECEIVED_FIRST_STUDENT", achieved: false, achievedAt: null },
        { key: "COMPLETED_FIRST_GUIDED_PRACTICE", achieved: false, achievedAt: null },
      ],
    });

    expect(screen.getByText("Logrado")).toBeInTheDocument();
    expect(screen.getByText("Te verificaste como instructor")).toBeInTheDocument();
  });

  it("celebra discretamente el recorrido completo sin CTA", () => {
    renderAchievements({
      ...nonLinearUserData,
      completedCount: 5,
      milestones: nonLinearUserData.milestones.map((item) => ({
        ...item,
        achieved: true,
        achievedAt: item.achievedAt ?? "2026-04-01T10:00:00.000Z",
      })),
    });

    expect(screen.getByText("Completaste este recorrido")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("resuelve loading, error y retry de forma accesible", () => {
    const retry = vi.fn();
    const { rerender } = render(
      <MemoryRouter>
        <Achievements data={null} isLoading error={null} onRetry={retry} />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText("Cargando tu recorrido")).toHaveAttribute("aria-busy", "true");

    rerender(
      <MemoryRouter>
        <Achievements data={null} isLoading={false} error="No disponible" onRetry={retry} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("No disponible");
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
