import { FAQ } from "@/components/Accordion/FAQ";

const betaFaqs = [
  {
    question: "¿Puedo probar Vitalica como alumno?",
    answer:
      "Sí. Podés registrarte, explorar los cursos de prueba y recorrer la experiencia disponible para alumnos.",
  },
  {
    question: "¿Puedo probar Vitalica como instructor?",
    answer:
      "Sí. Durante la Beta podés solicitar el rol de instructor (aún si no lo sos) y probar las herramientas destinadas a la creación y gestión de cursos.",
  },
  {
    question:
      "¿Tengo que enviar información real para solicitar ser instructor?",
    answer:
      "No. Durante esta etapa estamos probando el funcionamiento de la plataforma, por lo que podés utilizar información ficticia para completar la solicitud.",
  },
  {
    question: "¿Puedo subir mi curso real?",
    answer:
      "No. Durante la Beta no queremos que los instructores suban contenido real, comercial o material que quieran conservar. Para probar las herramientas pueden utilizar textos, imágenes, documentos o videos ficticios o de prueba.",
  },
  {
    question: "¿Qué pasa con lo que cree durante la Beta?",
    answer:
      "Los datos, cursos, progresos, solicitudes y demás contenido generado durante esta etapa pueden modificarse o eliminarse antes del lanzamiento oficial. No debe considerarse información permanente.",
  },
  {
    question: "¿Encontré un error, cómo puedo informarlo?",
    answer: (
      <>
        Podés informar errores, algo que no se entiende o sugerencias desde la{" "}
        <a
          href="/feedback/beta"
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          onClick={(event) => event.stopPropagation()}
        >
          página de comentarios de la Beta
        </a>
        .
      </>
    ),
  },
  {
    question:
      "¿Algo funciona, pero no entiendo cómo usarlo? ¿También debería informarlo?",
    answer:
      "Sí. Queremos detectar no solamente errores técnicos sino también partes que resulten confusas. Si una función no se entiende sin explicación, esa devolución es especialmente útil.",
  },
  {
    question: "¿Cuándo se lanza oficialmente Vitalica?",
    answer:
      "El lanzamiento oficial está previsto para octubre. Septiembre corresponde a la etapa de Beta pública.",
  },
];

export function BetaFAQ() {
  return <FAQ faqs={betaFaqs} />;
}
