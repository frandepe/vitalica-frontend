import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PublicLayout from "./public.layout";

vi.mock("./Navbar", () => ({ Navbar: () => <nav>Navbar</nav> }));
vi.mock("./Footer", () => ({ Footer: () => <footer>Footer</footer> }));
vi.mock("@/utils/scroll-top", () => ({ ScrollToTop: () => null }));

describe("PublicLayout", () => {
  it("uses the document flow for main content and footer", () => {
    render(
      <MemoryRouter>
        <PublicLayout />
      </MemoryRouter>,
    );

    const footer = screen.getByText("Footer");
    const root = footer.closest("div.min-h-screen");
    const main = root?.querySelector("main");

    expect(root).toHaveClass("flex", "min-h-screen", "flex-col");
    expect(main).toHaveClass("flex", "flex-1", "flex-col");
    expect(root).not.toHaveClass("h-screen", "overflow-hidden");
  });
});
