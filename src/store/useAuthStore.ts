import { updateProfile } from "@/api";
import { User } from "@/types/auth.types";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },

  updateUser: async (data) => {
    try {
      const response = await updateProfile(data);
      const updatedUser = response?.user || data;

      // Actualiza el estado local con los nuevos datos
      set({ user: { ...get().user, ...updatedUser } as User });
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      throw error;
    }
  },
}));
