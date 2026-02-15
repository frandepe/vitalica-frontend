import { ToastProvider } from "@/components/ui/toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { getMe } from "@/api/authEndpoints";
import { getInstructorProfile } from "@/api";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const setInstructor = useAuthStore((state) => state.setInstructor);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        // 1️⃣ Traer usuario
        const res = await getMe();

        if (!res.success || !res.data) {
          localStorage.removeItem("token");
          return;
        }

        setUser(res.data);

        // 2️⃣ Intentar traer instructor (puede no existir y está bien)
        try {
          const instructorRes = await getInstructorProfile();

          if (instructorRes.success && instructorRes.data) {
            setInstructor(instructorRes.data);
          } else {
            setInstructor(null);
          }
        } catch {
          // si no es instructor o da 404 → normal
          setInstructor(null);
        }
      } catch {
        localStorage.removeItem("token");
      } finally {
        setInitialized(true);
      }
    };

    hydrateAuth();
  }, [setUser, setInstructor, setInitialized]);

  return <ToastProvider>{children}</ToastProvider>;
}
