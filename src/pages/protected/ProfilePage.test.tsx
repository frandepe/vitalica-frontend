import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProfilePage from "./ProfilePage";

const state = vi.hoisted(() => ({ role: "USER" as "USER" | "INSTRUCTOR" | "ADMIN" }));
const useAchievements = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { role: state.role, slug: "perfil-test", avatarUrl: null } }),
}));
vi.mock("@/hooks/useAchievements", () => ({ useAchievements }));
vi.mock("@/components/user/Avatar", () => ({ default: () => <div>Avatar</div> }));
vi.mock("@/components/user/ProfileBg", () => ({ default: () => <div>Profile bg</div> }));
vi.mock("@/components/Share/ShareProfile", () => ({ default: () => <div>Share</div> }));
vi.mock("@/components/notifications/NotificationConfig", () => ({ NotificationConfig: () => <div>Notifications</div> }));
vi.mock("@/components/user/Forms/BasicInformationForm", () => ({ BasicInformationForm: () => <div>Basic information</div> }));
vi.mock("@/components/user/FeaturesSectionWithCardGradient", () => ({ FeaturesSectionWithCardGradient: () => <div>Profile actions</div> }));
vi.mock("@/components/Banners/PromoteInstructor", () => ({ PromoteInstructor: () => <div>Promote instructor</div> }));
vi.mock("@/components/CardsAnimated/DemoCardsAnimatedGradient", () => ({ AnimatedGradientDemo: () => <div>Instructor dashboard</div> }));
vi.mock("@/components/Achievements/Achievements", () => ({ Achievements: () => <div>Tu recorrido en Vitalica</div> }));

describe("ProfilePage achievements integration", () => {
  afterEach(cleanup);
  beforeEach(() => {
    state.role = "USER";
    useAchievements.mockReturnValue({ data: null, isLoading: false, error: null, retry: vi.fn() });
  });

  it("reemplaza las cards antiguas por el recorrido USER", () => {
    render(<ProfilePage />);

    expect(screen.getByText("Tu recorrido en Vitalica")).toBeInTheDocument();
    expect(screen.getByText("Promote instructor")).toBeInTheDocument();
    expect(screen.queryByText("Último acceso")).not.toBeInTheDocument();
    expect(screen.queryByText("Cuenta creada")).not.toBeInTheDocument();
    expect(screen.queryByText("Última actualización")).not.toBeInTheDocument();
    expect(screen.queryByText("Actividad reciente")).not.toBeInTheDocument();
    expect(useAchievements).toHaveBeenCalledWith(true);
  });

  it("muestra el recorrido y acceso al panel para INSTRUCTOR", () => {
    state.role = "INSTRUCTOR";
    render(<ProfilePage />);
    expect(screen.getByText("Tu recorrido en Vitalica")).toBeInTheDocument();
    expect(screen.getByText("Instructor dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Promote instructor")).not.toBeInTheDocument();
  });

  it("no consulta ni muestra Hitos o promoción para ADMIN", () => {
    state.role = "ADMIN";
    render(<ProfilePage />);
    expect(useAchievements).toHaveBeenCalledWith(false);
    expect(screen.queryByText("Tu recorrido en Vitalica")).not.toBeInTheDocument();
    expect(screen.queryByText("Promote instructor")).not.toBeInTheDocument();
    expect(screen.queryByText("Instructor dashboard")).not.toBeInTheDocument();
    expect(screen.getByText("Basic information")).toBeInTheDocument();
  });
});
