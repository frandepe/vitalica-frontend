import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Search from "./Search";

const mocks = vi.hoisted(() => ({ getCourses: vi.fn() }));

vi.mock("@/api", () => ({ getCourses: mocks.getCourses }));
vi.mock("@/components/CardsAnimated/CoursePublic", () => ({
  CoursePublicCard: ({ title }: { title: string }) => <article>{title}</article>,
}));
vi.mock("@/components/Loadings/GlobalLoading", () => ({
  GlobalLoading: () => <div>Cargando cursos...</div>,
}));

const LocationProbe = () => {
  const location = useLocation();
  return <output aria-label="current-url">{location.search}</output>;
};

const course = {
  id: "course-1",
  title: "RCP Inicial",
  slug: "rcp-inicial",
};

const renderSearch = (initialUrl = "/buscar?search=rcp&page=3&limit=10") => {
  mocks.getCourses.mockResolvedValue({
    success: true,
    data: [course],
    meta: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
      availableSpecialties: ["CPR", "FIRST_AID"],
    },
  });

  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <Routes>
        <Route
          path="/buscar"
          element={
            <>
              <Search />
              <LocationProbe />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe("Search filters", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(cleanup);

  it("hydrates applied filters from the URL", async () => {
    renderSearch(
      "/buscar?search=rcp&page=2&limit=10&rating=4&duration=medium&level=BASIC,ADVANCED&price=paid",
    );

    await waitFor(() =>
      expect(mocks.getCourses).toHaveBeenCalledWith(
        2,
        10,
        "rcp",
        {
          rating: "4",
          duration: "medium",
          levels: ["BASIC", "ADVANCED"],
          prices: ["paid"],
        },
        undefined,
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: /Todos los filtros/ }));
    expect(screen.getByLabelText("Básico")).toBeChecked();
    expect(screen.getByLabelText("Avanzado")).toBeChecked();
    expect(screen.getByLabelText("De pago")).toBeChecked();
    expect(screen.getByLabelText("4,0 o más")).toBeChecked();
  });

  it("shows only backend-provided specialties and replaces text search when applying one", async () => {
    renderSearch();
    await screen.findByText("RCP Inicial");

    fireEvent.click(
      screen.getByRole("combobox", { name: "Filtrar por especialidad" }),
    );
    expect(
      screen.getByRole("option", { name: "Reanimación cardiopulmonar (RCP)" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Soporte vital en trauma")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("option", { name: "Reanimación cardiopulmonar (RCP)" }),
    );

    await waitFor(() => {
      const url = screen.getByLabelText("current-url").textContent ?? "";
      expect(url).toContain("specialty=CPR");
      expect(url).toContain("page=1");
      expect(url).not.toContain("search=");
    });
  });

  it("discards temporary changes when the panel closes without applying", async () => {
    renderSearch();
    await screen.findByText("RCP Inicial");

    fireEvent.click(screen.getByRole("button", { name: /Todos los filtros/ }));
    fireEvent.click(screen.getByLabelText("Básico"));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: /Todos los filtros/ }));

    expect(screen.getByLabelText("Básico")).not.toBeChecked();
    expect(screen.getByLabelText("current-url")).toHaveTextContent("page=3");
  });

  it("applies filters, preserves search and limit, and resets page", async () => {
    renderSearch();
    await screen.findByText("RCP Inicial");

    fireEvent.click(screen.getByRole("button", { name: /Todos los filtros/ }));
    fireEvent.click(screen.getByLabelText("4,0 o más"));
    fireEvent.click(screen.getByLabelText("Intermedio"));
    fireEvent.click(screen.getByRole("button", { name: "Aplicar filtros" }));

    await waitFor(() => {
      const url = screen.getByLabelText("current-url").textContent ?? "";
      expect(url).toContain("search=rcp");
      expect(url).toContain("page=1");
      expect(url).toContain("limit=10");
      expect(url).toContain("rating=4");
      expect(url).toContain("level=INTERMEDIATE");
    });
    expect(screen.queryByText("Ajustá los criterios y aplicalos cuando estés listo.")).not.toBeInTheDocument();
  });

  it("clears filters while preserving search and resetting page", async () => {
    renderSearch("/buscar?search=rcp&page=4&limit=10&rating=4.5&price=free");
    await screen.findByText("RCP Inicial");

    fireEvent.click(screen.getByRole("button", { name: /Todos los filtros/ }));
    fireEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));

    await waitFor(() => {
      const url = screen.getByLabelText("current-url").textContent ?? "";
      expect(url).toContain("search=rcp");
      expect(url).toContain("page=1");
      expect(url).not.toContain("rating=");
      expect(url).not.toContain("price=");
    });
  });

  it("preserves active filters while paginating", async () => {
    mocks.getCourses.mockResolvedValue({
      success: true,
      data: [course],
      meta: {
        page: 1,
        limit: 10,
        total: 20,
        totalPages: 2,
        availableSpecialties: ["CPR"],
      },
    });
    render(
      <MemoryRouter initialEntries={["/buscar?search=rcp&page=1&limit=10&rating=4"]}>
        <Routes>
          <Route path="/buscar" element={<><Search /><LocationProbe /></>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Siguiente" }));

    await waitFor(() => {
      const url = screen.getByLabelText("current-url").textContent ?? "";
      expect(url).toContain("page=2");
      expect(url).toContain("rating=4");
      expect(url).toContain("search=rcp");
    });
  });

  it("keeps a coherent empty state for filtered results", async () => {
    mocks.getCourses.mockResolvedValue({
      success: true,
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        availableSpecialties: [],
      },
    });
    render(
      <MemoryRouter initialEntries={["/buscar?price=paid"]}>
        <Routes><Route path="/buscar" element={<Search />} /></Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("No se encontraron cursos.")).toBeInTheDocument();
    expect(screen.getByText("0 cursos encontrados")).toBeInTheDocument();
  });
});
