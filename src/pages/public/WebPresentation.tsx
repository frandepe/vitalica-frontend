import SocialLinks from "@/components/Social";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

export function WebPresentation() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.target);

    try {
      const res = await fetch("https://formspree.io/f/xvgengnz", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error();

      setStatus("success");
      e.target.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#050a18] transition-colors duration-500">
      {/* Top-left orb */}
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
        <SocialLinks
          links={[
            { platform: "facebook", href: "https://facebook.com" },
            { platform: "instagram", href: "https://instagram.com" },
            { platform: "mail", href: "mailto:vitalicaofficial@gmail.com" },
          ]}
          floatingButtonColor="bg-slate-700"
        />
      </div>
      <div
        className={`absolute transition-all duration-1000 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
        style={{
          top: "-40%",
          left: "-20%",
          width: "80vw",
          height: "80vw",
          maxWidth: "800px",
          maxHeight: "800px",
        }}
      >
        <div className="w-full h-full rounded-full relative orb-light">
          <div className="beam-container beam-spin-8">
            <div className="beam-light" />
          </div>
        </div>
      </div>

      {/* Bottom-center orb */}
      <div
        className={`absolute transition-all duration-1000 ease-out delay-300 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{
          bottom: "-50%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "100vw",
          maxWidth: "1000px",
          maxHeight: "1000px",
        }}
      >
        <div className="w-full h-full rounded-full relative orb-light">
          <div className="beam-container beam-spin-10-reverse">
            <div className="beam-light" />
          </div>
        </div>
      </div>

      {/* Top-right orb */}
      <div
        className={`absolute transition-all duration-1000 ease-out delay-500 ${
          mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
        }`}
        style={{
          top: "-30%",
          right: "-25%",
          width: "70vw",
          height: "70vw",
          maxWidth: "700px",
          maxHeight: "700px",
        }}
      >
        <div className="w-full h-full rounded-full relative orb-light">
          <div className="beam-container beam-spin-6">
            <div className="beam-light" />
          </div>
        </div>
      </div>

      {/* Bottom-right orb */}
      <div
        className={`absolute transition-all duration-1000 ease-out delay-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{
          bottom: "-35%",
          right: "-15%",
          width: "75vw",
          height: "75vw",
          maxWidth: "750px",
          maxHeight: "750px",
        }}
      >
        <div className="w-full h-full rounded-full relative orb-light">
          <div className="beam-container beam-spin-7-reverse">
            <div className="beam-light" />
          </div>
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center text-primary dark:bg-black/40 backdrop-blur-md px-8 py-10 rounded-lg shadow-lg max-w-lg mx-4">
        <h1
          className={`text-4xl md:text-7xl font-extralight tracking-[0.2em] mb-4 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {"VITALICA".split("").map((char, i) => (
            <span
              key={i}
              className="inline-block transition-all duration-500"
              style={{ transitionDelay: `${800 + i * 50}ms` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <p
          className={`text-lg md:text-xl font-light tracking-widest text-primary dark:text-white/60 transition-all duration-1000 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "1500ms" }}
        >
          09 / 10 / 2026
        </p>

        <p className="mt-8 max-w-md mx-auto">
          Un espacio pensado para instructores de primeros auxilios que quieren
          compartir su conocimiento, crear cursos a medida y llegar a alumnos de
          todo el país.
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <p>Dejanos tu correo y te enviamos más información</p>
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              required
              placeholder="Tu correo electrónico"
              disabled={status === "loading"}
              className="px-4 py-2 w-64 rounded-md bg-white/80 border border-white/20 backdrop-blur outline-none text-sm"
            />

            <Button
              type="submit"
              disabled={status === "loading"}
              variant="default"
            >
              {status === "loading" ? "Enviando..." : "Enviar"}
            </Button>
          </div>

          {status === "success" && (
            <p className="text-sm text-green-500">
              ¡Gracias por contactarnos! Te vamos a escribir muy pronto ✔
            </p>
          )}

          {status === "error" && (
            <p className="text-sm text-red-500">
              Algo falló, comunicate a través de nuestras redes sociales.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
