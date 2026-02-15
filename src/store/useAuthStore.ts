import {
  updateProfile,
  upsertInstructorProfile as upsertInstructorProfileApi,
} from "@/api";
import { User } from "@/types/auth.types";
import { InstructorProfile } from "@/types/instructor.types";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  instructor: InstructorProfile | null;

  /**
   * Indica si ya se hizo al menos un intento
   * de hidratar el usuario desde la API (`getMe`).
   */
  isInitialized: boolean;

  setUser: (user: User) => void;
  setInstructor: (instructor: InstructorProfile | null) => void;
  setInitialized: (value: boolean) => void;
  logout: () => void;

  updateUser: (data: Partial<User>) => Promise<void>;

  // ⭐ NUEVO
  upsertInstructorProfile: (data: Partial<InstructorProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  instructor: null,
  isInitialized: false,

  setUser: (user) => set({ user }),

  setInstructor: (instructor) => set({ instructor }),

  setInitialized: (value) => set({ isInitialized: value }),

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, instructor: null, isInitialized: true });
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

  upsertInstructorProfile: async (data) => {
    try {
      const response = await upsertInstructorProfileApi(data);
      const updatedInstructor = response?.data || data;

      set({
        instructor: {
          ...get().instructor,
          ...updatedInstructor,
        } as InstructorProfile,
      });
    } catch (error) {
      console.error("Error al actualizar perfil de instructor:", error);
      throw error;
    }
  },
}));
