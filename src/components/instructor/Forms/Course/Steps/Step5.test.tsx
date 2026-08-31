import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useMemo, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createFinalQuiz,
  deleteFinalQuiz,
  getFinalQuizzes,
} from "@/api";
import { Step, Stepper } from "@/components/instructor/Stepper";
import type { ICourse } from "@/types/course.types";
import type { InstructorFinalQuiz } from "@/types/quiz.types";
import { getValidationIssues } from "@/utils/course-validations";
import { Step5 } from "./Step5";

vi.mock("@/api", () => ({
  createFinalQuiz: vi.fn(),
  deleteFinalQuiz: vi.fn(),
  getFinalQuizzes: vi.fn(),
  reorderFinalQuizzes: vi.fn(),
  updateCourseQuiz: vi.fn(),
}));

const mockedCreateFinalQuiz = vi.mocked(createFinalQuiz);
const mockedDeleteFinalQuiz = vi.mocked(deleteFinalQuiz);
const mockedGetFinalQuizzes = vi.mocked(getFinalQuizzes);

const makeQuizzes = (count: number): InstructorFinalQuiz[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `quiz-${index + 1}`,
    order: index + 1,
    question: `Pregunta ${index + 1}`,
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
  }));

const validCourse = {
  id: "course-one",
  instructorId: "instructor-one",
  slug: "course-one",
  title: "Curso completo",
  description: "Descripción",
  specialty: "DEA",
  price: 100,
  status: "DRAFT",
  avgTheoreticalRating: 0,
  ratingCount: 0,
  totalStudents: 0,
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
  modules: [
    {
      id: "module-one",
      courseId: "course-one",
      slug: "module-one",
      title: "Módulo",
      order: 1,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
      lessons: [
        {
          id: "lesson-one",
          moduleId: "module-one",
          slug: "lesson-one",
          title: "Lección",
          order: 1,
          isFree: false,
          type: "content",
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      ],
    },
  ],
} as ICourse;

function WizardHarness() {
  const [quizzes, setQuizzes] = useState<InstructorFinalQuiz[]>([]);
  const [pending, setPending] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const issues = useMemo(
    () =>
      getValidationIssues(
        { ...validCourse, quizzes: quizzes as ICourse["quizzes"] },
        5,
      ),
    [quizzes],
  );
  const errorCount = issues.filter((issue) => issue.type === "error").length;

  return (
    <Stepper
      errorCount={errorCount}
      nextButtonText="Siguiente"
      onStepChange={setCurrentStep}
      nextButtonProps={{
        disabled: currentStep === 1 ? pending : errorCount > 0,
      }}
    >
      <Step>
        <Step5
          courseId="course-one"
          onQuizzesChange={setQuizzes}
          onPendingChange={setPending}
        />
      </Step>
      <Step>
        <p>{quizzes.length} preguntas reconocidas</p>
        <p>{errorCount === 0 ? "Curso completo" : "Curso incompleto"}</p>
      </Step>
    </Stepper>
  );
}

describe("sincronización del examen final en el wizard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("scrollTo", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("alcanza el mínimo y habilita el envío en el paso siguiente sin refresh", async () => {
    const fourQuizzes = makeQuizzes(4);
    const fiveQuizzes = makeQuizzes(5);
    mockedGetFinalQuizzes
      .mockResolvedValueOnce({ success: true, data: fourQuizzes })
      .mockResolvedValueOnce({ success: true, data: fiveQuizzes });
    mockedCreateFinalQuiz.mockResolvedValue({
      success: true,
      data: { id: "quiz-5" },
    });

    render(<WizardHarness />);

    await screen.findByText("Preguntas del examen final (4/20)");
    fireEvent.change(screen.getByPlaceholderText("Escribi la pregunta"), {
      target: { value: "Pregunta 5" },
    });
    ["Opción A", "Opción B", "Opción C", "Opción D"].forEach(
      (value, index) => {
        fireEvent.change(screen.getByPlaceholderText(`Opcion ${index + 1}`), {
          target: { value },
        });
      },
    );
    fireEvent.click(screen.getAllByRole("radio")[0]);
    fireEvent.click(screen.getByRole("button", { name: "Agregar pregunta" }));

    await screen.findByText("Preguntas del examen final (5/20)");
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));

    expect(screen.getByText("5 preguntas reconocidas")).toBeInTheDocument();
    expect(screen.getByText("Curso completo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Finalizar" })).toBeEnabled();
  });

  it("refleja una eliminación y vuelve a deshabilitar el envío", async () => {
    const fiveQuizzes = makeQuizzes(5);
    const fourQuizzes = makeQuizzes(4);
    mockedGetFinalQuizzes
      .mockResolvedValueOnce({ success: true, data: fiveQuizzes })
      .mockResolvedValueOnce({ success: true, data: fourQuizzes });
    mockedDeleteFinalQuiz.mockResolvedValue({ success: true });

    render(<WizardHarness />);

    await screen.findByText("Preguntas del examen final (5/20)");
    fireEvent.click(
      screen.getByRole("button", { name: "Eliminar pregunta 1" }),
    );

    await screen.findByText("Preguntas del examen final (4/20)");
    await waitFor(() =>
      expect(mockedDeleteFinalQuiz).toHaveBeenCalledWith("quiz-1"),
    );
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));

    expect(screen.getByText("4 preguntas reconocidas")).toBeInTheDocument();
    expect(screen.getByText("Curso incompleto")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Finalizar" })).toBeDisabled();
  });
});
