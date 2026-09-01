// import {
//   updateProfile,
//   upsertInstructorProfile as upsertInstructorProfileApi,
// } from "@/api";
// import { User } from "@/types/auth.types";
// import { InstructorProfile } from "@/types/instructor.types";
// import { create } from "zustand";

// interface AuthState {
//   user: User | null;
//   instructor: InstructorProfile | null;

//   /**
//    * Indica si ya se hizo al menos un intento
//    * de hidratar el usuario desde la API (`getMe`).
//    */
//   isInitialized: boolean;

//   setUser: (user: User) => void;
//   setInstructor: (instructor: InstructorProfile | null) => void;
//   setInitialized: (value: boolean) => void;
//   logout: () => void;

//   updateUser: (data: Partial<User>) => Promise<void>;

//   // ⭐ NUEVO
//   upsertInstructorProfile: (data: Partial<InstructorProfile>) => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set, get) => ({
//   user: null,
//   instructor: null,
//   isInitialized: false,

//   setUser: (user) => set({ user }),

//   setInstructor: (instructor) => set({ instructor }),

//   setInitialized: (value) => set({ isInitialized: value }),

//   logout: () => {
//     localStorage.removeItem("token");
//     set({ user: null, instructor: null, isInitialized: true });
//   },

//   updateUser: async (data) => {
//     try {
//       const response = await updateProfile(data);
//       const updatedUser = response?.user || data;

//       // Actualiza el estado local con los nuevos datos
//       set({ user: { ...get().user, ...updatedUser } as User });
//     } catch (error) {
//       console.error("Error al actualizar el perfil:", error);
//       throw error;
//     }
//   },

//   upsertInstructorProfile: async (data) => {
//     try {
//       const response = await upsertInstructorProfileApi(data);
//       const updatedInstructor = response?.data || data;

//       set({
//         instructor: {
//           ...get().instructor,
//           ...updatedInstructor,
//         } as InstructorProfile,
//       });
//     } catch (error) {
//       console.error("Error al actualizar perfil de instructor:", error);
//       throw error;
//     }
//   },
// }));

import { create } from "zustand";
import {
  updateProfile,
  upsertInstructorProfile as upsertInstructorProfileApi,
} from "@/api";
import { getMe } from "@/api/authEndpoints";
import { getInstructorProfile } from "@/api";
import { User } from "@/types/auth.types";
import { InstructorProfile } from "@/types/instructor.types";

interface AuthState {
  user: User | null;
  instructor: InstructorProfile | null;
  isInitialized: boolean;

  setUser: (user: User | null) => void;
  setInstructor: (instructor: InstructorProfile | null) => void;
  setInitialized: (value: boolean) => void;

  hydrateAuth: () => Promise<void>;
  logout: () => void;

  updateUser: (data: Partial<User>) => Promise<void>;
  upsertInstructorProfile: (data: Partial<InstructorProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  instructor: null,
  isInitialized: false,

  setUser: (user: User | null) => set({ user }),
  setInstructor: (instructor: InstructorProfile | null) => set({ instructor }),
  setInitialized: (value: boolean) => set({ isInitialized: value }),

  // ⭐ ESTA ES LA CLAVE DE TODO
  hydrateAuth: async () => {
    set({ isInitialized: false });

    try {
      // traer usuario
      const res = await getMe();

      if (!res?.success || !res?.data) {
        localStorage.removeItem("token");
        set({ user: null, instructor: null });
        return;
      }

      set({ user: res.data });

      // traer instructor si existe
      try {
        const instructorRes = await getInstructorProfile();

        if (instructorRes?.success && instructorRes?.data) {
          set({ instructor: instructorRes.data });
        } else {
          set({ instructor: null });
        }
      } catch {
        set({ instructor: null });
      }
    } catch {
      localStorage.removeItem("token");
      set({ user: null, instructor: null });
    } finally {
      set({ isInitialized: true });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      instructor: null,
      isInitialized: true,
    });
  },

  updateUser: async (data: Partial<User>) => {
    try {
      const response = await updateProfile(data);
      const updatedUser = response?.user || data;

      set({
        user: { ...get().user, ...updatedUser } as User,
      });
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      throw error;
    }
  },

  upsertInstructorProfile: async (data: Partial<InstructorProfile>) => {
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
      console.error("Error al actualizar perfil instructor:", error);
      throw error;
    }
  },
}));
