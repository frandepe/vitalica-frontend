import { useAuthStore } from "@/store/useAuthStore";
import { EMPTY_USER } from "@/types/auth.types";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  // Devuelve un user “seguro” que nunca es null
  const safeUser = user ?? EMPTY_USER;
  const isActive = safeUser.isActive;

  return { user: safeUser, isActive, setUser, logout, updateUser };
}
