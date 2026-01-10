import { ICourse } from "@/types/course.types";

// Este componente ofrece errores o warnings con sus respectivos mensajes si al curso le falta contenido

export const getValidationIssues = (course?: ICourse | null) => {
  if (!course) return []; // si es null, no hay issues

  const issues: {
    type: "error" | "warning";
    message: string;
    field: string;
  }[] = [];

  // Critical issues
  if (!course.title) {
    issues.push({
      type: "error",
      message: "Falta asignar un título al curso",
      field: "title",
    });
  }

  if (!course.description) {
    issues.push({
      type: "error",
      message: "Falta agregar una descripción",
      field: "description",
    });
  }

  if (!course.specialty) {
    issues.push({
      type: "error",
      message: "Falta asignar una especialidad",
      field: "specialty",
    });
  }

  if (course.price === null) {
    issues.push({
      type: "error",
      message: "Falta definir el precio del curso",
      field: "price",
    });
  }

  // Módulos
  if (!course.modules || course.modules.length === 0) {
    issues.push({
      type: "error",
      message: "El curso no tiene módulos",
      field: "modules",
    });
  } else {
    course.modules.forEach((module, idx) => {
      if (!module) return; // proteccion adicional
      if (!module.title) {
        issues.push({
          type: "error",
          message: `El módulo ${idx + 1} no tiene título`,
          field: `module-${module.id}`,
        });
      }
      if (!module.lessons || module.lessons.length === 0) {
        issues.push({
          type: "error",
          message: `El módulo "${module.title || idx + 1}" no tiene lecciones`,
          field: `module-${module.id}`,
        });
      }
    });
  }

  // Quizzes
  if (!course.quizzes || course.quizzes.length <= 5) {
    issues.push({
      type: "error",
      message: "El examen final debe tener al menos 5 preguntas",
      field: "quizzes",
    });
  }

  return issues;
};
