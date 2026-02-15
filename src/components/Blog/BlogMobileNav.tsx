import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface MobileNavProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function MobileBlogNav({
  activeCategory,
  onCategoryChange,
}: MobileNavProps) {
  return (
    <div className="lg:hidden">
      <Drawer>
        <DrawerTrigger asChild className="absolute top-6 left-6 z-50">
          <div>
            <Menu />
            <span className="sr-only">Abrir menú de navegación</span>
          </div>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh] flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Navegación</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Categorías */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Elige tu tema
                </h2>
                <nav className="space-y-2">
                  {categories.map((category, index) => (
                    <motion.button
                      key={category}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      onClick={() => onCategoryChange?.(category)}
                      className={`block text-left w-full text-sm py-2 transition-colors hover:text-sky-600 ${
                        activeCategory === category
                          ? "text-sky-600 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {category}
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Guías populares */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Las guías más populares
                </h2>
                <nav className="space-y-3">
                  {popularGuides.map((guide, index) => (
                    <motion.a
                      key={guide}
                      href="#"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.2 + index * 0.03 }}
                      className="block text-sm font-medium text-foreground hover:text-sky-600 transition-colors leading-snug py-1"
                    >
                      {guide}
                    </motion.a>
                  ))}
                </nav>
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
