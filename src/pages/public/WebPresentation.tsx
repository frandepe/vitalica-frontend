import SocialLinks from "@/components/Social";
import { Button } from "@/components/ui/button";
import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useState, type FormEvent } from "react";

const HERO_PLAYBACK_ID = "NiyLGkB02VE8vsS8ThtQz6k43Tj1fw5bLevF4JnrfuAA";
const MODEL_PLAYBACK_ID = "ibXEkY8ztpH83BAXtZtTPZfpKatXZ9JlMoOFCi7VBko";

const modelSteps = [
  "Accedés al contenido teórico online, a tu ritmo",
  "Completás evaluaciones para validar conocimientos",
  "Desbloqueás la instancia práctica",
  "Elegís con qué instructor certificado entrenar",
  "Obtenés una certificación completa, teórica y práctica",
];

export function WebPresentation() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const isSubmitting = status === "loading";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

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
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7fbfa] text-[#10201f]">
      <SocialLinks
        floatingButtonColor="bg-[#123c38]"
        links={[
          {
            platform: "whatsapp",
            href: "https://wa.me/?text=Te%20comparto%20Vitalica,%20plataforma%20de%20formaci%C3%B3n%20en%20primeros%20auxilios:%20https://vitalica.com.ar",
          },
          {
            platform: "linkedin",
            href: "https://www.linkedin.com/sharing/share-offsite/?url=https://vitalica.com.ar",
          },
          {
            platform: "facebook",
            href: "https://www.facebook.com/sharer/sharer.php?u=https://vitalica.com.ar",
          },
          {
            platform: "copy",
            href: "https://vitalica.com.ar",
          },
        ]}
      />

      <section className="relative isolate border-b border-[#dbe9e6] bg-[linear-gradient(135deg,#ffffff_0%,#f7fbfa_52%,#e8f5f1_100%)]">
        <div
          className={`mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-5 py-24 transition-all duration-700 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-10 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-lg border border-[#c9ddd8] bg-[#0d1e1c] shadow-[0_24px_70px_rgba(16,32,31,0.16)]">
              <MuxPlayer
                playbackId={HERO_PLAYBACK_ID}
                streamType="on-demand"
                // autoPlay="muted"
                thumbnailTime={7}
                loop
                playsInline
                accentColor="#20ab9f"
                primaryColor="#ffffff"
                secondaryColor="#10201f"
                metadataVideoTitle="Vitalica - lanzamiento"
                className="aspect-[4/5] w-full bg-[#0d1e1c] sm:aspect-video lg:aspect-[4/5]"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-md border border-[#94c8be] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#123c38]">
                Vitalica
              </span>
              <span className="text-sm font-medium text-[#51706b]">
                Lanzamiento 09 / 10 / 2026
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.04] tracking-normal text-[#10201f] sm:text-5xl lg:text-6xl">
              Formación teórica y práctica en emergencias prehospitalarias.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#37524e] sm:text-xl">
              Aprendés online y validás en la práctica con instructores reales.
              Vitalica conecta la formación digital con una red de profesionales
              en todo el país.
            </p>

            <div className="mt-8 grid gap-3 text-sm font-medium text-[#294743] sm:grid-cols-3">
              <p className="border-l-2 border-[#20ab9f] pl-3">
                Sistema híbrido de formación
              </p>
              <p className="border-l-2 border-[#20ab9f] pl-3">
                Red nacional de instructores
              </p>
              <p className="border-l-2 border-[#20ab9f] pl-3">
                Emergencias y primeros auxilios
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-10 max-w-3xl border-t border-[#cfe1dd] pt-8"
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-8">
                <div className="max-w-xl">
                  <span className="inline-flex rounded-full border border-[#b8d8d1] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#123c38]">
                    Convocatoria inicial
                  </span>
                  <h2 className="mt-4 text-2xl font-semibold leading-tight text-[#10201f] sm:text-3xl">
                    Convertite en uno de los instructores fundadores de
                    Vitalica
                  </h2>
                  <p className="mt-4 text-base leading-7 text-[#47625d] sm:text-[1.05rem]">
                    Los primeros en sumarse acceden a condiciones
                    preferenciales, mayor visibilidad dentro de la plataforma y
                    un lugar clave en la etapa inicial del proyecto.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#5f7873]">
                    Queremos construir esta red junto a quienes decidan formar
                    parte desde el comienzo.
                  </p>
                </div>

                <div className="grid gap-4">
                  {status === "success" ? (
                    <div className="border-l-2 border-[#20ab9f] bg-white/75 px-5 py-5 backdrop-blur-sm">
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0d6b61]">
                        Postulación recibida
                      </p>
                      <p className="mt-3 text-base leading-7 text-[#24423f]">
                        Gracias por postularte. Te vamos a contactar antes del
                        lanzamiento para compartir los próximos pasos y contarte
                        cómo formar parte de la etapa inicial de Vitalica.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="grid gap-2 text-sm font-medium text-[#1f3a37]">
                          Nombre
                          <input
                            type="text"
                            name="firstName"
                            autoComplete="given-name"
                            required
                            disabled={isSubmitting}
                            placeholder="Tu nombre"
                            className="h-12 min-w-0 border border-[#b9d1cc] bg-white/92 px-4 text-sm text-[#10201f] outline-none transition placeholder:text-[#7b918d] focus:border-[#20ab9f] focus:ring-2 focus:ring-[#20ab9f]/20 disabled:cursor-not-allowed disabled:opacity-70"
                          />
                        </label>

                        <label className="grid gap-2 text-sm font-medium text-[#1f3a37]">
                          Apellido
                          <input
                            type="text"
                            name="lastName"
                            autoComplete="family-name"
                            required
                            disabled={isSubmitting}
                            placeholder="Tu apellido"
                            className="h-12 min-w-0 border border-[#b9d1cc] bg-white/92 px-4 text-sm text-[#10201f] outline-none transition placeholder:text-[#7b918d] focus:border-[#20ab9f] focus:ring-2 focus:ring-[#20ab9f]/20 disabled:cursor-not-allowed disabled:opacity-70"
                          />
                        </label>
                      </div>

                      <label className="grid gap-2 text-sm font-medium text-[#1f3a37]">
                        Correo electrónico
                        <input
                          type="email"
                          name="email"
                          autoComplete="email"
                          required
                          disabled={isSubmitting}
                          placeholder="nombre@ejemplo.com"
                          className="h-12 min-w-0 border border-[#b9d1cc] bg-white/92 px-4 text-sm text-[#10201f] outline-none transition placeholder:text-[#7b918d] focus:border-[#20ab9f] focus:ring-2 focus:ring-[#20ab9f]/20 disabled:cursor-not-allowed disabled:opacity-70"
                        />
                      </label>

                      <input
                        type="hidden"
                        name="_subject"
                        value="Preinscripción instructor fundador - Vitalica"
                      />

                      <div className="grid gap-4 pt-1">
                        <div className="border-l-2 border-[#d0e4df] pl-4">
                          <p className="text-sm leading-6 text-[#5f7873]">
                            No es una newsletter general. Es una convocatoria
                            temprana para sumar a quienes quieran construir
                            Vitalica desde el inicio.
                          </p>
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          variant="default"
                          className="h-13 w-full bg-[#123c38] px-6 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(18,60,56,0.18)] hover:bg-[#0d302c] sm:w-auto sm:min-w-[320px] sm:self-start"
                        >
                          {isSubmitting
                            ? "Enviando..."
                            : "Postularme como instructor fundador"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {status === "error" && (
                <p className="mt-4 text-sm font-medium text-[#b42318]">
                  No pudimos enviar la postulación. Probá nuevamente o
                  comunicate por nuestras redes.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#10201f] text-white">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-10 lg:py-28">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#72d0ba]">
              Modelo Vitalica
            </span>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Cómo funciona Vitalica
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#c7d8d5]">
              Vitalica combina formación teórica online con validación práctica
              presencial. Un modelo simple, flexible y alineado con cómo ya se
              enseña en el mundo.
            </p>

            <ol className="mt-8 space-y-4">
              {modelSteps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#20ab9f] text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-base leading-7 text-[#edf7f5]">
                    {step}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-8 max-w-xl border-l-2 border-[#72d0ba] pl-4 text-lg font-semibold leading-7 text-white">
              No es solo aprender. Es saber actuar cuando realmente importa.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/15 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <MuxPlayer
              playbackId={MODEL_PLAYBACK_ID}
              streamType="on-demand"
              thumbnailTime={11}
              playsInline
              accentColor="#72d0ba"
              primaryColor="#ffffff"
              secondaryColor="#10201f"
              metadataVideoTitle="Cómo funciona Vitalica"
              className="aspect-video w-full bg-black"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
