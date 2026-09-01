import { useEffect, type ReactNode } from "react";
import {
  BookOpenCheck,
  GraduationCap,
  Handshake,
  UsersRound,
} from "lucide-react";

import { FAQ } from "@/components/Accordion/FAQ";

const SEO_TITLE = "Preguntas frecuentes | Vitalica";
const SEO_DESCRIPTION =
  "Respuestas sobre cursos online, prácticas presenciales, certificados, comisiones y participación de instructores en Vitalica.";

const studentFaqs: Array<{
  question: string;
  answer: ReactNode;
  meta?: string;
}> = [
  {
    question: "¿Los cursos son completamente online?",
    answer:
      "La formación teórica se realiza online. Dependiendo del curso, podés complementar lo aprendido con una práctica presencial junto a un instructor.",
    meta: "Cursos",
  },
  {
    question: "¿Cómo funcionan las prácticas presenciales?",
    answer:
      "Una vez realizada la formación teórica, podés buscar y solicitar una práctica presencial relacionada. La práctica se coordina con un instructor disponible y tiene sus propias condiciones y precio.",
    meta: "Prácticas",
  },
  {
    question:
      "¿La práctica tiene que ser con el mismo instructor que dictó la teoría?",
    answer:
      "No. Podés realizar la teoría con un instructor de cualquier parte del país y luego elegir otro instructor para la práctica presencial, por ejemplo, uno que se encuentre más cerca de tu localidad.",
    meta: "Instructores",
  },
  {
    question: "¿La práctica presencial está incluida en el precio del curso?",
    answer:
      "No. La formación teórica y la práctica presencial son instancias independientes y tienen precios diferentes. Cada instructor define el precio de los cursos y de las prácticas que ofrece.",
    meta: "Precios",
  },
  {
    question:
      "¿Puedo realizar una práctica sin haber completado antes un curso teórico?",
    answer:
      "No. Para acceder a una práctica presencial primero tenés que completar un curso teórico relacionado. Una vez finalizada la formación teórica, se habilitará la posibilidad de solicitar una práctica correspondiente a ese curso con los instructores disponibles.",
    meta: "Prácticas",
  },
  {
    question: "¿Recibo un certificado al terminar un curso?",
    answer:
      "Sí. El certificado teórico queda disponible cuando completás la cursada teórica y aprobás el examen final del curso. Si el curso tiene práctica presencial, esa instancia funciona por separado y puede emitir su propio certificado cuando la práctica queda completada.",
    meta: "Certificado",
  },
];

const instructorFaqs: Array<{
  question: string;
  answer: ReactNode;
  meta?: string;
}> = [
  {
    question: "¿Cuánto gano por cada curso? ¿Tengo que pagar para publicar?",
    answer:
      "Publicar un curso no tiene un costo inicial. Por cada venta, el instructor recibe el 80% y Vitalica el 20%. Los instructores fundadores cuentan con una condición especial: reciben el 90% y Vitalica el 10%.",
    meta: "Comisiones",
  },
  {
    question: "¿Quién define el precio de mi curso?",
    answer:
      "El instructor define el precio de los cursos que publica en Vitalica.",
    meta: "Precios",
  },
  {
    question:
      "¿Puedo agregar nuevas credenciales o especialidades después de ser aprobado?",
    answer:
      "Sí. Una vez aprobado como instructor, podés presentar nuevas credenciales y solicitar nuevas especialidades desde tu panel. Las nuevas solicitudes serán revisadas antes de incorporarse a tu perfil.",
    meta: "Perfil",
  },
  {
    question:
      "¿Tengo que encargarme de las prácticas de los alumnos que hicieron mi curso?",
    answer:
      "No necesariamente. La formación teórica y la práctica presencial funcionan de manera independiente. Si un alumno que realizó tu curso te elige también para hacer la práctica y vos la ofrecés, puede realizar ambas instancias con vos. También puede elegir otro instructor para realizar la práctica.",
    meta: "Prácticas",
  },
  {
    question:
      "¿Me pueden contactar para realizar prácticas aunque no haya publicado un curso teórico?",
    answer:
      "Sí. No necesitás tener un curso teórico publicado para ofrecer prácticas presenciales. Si tus especialidades están habilitadas y ofrecés prácticas, los alumnos pueden encontrarte y solicitar una práctica con vos.",
    meta: "Prácticas",
  },
];

