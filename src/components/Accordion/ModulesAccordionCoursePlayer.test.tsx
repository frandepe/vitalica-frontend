import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { ICourseModuleWithProgress } from "@/types/courseProgress.types";
import { ModulesAccordionCoursePlayer } from "./ModulesAccordionCoursePlayer";

const renderModule = (availableQuizCount: number) => {
  const modules: ICourseModuleWithProgress[] = [
    {
      id: "module-1",
      title: "Módulo de prueba",
      order: 1,
      availableQuizCount,
      lessons: [],
    },
  ];

  render(<ModulesAccordionCoursePlayer modules={modules} />);
  fireEvent.click(screen.getByTitle("Módulo de prueba").closest("button")!);
};

describe("ModulesAccordionCoursePlayer", () => {
  afterEach(cleanup);

  it("no muestra el examen cuando el módulo no tiene preguntas", () => {
    renderModule(0);

    expect(
      screen.queryByRole("button", { name: "Examen del módulo 1" }),
    ).not.toBeInTheDocument();
  });

  it("muestra el examen cuando el módulo tiene preguntas válidas", () => {
    renderModule(1);

    expect(
      screen.getByRole("button", { name: "Examen del módulo 1" }),
    ).toBeInTheDocument();
  });

  it("no muestra el examen cuando ninguna pregunta está disponible", () => {
    renderModule(0);

    expect(screen.queryByText("Examen del módulo 1")).not.toBeInTheDocument();
  });
});
