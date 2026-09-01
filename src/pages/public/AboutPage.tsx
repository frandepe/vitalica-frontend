import {
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Users,
  MapPinned,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";

const principles = [
  {
    title: "Formación híbrida de verdad",
    description:
      "La propuesta une lo mejor de dos mundos: la flexibilidad de estudiar online y la exigencia de validar habilidades en una instancia práctica presencial. No creemos en una formación que termine solo frente a una pantalla.",
    icon: GraduationCap,
  },
  {
    title: "Aprender para actuar",
    description:
      "En primeros auxilios y emergencias, aprender no es solo incorporar conceptos. Es ganar criterio, seguridad y capacidad de respuesta para intervenir mejor cuando una situación real lo exige.",
    icon: HeartPulse,
  },
  {
    title: "Instructores con respaldo",
    description:
      "Los cursos y las prácticas están atravesados por la participación de instructores con formación comprobable. Buscamos que la enseñanza sea clara, responsable y profesional.",
    icon: Stethoscope,
  },
  {
    title: "Una red que conecta conocimiento y práctica",
    description:
      "El proyecto busca construir una red confiable entre alumnos e instructores, donde la capacitación no quede aislada en teoría sino conectada con experiencias reales de validación y crecimiento.",
    icon: Users,
  },
];

const milestones = [
  "Vitalica nace con una convicción simple: la formación en primeros auxilios y emergencias debería ser más accesible, sin perder seriedad ni calidad.",
  "Por eso proponemos un recorrido híbrido, donde la teoría online permite avanzar con flexibilidad y la práctica presencial aporta validación, criterio y contacto con la realidad.",
  "La visión es construir un espacio donde aprender habilidades que pueden salvar vidas sea más claro, más confiable y más conectado con profesionales capacitados.",
];

const trustPillars = [
  "Formación enfocada en primeros auxilios y emergencias prehospitalarias",
  "Recorrido híbrido con teoría online y práctica presencial validada",
  "Instructores con credenciales y experiencia comprobable",
  "Certificación final basada en aprendizaje y validación real",
];

const learningFlow = [
  "Accedés al contenido teórico online y avanzás a tu ritmo.",
  "Completás el recorrido académico y aprobás la evaluación final.",
  "Desbloqueás la instancia práctica presencial dentro de la red de instructores.",
  "Elegís con quién realizar la práctica según disponibilidad y ubicación.",
  "El instructor valida tus habilidades y se completa el recorrido formativo.",
];

const AboutPage = () => {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f5fffc_0%,#ffffff_24%,#ffffff_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-7rem] top-14 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto container pb-24 pt-16 px-4 md:px-0">
        <header className="grid gap-12 border-b border-border/60 pb-16 pt-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Sobre Vitalica
            </div>

            <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
              Formación en primeros auxilios que combina aprendizaje online con
              validación práctica presencial.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              Vitalica es una plataforma educativa enfocada en primeros
              auxilios y emergencias prehospitalarias. La propuesta parte de una
              idea clara: facilitar el acceso a una formación seria y flexible,
              sin resignar la práctica, el respaldo profesional ni la
              validación de habilidades en contextos reales.
            </p>
          </div>

          <div className="rounded-lg border-l border-primary bg-background/85 p-6 shadow-[0_24px_80px_-40px_rgba(34,80,69,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              La base del producto
            </p>

            <div className="mt-5 space-y-4">
              {trustPillars.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="grid gap-14 py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Nuestra filosofía
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              La teoría sola no alcanza. La práctica sola tampoco.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              Creemos que la formación en emergencias necesita un recorrido más
              completo. La parte online permite estudiar con flexibilidad,
              ordenar conocimientos y ampliar el acceso. La parte presencial
              aporta algo igual de importante: validación, contacto con
              instructores y demostración real de habilidades. El valor está en
              la unión de ambas.
            </p>
          </section>

          <section className="space-y-8">
            {milestones.map((item, index) => (
              <article
                key={item}
                className="grid gap-4 border-t border-border/60 pt-6 sm:grid-cols-[4rem_minmax(0,1fr)]"
              >
                <div className="text-sm font-semibold tracking-[0.18em] text-primary">
                  0{index + 1}
                </div>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                  {item}
                </p>
              </article>
            ))}
          </section>
        </div>

        <section className="border-t border-border/60 py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                Cómo funciona
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Un recorrido pensado para aprender, rendir y validar habilidades
                de verdad.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
                El modelo está diseñado para que la experiencia del alumno no
                termine en el consumo de contenido. La formación se completa
                cuando el conocimiento teórico se articula con una práctica
                presencial supervisada.
              </p>
            </div>

            <div className="rounded-lg border-l border-primary bg-background/90 p-6 shadow-[0_20px_70px_-42px_rgba(34,80,69,0.35)]">
              <div className="space-y-5">
                {learningFlow.map((item, index) => (
                  <div
                    key={item}
                    className="grid gap-3 border-b border-border/50 pb-5 last:border-b-0 last:pb-0 sm:grid-cols-[2.75rem_minmax(0,1fr)]"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/8 text-sm font-semibold text-primary">
                      0{index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-7 text-muted-foreground sm:text-base">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 border-t border-border/60 py-16 md:grid-cols-2 xl:grid-cols-4">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className="rounded-lg border border-border/70 bg-background/90 p-7 shadow-[0_18px_60px_-38px_rgba(34,80,69,0.32)]"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-primary/15 bg-primary/8 text-primary">
                <principle.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                {principle.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                {principle.description}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-10 border-t border-border/60 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.82fr)] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Una experiencia conectada con la realidad
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              La práctica presencial no es un agregado: es una parte central
              del valor de la propuesta.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Después de completar y aprobar la formación teórica, el alumno
              accede a una red de instructores disponibles para realizar la
              instancia práctica. Eso permite conectar el aprendizaje digital
              con una validación más concreta, acompañada por profesionales con
              experiencia y credenciales verificadas.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-background/80 p-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/15 bg-primary/8 text-primary">
                  <MapPinned className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Red de instructores
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  El alumno puede elegir con quién realizar su práctica dentro
                  de la red disponible, según ubicación, perfil y
                  disponibilidad.
                </p>
              </div>

              <div className="rounded-lg border border-border/70 bg-background/80 p-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/15 bg-primary/8 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Validación final
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  El proceso se completa cuando la práctica es validada por el
                  instructor y el recorrido formativo alcanza su cierre con una
                  certificación integral.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border-l border-primary bg-background/90 p-6 shadow-[0_20px_70px_-42px_rgba(34,80,69,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Qué buscamos construir
            </p>

            <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
              <p>
                El proyecto no busca ser solo un catálogo de cursos. Busca ser
                un entorno de formación más serio, más claro y más útil para
                quienes quieren aprender habilidades que importan.
              </p>
              <p>
                También quiere abrir espacio para que instructores capacitados
                puedan enseñar, validar prácticas y formar parte de una red con
                alcance más amplio.
              </p>
              <p>
                La apuesta es simple: acercar educación de calidad en primeros
                auxilios y emergencias, con una lógica híbrida que una
                accesibilidad, exigencia y aplicación real.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-10 border-t border-border/60 pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.75fr)] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Explorar Vitalica
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Descubrí una forma de aprender que une flexibilidad, respaldo
              profesional y validación práctica.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Queremos que más personas puedan acceder a formación en primeros
              auxilios y emergencias sin depender de recorridos cerrados,
              desordenados o difíciles de sostener. La experiencia propone un
              camino más claro, más humano y mejor conectado con la práctica
              real.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
            <Link
              to="/buscar?search=&page=1&limit=10"
              className="group inline-flex items-center justify-between rounded-lg border border-border/70 bg-background/90 px-5 py-4 text-foreground shadow-[0_16px_48px_-36px_rgba(34,80,69,0.3)]"
            >
              <span>
                <span className="block text-sm font-semibold">
                  Explorar cursos
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Ver la oferta formativa disponible
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              to="/contacto"
              className="group inline-flex items-center justify-between rounded-lg border border-border/70 bg-background/90 px-5 py-4 text-foreground shadow-[0_16px_48px_-36px_rgba(34,80,69,0.3)]"
            >
              <span>
                <span className="block text-sm font-semibold">
                  Contactarnos
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Resolver dudas o recibir más información
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AboutPage;
