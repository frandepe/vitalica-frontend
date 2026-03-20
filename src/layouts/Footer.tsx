import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  HeartPulse,
  Instagram,
  Linkedin,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/utils/cn";

interface FooterLink {
  title: string;
  href: string;
}

interface FooterLinkGroup {
  label: string;
  links: FooterLink[];
}

type FooterProps = ComponentProps<"footer">;

const footerLinkGroups: FooterLinkGroup[] = [
  {
    label: "Aprender",
    links: [
      { title: "Explorar cursos", href: "/buscar?search=&page=1&limit=10" },
      { title: "Primeros pasos", href: "/primeros-pasos" },
      { title: "Blog y guias", href: "/blogs" },
      { title: "Mis cursos", href: "/mis-cursos" },
    ],
  },
  {
    label: "Enseñar",
    links: [
      { title: "Enseña en Vitalica", href: "/dar-cursos" },
      {
        title: "Postularme como instructor",
        href: "/solicitar-ser-instructor",
      },
      { title: "Perfil profesional", href: "/perfil" },
      { title: "Panel de instructor", href: "/instructor" },
    ],
  },
  {
    label: "Vitalica",
    links: [
      { title: "Sobre nosotros", href: "/sobre-nosotros" },
      { title: "Contacto", href: "/contacto" },
      {
        title: "Politicas de privacidad",
        href: "/politicas-de-privacidad",
      },
      {
        title: "Terminos y condiciones",
        href: "/terminos-y-condiciones",
      },
    ],
  },
];

const trustPillars = [
  "Formacion orientada a emergencias medicas",
  "Instructores con perfil profesional",
  "Aprendizaje flexible y acompanado",
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/vitalica.academia/",
    icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/vitalica-academia",
    icon: Linkedin,
  },
  { label: "Email", href: "mailto:hola@vitalica.com", icon: Mail },
];

export function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      className={cn(
        "relative overflow-hidden border-t border-border/70 bg-[linear-gradient(180deg,#ffffff_0%,#f8fffd_100%)]",
        className,
      )}
      {...props}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-10 h-72 w-72 rounded-full bg-secondary/8 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <Reveal className="grid gap-10 border-b border-border/60 pb-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <HeartPulse className="h-3.5 w-3.5" />
              Formacion con criterio
            </div>

            <h2 className="mt-6 max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              Aprendizaje híbrido
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Vitalica conecta a alumnos e instructores en una experiencia de
              formacion clara, profesional y centrada en emergencias medicas.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <LinkCard
              href="/buscar?search=&page=1&limit=10"
              eyebrow="Para alumnos"
              title="Ver cursos"
              description="Encontra formacion teorica y practica para avanzar a tu ritmo."
            />
            <LinkCard
              href="/dar-cursos"
              eyebrow="Para instructores"
              title="Compartir experiencia"
              description="Presenta tu propuesta y construí tu espacio de enseñanza."
            />
          </div>
        </Reveal>

        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal className="space-y-8">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-3 text-foreground transition-opacity hover:opacity-90"
              >
                <img
                  src="/Logo/logoVitalica.png"
                  alt="Vitalica"
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            <div className="space-y-4">
              {trustPillars.map((pillar) => (
                <div
                  key={pillar}
                  className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{pillar}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
                  aria-label={item.label}
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal
            delay={0.08}
            className="grid gap-10 sm:grid-cols-3 sm:gap-8 lg:pl-8"
          >
            {footerLinkGroups.map((group) => (
              <div key={group.label}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
                  {group.label}
                </h3>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        to={link.href}
                        className="text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal
          delay={0.12}
          className="flex flex-col gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between"
        >
          <p>© 2026 Vitalica. Formacion online en emergencias medicas.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/politicas-de-privacidad"
              className="transition-colors hover:text-foreground"
            >
              Privacidad
            </Link>
            <Link
              to="/terminos-y-condiciones"
              className="transition-colors hover:text-foreground"
            >
              Terminos
            </Link>
            <Link
              to="/contacto"
              className="transition-colors hover:text-foreground"
            >
              Contacto
            </Link>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

interface LinkCardProps {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
}

function LinkCard({ href, eyebrow, title, description }: LinkCardProps) {
  return (
    <Link
      to={href}
      className="group rounded-lg border border-border/70 bg-background/85 p-5 shadow-[0_18px_50px_-32px_rgba(34,80,69,0.28)] transition-all hover:-translate-y-0.5 hover:border-primary/25"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </p>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

type RevealProps = {
  children?: ReactNode;
  className?: string;
  delay?: number;
};

function Reveal({ delay = 0, children, className }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
