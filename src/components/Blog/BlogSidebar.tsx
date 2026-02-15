"use client";

import { motion } from "framer-motion";

const categories = [
  "Creación de Cursos",
  "Contenido y Comunicación",
  "Producción de Video",
  "Organización y Flujo de Trabajo",
  "Herramientas Digitales",
  "Estrategia Profesional",
  "Experiencia del Alumno",
];

const popularGuides = [
  "Cómo crear tu primer curso online paso a paso",
  "Cómo organizar el contenido de un curso antes de grabar",
  "Cómo filmarte para un curso con recursos básicos",
  "Errores comunes al grabar y editar videos educativos",
  "Cómo estructurar lecciones claras y fáciles de seguir",
];

interface BlogSidebarProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function BlogSidebar({
  activeCategory,
  onCategoryChange,
}: BlogSidebarProps) {
  return (
    <aside className="space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Elige tu tema
        </h2>
        <nav className="space-y-2">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onCategoryChange?.(category)}
              className={`block text-left w-full text-sm transition-colors hover:text-sky-600 ${
                activeCategory === category
                  ? "text-sky-600 font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </nav>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Las guías más populares
        </h2>
        <nav className="space-y-4">
          {popularGuides.map((guide, index) => (
            <motion.a
              key={guide}
              href="#"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              className="block text-sm font-medium text-foreground hover:text-sky-600 transition-colors leading-snug"
            >
              {guide}
            </motion.a>
          ))}
        </nav>
      </motion.div>
    </aside>
  );
}
