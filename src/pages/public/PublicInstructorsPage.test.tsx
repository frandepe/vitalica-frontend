import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PublicInstructorsPage from "./PublicInstructorsPage";

const mocks = vi.hoisted(() => ({ getPublicInstructors: vi.fn() }));

vi.mock("@/api", () => ({
  getPublicInstructors: mocks.getPublicInstructors,
}));
vi.mock("@/components/Banners/HeaderBanner", () => ({
  CirclesImg: () => null,
}));
vi.mock("@/components/CardsAnimated/InstructorProfileCard", () => ({
  InstructorProfileCard: (props: {
    totalCourses: number;
    totalStudents: number;
    theoryRating: number | null;
    theoryReviewCount: number;
    practiceRating: number | null;
    practiceReviewCount: number;
  }) => (
    <article aria-label="instructor-card">
      {JSON.stringify(props)}
    </article>
  ),
}));

describe("PublicInstructorsPage dynamic stats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getPublicInstructors.mockResolvedValue({
      data: [
        {
          userId: "instructor-1",
          slug: "ana-instructora",
          firstName: "Ana",
          lastName: "Instructora",
          avatarUrl: null,
          headline: "Instructora de emergencias",
          specialties: ["CPR"],
          city: "La Plata",
          state: "Buenos Aires",
          approvedAt: "2026-01-01T00:00:00.000Z",
          isFoundingInstructor: false,
          credentialTypes: [],
          stats: {
            uniqueStudents: 2,
            publishedCourses: 1,
            theory: { averageRating: 4.5, reviewCount: 2 },
            practice: { averageRating: null, reviewCount: 0 },
          },
        },
      ],
      meta: { page: 1, limit: 12, total: 1, totalPages: 1 },
    });
  });

  afterEach(cleanup);

  it("maps the stable stats contract to the card instead of legacy values", async () => {
    render(
      <MemoryRouter>
        <PublicInstructorsPage />
      </MemoryRouter>,
    );

    const card = await screen.findByLabelText("instructor-card");
    expect(card).toHaveTextContent('"totalCourses":1');
    expect(card).toHaveTextContent('"totalStudents":2');
    expect(card).toHaveTextContent('"theoryRating":4.5');
    expect(card).toHaveTextContent('"theoryReviewCount":2');
    expect(card).toHaveTextContent('"practiceRating":null');
    expect(card).not.toHaveTextContent("999");
  });
});
