import { useAuthStore } from "@/store/useAuthStore";
import { EMPTY_USER } from "@/types/auth.types";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const instructor = useAuthStore((state) => state.instructor);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setUser = useAuthStore((state) => state.setUser);
  const setInstructor = useAuthStore((state) => state.setInstructor);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const upsertInstructorProfile = useAuthStore(
    (state) => state.upsertInstructorProfile,
  );

  // Instructor
  const isInstructor = !!instructor;
  const hasMercadoPagoConnected = !!instructor?.mpCollectorId;

  // Devuelve un user “seguro” que nunca es null
  const safeUser = user ?? EMPTY_USER;
  const isActive = safeUser.isActive;

  return {
    user: safeUser,
    instructor,
    isInstructor,
    hasMercadoPagoConnected,
    isActive,
    isInitialized,
    setUser,
    setInstructor,
    logout,
    updateUser,
    upsertInstructorProfile,
  };
}
