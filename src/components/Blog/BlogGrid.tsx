import { motion } from "framer-motion";
import { BlogCard } from "./BlogCard";
const blogPosts = [
  {
    image: "/Blogs/como-filmarte.png",
    category: "Guías para Creadores",
    categoryColor: "blue" as const,
    title: "Cómo filmarte para tu primer curso (sin equipo profesional)",
    excerpt:
      "Qué cámara usar, cómo encuadrarte, luz básica y errores comunes para grabarte bien desde el primer día.",
  },
  {
    image: "/Blogs/tu-primer-curso.png",
    category: "Guías para Creadores",
    categoryColor: "orange" as const,
    title: "Cómo crear tu primer curso online paso a paso",
    excerpt:
      "Desde la idea inicial hasta la publicación: estructura, contenidos y decisiones clave para no frustrarte.",
  },
  {
    image: "/Blogs/ideas.png",
    category: "Ideas de Contenido",
    categoryColor: "blue" as const,
    title: "Ideas de cursos para empezar a crear contenido",
    excerpt:
      "Criterios y ejemplos para definir qué tipo de curso crear según tu experiencia y objetivos.",
  },
  {
    image: "/Blogs/edicion.png",
    category: "Guías para Creadores",
    categoryColor: "orange" as const,
    title: "Cómo editar tus videos de forma simple y profesional",
    excerpt:
      "Herramientas recomendadas, cortes básicos y tips para que tus videos se vean prolijos sin saber edición.",
  },
  {
    image: "/Blogs/organizacion.png",
    category: "Inspiración",
    categoryColor: "blue" as const,
    title: "De idea a curso publicado: cómo avanzar sin trabarte",
    excerpt:
      "Cómo organizarte, mantener constancia y evitar el perfeccionismo que frena a la mayoría.",
  },
  {
    image: "/Blogs/errores-comunes.png",
    category: "Guías Prácticas",
    categoryColor: "orange" as const,
    title: "Errores comunes al crear un curso (y cómo evitarlos)",
    excerpt:
      "Los fallos más frecuentes al empezar y qué hacer para no perder tiempo ni motivación.",
  },
];

export function BlogGrid() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
          Guías prácticas para profesionales y futuros profesionales
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-1"
      >
        <h2 className="text-lg font-semibold text-foreground">
          De la teoría a la práctica
        </h2>
        <p className="text-muted-foreground">
          Recursos pensados para quienes están empezando y para quienes quieren
          profesionalizar y escalar su trabajo.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {blogPosts.map((post) => (
          <BlogCard key={post.title} {...post} />
        ))}
      </div>
    </div>
  );
}
