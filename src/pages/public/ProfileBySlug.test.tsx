import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProfileBySlug from "./ProfileBySlug";

const mocks = vi.hoisted(() => ({
  getProfileBySlug: vi.fn(),
  getCoursesByInstructor: vi.fn(),
}));

vi.mock("@/api", () => ({
  getProfileBySlug: mocks.getProfileBySlug,
  getCoursesByInstructor: mocks.getCoursesByInstructor,
}));
vi.mock("@/components/user/OptimizedAvatarImage", () => ({
  OptimizedAvatarImage: ({ alt }: { alt: string }) => <div role="img" aria-label={alt} />,
}));
vi.mock("@/components/FoundingInstructorBadge", () => ({
  FoundingInstructorBadge: () => <span>Instructor fundador</span>,
}));

const profile = {
  id: "instructor-user-1",
  slug: "ines-prueba",
  firstName: "Ines",
  lastName: "Prueba",
  avatarUrl: "",
  role: "INSTRUCTOR",
  enrollments: [],
  discoveryCourses: [],
  instructorProfile: {
    id: "instructor-profile-1",
    bio: "Perfil público de prueba",
    headline: "Instructora",
    specialties: ["CPR"],
    approvedAt: "2026-01-01T00:00:00.000Z",
    isFoundingInstructor: false,
    city: "La Plata",
    state: "Buenos Aires",
    credentials: [],
  },
};

const renderProfile = (stats: unknown) => {
  mocks.getProfileBySlug.mockResolvedValue({
    data: { ...profile, stats },
  });
  mocks.getCoursesByInstructor.mockResolvedValue({ data: [] });

  return render(
    <MemoryRouter initialEntries={["/perfil/ines-prueba"]}>
      <Routes>
        <Route path="/perfil/:slug" element={<ProfileBySlug />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("ProfileBySlug instructor stats", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(cleanup);

  it("renders reach and keeps theory and practice reputation separate", async () => {
    renderProfile({
      uniqueStudents: 24,
      publishedCourses: 3,
      theory: { averageRating: 4.75, reviewCount: 32 },
      practice: { averageRating: 4.9, reviewCount: 1 },
    });

    expect(await screen.findByText("24")).toBeInTheDocument();
    expect(screen.getByText("Cursos publicados")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4.8")).toBeInTheDocument();
    expect(screen.getByText("32 reseñas")).toBeInTheDocument();
    expect(screen.getByText("4.9")).toBeInTheDocument();
    expect(screen.getByText("1 reseña")).toBeInTheDocument();
    expect(screen.queryByText("999")).not.toBeInTheDocument();
  });

  it("shows semantic empty states instead of a zero-star rating", async () => {
    renderProfile({
      uniqueStudents: 0,
      publishedCourses: 0,
      theory: { averageRating: null, reviewCount: 0 },
      practice: { averageRating: null, reviewCount: 0 },
    });

    await waitFor(() =>
      expect(screen.getAllByText("Sin calificaciones")).toHaveLength(2),
    );
    expect(screen.getAllByText("Sin reseñas")).toHaveLength(2);
    expect(screen.queryByText(/0\s*⭐/)).not.toBeInTheDocument();
  });
});
