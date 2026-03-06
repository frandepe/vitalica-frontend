import { ICourse } from "@/types/course.types";

// Este componente ofrece errores o warnings con sus respectivos mensajes si al curso le falta contenido

export const getValidationIssues = (
  course?: ICourse | null,
  minimumFinalQuizQuestions: number = 5,
) => {
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
      message: "Falta asignar un título al curso (Paso 1)",
      field: "title",
    });
  }

  if (!course.description) {
    issues.push({
      type: "error",
      message: "Falta agregar una descripción (Paso 1)",
      field: "description",
    });
  }

  if (!course.specialty) {
    issues.push({
      type: "error",
      message: "Falta asignar una especialidad (Paso 1)",
      field: "specialty",
    });
  }

  if (course.price === null) {
    issues.push({
      type: "error",
      message: "Falta definir el precio del curso (Paso 3)",
      field: "price",
    });
  }

  if (
    course.requirementsAndMaterials === null ||
    course.requirementsAndMaterials === ""
  ) {
    issues.push({
      type: "warning",
      message: "Falta definir los requisitos y materiales del curso (Paso 3)",
      field: "requirementsAndMaterials",
    });
  }

  // Módulos
  if (!course.modules || course.modules.length === 0) {
    issues.push({
      type: "error",
      message: "El curso no tiene módulos (Paso 4)",
      field: "modules",
    });
  } else {
    course.modules.forEach((module, idx) => {
      if (!module) return; // proteccion adicional
      if (!module.title) {
        issues.push({
          type: "error",
          message: `El módulo ${idx + 1} no tiene título (Paso 4)`,
          field: `module-${module.id}`,
        });
      }
      if (!module.lessons || module.lessons.length === 0) {
        issues.push({
          type: "error",
          message: `El módulo "${module.title || idx + 1}" no tiene lecciones (Paso 4)`,
          field: `module-${module.id}`,
        });
      }
    });
  }

  // Quizzes
  if (!course.quizzes || course.quizzes.length < minimumFinalQuizQuestions) {
    issues.push({
      type: "error",
      message: `El examen final debe tener al menos ${minimumFinalQuizQuestions} preguntas (Paso 5)`,
      field: "quizzes",
    });
  }

  return issues;
};
