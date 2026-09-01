import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Avatar from "./Avatar";

const { updateAvatarProfile, processAvatarFile, setUser, showToast } = vi.hoisted(
  () => ({
    updateAvatarProfile: vi.fn(),
    processAvatarFile: vi.fn(),
    setUser: vi.fn(),
    showToast: vi.fn(),
  }),
);

vi.mock("@/api", () => ({ updateAvatarProfile }));
vi.mock("@/utils/avatar-processing", () => ({ processAvatarFile }));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-1", avatarUrl: "old" }, setUser }),
}));
vi.mock("../ui/toast", () => ({ useToast: () => ({ showToast }) }));

describe("Avatar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("converge inmediatamente a la URL realmente persistida", async () => {
    const persisted =
      "https://res.cloudinary.com/vitalica/image/upload/v2/new-avatar.jpg";
    processAvatarFile.mockResolvedValue("data:image/jpeg;base64,/9j/2Q==");
    updateAvatarProfile.mockResolvedValue({
      success: true,
      data: { avatarUrl: persisted, avatarUrlId: "new-id" },
    });

    render(<Avatar defaultImage="https://example.com/old.jpg" />);
    fireEvent.change(screen.getByLabelText("Upload profile picture"), {
      target: { files: [new File(["avatar"], "avatar.png", { type: "image/png" })] },
    });

    await waitFor(() => expect(updateAvatarProfile).toHaveBeenCalled());
    const image = screen.getByAltText("Profile image") as HTMLImageElement;
    expect(image.src).toContain("c_fill,g_auto,h_160,w_160/q_auto/f_auto/");
    expect(image.src).toContain("new-avatar.jpg");
    expect(setUser).toHaveBeenCalledWith(
      expect.objectContaining({ avatarUrl: persisted, avatarUrlId: "new-id" }),
    );
  });
});