function usePageSeo() {
  useEffect(() => {
    const previousTitle = document.title;

    const ensureMeta = (
      selector: string,
      attributes: Record<string, string>,
    ) => {
      let element = document.head.querySelector(selector) as
        | HTMLMetaElement
        | HTMLLinkElement
        | null;

      if (!element) {
        element = document.createElement(
          selector.startsWith("link") ? "link" : "meta",
        ) as HTMLMetaElement | HTMLLinkElement;
        document.head.appendChild(element);
      }

      Object.entries(attributes).forEach(([key, value]) => {
        element?.setAttribute(key, value);
      });

      return element;
    };

    document.title = SEO_TITLE;

    const metaDescription = ensureMeta('meta[name="description"]', {
      name: "description",
      content: SEO_DESCRIPTION,
    });
    const ogTitle = ensureMeta('meta[property="og:title"]', {
      property: "og:title",
      content: SEO_TITLE,
    });
    const ogDescription = ensureMeta('meta[property="og:description"]', {
      property: "og:description",
      content: SEO_DESCRIPTION,
    });
    const canonical = ensureMeta('link[rel="canonical"]', {
      rel: "canonical",
      href: `${window.location.origin}/preguntas-frecuentes`,
    });

    return () => {
      document.title = previousTitle;
      metaDescription?.setAttribute("content", "");
      ogTitle?.setAttribute("content", "");
      ogDescription?.setAttribute("content", "");
      canonical?.setAttribute("href", window.location.origin);
    };
  }, []);
}

const FrequentlyAskedQuestionsPage = () => {
  usePageSeo();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f5fffc_0%,#ffffff_24%,#ffffff_100%)]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-7rem] top-14 h-72 w-72 rounded-full bg-secondary/8 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto container px-4 pb-24 pt-16 md:px-0">
        <header className="border-b border-border/60 pb-12 pt-12">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <BookOpenCheck className="h-3.5 w-3.5" />
              Ayuda y confianza
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
              Preguntas frecuentes
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              Respuestas claras sobre cursos, prácticas presenciales,
              certificados y participación de instructores en Vitalica.
            </p>
          </div>
        </header>

        <section className="grid gap-6 border-b border-border/60 py-10 lg:grid-cols-3">
          <ContextItem
            icon={<GraduationCap className="h-5 w-5" />}
            title="Teoría online"
            description="La etapa teórica se cursa desde la plataforma y marca el avance académico del alumno."
          />
          <ContextItem
            icon={<Handshake className="h-5 w-5" />}
            title="Práctica presencial"
            description="Cuando corresponde, se coordina aparte con un instructor disponible y condiciones propias."
          />
          <ContextItem
            icon={<UsersRound className="h-5 w-5" />}
            title="Instructores independientes"
            description="El instructor de la teoría y el de la práctica pueden ser personas distintas."
          />
        </section>

        <div className="grid gap-14 py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
          <FaqGroup
            eyebrow="Para alumnos"
            title="Cursos, prácticas y certificados"
            description="Dudas frecuentes sobre cómo avanzar desde la formación teórica hasta una instancia presencial cuando el curso la contempla."
            idPrefix="student-faq"
            faqs={studentFaqs}
          />

          <FaqGroup
            eyebrow="Para instructores"
            title="Publicación, comisiones y prácticas"
            description="Información para quienes enseñan o quieren ofrecer instancias prácticas dentro de Vitalica."
            idPrefix="instructor-faq"
            faqs={instructorFaqs}
          />
        </div>
      </div>
    </section>
  );
};

interface ContextItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function ContextItem({ icon, title, description }: ContextItemProps) {
  return (
    <article className="grid gap-4 border-l border-primary bg-background/90 p-5 shadow-[0_18px_60px_-42px_rgba(34,80,69,0.32)] sm:grid-cols-[2.75rem_minmax(0,1fr)]">
      <div className="flex h-11 w-11 items-center justify-center border border-primary/15 bg-primary/8 text-primary">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </article>
  );
}

interface FaqGroupProps {
  eyebrow: string;
  title: string;
  description: string;
  idPrefix: string;
  faqs: Array<{
    question: string;
    answer: ReactNode;
    meta?: string;
  }>;
}

function FaqGroup({
  eyebrow,
  title,
  description,
  idPrefix,
  faqs,
}: FaqGroupProps) {
  return (
    <section className="min-w-0">
      <div className="mb-7 max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      <FAQ faqs={faqs} idPrefix={idPrefix} />
    </section>
  );
}

export default FrequentlyAskedQuestionsPage;
