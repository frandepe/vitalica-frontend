// import { useAuthStore } from "@/store/useAuthStore";
// import { useEffect } from "react";

// export default function GoogleLoginButton() {
//   const setUser = useAuthStore((state) => state.setUser);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     script.defer = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       /* @ts-ignore */
//       google.accounts.id.initialize({
//         client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
//         callback: async (response: any) => {
//           const res = await fetch("/api/auth/google", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ credential: response.credential }),
//           });

//           const data = await res.json();

//           if (data.success) {
//             localStorage.setItem("token", data.data.token);
//             setUser(data.data.user); // actualizamos el estado global
//           } else {
//             console.error("Error al loguear con Google", data.error);
//           }
//         },
//       });

//       /* @ts-ignore */
//       google.accounts.id.renderButton(
//         document.getElementById("googleLoginBtn"),
//         {
//           theme: "outline", // 'outline' o 'filled_blue'
//           size: "large", // 'small', 'medium', 'large'
//           shape: "rectangular", // 'rectangular' o 'pill'
//           text: "continue_with", // 'signin_with', 'signup_with', 'continue_with'
//         }
//       );
//     };
//   }, [setUser]);

//   return <div id="googleLoginBtn"></div>;
// }
import { googleLogin } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      /* @ts-ignore */
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            // 👇 Usamos la función centralizada
            const data = await googleLogin(response.credential);

            if (data.success) {
              localStorage.setItem("token", data.data.token);
              setUser(data.data.user);
              navigate("/");
            } else {
              console.error("Error al loguear con Google:", data.message);
            }
          } catch (err) {
            console.error("Error en Google Login:", err);
          }
        },
      });

      /* @ts-ignore */
      google.accounts.id.renderButton(
        document.getElementById("googleLoginBtn"),
        {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "continue_with",
        }
      );
    };
  }, [setUser]);

  return <div id="googleLoginBtn"></div>;
}
