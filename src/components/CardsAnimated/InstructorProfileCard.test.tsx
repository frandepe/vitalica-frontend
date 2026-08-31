import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { InstructorProfileCard } from "./InstructorProfileCard";

const renderCard = () =>
  render(
    <MemoryRouter>
      <InstructorProfileCard
        name="Ana Instructor"
        headline="Instructora de emergencias"
        specialties={["RCP"]}
        location="Buenos Aires"
        reviewLabel="Sin reseñas públicas todavía"
        totalCourses={2}
        totalStudents={10}
        courseLabel="2 cursos"
        studentLabel="10 estudiantes"
        approvedLabel="Instructor aprobado en Vitalica"
        profileHref="/perfil/ana"
        credentialTypes={[
          "PROFESSIONAL_DEGREE",
          "PROFESSIONAL_LICENSE",
          "INSTRUCTOR_CERTIFICATION",
        ]}
      />
    </MemoryRouter>,
  );

describe("InstructorProfileCard credentials", () => {
  afterEach(cleanup);

  it("shows the corresponding credential logos without exposing details", () => {
    renderCard();

    expect(
      screen.getByLabelText("Título profesional").querySelector("img"),
    ).toHaveAttribute("src", "/Icons/titulo-profesional.png");
    expect(
      screen.getByLabelText("Matrícula profesional").querySelector("img"),
    ).toHaveAttribute("src", "/Icons/matricula-profesional.png");
    expect(
      screen
        .getByLabelText("Certificación como instructor")
        .querySelector("img"),
    ).toHaveAttribute("src", "/Icons/certificacion-como-instructor.png");
    expect(screen.queryByText("Médica")).not.toBeInTheDocument();
  });

  it("reveals the credential category on hover and keyboard focus", async () => {
    renderCard();
    const trigger = screen.getByLabelText("Título profesional");

    fireEvent.pointerMove(trigger, { pointerType: "mouse" });
    await waitFor(() =>
      expect(screen.getByRole("tooltip")).toHaveTextContent(
        "Título profesional",
      ),
    );

    fireEvent.mouseLeave(trigger);
    fireEvent.focus(screen.getByLabelText("Matrícula profesional"));
    await waitFor(() =>
      expect(screen.getByRole("tooltip")).toHaveTextContent(
        "Matrícula profesional",
      ),
    );
  });
});
