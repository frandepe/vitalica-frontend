import { ToastProvider } from "@/components/ui/toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { getMe } from "@/api/authEndpoints";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getMe();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        localStorage.removeItem("token"); // token inválido o expirado
      }
    };

    fetchUser();
  }, [setUser]);

  return <ToastProvider>{children}</ToastProvider>;
}
