export type BlogAudience = "ALUMNOS" | "INSTRUCTORES" | "COMUNIDAD";
export type BlogAudienceFilter = "TODOS" | BlogAudience;

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  audience: BlogAudience;
  topic: string;
  featured?: boolean;
}

export const blogs: BlogPost[] = [
  {
    id: "inst-001",
    slug: "como-grabarte-bien-primer-curso",
    title: "Cómo grabarte bien para el primer curso sin equipo profesional",
    excerpt:
      "Qué cámara usar, cómo encuadrarte y qué ajustes básicos aplicar para grabar clases claras y confiables desde el inicio.",
    image: "/Blogs/como-filmarte.png",
    audience: "INSTRUCTORES",
    topic: "Producción de Video",
    featured: true,
  },
  {
    id: "inst-002",
    slug: "audio-claro-luz-simple-setup-minimo",
    title:
      "Audio claro, luz simple: setup mínimo para grabar clases confiables",
    excerpt:
      "Una guía concreta para resolver sonido, iluminación y fondo sin convertir la grabación en un proyecto técnico innecesario.",
    image: "/Blogs/audio-claro.png",
    audience: "INSTRUCTORES",
    topic: "Producción de Video",
  },
  {
    id: "inst-003",
    slug: "como-estructurar-clase-clara-y-memorable",
    title: "Cómo estructurar una clase para que se entienda y se recuerde",
    excerpt:
      "Ordená objetivos, ejemplos y cierre para que cada lección tenga lógica pedagógica y sea fácil de seguir.",
    image: "/Blogs/tu-primer-curso.png",
    audience: "INSTRUCTORES",
    topic: "Creación de Cursos",
    featured: true,
  },
  {
    id: "inst-004",
    slug: "como-planificar-curso-antes-de-grabar",
    title: "Cómo planificar un curso antes de encender la cámara",
    excerpt:
      "Definí alcance, módulos y materiales antes de grabar para evitar retrabajo y mejorar la consistencia del curso.",
    image: "/Blogs/organizacion.png",
    audience: "INSTRUCTORES",
    topic: "Organización y Flujo de Trabajo",
  },
  {
    id: "inst-005",
    slug: "errores-comunes-al-crear-tu-primer-curso",
    title: "Errores comunes al crear el primer curso y cómo evitarlos",
    excerpt:
      "Los desvíos más frecuentes al empezar y cómo corregirlos a tiempo para no perder claridad ni ritmo de producción.",
    image: "/Blogs/errores-comunes.png",
    audience: "INSTRUCTORES",
    topic: "Guías Prácticas",
  },
  {
    id: "inst-006",
    slug: "herramientas-para-editar-video-sin-complicarte",
    title: "Qué herramientas usar para editar video sin complicarte de más",
    excerpt:
      "Un recorrido por flujos simples de edición para publicar clases prolijas con tiempos realistas de producción.",
    image: "/Blogs/edicion.png",
    audience: "INSTRUCTORES",
    topic: "Herramientas Digitales",
  },
  {
    id: "inst-007",
    slug: "transformar-experiencia-profesional-en-propuesta-formativa",
    title:
      "Cómo transformar experiencia profesional en una propuesta formativa clara",
    excerpt:
      "Convertí conocimiento experto en una secuencia didáctica útil para alumnos reales y contextos de práctica.",
    image: "/Blogs/propuesta.png",
    audience: "INSTRUCTORES",
    topic: "Estrategia Profesional",
  },
  {
    id: "inst-008",
    slug: "que-revisar-antes-de-publicar-un-curso",
    title: "Qué revisar antes de publicar un curso en Vitalica",
    excerpt:
      "Chequeá estructura, materiales, comunicación y consistencia antes de lanzar para sostener una experiencia profesional.",
    image: "/Blogs/tu-primer-curso.png",
    audience: "INSTRUCTORES",
    topic: "Publicación y Calidad",
  },
  {
    id: "alu-001",
    slug: "como-elegir-un-curso-segun-tu-etapa-profesional",
    title: "Cómo elegir un curso según la etapa profesional",
    excerpt:
      "Criterios para decidir qué formación te conviene según experiencia previa, objetivos concretos y tiempo disponible.",
    image: "/Blogs/ideas.png",
    audience: "ALUMNOS",
    topic: "Orientación Académica",
    featured: true,
  },
  {
    id: "alu-002",
    slug: "que-tener-en-cuenta-antes-de-inscribirte-online",
    title: "Qué tener en cuenta antes de inscribirte en una formación online",
    excerpt:
      "Revisá objetivos, modalidad, evaluación y soporte para elegir propuestas serias y alineadas con la necesidad real.",
    image: "/Blogs/tener-en-cuenta.png",
    audience: "ALUMNOS",
    topic: "Orientación Académica",
  },
  {
    id: "alu-003",
    slug: "como-estudiar-mejor-en-cursos-asincronicos",
    title: "Cómo estudiar mejor en cursos asincrónicos sin perder constancia",
    excerpt:
      "Métodos simples para sostener continuidad, registrar avances y evitar que el curso quede postergado.",
    image: "/Blogs/organizacion.png",
    audience: "ALUMNOS",
    topic: "Hábitos de Estudio",
    featured: true,
  },
  {
    id: "alu-004",
    slug: "como-organizar-tu-tiempo-para-completar-formacion",
    title: "Cómo organizar el tiempo para completar una formación profesional",
    excerpt:
      "Una estrategia realista para estudiar con agenda ocupada sin resignar comprensión ni continuidad.",
    image: "/Blogs/organizar-tiempo.png",
    audience: "ALUMNOS",
    topic: "Hábitos de Estudio",
  },
  {
    id: "alu-005",
    slug: "que-diferencia-a-un-curso-serio-de-uno-superficial",
    title: "Qué diferencia a un curso serio de uno superficial",
    excerpt:
      "Señales para detectar profundidad formativa, criterio profesional y diseño pedagógico antes de inscribirte.",
    image: "/Blogs/diferencia.png",
    audience: "ALUMNOS",
    topic: "Criterio de Selección",
  },
  {
    id: "alu-006",
    slug: "como-aprovechar-quizzes-materiales-y-clases",
    title:
      "Cómo aprovechar quizzes, materiales y clases grabadas para aprender mejor",
    excerpt:
      "Usá cada recurso de la plataforma con intención para pasar de consumir contenido a incorporar criterios aplicables.",
    image: "/Blogs/como-aprovechar.png",
    audience: "ALUMNOS",
    topic: "Experiencia del Alumno",
  },
  {
    id: "alu-007",
    slug: "cuando-elegir-formacion-teorica-practica-o-hibrida",
    title: "Cuándo elegir formación teórica, práctica o híbrida",
    excerpt:
      "Qué aporta cada enfoque y cómo identificar cuál tiene más sentido según la etapa y los objetivos.",
    image: "/Blogs/cuando-elegir.png",
    audience: "ALUMNOS",
    topic: "Orientación Académica",
  },
  {
    id: "alu-008",
    slug: "como-construir-continuidad-despues-de-un-curso",
    title:
      "Cómo construir continuidad de aprendizaje después de terminar un curso",
    excerpt:
      "Convertí el cierre de una cursada en un punto de apoyo para seguir profundizando con orden y criterio.",
    image: "/Blogs/edicion.png",
    audience: "ALUMNOS",
    topic: "Continuidad Profesional",
  },
  {
    id: "amb-001",
    slug: "que-hace-efectiva-una-experiencia-de-aprendizaje-online",
    title:
      "Qué hace que una experiencia de aprendizaje online sea realmente efectiva",
    excerpt:
      "Los elementos que sostienen comprensión, ritmo y confianza en una propuesta de formación digital bien resuelta.",
    image: "/Blogs/tu-primer-curso.png",
    audience: "COMUNIDAD",
    topic: "Calidad Formativa",
    featured: true,
  },
  {
    id: "amb-002",
    slug: "por-que-la-claridad-importa-mas-que-la-sobreproduccion",
    title: "Por qué la claridad importa más que la sobreproducción",
    excerpt:
      "Una buena experiencia formativa depende más de decisiones claras que de recursos vistosos o excesivos.",
    image: "/Blogs/claridad-importa.png",
    audience: "COMUNIDAD",
    topic: "Buenas Prácticas",
  },
  {
    id: "amb-003",
    slug: "como-generar-confianza-en-formacion-digital",
    title: "Cómo generar confianza en entornos de formación digital",
    excerpt:
      "Qué señales fortalecen la credibilidad institucional, la claridad de expectativas y la percepción de calidad.",
    image: "/Blogs/ideas.png",
    audience: "COMUNIDAD",
    topic: "Confianza Institucional",
  },
  {
    id: "amb-004",
    slug: "importancia-de-la-buena-secuencia-formativa",
    title:
      "La importancia de una buena secuencia entre teoría, práctica y evaluación",
    excerpt:
      "Cuando el recorrido está bien diseñado, enseñar y aprender se vuelve más ordenado, aplicable y sostenible.",
    image: "/Blogs/organizacion.png",
    audience: "COMUNIDAD",
    topic: "Diseño Pedagógico",
  },
  {
    id: "amb-005",
    slug: "buenas-practicas-para-ensenar-y-aprender-online",
    title: "Buenas prácticas para enseñar y aprender en plataformas digitales",
    excerpt:
      "Un marco simple para mejorar comunicación, seguimiento y uso de recursos en experiencias de formación online.",
    image: "/Blogs/errores-comunes.png",
    audience: "COMUNIDAD",
    topic: "Buenas Prácticas",
  },
];

export const featuredBlogs = blogs.filter((blog) => blog.featured);

export const getBlogsByAudience = (audience: BlogAudience) =>
  blogs.filter((blog) => blog.audience === audience);

export const getBlogsByAudienceFilter = (audience: BlogAudienceFilter) =>
  audience === "TODOS" ? blogs : getBlogsByAudience(audience);

export const getBlogBySlug = (slug: string) =>
  blogs.find((blog) => blog.slug === slug);
