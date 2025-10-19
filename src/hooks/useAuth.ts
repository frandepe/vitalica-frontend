import { useAuthStore } from "@/store/useAuthStore";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  return { user, setUser, logout };
}
