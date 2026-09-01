export type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "ordered-list"; items: string[] };

export interface BlogContentSection {
  heading: string;
  blocks: BlogContentBlock[];
}

export interface BlogDetailContent {
  slug: string;
  sections: BlogContentSection[];
}

export const blogDetails: Record<string, BlogDetailContent> = {
  "audio-claro-luz-simple-setup-minimo": {
    "slug": "audio-claro-luz-simple-setup-minimo",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una clase con buen contenido puede volverse difícil de seguir si el audio cansa, la cara queda oscura o el fondo compite con la explicación. Antes de pensar en un estudio, conviene resolver lo mínimo que hace que una clase se sienta confiable."
          },
          {
            "type": "paragraph",
            "text": "El setup mínimo no busca impresionar. Busca que el alumno pueda concentrarse en aprender."
          }
        ]
      },
      {
        "heading": "El audio es la primera condicion de confianza",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El alumno puede tolerar una imagen simple. Lo que tolera mucho menos es un audio bajo, con eco o con ruido constante."
          },
          {
            "type": "paragraph",
            "text": "Si tiene que subir demasiado el volumen, adivinar palabras o escuchar un zumbido de fondo durante toda la clase, la atención se desgasta. No importa que la explicación sea buena. El esfuerzo extra se acumula."
          },
          {
            "type": "paragraph",
            "text": "La primera decisión es la distancia al micrófono. Cuánto más lejos estes, más entra la habitación: eco, calle, ventilador, teclado, sillas, notificaciones. No hace falta tener un micrófono caro, pero si estar cerca de la fuente de audio y grabar en un lugar razonablemente controlado."
          },
          {
            "type": "paragraph",
            "text": "Una prueba simple: grabá 20 segundos y escuchalos con auriculares. Si entendés sin esfuerzo y no hay un ruido fijo que moleste, estás cerca."
          }
        ]
      },
      {
        "heading": "Luz suficiente sin armar un estudio",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La luz tiene una función: que se vea la cara y lo que necesitás mostrar."
          },
          {
            "type": "paragraph",
            "text": "La solución más simple suele ser ubicarte frente a una ventana o en diagonal. Evitá que la fuente de luz principal quede detrás tuyo. Si pasa eso, la cámara intenta compensar el fondo y la cara queda oscura."
          },
          {
            "type": "paragraph",
            "text": "Si grabás de noche, usá una luz frontal suave. No hace falta que sea perfecta. Evitá luces muy bajas que generen sombras duras desde abajo o luces laterales demasiado fuertes que dejen media cara perdida."
          },
          {
            "type": "paragraph",
            "text": "La pregunta no es si la luz es linda. La pregunta es si ayuda a seguir la explicación."
          }
        ]
      },
      {
        "heading": "Fondo limpio, no fondo perfecto",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un fondo limpio no significa una pared vacía. Significa que nada del fondo pide más atención que la clase."
          },
          {
            "type": "paragraph",
            "text": "Antes de grabar, revisá el encuadre y sacá elementos que distraigan:"
          },
          {
            "type": "list",
            "items": [
              "pantallas encendidas",
              "objetos muy llamativos",
              "puertas abiertas",
              "movimiento detrás tuyo",
              "papeles o cables que ensucian la imagen."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si el fondo tiene relación con lo que enseñás, puede sumar. Si solo está ahí y distrae, conviene simplificar."
          },
          {
            "type": "paragraph",
            "text": "La regla es sencilla: el fondo debería acompañarte, no competir."
          }
        ]
      },
      {
        "heading": "Cómo probar el setup en cinco minutos",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Antes de grabar una clase completa, hacé una prueba corta con las mismas condiciones que vas a usar."
          },
          {
            "type": "paragraph",
            "text": "Checklist de prueba:"
          },
          {
            "type": "list",
            "items": [
              "grabá 20 o 30 segundos",
              "hablá al volumen normal de clase",
              "movete como te moverías durante la explicación",
              "mirá si la cara queda clara",
              "escuchá el audio con auriculares",
              "revisá si hay ruidos constantes",
              "mirá si algo del fondo distrae."
            ]
          },
          {
            "type": "paragraph",
            "text": "No revises la prueba como si fuera una pieza publicitaria. Revisala como alumno: puedo seguir esto durante varios minutos sin cansarme."
          }
        ]
      },
      {
        "heading": "Qué mejorar primero si algo sale mal",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Si la prueba no funciona, no corrijas todo a la vez. Ordena prioridades."
          },
          {
            "type": "paragraph",
            "text": "Primero audio. Si no se entiende, la clase no funciona."
          },
          {
            "type": "paragraph",
            "text": "Después luz. Si no se ve la cara o el recurso que estás mostrando, la imagen no acompaña."
          },
          {
            "type": "paragraph",
            "text": "Después fondo. Si distrae, simplificalo."
          },
          {
            "type": "paragraph",
            "text": "Después detalles menores. Una sombra leve, una pared común o una cámara no profesional rara vez bloquean el aprendizaje."
          }
        ]
      },
      {
        "heading": "Un setup mínimo que alcanza para empezar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un buen setup mínimo puede ser:"
          },
          {
            "type": "list",
            "items": [
              "celular o webcam estable",
              "luz frontal o lateral suave",
              "audio probado con auriculares",
              "fondo sin distracciones fuertes",
              "una prueba corta antes de grabar."
            ]
          },
          {
            "type": "paragraph",
            "text": "Con eso ya podés grabar clases confiables. Más adelante podrás mejorar equipo, edición o estética. Pero el primer objetivo es que el alumno no tenga que pelear con el video para entenderte."
          }
        ]
      }
    ]
  },
  "buenas-practicas-para-ensenar-y-aprender-online": {
    "slug": "buenas-practicas-para-ensenar-y-aprender-online",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La formación online funciona mejor cuando quien enseña y quien aprende entienden cómo usar el entorno con intención. No alcanza con subir contenido ni con mirar clases. La experiencia mejora cuando cada recurso, actividad y pausa tiene una función."
          },
          {
            "type": "paragraph",
            "text": "Estas buenas prácticas no son una lista de tips sueltos. Son criterios compartidos para que el recorrido tenga menos fricción y más aprendizaje."
          }
        ]
      },
      {
        "heading": "Acordar expectativas desde el inicio",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La primera buena práctica es evitar que cada persona adivine de que se trata la experiencia."
          },
          {
            "type": "paragraph",
            "text": "Para quien enseña, esto significa comunicar:"
          },
          {
            "type": "list",
            "items": [
              "qué se va a aprender",
              "para quién es la formación",
              "qué nivel supone",
              "cómo se avanza",
              "qué esfuerzo requiere",
              "qué se espera del alumno."
            ]
          },
          {
            "type": "paragraph",
            "text": "Para quien aprende, significa revisar esa información antes de empezar y ajustar expectativas. No todos los cursos tienen el mismo ritmo, soporte o nivel de práctica."
          },
          {
            "type": "paragraph",
            "text": "Cuándo las expectativas están claras, la energía se usa en aprender, no en descifrar el recorrido."
          }
        ]
      },
      {
        "heading": "Usar recursos con propósito",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una clase, un material, una actividad o un quiz deberian tener una función reconocible."
          },
          {
            "type": "paragraph",
            "text": "Para quien enseña, la pregunta es: para qué existe este recurso."
          },
          {
            "type": "paragraph",
            "text": "Puede servir para:"
          },
          {
            "type": "list",
            "items": [
              "introducir un tema",
              "mostrar un ejemplo",
              "guiar una práctica",
              "revisar comprensión",
              "ordenar un repaso",
              "cerrar una etapa."
            ]
          },
          {
            "type": "paragraph",
            "text": "Para quien aprende, la pregunta es distinta: cómo uso este recurso para avanzar."
          },
          {
            "type": "paragraph",
            "text": "Un material descargado y olvidado no ayuda. Un quiz hecho como trámite informa poco. Una clase vista sin pausa puede dar sensación de avance, pero no siempre aprendizaje."
          }
        ]
      },
      {
        "heading": "Cuidar el ritmo posible",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El ritmo online no depende solo de fechas. Depende de carga, claridad y continuidad."
          },
          {
            "type": "paragraph",
            "text": "Quien enseña puede cuidar el ritmo evitando clases innecesariamente largas, separando ideas importantes y marcando transiciones claras."
          },
          {
            "type": "paragraph",
            "text": "Quien aprende puede cuidar el ritmo reservando bloques reales, dejando notas de avance y retomando sin intentar compensar todo de golpe."
          },
          {
            "type": "paragraph",
            "text": "El objetivo no es ir rápido. Es sostener progreso."
          },
          {
            "type": "paragraph",
            "text": "Un recorrido que avanza demasiado lento pierde energía. Uno que exige demasiado de golpe aumenta abandono. El ritmo posible está entre esos extremos."
          }
        ]
      },
      {
        "heading": "Activar al alumno sin saturarlo",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Aprender online puede volverse pasívo si todo se reduce a mirar contenido."
          },
          {
            "type": "paragraph",
            "text": "Para evitarlo, quien enseña puede proponer acciones pequeñas:"
          },
          {
            "type": "list",
            "items": [
              "responder una pregunta",
              "comparar dos casos",
              "aplicar un criterio",
              "revisar un error",
              "completar una actividad breve."
            ]
          },
          {
            "type": "paragraph",
            "text": "Quien aprende puede activar su cursada haciendo algo con cada bloque importante:"
          },
          {
            "type": "list",
            "items": [
              "escribir una conclusión",
              "anotar una duda",
              "probar una idea",
              "explicar el concepto con sus palabras",
              "volver a una clase después de una evaluación."
            ]
          },
          {
            "type": "paragraph",
            "text": "La participación activa no tiene que ser enorme. Tiene que existir."
          }
        ]
      },
      {
        "heading": "Hacer visible el avance",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una dificultad de la formación online es que el avance puede sentirse difuso. Se miran clases, se completan pasos, pero no siempre queda claro qué cambió."
          },
          {
            "type": "paragraph",
            "text": "Quien enseña puede ayudar mostrando objetivos, cierres y criterios de evaluación."
          },
          {
            "type": "paragraph",
            "text": "Quien aprende puede registrar:"
          },
          {
            "type": "list",
            "items": [
              "qué entendió",
              "qué puede aplicar",
              "qué duda sigue",
              "qué necesita revisar",
              "cuál es el próximo paso."
            ]
          },
          {
            "type": "paragraph",
            "text": "Ver avance no es solo motivador. También permite corregir a tiempo."
          }
        ]
      },
      {
        "heading": "Revisar y ajustar durante el recorrido",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una experiencia online no debería depender de que todo salga perfecto desde el inicio."
          },
          {
            "type": "paragraph",
            "text": "Quien enseña puede revisar si las instrucciones generan dudas, si los materiales se usan, si la práctica llega en buen momento y si la evaluación mide lo trabajado."
          },
          {
            "type": "paragraph",
            "text": "Quien aprende puede revisar si su agenda es realista, si está estudiando con foco o solo acumulando clases, si necesita practicar más antes de seguir."
          },
          {
            "type": "paragraph",
            "text": "La mejora no siempre requiere cambios grandes. A veces una instrucción más clara, una pausa, una nota de avance o una actividad mejor ubicada cambia la experiencia."
          }
        ]
      },
      {
        "heading": "Elegir una práctica para mejorar ahora",
        "blocks": [
          {
            "type": "paragraph",
            "text": "No hace falta aplicar todas las buenas prácticas al mismo tiempo."
          },
          {
            "type": "paragraph",
            "text": "Si enseñás, elegí una:"
          },
          {
            "type": "list",
            "items": [
              "aclarar mejor expectativas",
              "revisar la función de un recurso",
              "mejorar una consigna",
              "agregar una práctica breve",
              "cerrar una clase con una acción concreta."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si aprendes, elegí una:"
          },
          {
            "type": "list",
            "items": [
              "reservar un bloque real",
              "tomar notas de avance",
              "revisar errores de un quiz",
              "usar un material con propósito",
              "definir el próximo paso después de una clase."
            ]
          },
          {
            "type": "paragraph",
            "text": "La formación online mejora cuando deja de ser una suma de contenidos y se convierte en una experiencia con intención."
          }
        ]
      }
    ]
  },
  "como-aprovechar-quizzes-materiales-y-clases": {
    "slug": "como-aprovechar-quizzes-materiales-y-clases",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Completar recursos no es lo mismo que aprender. Una clase vista, un material descargado o un quiz aprobado sirven poco si no los usás para entender mejor, practicar o detectar qué falta revisar."
          },
          {
            "type": "paragraph",
            "text": "La clave es darle una función a cada recurso. Si todo se usa igual, todo termina pareciendo tramite."
          }
        ]
      },
      {
        "heading": "Antes de la clase, prepara una pregunta guía",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Entrar a una clase sin foco hace que todo parezca importante. Una pregunta guía te ayuda a mirar con intención."
          },
          {
            "type": "paragraph",
            "text": "Puede ser simple:"
          },
          {
            "type": "list",
            "items": [
              "qué problema responde esta clase",
              "qué concepto necesito entender",
              "qué decisión debería poder tomar después",
              "qué parte puedo aplicar a mi caso."
            ]
          },
          {
            "type": "paragraph",
            "text": "No hace falta escribir un plan enorme. Una pregunta alcanza para orientar la atención."
          },
          {
            "type": "paragraph",
            "text": "Por ejemplo, antes de una clase sobre objetivos de aprendizaje, tu pregunta podría ser: \"cómo distingo un tema de un objetivo concreto\". Esa pregunta hace que escuches buscando criterio, no solo información."
          }
        ]
      },
      {
        "heading": "Durante la clase, toma notas que sirvan para volver",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Tomar nota no es copiar la clase. Es dejar rastros para poder volver al contenido con menos esfuerzo."
          },
          {
            "type": "paragraph",
            "text": "Una buena nota suele incluir:"
          },
          {
            "type": "list",
            "items": [
              "una idea central",
              "un ejemplo que la vuelve clara",
              "una duda",
              "una acción o aplicación posible."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si las notas son solo transcripción, después cuesta usarlas. Si son demasiado vagas, tampoco ayudan."
          },
          {
            "type": "paragraph",
            "text": "Una nota útil podría decir: \"No alcanza con decir 'módulo de Introducción'. El objetivo debería decir que podrá hacer el alumno. Revisar mis títulos de clases con esa diferencia.\""
          },
          {
            "type": "paragraph",
            "text": "Esa nota ya contiene una acción."
          }
        ]
      },
      {
        "heading": "Después de la clase, converti contenido en acción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El cierre de una clase es el mejor momento para fijar una decisión. No tiene que ser grande."
          },
          {
            "type": "paragraph",
            "text": "Podés hacer una de estas acciones:"
          },
          {
            "type": "list",
            "items": [
              "escribir un resumen de tres líneas",
              "responder la pregunta guía inicial",
              "anotar qué parte aplicarías primero",
              "marcar una duda para revisar",
              "hacer un ejercicio breve."
            ]
          },
          {
            "type": "paragraph",
            "text": "Lo importante es no pasar automáticamente a la siguiente clase si todavía no hiciste nada con la anterior."
          },
          {
            "type": "paragraph",
            "text": "Avanzar rápido puede sentirse bien. Aprender mejor suele requerir una pausa."
          }
        ]
      },
      {
        "heading": "Usá los quizzes como diagnóstico",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un quiz no debería ser solo una barrera para seguir. Puede mostrar qué entendiste, qué confundiste o qué tema necesita otra vuelta."
          },
          {
            "type": "paragraph",
            "text": "Cuando respondas un quiz, prestá atención a tres cosas:"
          },
          {
            "type": "list",
            "items": [
              "qué preguntas respondiste con seguridad",
              "dónde dudaste",
              "qué errores se repiten."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si te equivocas, no lo trates como cierre. Tratalo como información."
          },
          {
            "type": "paragraph",
            "text": "Volver a una clase después de un error es distinto a verla por primera vez. Ya sabés que estás buscando. Eso hace que el repaso sea más eficiente."
          }
        ]
      },
      {
        "heading": "Los materiales sirven si tienen uso definido",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Descargar un material no significa haberlo incorporado. Guardarlo en una carpeta tampoco."
          },
          {
            "type": "paragraph",
            "text": "Antes de acumular archivos, preguntate para qué sirve cada uno:"
          },
          {
            "type": "list",
            "items": [
              "anticipar una clase",
              "practicar un procedimiento",
              "repasar conceptos",
              "resolver una actividad",
              "usar como referencia después del curso."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si un material no tiene función clara, probablemente no lo uses. Si la tiene, conviene ubicarlo dentro de la forma de estudiar."
          },
          {
            "type": "paragraph",
            "text": "Por ejemplo, una plantilla puede servir después de ver la explicación, no antes. Una lectura puede funcionar mejor como preparación. Un checklist puede servir al final para revisar."
          }
        ]
      },
      {
        "heading": "No mires clases de corrido sin procesar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Mirar muchas clases seguidas puede servir para tener panorama, pero no siempre produce aprendizaje. Si el curso pide aplicar criterios, necesitás momentos de pausa."
          },
          {
            "type": "paragraph",
            "text": "Una regla práctica:"
          },
          {
            "type": "list",
            "items": [
              "si la clase introduce una idea, podés seguir",
              "si la clase cambia una decisión que deberías tomar, pausa",
              "si la clase propone una práctica, hacela antes de acumular más contenido."
            ]
          },
          {
            "type": "paragraph",
            "text": "No todas las clases pesan igual. Algunas se miran. Otras se trabajan."
          }
        ]
      },
      {
        "heading": "Un metodo simple para el próximo módulo",
        "blocks": [
          {
            "type": "paragraph",
            "text": "En el próximo módulo, proba este recorrido:"
          },
          {
            "type": "ordered-list",
            "items": [
              "escribí una pregunta guía",
              "mirá la clase tomando notas breves",
              "marcá una acción aplicable",
              "respondé el quiz revisando errores",
              "usá un material con una función definida."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si hacés eso, los recursos dejan de ser una lista de pendientes y empiezan a funcionar como partes de una misma experiencia de aprendizaje."
          }
        ]
      }
    ]
  },
  "como-construir-continuidad-despues-de-un-curso": {
    "slug": "como-construir-continuidad-despues-de-un-curso",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Terminar un curso no debería ser el último contacto con el tema. Es el momento de ordenar qué aprendiste, que todavía falta y qué paso concreto tiene sentido hacer después."
          },
          {
            "type": "paragraph",
            "text": "Si no hacés ese cierre, el aprendizaje puede quedar como una experiencia aislada. Interesante, pero desconectada de tu práctica."
          }
        ]
      },
      {
        "heading": "Revisá qué cambió después del curso",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Antes de buscar otro curso, revisá qué te dejá este."
          },
          {
            "type": "paragraph",
            "text": "No alcanza con preguntar si te gustó. Pregunta:"
          },
          {
            "type": "list",
            "items": [
              "qué entiendo mejor ahora",
              "qué puedo hacer que antes no podía",
              "qué decisiones tomo con más criterio",
              "qué dudas siguen abiertas",
              "qué parte todavía necesita práctica."
            ]
          },
          {
            "type": "paragraph",
            "text": "Está revisión separa sensación de avance de avance real. También evita saltar de curso en curso sin consolidar nada."
          },
          {
            "type": "paragraph",
            "text": "Un buen cierre puede ser una lista breve de tres columnas: aprendido, pendiente, próximo paso."
          }
        ]
      },
      {
        "heading": "No confundas terminar con dominar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Completar una cursada no significa dominar el tema. Significa que recorriste una propuesta y tenés una base para seguir."
          },
          {
            "type": "paragraph",
            "text": "Eso no le quita valor al curso. Lo ubica en su lugar."
          },
          {
            "type": "paragraph",
            "text": "Hay aprendizajes que necesitan repetición, práctica, casos distintos o tiempo para asentarse. Si esperas dominio inmediato, podés frustrarte. Si asumís que terminar ya equivale a saber, podés dejar de practicar demasiado pronto."
          },
          {
            "type": "paragraph",
            "text": "La continuidad empieza cuando aceptás que el cierre del curso abre otra etapa."
          }
        ]
      },
      {
        "heading": "Elegí una práctica de continuidad",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La mejor continuidad suele ser concreta y pequeña."
          },
          {
            "type": "paragraph",
            "text": "Algunas opciones:"
          },
          {
            "type": "list",
            "items": [
              "aplicar una idea en un caso real",
              "rehacer un ejercicio con otro ejemplo",
              "explicar el concepto a otra persona",
              "revisar los apuntes y convertirlos en checklist",
              "armar una mini práctica semanal",
              "volver a una clase clave después de unos días."
            ]
          },
          {
            "type": "paragraph",
            "text": "No necesitás hacer todo. De hecho, intentar hacer demasiadas cosas puede diluir el avance."
          },
          {
            "type": "paragraph",
            "text": "Elegir una práctica ayuda a transformar el cierre en acción."
          }
        ]
      },
      {
        "heading": "Profundiza con criterio, no por acumulación",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Hacer otro curso puede ser buena idea. Pero no siempre es el siguiente paso."
          },
          {
            "type": "paragraph",
            "text": "Antes de buscar más contenido, preguntate:"
          },
          {
            "type": "list",
            "items": [
              "necesito base adicional",
              "necesito practicar lo que ya vi",
              "necesito feedback",
              "necesito un enfoque más avanzado",
              "necesito aplicar en contexto real."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si todavía no aplicáste nada del curso anterior, tal vez otro curso no resuelva el problema. Puede darte más información, pero no necesariamente más aprendizaje."
          },
          {
            "type": "paragraph",
            "text": "Profundizar no es acumular. Es elegir qué falta para avanzar mejor."
          }
        ]
      },
      {
        "heading": "Conecta lo aprendido con un objetivo profesional",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La continuidad mejora cuando el aprendizaje se conecta con algo real."
          },
          {
            "type": "paragraph",
            "text": "Puede ser una tarea de trabajo, una decisión que tenés que tomar, una práctica que querés mejorar o una conversación profesional que ahora podés tener con más criterio."
          },
          {
            "type": "paragraph",
            "text": "Por ejemplo:"
          },
          {
            "type": "list",
            "items": [
              "si aprendiste a evaluar cursos, podés revisar una propuesta antes de inscribirte",
              "si aprendiste a estructurar clases, podés reescribir el objetivo de una clase propia",
              "si aprendiste a estudiar asincrónico, podés ajustar la rutina semanal."
            ]
          },
          {
            "type": "paragraph",
            "text": "La pregunta es: donde vive este aprendizaje fuera del curso."
          }
        ]
      },
      {
        "heading": "Definí el próximo paso medible",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un próximo paso medible no tiene que ser grande. Tiene que ser verificable."
          },
          {
            "type": "paragraph",
            "text": "Ejemplos:"
          },
          {
            "type": "list",
            "items": [
              "esta semana voy a revisar mis apuntes y marcar tres ideas aplicables",
              "voy a rehacer una actividad con un caso propio",
              "voy a reservar dos bloques para practicar",
              "voy a elegir si necesito profundizar o aplicar antes de otro curso",
              "voy a explicar el tema en una página."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si no podés comprobar si lo hiciste, probablemente el paso está demasiado vago."
          }
        ]
      },
      {
        "heading": "Una acción para los próximos siete días",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Para cerrar el curso con continuidad, elegí una acción para esta semana:"
          },
          {
            "type": "ordered-list",
            "items": [
              "revisá qué aprendiste",
              "marcá qué quedó pendiente",
              "elegí una práctica concreta",
              "definila con fecha",
              "después de hacerla, decidí si necesitás practicar más o profundizar."
            ]
          },
          {
            "type": "paragraph",
            "text": "El final de un curso es un buen momento para descansar. También es un buen momento para no perder el hilo."
          }
        ]
      }
    ]
  },
  "como-elegir-un-curso-segun-tu-etapa-profesional": {
    "slug": "como-elegir-un-curso-segun-tu-etapa-profesional",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un curso puede ser bueno y aun así no ser el curso que necesitás ahora. Elegir bien no depende solo del tema, depende de la etapa, el objetivo y el tiempo real que podés dedicarle."
          },
          {
            "type": "paragraph",
            "text": "La pregunta no es \"qué curso parece más interesante\". La pregunta es \"que formación me ayuda a dar el próximo paso sin saltearme piezas importantes\"."
          }
        ]
      },
      {
        "heading": "Primero identificá en qué etapa estás",
        "blocks": [
          {
            "type": "paragraph",
            "text": "No todas las personas buscan lo mismo cuando se forman. Algunas están explorando un área nueva. Otras quieren ordenar conocimientos que ya usan. Otras necesitan profundizar para tomar mejores decisiones profesionales."
          },
          {
            "type": "paragraph",
            "text": "Podés ubicarte, de forma simple, en una de estas etapas:"
          },
          {
            "type": "list",
            "items": [
              "exploración: querés entender si un tema es para vos",
              "base inicial: necesitás fundamentos para empezar con criterio",
              "aplicación: querés usar lo aprendido en casos concretos",
              "profundización: ya tenés experiencia y necesitás mejorar criterio",
              "actualizacion: querés revisar prácticas, enfoques o herramientas nuevas."
            ]
          },
          {
            "type": "paragraph",
            "text": "No es una escala de valor. No hay una etapa \"mejor\". Hay una etapa más honesta para elegir."
          }
        ]
      },
      {
        "heading": "Definí que querés lograr con el curso",
        "blocks": [
          {
            "type": "paragraph",
            "text": "\"Quiero aprender más\" es comprensible, pero no ayuda mucho a decidir."
          },
          {
            "type": "paragraph",
            "text": "Un objetivo útil tiene más forma:"
          },
          {
            "type": "list",
            "items": [
              "quiero entender los fundamentos para decidir si sigo",
              "quiero aplicar una técnica en mi trabajo",
              "quiero mejorar una práctica que ya hago",
              "quiero prepararme para asumir una tarea nueva",
              "quiero ordenar conocimiento disperso."
            ]
          },
          {
            "type": "paragraph",
            "text": "Ese objetivo cambia el tipo de curso que conviene. Si estás explorando, tal vez necesitás claridad y panorama. Si ya estás aplicando, probablemente necesites práctica, casos y criterios de corrección."
          }
        ]
      },
      {
        "heading": "Mirá el nivel, no solo el temario",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un temario atractivo puede esconder un desajuste. Si el curso usa conceptos que todavía no manejas, vas a dedicar energía a sobrevivir, no a aprender."
          },
          {
            "type": "paragraph",
            "text": "También pasa al revés. Si ya tenés base suficiente y elegís un curso demasiado introductorio, quizás te resulte prolijo pero poco transformador."
          },
          {
            "type": "paragraph",
            "text": "Antes de inscribirte, revisá:"
          },
          {
            "type": "list",
            "items": [
              "qué conocimientos previos supone",
              "si explica desde cero o parte de una base",
              "qué tipo de ejemplos usa",
              "qué resultado promete al final",
              "si el lenguaje parece orientado a el nivel."
            ]
          },
          {
            "type": "paragraph",
            "text": "Cuando el nivel está bien elegido, el curso desafía sin bloquear."
          }
        ]
      },
      {
        "heading": "Calcula el tiempo real, no el tiempo ideal",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La duración visible de un curso no siempre coincide con el tiempo de aprendizaje. Una clase de 20 minutos puede pedir una hora si necesitás tomar notas, practicar o revisar materiales."
          },
          {
            "type": "paragraph",
            "text": "Si la agenda está ajustada, esto importa. Elegir una formación más demandante de lo que podés sostener no te hace más comprometido. Solo aumenta la chance de abandonar o cursar sin profundidad."
          },
          {
            "type": "paragraph",
            "text": "Preguntate:"
          },
          {
            "type": "list",
            "items": [
              "cuantas horas reales tengo por semana",
              "qué días puedo sostener sin depender de motivación",
              "si necesito practicar entre clases",
              "qué margen tengo si una semana se complica."
            ]
          },
          {
            "type": "paragraph",
            "text": "Un curso más corto pero bien aprovechado puede ser mejor que uno amplio qué queda a mitad de camino."
          }
        ]
      },
      {
        "heading": "Señales de que un curso no es para este momento",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Hay cursos valiosos que conviene dejar para después. Algunas señales:"
          },
          {
            "type": "list",
            "items": [
              "el temario te interesa, pero no sabés para qué lo usarías",
              "los requisitos previos te quedan lejos",
              "promete resultados que no coinciden con la etapa",
              "exige una práctica que hoy no podés sostener",
              "te atrae por tendencia, no por necesidad propia."
            ]
          },
          {
            "type": "paragraph",
            "text": "Postergar no siempre es perder. A veces es elegir mejor la secuencia."
          }
        ]
      },
      {
        "heading": "Elegí el curso para el próximo paso",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una buena elección formativa no tiene que resolver toda la carrera. Tiene que ayudarte con el próximo avance real."
          },
          {
            "type": "paragraph",
            "text": "Si estás empezando, buscá base clara. Si ya tenés base, buscá aplicación. Si ya aplicás, buscá criterio, revisión y profundidad."
          },
          {
            "type": "paragraph",
            "text": "El mejor curso para vos no siempre es el más completo. Es el que encaja con el momento y te deja mejor preparado para decidir qué sigue."
          }
        ]
      }
    ]
  },
  "como-estructurar-clase-clara-y-memorable": {
    "slug": "como-estructurar-clase-clara-y-memorable",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Saber mucho de un tema no alcanza para dar una buena clase. El alumno no necesita entrar a la cabeza de experto, necesita un camino que pueda seguir."
          },
          {
            "type": "paragraph",
            "text": "Una clase clara no es la que dice todo. Es la que decide que va primero, qué puede esperar y qué tiene que quedar funcionando cuando termina."
          }
        ]
      },
      {
        "heading": "Empezá por lo que el alumno debe poder hacer",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un tema no es un objetivo. \"Introducción a la evaluación\" es un tema. \"Distinguir tres criterios para evaluar una propuesta formativa\" es un objetivo."
          },
          {
            "type": "paragraph",
            "text": "Esa diferencia ordena la clase. Si no sabés que debería poder hacer el alumno al final, vas a llenar la clase de información posible, no de información necesaria."
          },
          {
            "type": "paragraph",
            "text": "Antes de escribir o grabar, completá esta frase:"
          },
          {
            "type": "paragraph",
            "text": "\"Al terminar esta clase, el alumno debería poder...\""
          },
          {
            "type": "paragraph",
            "text": "Si la frase queda vaga, la clase también va a quedar vaga."
          }
        ]
      },
      {
        "heading": "Da contexto antes de entrar en detalle",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El contexto le dice al alumno por qué esto importa y dónde ubicar lo qué viene. No tiene que ser largo. De hecho, si tarda demasiado, se vuelve otra barrera."
          },
          {
            "type": "paragraph",
            "text": "Un buen contexto responde tres preguntas:"
          },
          {
            "type": "list",
            "items": [
              "qué problema estamos mirando",
              "por qué aparece en la práctica",
              "qué vamos a resolver en esta clase."
            ]
          },
          {
            "type": "paragraph",
            "text": "Por ejemplo, antes de explicar cómo organizar una cursada, podés mostrar el problema: muchos alumnos abandonan no porque el contenido sea imposible, sino porque no saben cómo convertir flexibilidad en rutina."
          },
          {
            "type": "paragraph",
            "text": "Eso prepara la atención. El alumno entiende por qué tiene que escuchar lo que sigue."
          }
        ]
      },
      {
        "heading": "Explica una idea principal por bloque",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una clase se vuelve difícil cuando mezcla definición, excepciones, historia, caso avanzado y opinion profesional en el mismo tramo."
          },
          {
            "type": "paragraph",
            "text": "No es que esos elementos sobren. El problema es el orden."
          },
          {
            "type": "paragraph",
            "text": "Una estructura simple puede ser:"
          },
          {
            "type": "ordered-list",
            "items": [
              "idea principal",
              "explicación breve",
              "ejemplo",
              "aplicación o pregunta",
              "transición al siguiente bloque."
            ]
          },
          {
            "type": "paragraph",
            "text": "El ejemplo no debería aparecer solo al final. Si el alumno tiene que esperar diez minutos para ver cómo se usa lo que estás diciendo, probablemente ya perdió parte del hilo."
          }
        ]
      },
      {
        "heading": "Usa ejemplos para bajar el criterio a tierra",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un ejemplo no es decoración. Es la prueba de que la explicación puede usarse."
          },
          {
            "type": "paragraph",
            "text": "Si estás enseñando a planificar un curso, no alcanza con decir \"definí el alcance\". Mostrá una diferencia concreta:"
          },
          {
            "type": "list",
            "items": [
              "alcance demasiado amplio: \"todo sobre nutrición deportiva\"",
              "alcance más usable: \"cómo planificar una semana de alimentación para entrenamiento recreativo\"."
            ]
          },
          {
            "type": "paragraph",
            "text": "El segundo ejemplo permite decidir. El primero solo nombra un tema enorme."
          },
          {
            "type": "paragraph",
            "text": "Cuando un concepto sea importante, preguntate qué ejemplo lo vuelve visible. Si no podés dar ningún ejemplo, quizás todavía no está listo para enseñarse."
          }
        ]
      },
      {
        "heading": "Corta contenido antes de que la clase se rompa",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El error común es creer que una clase mejora cuando agregás más. A veces mejora cuando sacás."
          },
          {
            "type": "paragraph",
            "text": "Sacá lo que:"
          },
          {
            "type": "list",
            "items": [
              "no ayuda al objetivo de la clase",
              "depende de conocimientos que todavía no explicaste",
              "abre un tema nuevo que no vas a cerrar",
              "sirve más para mostrar expertise que para ayudar al alumno."
            ]
          },
          {
            "type": "paragraph",
            "text": "Esto no significa simplificar de más. Significa cuidar la secuencia. Lo avanzado puede tener su lugar, pero no debería ocupar el espacio que necesita la comprensión inicial."
          }
        ]
      },
      {
        "heading": "Cerrar no es repetir todo",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un cierre útil no es una lista de lo que se vio. Eso puede servir, pero no alcanza."
          },
          {
            "type": "paragraph",
            "text": "El cierre debería ayudar al alumno a recuperar lo importante y saber qué hacer con eso."
          },
          {
            "type": "paragraph",
            "text": "Una buena forma es cerrar con tres piezas:"
          },
          {
            "type": "list",
            "items": [
              "la idea que no debería olvidar",
              "una pregunta para revisar si entendió",
              "una acción pequeña para aplicar lo aprendido."
            ]
          },
          {
            "type": "paragraph",
            "text": "Por ejemplo: \"Si tenés que revisar la próxima clase, no empieces por la duración. Empezá por el objetivo. Escribí qué debería poder hacer el alumno al final y recortá lo que no ayude a eso.\""
          }
        ]
      },
      {
        "heading": "La prueba de claridad",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Antes de publicar una clase, revisala con una pregunta incomoda: si el alumno mira solo esta clase, sin que vos estés al lado para aclarar, puede seguir el recorrido."
          },
          {
            "type": "paragraph",
            "text": "Si la respuesta es no, no agregues más explicación de inmediato. Primero revisa estructura."
          },
          {
            "type": "paragraph",
            "text": "El orden correcto suele resolver más que un párrafo extra."
          }
        ]
      }
    ]
  },
  "como-estudiar-mejor-en-cursos-asincronicos": {
    "slug": "como-estudiar-mejor-en-cursos-asincronicos",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La flexibilidad de un curso asincrónico ayuda, pero también puede hacer que todo quede para después. Si no convertís esa flexibilidad en una rutina mínima, el curso compite contra cualquier urgencia del día."
          },
          {
            "type": "paragraph",
            "text": "No necesitás una agenda perfecta. Necesitás un sistema simple para avanzar, registrar dónde quedaste y volver cuando te atrásos."
          }
        ]
      },
      {
        "heading": "La constancia empieza antes de abrir la clase",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El error más común es estudiar solo cuando aparece un hueco. Los huecos existen, pero rara vez alcanzan para sostener una formación."
          },
          {
            "type": "paragraph",
            "text": "Antes de empezar, elegí bloques concretos. No hace falta que sean largos. Dos bloques de 45 minutos por semana pueden ser mejores que esperar una tarde ideal que nunca llega."
          },
          {
            "type": "paragraph",
            "text": "El bloque tiene que tener horario, no solo intención. \"Voy a estudiar cuando pueda\" suele convertirse en \"voy a estudiar cuando no haya nada más\"."
          }
        ]
      },
      {
        "heading": "Separá ver clase de aprender",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Ver una clase es una parte del estudio. No toda."
          },
          {
            "type": "paragraph",
            "text": "En un curso asincrónico, conviene pensar cada sesión en tres momentos:"
          },
          {
            "type": "list",
            "items": [
              "preparar foco: qué voy a mirar y para qué",
              "ver la clase: tomar notas de ideas y dudas",
              "cerrar: escribir qué entendí y qué tengo que hacer después."
            ]
          },
          {
            "type": "paragraph",
            "text": "Ese cierre es clave. Si terminás la clase y no dejas ningúna marca, retomar después se vuelve más difícil. El problema no es solo recordar el contenido. Es recordar que estabas intentando resolver."
          }
        ]
      },
      {
        "heading": "Usa notas de avance, no apuntes infinitos",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Tomar apuntes puede ayudar, pero también puede convertirse en copiar todo sin procesar nada."
          },
          {
            "type": "paragraph",
            "text": "Una nota de avance debería responder:"
          },
          {
            "type": "list",
            "items": [
              "qué vi",
              "qué idea me sirve",
              "qué duda queda",
              "cuál es el próximo paso."
            ]
          },
          {
            "type": "paragraph",
            "text": "Con eso alcanza para retomar. Si después de una semana volvés al curso, esa nota te ubica rápido. No tenés que reconstruir desde cero."
          },
          {
            "type": "paragraph",
            "text": "Ejemplo:"
          },
          {
            "type": "paragraph",
            "text": "\"Vi la clase sobre objetivos de aprendizaje. Me sirve diferenciar tema de objetivo. Tengo que revisar si mi curso dice que el alumno podrá hacer algo concreto. Próximo paso: reescribir el objetivo del módulo 1.\""
          },
          {
            "type": "paragraph",
            "text": "Eso vale más que tres páginas copiadas sin decisión."
          }
        ]
      },
      {
        "heading": "No acumules clases como si fueran episodios",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Es tentador mirar varias clases seguidas para \"ponerse al día\". A veces sirve. Muchas veces solo genera sensación de avance."
          },
          {
            "type": "paragraph",
            "text": "Si el curso requiere práctica, lectura o reflexión, mirar cinco clases sin pausa puede dejarte con menos aprendizaje que mirar una y aplicarla bien."
          },
          {
            "type": "paragraph",
            "text": "Una regla simple: después de cada bloque importante, preguntate que cambia en lo que sabés hacer o decidir. Si la respuesta es nada, quizás estás consumiendo contenido, no estudiando."
          }
        ]
      },
      {
        "heading": "Qué hacer cuando te atrásos",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Te vas a atrásar alguna vez. La pregunta es si tenés una forma de volver."
          },
          {
            "type": "paragraph",
            "text": "Cuando pase, no intentes compensar todo de golpe. Revisá la última nota de avance, mirá el índice del módulo y elegí una unidad concreta para retomar."
          },
          {
            "type": "paragraph",
            "text": "Plan de recuperacion:"
          },
          {
            "type": "ordered-list",
            "items": [
              "ubicá dónde quedaste",
              "mirá una clase corta o relee una nota",
              "marcá qué falta",
              "agenda el siguiente bloque",
              "evitá rehacer todo desde el principio salvo que sea necesario."
            ]
          },
          {
            "type": "paragraph",
            "text": "Volver al curso no debería sentirse como empezar de cero."
          }
        ]
      },
      {
        "heading": "Una rutina mínima para esta semana",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Si estás cursando algo asincrónico, probá esto durante siete días:"
          },
          {
            "type": "list",
            "items": [
              "agenda dos bloques de estudio",
              "antes de cada bloque, escribí qué vas a hacer",
              "después, dejá una nota de avance de cuatro líneas",
              "si aparece una duda, anotala sin frenar todo",
              "al final de la semana, revisá si el plan fue realista."
            ]
          },
          {
            "type": "paragraph",
            "text": "La constancia no aparece porque el curso sea flexible. Aparece cuando decidis cómo usar esa flexibilidad."
          }
        ]
      }
    ]
  },
  "como-generar-confianza-en-formacion-digital": {
    "slug": "como-generar-confianza-en-formacion-digital",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La confianza en una formación digital no aparece porque una página diga que el curso es de calidad. Se construye cuando lo que se promete, lo que se muestra y lo que el alumno vive durante la cursada coinciden."
          },
          {
            "type": "paragraph",
            "text": "En digital, cada ambigüedad pesa más. Si el alumno no entiende que va a pasar, empieza a completar huecos solo."
          }
        ]
      },
      {
        "heading": "La confianza empieza antes de cursar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Antes de inscribirse, una persona necesita información suficiente para decidir. No necesita una explicación interminable. Necesita claridad."
          },
          {
            "type": "paragraph",
            "text": "Una propuesta confiable comunica:"
          },
          {
            "type": "list",
            "items": [
              "para quién es",
              "qué nivel supone",
              "qué resultado promete",
              "cómo se cursa",
              "qué esfuerzo requiere",
              "qué incluye y qué no incluye."
            ]
          },
          {
            "type": "paragraph",
            "text": "Cuando esto falta, el alumno puede inscribirse con expectativas equivocadas. Incluso si el curso es bueno, la experiencia arranca con riesgo."
          }
        ]
      },
      {
        "heading": "Las expectativas claras reducen frustración",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Muchas frustraciones no vienen de una mala clase, sino de una expectativa mal alineada."
          },
          {
            "type": "paragraph",
            "text": "Un alumno que espera acompañamiento constante en un curso pensado para avance autónomo puede sentirse abandonado. Un alumno que busca práctica puede frustrarse si encuentra solo teoría. Un principiante puede trabarse si el curso asume base previa."
          },
          {
            "type": "paragraph",
            "text": "La solución no es prometer menos. Es prometer con precision."
          },
          {
            "type": "paragraph",
            "text": "Decir \"este curso es introductorio\" ayuda. Decir \"vas a necesitar una hora semanal de práctica\" ayuda. Decir \"no cubre temas avanzados\" también ayuda."
          },
          {
            "type": "paragraph",
            "text": "Los límites bien comunicados generan más confianza que las promesas amplias."
          }
        ]
      },
      {
        "heading": "La consistencia durante la cursada sostiene credibilidad",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La confianza no se gana una vez. Se confirma durante todo el recorrido."
          },
          {
            "type": "paragraph",
            "text": "El alumno compara, aunque no lo haga de forma consciente:"
          },
          {
            "type": "list",
            "items": [
              "el titulo con el contenido",
              "la promesa con las actividades",
              "las instrucciones con lo que se pide",
              "los materiales mencionados con los materiales disponibles",
              "el nivel declarado con la dificultad real."
            ]
          },
          {
            "type": "paragraph",
            "text": "Cada coincidencia refuerza confianza. Cada contradiccion la erosiona."
          },
          {
            "type": "paragraph",
            "text": "Por eso, la consistencia es una decisión editorial y pedagógica. No es solo prolijidad."
          }
        ]
      },
      {
        "heading": "Las instrucciones también comunican cuidado",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una consigna confusa no solo dificulta una actividad. También transmite que el alumno tiene que arreglarse solo."
          },
          {
            "type": "paragraph",
            "text": "Una buena instrucción responde:"
          },
          {
            "type": "list",
            "items": [
              "qué hay que hacer",
              "para qué sirve",
              "con qué material o clase se relaciona",
              "cómo saber si está bien encaminado",
              "qué hacer después."
            ]
          },
          {
            "type": "paragraph",
            "text": "No hace falta escribir mucho. Hace falta escribir lo necesario."
          },
          {
            "type": "paragraph",
            "text": "En formación digital, donde no siempre hay una aclaración inmediata, una instrucción clara evita fricción y sostiene autonomía."
          }
        ]
      },
      {
        "heading": "El acompañamiento no siempre es estar encima",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Acompañar no significa responder todo todo el tiempo. También puede ser diseñar un recorrido que anticipe dudas frecuentes."
          },
          {
            "type": "paragraph",
            "text": "Hay acompañamiento cuando:"
          },
          {
            "type": "list",
            "items": [
              "el orden de clases tiene sentido",
              "los recursos aparecen cuando se necesitan",
              "las evaluaciones coinciden con lo trabajado",
              "el alumno sabe cómo retomar si se atrása",
              "las dudas esperables están contempladas en el contenido."
            ]
          },
          {
            "type": "paragraph",
            "text": "Un curso autónomo puede sentirse acompañado si está bien construido. Un curso con muchos canales puede sentirse confuso si no hay criterio."
          }
        ]
      },
      {
        "heading": "La confianza se confirma al final",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El cierre de una formación también importa. El alumno debería poder mirar hacia atrás y entender qué cambió."
          },
          {
            "type": "paragraph",
            "text": "Un buen cierre puede ayudar a:"
          },
          {
            "type": "list",
            "items": [
              "recuperar aprendizajes importantes",
              "identificar qué queda pendiente",
              "proponer una forma de seguir practicando",
              "conectar el curso con una decisión o acción real."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si el curso termina de golpe, la experiencia puede sentirse incompleta aunque las clases hayan sido buenas."
          }
        ]
      },
      {
        "heading": "Una revisión simple de confianza",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Para revisar una propuesta digital, alcanza una pregunta fuerte: el alumno tiene que adivinar demasiado."
          },
          {
            "type": "paragraph",
            "text": "Si tiene que adivinar nivel, esfuerzo, modalidad, orden, materiales o resultado, hay trabajo por hacer."
          },
          {
            "type": "paragraph",
            "text": "La confianza no se genera agregando frases institucionales. Se genera quitando dudas innecesarias y cumpliendo lo que se prometió."
          }
        ]
      }
    ]
  },
  "como-grabarte-bien-primer-curso": {
    "slug": "como-grabarte-bien-primer-curso",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "No necesitás una cámara profesional para grabar una primera clase clara. Necesitás que el alumno pueda verte, escucharte y seguir la explicación sin pelearse con la imagen."
          },
          {
            "type": "paragraph",
            "text": "La diferencia parece menor, pero cambia todo. Si arrancás pensando en equipo, es fácil gastar tiempo en cosas que no van a mejorar la clase. Si arrancás pensando en comprensión, las decisiones se vuelven más simples."
          }
        ]
      },
      {
        "heading": "Verse bien significa que nada estorba",
        "blocks": [
          {
            "type": "paragraph",
            "text": "En una clase online, \"verse bien\" no quiere decir parecer una producción de estudio. Quiere decir que la cara se vea con claridad, que el encuadre no distraiga y que la imagen no obligue al alumno a adivinar dónde mirar."
          },
          {
            "type": "paragraph",
            "text": "El objetivo no es impresionar. El objetivo es reducir fricción."
          },
          {
            "type": "paragraph",
            "text": "Si el alumno está pensando en si la imagen está torcida, si hay demasiado fondo, si la cara está oscura o si el video tiembla, ya perdió parte de la atención que necesitaba para aprender."
          }
        ]
      },
      {
        "heading": "La cámara importa menos que la ubicación",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un celular reciente, una webcam simple o la cámara de una notebook pueden alcanzar para empezar. Lo que suele arruinar la imagen no es la cámara, sino donde la pones."
          },
          {
            "type": "paragraph",
            "text": "La cámara debería estar a la altura de los ojos o apenas por encima. Si queda muy abajo, la imagen se vuelve incomoda. Si queda muy arriba, pareces mirando hacia otro lugar. La clase se siente menos directa."
          },
          {
            "type": "paragraph",
            "text": "La distancia también importa. Si estás demasiado cerca, la imagen se vuelve intensa y hay poco contexto. Si estás demasiado lejos, cuesta leer expresiones y seguirte. Como punto de partida, dejá un poco de aire sobre la cabeza y encuadra desde el pecho o mitad del torso."
          },
          {
            "type": "paragraph",
            "text": "Usá algo estable. Un tripode ayuda, pero no es obligatorio. Una pila de libros, un soporte fijo o una mesa firme pueden resolver el problema. Lo importante es que la cámara no se mueva durante la explicación."
          }
        ]
      },
      {
        "heading": "La luz debe ayudarte, no decorar el video",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La luz más simple suele ser la mejor: una ventana frente a vos o en diagonal. Evita quedar con una ventana fuerte detrás, porque la cámara va a compensar la luz del fondo y la cara va a quedar oscura."
          },
          {
            "type": "paragraph",
            "text": "Si grabás de noche, usá una luz frontal suave. No hace falta armar un set. Una lámpara ubicada frente a vos, no justo debajo de la cara, puede mejorar mucho la imagen."
          },
          {
            "type": "paragraph",
            "text": "La prueba es sencilla: mirá un clip corto y preguntate si los ojos, la boca y los gestos se ven sin esfuerzo. Si la respuesta es sí, probablemente alcanza."
          }
        ]
      },
      {
        "heading": "El fondo no tiene que ser perfecto",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un fondo profesional no hace que una clase sea buena. Un fondo desordenado sí puede distraer."
          },
          {
            "type": "paragraph",
            "text": "Antes de grabar, mirá qué queda dentro del encuadre. Sacá objetos que llamen demasiado la atención, evitá puertas abiertas, pantallas encendidas o movimiento detrás tuyo. No hace falta vaciar la habitación. Solo quitar lo que compite con la explicación."
          },
          {
            "type": "paragraph",
            "text": "Si vas a usar pizarras, láminas o elementos físicos, asegurate de que se vean. Si no se ven, no funcionan como recurso didáctico, funcionan como ruido."
          }
        ]
      },
      {
        "heading": "Ajustes básicos antes de grabar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Antes de grabar una clase completa, hacé una prueba de 30 segundos. Decí una frase parecida a la que usarías en la clase, movete como te moverías normalmente y después revisá el video."
          },
          {
            "type": "paragraph",
            "text": "Chequeá esto:"
          },
          {
            "type": "list",
            "items": [
              "la cara se ve clara",
              "la cámara está estable",
              "el encuadre no corta gestos importantes",
              "no hay objetos que distraigan",
              "el audio se entiende sin subir mucho el volumen",
              "no hay ruidos constantes que cansen."
            ]
          },
          {
            "type": "paragraph",
            "text": "Esa prueba vale más que una hora leyendo recomendaciones de equipo."
          }
        ]
      },
      {
        "heading": "Cuándo corregir y cuando avanzar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Corregí lo que afecta la comprensión. Si el audio tiene eco fuerte, corregilo. Si la cara está oscura, movete o cambia la luz. Si el encuadre está torcido, ajustalo."
          },
          {
            "type": "paragraph",
            "text": "No frenes por detalles que no cambian la experiencia del alumno. Una pared común, una silla simple o una luz no perfecta no impiden aprender. Un sonido confuso, una imagen inestable o una explicación sin foco, sí."
          }
        ]
      },
      {
        "heading": "Una prueba real antes de la primera clase",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Antes de grabar el primer módulo, grabá un minuto completo como si fuera parte del curso. No lo mires como creador. Miralo como alumno."
          },
          {
            "type": "paragraph",
            "text": "Preguntate:"
          },
          {
            "type": "list",
            "items": [
              "entiendo dónde mirar",
              "escucho sin esfuerzo",
              "la imagen acompaña la explicación",
              "algo me distrae",
              "parece una clase que podría seguir durante varios minutos."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si pasa esa prueba, ya tenés suficiente para empezar. La calidad puede mejorar con el tiempo. La claridad tiene que estar desde el primer video."
          }
        ]
      }
    ]
  },
  "como-organizar-tu-tiempo-para-completar-formacion": {
    "slug": "como-organizar-tu-tiempo-para-completar-formacion",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Completar una formación profesional no depende solo de interés. Depende de hacerle lugar en una agenda que ya tiene trabajo, familia, cansancio, imprevistos y otras prioridades compitiendo."
          },
          {
            "type": "paragraph",
            "text": "El problema no suele ser falta de ganas. El problema es planificar como si estudiar ocupara solo el tiempo exacto de las clases."
          }
        ]
      },
      {
        "heading": "Calcula la demanda real, no solo la duración visible",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una clase de 25 minutos no siempre toma 25 minutos. Puede pedir pausa, apuntes, repaso, práctica o una segunda mirada si el tema es nuevo."
          },
          {
            "type": "paragraph",
            "text": "Antes de armar la agenda, separa tres tipos de tiempo:"
          },
          {
            "type": "list",
            "items": [
              "tiempo de clase: mirar o escuchar el contenido",
              "tiempo de procesamiento: tomar notas, ordenar ideas, revisar dudas",
              "tiempo de aplicación: practicar, resolver actividades o conectar el tema con el trabajo."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si solo reservas tiempo para ver clases, cualquier ejercicio se vuelve atráso. Si contemplas el tiempo completo de aprendizaje, el plan se vuelve más realista."
          }
        ]
      },
      {
        "heading": "Definí bloques que puedas sostener",
        "blocks": [
          {
            "type": "paragraph",
            "text": "No hace falta estudiar todos los días. Hace falta elegir bloques que puedas repetir durante varias semanas."
          },
          {
            "type": "paragraph",
            "text": "Un bloque sostenible tiene tres condiciones:"
          },
          {
            "type": "list",
            "items": [
              "entra en la agenda real",
              "tiene energía suficiente, no solo tiempo disponible",
              "permite empezar y cerrar sin quedar siempre a medias."
            ]
          },
          {
            "type": "paragraph",
            "text": "Por ejemplo, si solo podés estudiar martes y jueves por la noche, ese es el punto de partida. No armes un plan ideal de cinco días si sabés que no va a sobrevivir a la primera semana ocupada."
          },
          {
            "type": "paragraph",
            "text": "Estudiar menos veces, pero de forma estable, suele funcionar mejor que depender de impulsos largos y aislados."
          }
        ]
      },
      {
        "heading": "Separá mirar, practicar y repasar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "No todas las sesiónes de estudio deberian hacer lo mismo."
          },
          {
            "type": "paragraph",
            "text": "Una sesión puede ser para avanzar con una clase. Otra, para practicar. Otra, para repasar notas y ordenar dudas. Si intentas hacer todo en el mismo bloque, cualquier clase un poco densa rompe el plan."
          },
          {
            "type": "paragraph",
            "text": "Una distribucion simple:"
          },
          {
            "type": "list",
            "items": [
              "bloque 1: ver clase y tomar notas breves",
              "bloque 2: practicar o resolver una actividad",
              "bloque 3: repasar, cerrar dudas y preparar el siguiente tema."
            ]
          },
          {
            "type": "paragraph",
            "text": "No necesitás usar esta estructura siempre. Sirve para recordar que aprender no es solo consumir contenido."
          }
        ]
      },
      {
        "heading": "Deja margen para atrásos",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un plan sin margen no es exigente. Es fragil."
          },
          {
            "type": "paragraph",
            "text": "Si la agenda está ocupada, alguna semana se va a complicar. El objetivo no es evitar todos los atrásos, sino poder absorberlos sin abandonar."
          },
          {
            "type": "paragraph",
            "text": "Una forma simple es planificar al 70 u 80 por ciento de la capacidad. Si crees que podrías estudiar cinco horas por semana, agendá cuatro. El margen restante te ayuda cuando una clase demanda más, aparece un imprevisto o necesitás repasar."
          },
          {
            "type": "paragraph",
            "text": "También conviene definir una regla de recuperacion:"
          },
          {
            "type": "list",
            "items": [
              "si pierdo un bloque, no rehago toda la semana",
              "recupero una unidad concreta",
              "ajusto el siguiente bloque",
              "mantengo el ritmo posible."
            ]
          },
          {
            "type": "paragraph",
            "text": "El atráso no debería convertirse en prueba de fracaso. Es parte normal de estudiar con una vida real alrededor."
          }
        ]
      },
      {
        "heading": "Revisá el plan después de la primera semana",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La primera semana te da información. No la uses para juzgarte, usala para ajustar."
          },
          {
            "type": "paragraph",
            "text": "Preguntate:"
          },
          {
            "type": "list",
            "items": [
              "reserve tiempo suficiente",
              "el horario elegido tenia energía real",
              "subestime la práctica",
              "necesite más pausas",
              "hubo un obstaculo puntual o el plan estaba mal calculado."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si el plan fallo porque fue demasiado ambicioso, bajalo. Si fallo por un imprevisto, retomalo. Si fallo porque el horario era malo, cambialo."
          },
          {
            "type": "paragraph",
            "text": "Un plan de estudio no es un contrato rigido. Es una herramienta para completar la formación sin depender de condiciones perfectas."
          }
        ]
      },
      {
        "heading": "Un plan mínimo para empezar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Para esta semana, elegí:"
          },
          {
            "type": "list",
            "items": [
              "dos bloques reales de estudio",
              "una clase o módulo concreto para avanzar",
              "un espacio breve de práctica o repaso",
              "una fecha para revisar si el plan funcionó."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si ese plan se sostiene, aumentarlo después es fácil. Si no se sostiene, ya tenés datos para corregir."
          },
          {
            "type": "paragraph",
            "text": "Completar una formación profesional es menos romántico que empezar una. Por eso necesita agenda, margen y revisión."
          }
        ]
      }
    ]
  },
  "como-planificar-curso-antes-de-grabar": {
    "slug": "como-planificar-curso-antes-de-grabar",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Grabar sin plan da sensación de avance, pero suele cobrar caro después. Aparecen clases repetidas, huecos de contenido, materiales no previstos y módulos que hay que mover cuando ya están grabados."
          },
          {
            "type": "paragraph",
            "text": "Planificar no es burocracia. Es decidir que recorrido vas a construir antes de poner la cámara a trabajar."
          }
        ]
      },
      {
        "heading": "Definí para quién es el curso",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un curso cambia según quién lo va a tomar. No es lo mismo escribir para alguien que empieza desde cero que para alguien que ya trabaja con el tema y necesita ordenar criterio."
          },
          {
            "type": "paragraph",
            "text": "Antes de pensar módulos, define:"
          },
          {
            "type": "list",
            "items": [
              "qué sabe el alumno antes de empezar",
              "qué problema quiere resolver",
              "qué lenguaje maneja",
              "qué nivel de autonomía tiene",
              "qué resultado espera."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si no hacés ese recorte, el curso puede intentar servirle a todos y terminar siendo impreciso para cada uno."
          },
          {
            "type": "paragraph",
            "text": "Una buena frase de partida es: \"Este curso es para personas que...\" y completarla con algo concreto, no con una audiencia enorme."
          }
        ]
      },
      {
        "heading": "Delimitá qué entra y qué queda afuera",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El alcance es una decisión de calidad. Un curso claro no promete cubrir todo. Promete cubrir lo necesario para un resultado definido."
          },
          {
            "type": "paragraph",
            "text": "Para delimitar, arma tres listas:"
          },
          {
            "type": "list",
            "items": [
              "imprescindible: sin esto, el alumno no llega al objetivo",
              "complementario: suma, pero no sostiene el recorrido principal",
              "afuera: puede ser interesante, pero pertenece a otro curso, módulo o etapa."
            ]
          },
          {
            "type": "paragraph",
            "text": "La lista \"afuera\" es la más difícil y una de las más importantes. Te protege de grabar clases que muestran conocimiento, pero no ayudan al recorrido."
          }
        ]
      },
      {
        "heading": "Ordená módulos por progresion",
        "blocks": [
          {
            "type": "paragraph",
            "text": "No ordenes los módulos solo por cómo se te ocurren a vos. Ordenalos por lo que el alumno necesita construir."
          },
          {
            "type": "paragraph",
            "text": "Una progresion simple suele responder:"
          },
          {
            "type": "ordered-list",
            "items": [
              "qué necesita entender primero",
              "qué criterio debe incorporar",
              "qué ejemplo lo vuelve claro",
              "qué práctica puede hacer",
              "qué cierre confirma avance."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si un módulo usa conceptos de otro que aparece después, el orden está roto. Si dos módulos repiten la misma idea, quizás hay que fusionar o recortar. Si un módulo no prepara nada ni cierra nada, revisá si pertenece al curso."
          }
        ]
      },
      {
        "heading": "Definí el objetivo de cada clase",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El objetivo del curso marca el destino. El objetivo de cada clase marca el paso."
          },
          {
            "type": "paragraph",
            "text": "No alcanza con titular una clase. Escribí qué debería poder hacer, entender o decidir el alumno al terminarla."
          },
          {
            "type": "paragraph",
            "text": "Ejemplo débil:"
          },
          {
            "type": "list",
            "items": [
              "\"Introducción a la planificacion\"."
            ]
          },
          {
            "type": "paragraph",
            "text": "Ejemplo más útil:"
          },
          {
            "type": "list",
            "items": [
              "\"Distinguir objetivo del curso, audiencia y alcance antes de definir módulos\"."
            ]
          },
          {
            "type": "paragraph",
            "text": "El segundo objetivo te ayuda a decidir qué explicar, qué ejemplo usar y qué dejar afuera."
          }
        ]
      },
      {
        "heading": "Identifica materiales antes de grabar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Muchos materiales se descubren tarde. Grabaste una clase, mencionaste una plantilla, prometiste un ejercicio o usaste un ejemplo que después hay que reconstruir."
          },
          {
            "type": "paragraph",
            "text": "Antes de grabar, revisá por módulo:"
          },
          {
            "type": "list",
            "items": [
              "qué archivos necesita",
              "qué ejemplos vas a mostrar",
              "qué consignas vas a pedir",
              "qué lecturas o recursos complementarios conviene preparar",
              "qué actividad necesita instrucciones claras."
            ]
          },
          {
            "type": "paragraph",
            "text": "No todos los cursos necesitan muchos materiales. Pero si los necesitás, conviene saberlo antes de grabar."
          }
        ]
      },
      {
        "heading": "Revisá si el curso se puede completar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una buena planificacion también mira la carga para el alumno."
          },
          {
            "type": "paragraph",
            "text": "Preguntate:"
          },
          {
            "type": "list",
            "items": [
              "cuantas clases tiene",
              "cuanto dura cada módulo",
              "dónde aparece la práctica",
              "cuanto tiempo real pide",
              "si el ritmo es sostenible",
              "si el objetivo final es alcanzable con ese recorrido."
            ]
          },
          {
            "type": "paragraph",
            "text": "Un curso puede estar bien intencionado y ser demasiado amplio para la promesa que hace. Ajustar antes de grabar es mucho más barato que corregir después."
          }
        ]
      },
      {
        "heading": "El mapa mínimo antes de grabar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Antes de encender la cámara, dejá escrito:"
          },
          {
            "type": "list",
            "items": [
              "audiencia",
              "objetivo del curso",
              "alcance",
              "lista de módulos",
              "objetivo de cada clase",
              "materiales necesarios",
              "práctica o actividad principal",
              "cierre esperado."
            ]
          },
          {
            "type": "paragraph",
            "text": "No necesitás un documento enorme. Necesitás un mapa que evite grabar a ciegas."
          },
          {
            "type": "paragraph",
            "text": "Si ese mapa está claro, grabar deja de ser improvisar frente a una cámara y pasa a ser ejecutar una propuesta formativa pensada."
          }
        ]
      }
    ]
  },
  "cuando-elegir-formacion-teorica-practica-o-hibrida": {
    "slug": "cuando-elegir-formacion-teorica-practica-o-hibrida",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "No todos los objetivos se aprenden igual. A veces necesitás base teórica para entender que estás haciendo. A veces necesitás práctica para ganar seguridad. Muchas veces necesitás una combinación ordenada de ambas."
          },
          {
            "type": "paragraph",
            "text": "Elegir entre formación teórica, práctica o híbrida no es elegir qué suena mejor. Es identificar qué brecha tenés hoy."
          }
        ]
      },
      {
        "heading": "La teoría sirve cuando necesitás lenguaje y criterio",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La teoría no es relleno si llega en el momento correcto. Sirve para entender conceptos, nombrar problemas, ordenar decisiones y evitar aplicar recetas sin saber por qué."
          },
          {
            "type": "paragraph",
            "text": "Conviene elegir una formación más teórica cuando:"
          },
          {
            "type": "list",
            "items": [
              "estás entrando a un tema nuevo",
              "necesitás entender fundamentos",
              "querés tomar mejores decisiones",
              "tenés práctica, pero te falta marco",
              "querés diferenciar enfoques o criterios."
            ]
          },
          {
            "type": "paragraph",
            "text": "Por ejemplo, si querés intervenir en un área profesional que no conocés, empezar solo con práctica puede hacerte repetir pasos sin entenderlos. Una base teórica bien explicada te da mapa."
          },
          {
            "type": "paragraph",
            "text": "El riesgo aparece cuando la teoría no baja nunca a ejemplos. Si todo queda en definiciones, el aprendizaje puede sentirse ordenado pero poco usable."
          }
        ]
      },
      {
        "heading": "La práctica sirve cuando necesitás aplicar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La práctica es clave cuando ya no alcanza con entender. Necesitás hacer, probar, equivocarte, ajustar y ganar criterio en situación."
          },
          {
            "type": "paragraph",
            "text": "Conviene elegir una formación más práctica cuando:"
          },
          {
            "type": "list",
            "items": [
              "ya conocés los fundamentos",
              "querés usar una técnica",
              "necesitás resolver casos",
              "buscas mejorar una habilidad concreta",
              "querés recibir consignas o ejercicios."
            ]
          },
          {
            "type": "paragraph",
            "text": "La práctica te muestra rápidamente qué entendiste y qué no. También revela dudas que la teoría sola no siempre expone."
          },
          {
            "type": "paragraph",
            "text": "El riesgo aparece cuando la práctica llega sin base suficiente. En ese caso, podés completar ejercicios, pero sin saber cómo transferir lo aprendido a otros contextos."
          }
        ]
      },
      {
        "heading": "Lo híbrido sirve cuando necesitás integrar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una formación híbrida combina base conceptual y aplicación. No es automáticamente mejor. Es mejor cuando el objetivo requiere entender y usar."
          },
          {
            "type": "paragraph",
            "text": "Conviene elegir un enfoque híbrido cuando:"
          },
          {
            "type": "list",
            "items": [
              "querés aprender un criterio y aplicarlo",
              "necesitás teoría para decidir y práctica para fijar",
              "estás pasando de conocimiento inicial a uso real",
              "querés revisar casos con fundamento",
              "buscas una experiencia más completa."
            ]
          },
          {
            "type": "paragraph",
            "text": "El punto importante es el orden. Híbrido no significa mezclar todo. Significa que teoría y práctica se preparan mutuamente."
          },
          {
            "type": "paragraph",
            "text": "Una buena secuencia podría ser:"
          },
          {
            "type": "ordered-list",
            "items": [
              "concepto",
              "ejemplo",
              "práctica guiada",
              "revisión",
              "aplicación más autonoma."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si el curso mezcla teoría y práctica sin conexion, lo híbrido puede volverse confuso."
          }
        ]
      },
      {
        "heading": "Cómo decidir según el objetivo",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Antes de elegir, completá esta frase:"
          },
          {
            "type": "paragraph",
            "text": "\"Necesito esta formación para...\""
          },
          {
            "type": "paragraph",
            "text": "Después mira qué verbo aparece."
          },
          {
            "type": "paragraph",
            "text": "Si aparece \"entender\", \"ordenar\", \"distinguir\" o \"decidir\", probablemente necesitás más teoría o una base conceptual fuerte."
          },
          {
            "type": "paragraph",
            "text": "Si aparece \"hacer\", \"aplicar\", \"resolver\" o \"practicar\", necesitás una propuesta con componente práctico claro."
          },
          {
            "type": "paragraph",
            "text": "Si aparece \"aplicar con criterio\", \"mejorar una práctica\" o \"llevarlo a mi trabajo\", probablemente necesitás una combinación."
          },
          {
            "type": "paragraph",
            "text": "La elección mejora cuando el formato responde al objetivo, no a una preferencia general."
          }
        ]
      },
      {
        "heading": "Errores frecuentes al elegir formato",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un error común es despreciar la teoría porque parece menos activa. Sin marco, la práctica puede volverse mecánica."
          },
          {
            "type": "paragraph",
            "text": "Otro error es refugiarse en teoría para evitar practicar. Entender más no siempre resuelve la falta de aplicación."
          },
          {
            "type": "paragraph",
            "text": "También pasa que algunas personas eligen híbrido porque suena completo, aunque solo necesitan una Introducción breve o una práctica puntual."
          },
          {
            "type": "paragraph",
            "text": "Para evitarlo, revisá:"
          },
          {
            "type": "list",
            "items": [
              "qué se espera que puedas hacer al final",
              "qué base tenés hoy",
              "qué tipo de esfuerzo estás dispuesto a sostener",
              "si el curso ofrece ejemplos, práctica o evaluación coherente con su promesa."
            ]
          }
        ]
      },
      {
        "heading": "Elegí según la brecha actual",
        "blocks": [
          {
            "type": "paragraph",
            "text": "No hay un formato superior para todos los casos."
          },
          {
            "type": "paragraph",
            "text": "Si te falta lenguaje, buscá teoría clara. Si te falta seguridad en la acción, buscá práctica. Si te falta conectar criterio con uso real, buscá una propuesta híbrida bien ordenada."
          },
          {
            "type": "paragraph",
            "text": "La mejor formación no es la que parece más completa. Es la que cubre la brecha que hoy te impide avanzar."
          }
        ]
      }
    ]
  },
  "errores-comunes-al-crear-tu-primer-curso": {
    "slug": "errores-comunes-al-crear-tu-primer-curso",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El primer curso rara vez falla porque el instructor no sabe del tema. Suele fallar por decisiones de alcance, estructura y experiencia que parecen pequeñas hasta que el alumno intenta seguir el recorrido."
          },
          {
            "type": "paragraph",
            "text": "La buena noticia: muchos errores se pueden detectar antes de publicar."
          }
        ]
      },
      {
        "heading": "Error 1: querer enseñar todo",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Cuando conocés mucho un tema, todo parece importante. El problema es que un curso que intenta cubrir todo termina sin una promesa clara."
          },
          {
            "type": "paragraph",
            "text": "El alumno no necesita recibir todo el conocimiento. Necesita un recorrido que lo lleve de un punto A a un punto B."
          },
          {
            "type": "paragraph",
            "text": "Consecuencia: clases largas, módulos mezclados, exceso de contexto y poca aplicación."
          },
          {
            "type": "paragraph",
            "text": "Cómo corregirlo:"
          },
          {
            "type": "list",
            "items": [
              "definí qué debe poder hacer o decidir el alumno al final",
              "separá contenido esencial de contenido complementario",
              "guarda temas avanzados para otro curso o módulo",
              "eliminá lo que no ayuda al resultado prometido."
            ]
          },
          {
            "type": "paragraph",
            "text": "Un buen recorte no empobrece el curso. Lo vuelve posible."
          }
        ]
      },
      {
        "heading": "Error 2: empezar a grabar sin estructura",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Grabar rápido da sensación de avance, pero puede generar mucho retrabajo. Si no tenés mapa, cada clase se decide sola. Después aparecen repeticiones, saltos y huecos."
          },
          {
            "type": "paragraph",
            "text": "Consecuencia: clases fuera de orden, ideas duplicadas y materiales que se descubren tarde."
          },
          {
            "type": "paragraph",
            "text": "Cómo corregirlo:"
          },
          {
            "type": "list",
            "items": [
              "arma primero el mapa de módulos",
              "define el objetivo de cada clase",
              "marcá qué recursos necesita cada módulo",
              "revisá la progresion antes de grabar."
            ]
          },
          {
            "type": "paragraph",
            "text": "La estructura no tiene que ser compleja. Tiene que evitar que el curso dependa de la memoria mientras grabás."
          }
        ]
      },
      {
        "heading": "Error 3: explicar desde el experto",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El experto ve conexiones que el alumno todavía no puede ver. Por eso, explicar desde el experto suele producir clases cargadas de excepciones, referencias y conceptos que llegan demasiado pronto."
          },
          {
            "type": "paragraph",
            "text": "Consecuencia: el alumno siente que el contenido es valioso, pero no logra seguirlo con seguridad."
          },
          {
            "type": "paragraph",
            "text": "Cómo corregirlo:"
          },
          {
            "type": "list",
            "items": [
              "presenta primero el problema",
              "explicá el concepto necesario",
              "usá un ejemplo simple",
              "recien después abre matices o excepciones",
              "revisá si estás usando términos antes de explicarlos."
            ]
          },
          {
            "type": "paragraph",
            "text": "No se trata de simplificar sin criterio. Se trata de ordenar el acceso al criterio."
          }
        ]
      },
      {
        "heading": "Error 4: descuidar audio, ritmo o pausas",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una clase puede tener buen contenido y aun así ser difícil de cursar. Audio bajo, eco, interrupciónes, silencios largos o explicaciones sin pausas cansan."
          },
          {
            "type": "paragraph",
            "text": "Consecuencia: el alumno abandona la atención antes de abandonar el curso."
          },
          {
            "type": "paragraph",
            "text": "Cómo corregirlo:"
          },
          {
            "type": "list",
            "items": [
              "grabá una prueba corta antes de cada tanda",
              "revisá audio con auriculares",
              "corta inicios o finales innecesarios",
              "deja pausas cuando cambia una idea importante",
              "evitá clases demasiado largas si el tema puede dividirse."
            ]
          },
          {
            "type": "paragraph",
            "text": "La producción no tiene que ser perfecta. Tiene que permitir seguir la clase sin esfuerzo extra."
          }
        ]
      },
      {
        "heading": "Error 5: prometer más práctica de la que el curso ofrece",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Si el curso promete aplicación, el alumno espera oportunidades para usar lo aprendido. Si solo encuentra explicaciones, puede sentir qué falta una parte."
          },
          {
            "type": "paragraph",
            "text": "Consecuencia: el contenido se entiende, pero no se transforma en capacidad."
          },
          {
            "type": "paragraph",
            "text": "Cómo corregirlo:"
          },
          {
            "type": "list",
            "items": [
              "incluye ejercicios breves",
              "propone preguntas de aplicación",
              "usá casos reales o simulados",
              "pide revisar una producción propia",
              "conecta cada práctica con el objetivo de la clase."
            ]
          },
          {
            "type": "paragraph",
            "text": "No todas las clases necesitan una gran actividad. Pero el curso si necesita momentos donde el alumno haga algo con lo que aprendió."
          }
        ]
      },
      {
        "heading": "Error 6: no revisar la experiencia completa",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Cuando trabajás clase por clase, podés perder de vista el recorrido. Cada pieza puede estar bien y aun así la experiencia completa sentirse desordenada."
          },
          {
            "type": "paragraph",
            "text": "Consecuencia: materiales qué faltan, instrucciones confusas, módulos desbalanceados o cierres abruptos."
          },
          {
            "type": "paragraph",
            "text": "Cómo corregirlo:"
          },
          {
            "type": "list",
            "items": [
              "recorré el curso como estudiante",
              "revisá si los materiales mencionados están disponibles",
              "mirá si los títulos orientan",
              "controlá que el cierre conecte con el resultado prometido",
              "marcá solo errores que afecten comprensión o confianza."
            ]
          }
        ]
      },
      {
        "heading": "Una pregunta para detectar problemas",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Antes de publicar, revisá el curso con esta pregunta: qué puede trabar al alumno antes de llegar al resultado prometido."
          },
          {
            "type": "paragraph",
            "text": "No busques perfección. Busca trabas."
          },
          {
            "type": "paragraph",
            "text": "Si eliminas las principales, el primer curso ya va a estar mucho más cerca de ser una experiencia clara y útil."
          }
        ]
      }
    ]
  },
  "herramientas-para-editar-video-sin-complicarte": {
    "slug": "herramientas-para-editar-video-sin-complicarte",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Editar una clase no debería convertirse en otro curso paralelo. Si la herramienta te obliga a aprender producción antes de publicar, probablemente estás resolviendo un problema más grande que el que tenés."
          },
          {
            "type": "paragraph",
            "text": "La edición de una clase tiene que mejorar claridad, no perseguir perfección."
          }
        ]
      },
      {
        "heading": "Qué debe resolver la edición de una clase",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Antes de elegir herramienta, definí qué necesitás editar."
          },
          {
            "type": "paragraph",
            "text": "En la mayoría de las clases, la edición basíca resuelve:"
          },
          {
            "type": "list",
            "items": [
              "cortar inicios y finales innecesarios",
              "eliminar errores claros",
              "ordenar segmentos",
              "ajustar pausas demasiado largas",
              "agregar algun titulo simple",
              "mejorar audio si hay un problema menor",
              "exportar en un formato usable."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si eso cubre la necesidad, no necesitás una herramienta compleja. Necesitás una que te permita terminar."
          }
        ]
      },
      {
        "heading": "Edición mínima: cortar, ordenar y limpiar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La primera capa de edición es limpieza."
          },
          {
            "type": "paragraph",
            "text": "Esto incluye sacar los segundos donde estás acomodando la cámara, cortar una repetición evidente, eliminar una interrupción o dividir una clase larga en partes más fáciles de seguir."
          },
          {
            "type": "paragraph",
            "text": "No conviene cortar todas las pausas. Algunas pausas ayudan al alumno a procesar. Si eliminas cada respiro, la clase puede volverse agotadora."
          },
          {
            "type": "paragraph",
            "text": "La pregunta es: este corte ayuda a entender mejor o solo hace que el video parezca más rápido."
          }
        ]
      },
      {
        "heading": "Cuándo conviene agregar títulos o apoyos visuales",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Los títulos simples pueden ayudar cuando marcan una transición, nombran un concepto importante o separan pasos."
          },
          {
            "type": "paragraph",
            "text": "Conviene agregarlos cuando:"
          },
          {
            "type": "list",
            "items": [
              "la clase cambia de bloque",
              "aparece una definición clave",
              "querés reforzar una consigna",
              "estás enumerando pasos",
              "necesitás que el alumno recuerde una pregunta."
            ]
          },
          {
            "type": "paragraph",
            "text": "No hace falta llenar la clase de placas. Si cada frase importante tiene grafica, nada se siente importante."
          },
          {
            "type": "paragraph",
            "text": "Un apoyo visual sirve cuando orienta. Si decora, puede esperar."
          }
        ]
      },
      {
        "heading": "Cómo elegir herramienta según nivel y tiempo",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La mejor herramienta es la que podés usar de forma constante sin frenar la publicación."
          },
          {
            "type": "paragraph",
            "text": "Si estás empezando, buscá algo que permita:"
          },
          {
            "type": "list",
            "items": [
              "importar video sin complicaciones",
              "cortar y unir clips",
              "agregar texto simple",
              "ajustar volumen básico",
              "exportar fácil."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si ya tenés experiencia, puede tener sentido una herramienta más completa. Pero la pregunta sigue siendo la misma: qué problema real te resuelve."
          },
          {
            "type": "paragraph",
            "text": "No elijas por lo que la herramienta puede hacer. Elegí por lo que vos necesitás hacer esta semana."
          }
        ]
      },
      {
        "heading": "Evita sobreeditar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La sobreedicion suele aparecer cuando querés compensar inseguridad con detalles."
          },
          {
            "type": "paragraph",
            "text": "Señales de sobreedicion:"
          },
          {
            "type": "list",
            "items": [
              "pasas más tiempo ajustando transiciones que revisando claridad",
              "agregás efectos que no explican nada",
              "rehacés cortes por diferencias mínimas",
              "retrasos la publicación por detalles que el alumno no necesita",
              "cada clase tiene un estilo distinto porque probaste cosas nuevas."
            ]
          },
          {
            "type": "paragraph",
            "text": "Editar mejor no siempre es editar más."
          }
        ]
      },
      {
        "heading": "Un flujo simple de edición",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Para una clase grabada, un flujo razonable puede ser:"
          },
          {
            "type": "ordered-list",
            "items": [
              "mirar el video completo una vez",
              "marcar cortes necesarios",
              "limpiar inicio, final e interrupciónes",
              "agregar títulos solo donde orientan",
              "revisar audio general",
              "exportar una version",
              "mirar los primeros minutos y un tramo del medio",
              "publicar si nada afecta la comprensión."
            ]
          },
          {
            "type": "paragraph",
            "text": "Este flujo evita quedar atrapado en ajustes infinitos."
          }
        ]
      },
      {
        "heading": "La herramienta tiene que ayudarte a terminar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una buena herramienta de edición para cursos no es la más impresionante. Es la que te permite publicar clases claras con un esfuerzo sostenible."
          },
          {
            "type": "paragraph",
            "text": "Si una herramienta te da control total, pero te frena durante semanas, no está ayudando al curso."
          },
          {
            "type": "paragraph",
            "text": "Elegila por claridad, velocidad y consistencia. La clase no necesita demostrar que sabés editar. Necesita ayudar a aprender."
          }
        ]
      }
    ]
  },
  "importancia-de-la-buena-secuencia-formativa": {
    "slug": "importancia-de-la-buena-secuencia-formativa",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una buena teoría, una buena práctica y una buena evaluación pueden fallar si aparecen desconectadas. El aprendizaje no depende solo de la calidad de cada parte, sino del orden en que se encuentran."
          },
          {
            "type": "paragraph",
            "text": "Cuando la secuencia está bien armada, cada paso prepara el siguiente. Cuando se rompe, el alumno tiene piezas sueltas."
          }
        ]
      },
      {
        "heading": "La teoría da lenguaje y criterio",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La teoría cumple una función concreta: ayuda a nombrar, distinguir y decidir."
          },
          {
            "type": "paragraph",
            "text": "No debería ser una Introducción eterna ni una acumulación de definiciones. Debería darle al alumno el marco mínimo para entender que está mirando y por qué importa."
          },
          {
            "type": "paragraph",
            "text": "Una teoría útil responde:"
          },
          {
            "type": "list",
            "items": [
              "qué concepto necesito",
              "qué problema ayuda a entender",
              "qué decisión mejora",
              "qué errores evita."
            ]
          },
          {
            "type": "paragraph",
            "text": "Sin teoría, la práctica puede volverse mecánica. El alumno hace, pero no siempre sabe por qué lo hace."
          }
        ]
      },
      {
        "heading": "La práctica convierte comprensión en acción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La práctica aparece cuando el alumno necesita usar lo que entendió."
          },
          {
            "type": "paragraph",
            "text": "Puede ser un ejercicio, un caso, una consigna breve, una comparación, una revisión de una producción propia o una decisión guiada. No siempre tiene que ser grande. Tiene que obligar a mover el contenido fuera de la explicación."
          },
          {
            "type": "paragraph",
            "text": "Una práctica bien ubicada permite detectar:"
          },
          {
            "type": "list",
            "items": [
              "si el concepto se entendió",
              "si el alumno puede aplicarlo",
              "qué dudas aparecen",
              "qué parte necesita refuerzo."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si la práctica llega demasiado pronto, el alumno actúa sin criterio. Si llega demasiado tarde, puede haber entendido en teoría, pero no sabe usarlo."
          }
        ]
      },
      {
        "heading": "La evaluación muestra si el aprendizaje se sostiene",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Evaluar no debería sentirse como una sorpresa al final del camino. Debería estar conectado con lo que se explicá y se practicó."
          },
          {
            "type": "paragraph",
            "text": "Una evaluación puede cumplir varias funciones:"
          },
          {
            "type": "list",
            "items": [
              "confirmar comprensión",
              "detectar errores",
              "ordenar repaso",
              "mostrar avance",
              "cerrar una etapa antes de pasar a otra."
            ]
          },
          {
            "type": "paragraph",
            "text": "No toda evaluación necesita nota. A veces una pregunta bien hecha o una actividad de revisión alcanza para mostrar si el aprendizaje se sostiene."
          },
          {
            "type": "paragraph",
            "text": "Lo importante es que mida lo que el recorrido preparó."
          }
        ]
      },
      {
        "heading": "Qué pasa cuando el orden se rompe",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Cuando la teoría se extiende demasiado sin práctica, el alumno acumula información pero no ve uso."
          },
          {
            "type": "paragraph",
            "text": "Cuando la práctica aparece sin base, el alumno completa pasos sin criterio."
          },
          {
            "type": "paragraph",
            "text": "Cuando la evaluación pregunta algo que no se practicó, se siente injusta o arbitraria."
          },
          {
            "type": "paragraph",
            "text": "Cuando todo aparece junto, el alumno no sabe qué priorizar."
          },
          {
            "type": "paragraph",
            "text": "Estos problemas no siempre se ven en el temario. A veces un curso parece completo porque tiene teoría, práctica y evaluación. Pero si esas partes no se preparan entre sí, la experiencia sigue siendo débil."
          }
        ]
      },
      {
        "heading": "Cómo reconocer una secuencia bien armada",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una secuencia formativa bien armada suele tener señales claras:"
          },
          {
            "type": "list",
            "items": [
              "cada clase prepara algo qué viene después",
              "los ejemplos aparecen antes de la práctica autonoma",
              "la práctica usa criterios ya explicados",
              "la evaluación revisa lo trabajado",
              "el nivel de dificultad sube de forma razonable",
              "el alumno entiende por qué está haciendo cada paso."
            ]
          },
          {
            "type": "paragraph",
            "text": "La clave es la continuidad. No se trata de repetir siempre el mismo formato, sino de cuidar la relación entre partes."
          }
        ]
      },
      {
        "heading": "Una forma simple de revisar una secuencia",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Tomá cualquier módulo y hacete estas preguntas:"
          },
          {
            "type": "ordered-list",
            "items": [
              "qué concepto necesita el alumno antes de practicar",
              "dónde aparece un ejemplo",
              "que acción concreta hace el alumno",
              "cómo sabe si lo hizo bien",
              "qué necesita antes de pasar al siguiente módulo."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si alguna respuesta falta, la secuencia tiene un hueco."
          },
          {
            "type": "paragraph",
            "text": "Ese hueco no siempre exige agregar más contenido. A veces alcanza con cambiar el orden, ajustar una consigna o conectar mejor una actividad con lo explicado."
          }
        ]
      },
      {
        "heading": "Cada parte debería preparar la siguiente",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La teoría no está para ocupar el inicio. La práctica no está para decorar. La evaluación no está para cerrar por obligacion."
          },
          {
            "type": "paragraph",
            "text": "Cada parte tiene una función. Y la calidad aparece cuando esas funciones se conectan."
          },
          {
            "type": "paragraph",
            "text": "Una buena secuencia no hace que aprender sea automático. Hace que el camino sea más claro, más justo y más fácil de sostener."
          }
        ]
      }
    ]
  },
  "por-que-la-claridad-importa-mas-que-la-sobreproduccion": {
    "slug": "por-que-la-claridad-importa-mas-que-la-sobreproduccion",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un video prolijo no salva una explicación confusa. Una clase simple, en cambio, puede funcionar muy bien si el alumno entiende qué se espera, dónde mirar y qué hacer con lo que aprende."
          },
          {
            "type": "paragraph",
            "text": "La producción importa cuando ayuda a aprender. Cuando solo hace que el contenido parezca más elaborado, puede convertirse en ruido caro."
          }
        ]
      },
      {
        "heading": "Claridad no significa hacer todo básico",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Claridad no es bajar la exigencia. Tampoco es evitar temas complejos."
          },
          {
            "type": "paragraph",
            "text": "Una experiencia formativa clara permite que el alumno entienda:"
          },
          {
            "type": "list",
            "items": [
              "qué problema está trabajando",
              "qué concepto necesita",
              "qué paso viene después",
              "cómo usar un recurso",
              "cómo saber si avanza."
            ]
          },
          {
            "type": "paragraph",
            "text": "Un tema difícil puede explicarse con claridad. Un tema simple puede explicarse de forma confusa. La diferencia no está en la dificultad del contenido, sino en las decisiones que ordenan la experiencia."
          }
        ]
      },
      {
        "heading": "La producción suma cuando cumple una función",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La producción visual, la edición, las placas, las animaciones o los recursos gráficos pueden mejorar una clase. El punto es que tengan una función."
          },
          {
            "type": "paragraph",
            "text": "Una placa suma si ordena una definición. Un corte suma si elimina ruido. Una animación suma si muestra una relación que seria difícil de explicar solo con palabras. Una buena iluminación suma si permite ver gestos, recursos o demostraciones."
          },
          {
            "type": "paragraph",
            "text": "La pregunta no es si el recurso se ve bien. La pregunta es si ayuda al alumno a entender mejor."
          },
          {
            "type": "paragraph",
            "text": "Cuando la respuesta es sí, la producción no es decoración. Es parte de la didáctica."
          }
        ]
      },
      {
        "heading": "La producción distrae cuando compite con la explicación",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El problema aparece cuando el recurso se vuelve protagonista."
          },
          {
            "type": "paragraph",
            "text": "Puede pasar con:"
          },
          {
            "type": "list",
            "items": [
              "animaciones que se mueven más de lo que explican",
              "música o efectos que cansan",
              "transiciones innecesarias",
              "fondos demasiado cargados",
              "edición que corta pausas útiles",
              "gráficos lindos pero poco legibles."
            ]
          },
          {
            "type": "paragraph",
            "text": "En esos casos, el alumno prestá atención a la forma y pierde parte del contenido."
          },
          {
            "type": "paragraph",
            "text": "Una clase no necesita demostrar todo el tiempo que está producida. Necesita sostener la atención en lo importante."
          }
        ]
      },
      {
        "heading": "Una decisión clara vale más que un efecto",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Muchas mejoras formativas no requieren más producción. Requieren mejores decisiones."
          },
          {
            "type": "paragraph",
            "text": "Por ejemplo:"
          },
          {
            "type": "list",
            "items": [
              "dividir una clase larga en dos partes",
              "poner primero el problema y después la definición",
              "mostrar un ejemplo antes de abrir excepciones",
              "nombrar claramente un recurso",
              "cerrar con una acción concreta",
              "eliminar una explicación que no aporta al objetivo."
            ]
          },
          {
            "type": "paragraph",
            "text": "Estas decisiones no siempre se ven como \"producción\", pero cambian la experiencia."
          },
          {
            "type": "paragraph",
            "text": "Si el alumno entiende mejor, la calidad sube aunque no haya más efectos."
          }
        ]
      },
      {
        "heading": "Lo simple también necesita criterio",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Defender la claridad no significa aceptar cualquier cosa. Un audio que no se entiende, una imagen oscura o una clase sin estructura no son \"simples\". Son problemas."
          },
          {
            "type": "paragraph",
            "text": "La simplicidad funciona cuando hay criterio detrás:"
          },
          {
            "type": "list",
            "items": [
              "audio suficiente",
              "imagen estable",
              "objetivo claro",
              "ritmo cuidado",
              "ejemplos pertinentes",
              "materiales con función."
            ]
          },
          {
            "type": "paragraph",
            "text": "Lo simple sin criterio se vuelve pobre. Lo producido sin claridad se vuelve pesado. La buena experiencia está en el equilibrio."
          }
        ]
      },
      {
        "heading": "Cómo decidir que mejorar primero",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Cuando tengas que mejorar una clase o una experiencia, ordená las prioridades así:"
          },
          {
            "type": "ordered-list",
            "items": [
              "lo que impide entender",
              "lo que confunde el recorrido",
              "lo que dificulta practicar",
              "lo que baja confianza",
              "lo que solo mejora apariencia."
            ]
          },
          {
            "type": "paragraph",
            "text": "Ese orden evita gastar energía en detalles visibles pero secundarios."
          },
          {
            "type": "paragraph",
            "text": "Si el audio no se entiende, no empieces por animaciones. Si el objetivo es confuso, no empieces por una placa más linda. Si la actividad no tiene sentido, no la maquilles."
          }
        ]
      },
      {
        "heading": "La pregunta final",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Antes de sumar producción, pregunta: esto ayuda al alumno a entender, decidir o aplicar mejor."
          },
          {
            "type": "paragraph",
            "text": "Si la respuesta es sí, vale la pena."
          },
          {
            "type": "paragraph",
            "text": "Si la respuesta es no, probablemente estás agregando forma donde falta claridad."
          }
        ]
      }
    ]
  },
  "que-diferencia-a-un-curso-serio-de-uno-superficial": {
    "slug": "que-diferencia-a-un-curso-serio-de-uno-superficial",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un curso puede verse prolijo y aun así estar mal pensado para aprender. La presentación ayuda, pero la seriedad de una formación se nota en la claridad de su promesa, la secuencia del contenido y la forma en que lleva al alumno hacia un resultado real."
          },
          {
            "type": "paragraph",
            "text": "No se trata de que un curso serio sea más difícil o más largo. Se trata de que cada parte tenga una función."
          }
        ]
      },
      {
        "heading": "Una promesa seria tiene límites",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La primera señal es la promesa. Un curso serio no intenta resolver todo para todos."
          },
          {
            "type": "paragraph",
            "text": "Una promesa útil dice:"
          },
          {
            "type": "list",
            "items": [
              "para quién es",
              "qué problema aborda",
              "qué nivel supone",
              "qué resultado razonable puede esperar el alumno",
              "qué no cubre."
            ]
          },
          {
            "type": "paragraph",
            "text": "Las promesas enormes suelen sonar atractivas, pero dejan poco margen para una experiencia clara. \"Aprende todo sobre formación online\" es difícil de sostener. \"Aprende a planificar una clase asincrónica con objetivo, estructura y cierre\" permite evaluar si el contenido cumple."
          },
          {
            "type": "paragraph",
            "text": "La precision no achica el valor. Lo hace verificable."
          }
        ]
      },
      {
        "heading": "La secuencia importa más que la cantidad de temas",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un temario largo no garantiza profundidad. A veces solo muestra acumulación."
          },
          {
            "type": "paragraph",
            "text": "Una buena secuencia hace que cada módulo prepare el siguiente. Empieza por conceptos necesarios, avanza hacia criterios, propone ejemplos y abre espacios de aplicación o revisión."
          },
          {
            "type": "paragraph",
            "text": "Un curso superficial suele tener otro patrón: muchos temas, poco orden y pocas conexiones. El alumno siente que recibió información, pero no necesariamente sabe qué hacer con ella."
          },
          {
            "type": "paragraph",
            "text": "Para evaluar la secuencia, mirá si podés responder:"
          },
          {
            "type": "list",
            "items": [
              "por qué este módulo va antes que el siguiente",
              "qué base construye cada parte",
              "dónde aparece la práctica",
              "cómo se recupera lo aprendido."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si el orden parece intercambiable, quizás el curso está más armado como lista que como recorrido."
          }
        ]
      },
      {
        "heading": "Los ejemplos muestran si hay criterio",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Los ejemplos son una forma de ver si el curso baja a tierra."
          },
          {
            "type": "paragraph",
            "text": "Un curso superficial se queda en definiciones generales. Un curso serio muestra casos, decisiones, errores frecuentes o situaciónes donde el criterio se pone a prueba."
          },
          {
            "type": "paragraph",
            "text": "No hace falta que cada clase tenga un caso complejo. Pero si el curso nunca muestra cómo se usa lo que explica, el alumno tiene que hacer demasiado trabajo solo."
          },
          {
            "type": "paragraph",
            "text": "Buscá ejemplos que:"
          },
          {
            "type": "list",
            "items": [
              "aclaren una decisión",
              "muestren una consecuencia",
              "comparen una version débil y una mejor",
              "conecten teoría con práctica."
            ]
          },
          {
            "type": "paragraph",
            "text": "Un ejemplo bien elegido vale más que una definición repetida tres veces."
          }
        ]
      },
      {
        "heading": "La práctica no tiene que ser grande, pero tiene que existir",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Si una formación promete aplicación, debería ofrecer alguna forma de practicar. Puede ser una consigna, un ejercicio, una pregunta guiada, una revisión de caso o una actividad breve."
          },
          {
            "type": "paragraph",
            "text": "La práctica ayuda a detectar si el alumno entendió o solo siguió la explicación."
          },
          {
            "type": "paragraph",
            "text": "Un curso puede ser introductorio y tener poca práctica. Eso está bien si la promesa es introductoria. Lo problematico es prometer transformación profesional y ofrecer solo exposición."
          },
          {
            "type": "paragraph",
            "text": "La pregunta no es \"cuanta práctica tiene\". La pregunta es \"la práctica coincide con el resultado que promete\"."
          }
        ]
      },
      {
        "heading": "La evaluación debería medir lo que el curso enseña",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una evaluación seria no aparece como sorpresa. Está conectada con lo que el curso explicó y practicó."
          },
          {
            "type": "paragraph",
            "text": "Puede ser simple. Un quiz bien pensado puede ayudar a revisar conceptos. Una actividad puede mostrar si el alumno puede aplicar un criterio. Una autoevaluación puede ordenar dudas."
          },
          {
            "type": "paragraph",
            "text": "Lo importante es la coherencia."
          },
          {
            "type": "paragraph",
            "text": "Si el curso evalúa cosas que no preparó, genera frustración. Si evalúa demasiado fácil, no informa. Si no evalúa nada y prometía aplicación, dejá al alumno sin referencia."
          }
        ]
      },
      {
        "heading": "La profundidad no siempre se ve en la duración",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Más horas no siempre significan mejor formación. Menos horas tampoco significan superficialidad."
          },
          {
            "type": "paragraph",
            "text": "Un curso corto puede ser serio si tiene un objetivo claro, buen recorte y una secuencia precisa. Un curso largo puede ser superficial si acumula contenido sin criterio."
          },
          {
            "type": "paragraph",
            "text": "La calidad está en la relación entre promesa, recorrido y resultado. La duración solo tiene sentido dentro de esa relación."
          }
        ]
      },
      {
        "heading": "Preguntas antes de elegir",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Antes de decidir, podés revisar:"
          },
          {
            "type": "list",
            "items": [
              "la promesa es concreta o demasiado amplia",
              "el curso dice para quién es",
              "el temario tiene progresion",
              "hay ejemplos o solo definiciones",
              "existe práctica si la promesa es aplicar",
              "la evaluación coincide con lo enseñado",
              "queda claro qué esfuerzo demanda."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si varias respuestas quedan en el aire, no necesariamente tenés que descartar el curso. Pero si conviene pedir más información o seguir comparando."
          }
        ]
      },
      {
        "heading": "Un curso serio te ayuda a decidir mejor",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La seriedad de una formación se nota antes de empezar. No en la solemnidad, no en la dificultad, no en la cantidad de módulos."
          },
          {
            "type": "paragraph",
            "text": "Se nota en si la propuesta comunica con claridad qué ofrece, para quién es y cómo te va a llevar hasta ahí."
          },
          {
            "type": "paragraph",
            "text": "Elegir con ese criterio reduce una de las frustraciones más comunes: terminar un curso prolijo, pero no salir con una capacidad, una decisión o un criterio más claro."
          }
        ]
      }
    ]
  },
  "que-hace-efectiva-una-experiencia-de-aprendizaje-online": {
    "slug": "que-hace-efectiva-una-experiencia-de-aprendizaje-online",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una experiencia de aprendizaje online no es efectiva porque tenga muchas clases, una plataforma prolija o materiales descargables. Es efectiva cuando ayuda al alumno a entender que tiene que aprender, cómo avanzar y cómo saber si está progresando."
          },
          {
            "type": "paragraph",
            "text": "La tecnología puede ayudar. Pero si la experiencia está mal pensada, solo hace más visible el desorden."
          }
        ]
      },
      {
        "heading": "Objetivos claros desde el inicio",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El alumno necesita saber qué puede esperar. No en términos grandilocuentes, sino concretos."
          },
          {
            "type": "paragraph",
            "text": "Un objetivo claro responde:"
          },
          {
            "type": "list",
            "items": [
              "qué voy a aprender",
              "para qué me sirve",
              "qué nivel supone",
              "qué voy a poder hacer o decidir al final."
            ]
          },
          {
            "type": "paragraph",
            "text": "Cuando esa información falta, el alumno completa los huecos con expectativas propias. A veces espera más acompañamiento del que habrá. A veces cree que el curso es inicial cuando en realidad requiere base previa. A veces avanza sin entender qué resultado debería estar construyendo."
          },
          {
            "type": "paragraph",
            "text": "La claridad inicial evita frustraciones que después son difíciles de corregir."
          }
        ]
      },
      {
        "heading": "Una buena secuencia da ritmo",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El aprendizaje online necesita ritmo porque no siempre hay una clase en vivo empujando el avance. Ese ritmo no depende solo de fechas. Depende de secuencia."
          },
          {
            "type": "paragraph",
            "text": "Una buena secuencia hace que cada parte prepare la siguiente:"
          },
          {
            "type": "list",
            "items": [
              "primero da lenguaje",
              "después muestra criterio",
              "luego propone aplicación",
              "finalmente permite revisar si hubo aprendizaje."
            ]
          },
          {
            "type": "paragraph",
            "text": "Cuando el orden se rompe, el alumno siente que el contenido está completo, pero no conectado. Puede haber buenas clases y aun así una mala experiencia."
          },
          {
            "type": "paragraph",
            "text": "El problema no es solo pedagogico. Es practicó. Si no se entiende cómo avanzar, aumenta la chance de abandono o cursada superficial."
          }
        ]
      },
      {
        "heading": "Los recursos tienen que tener función",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un recurso no mejora una experiencia por existir. Una guía, un quiz, una clase grabada o una lectura sirven cuando tienen una función clara."
          },
          {
            "type": "paragraph",
            "text": "Por ejemplo:"
          },
          {
            "type": "list",
            "items": [
              "una clase introduce y explica",
              "un material ayuda a practicar o repasar",
              "un quiz muestra qué falta revisar",
              "una actividad obliga a aplicar criterio",
              "una consigna ordena el siguiente paso."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si el alumno no entiende para qué usar un recurso, probablemente lo ignore o lo complete como trámite. En ambos casos, se pierde valor."
          }
        ]
      },
      {
        "heading": "La práctica conecta contenido con aprendizaje",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una experiencia online puede caer facilmente en consumo pasívo. El alumno mira, toma notas, avanza, pero no necesariamente aprende a usar lo visto."
          },
          {
            "type": "paragraph",
            "text": "La práctica corta ese circuito. No siempre tiene que ser compleja. Puede ser una pregunta de aplicación, un caso, una revisión de una producción propia o una decisión guiada."
          },
          {
            "type": "paragraph",
            "text": "Lo importante es que obligue a pasar de \"entiendo lo que dice\" a \"puedo usar este criterio\"."
          },
          {
            "type": "paragraph",
            "text": "Sin algun tipo de práctica, la experiencia puede sentirse ordenada, pero quedarse corta cuando el alumno necesita aplicar."
          }
        ]
      },
      {
        "heading": "La evaluación no debería aparecer como sorpresa",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Evaluar no es solo poner una nota o aprobar un paso. También es ayudar al alumno a saber si está entendiendo."
          },
          {
            "type": "paragraph",
            "text": "Una evaluación bien conectada mide algo que fue explicado y practicado. Si pregunta otra cosa, rompe confianza. Si es demasiado fácil, no informa. Si aparece sin criterio, se siente arbitraria."
          },
          {
            "type": "paragraph",
            "text": "La evaluación puede ser formal o informal, automática o manual, simple o compleja. Lo que no debería perder es coherencia con el recorrido."
          }
        ]
      },
      {
        "heading": "La confianza se construye con consistencia",
        "blocks": [
          {
            "type": "paragraph",
            "text": "En formación digital, la confianza no depende de una promesa fuerte. Depende de que la experiencia cumpla lo que dice."
          },
          {
            "type": "paragraph",
            "text": "Si el curso promete una Introducción, no debería asumir conocimientos avanzados. Si promete aplicación, debería ofrecer práctica. Si pide tiempo, debería estar claro desde el inicio. Si usa materiales, deberian estar disponibles y tener sentido."
          },
          {
            "type": "paragraph",
            "text": "Cada detalle consistente reduce incertidumbre. Cada contradiccion obliga al alumno a interpretar solo."
          }
        ]
      },
      {
        "heading": "Cómo evaluar si una experiencia online funciona",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una buena pregunta final es está: la experiencia ayuda al alumno a saber qué hacer, por qué hacerlo y cómo reconocer si avanza."
          },
          {
            "type": "paragraph",
            "text": "Si la respuesta es sí, hay una base efectiva."
          },
          {
            "type": "paragraph",
            "text": "Si la respuesta es no, agregar más clases, más recursos o más decoración no va a resolver el problema principal. Primero hay que ordenar el aprendizaje."
          }
        ]
      }
    ]
  },
  "que-revisar-antes-de-publicar-un-curso": {
    "slug": "que-revisar-antes-de-publicar-un-curso",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Publicar un curso no es solo tener las clases listas. Antes de mostrarlo al alumno, conviene revisar si la promesa, el orden, los materiales y las instrucciones sostienen una experiencia clara."
          },
          {
            "type": "paragraph",
            "text": "La revisión final no debería convertirse en una excusa para rehacer todo. Sirve para detectar fricciones que todavía estás a tiempo de corregir."
          }
        ]
      },
      {
        "heading": "Revisá si la promesa coincide con el recorrido",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Empezá por la promesa del curso. Qué le estás diciendo al alumno que va a lograr."
          },
          {
            "type": "paragraph",
            "text": "Después mirá los módulos y clases como si no los hubieras creado vos. La pregunta es simple: el recorrido realmente lleva hacia esa promesa."
          },
          {
            "type": "paragraph",
            "text": "Señales de desajuste:"
          },
          {
            "type": "list",
            "items": [
              "el curso promete aplicación, pero casí no hay práctica",
              "el titulo sugiere nivel inicial, pero aparecen conceptos avanzados sin explicación",
              "el objetivo habla de un resultado concreto, pero las clases se quedan en panorama general",
              "hay módulos interesantes que no ayudan al resultado principal."
            ]
          },
          {
            "type": "paragraph",
            "text": "No hace falta que cada clase haga todo. Pero cada parte debería tener una razón para estar."
          }
        ]
      },
      {
        "heading": "Revisá el orden de módulos y clases",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El orden es una parte del contenido. Una buena clase puede fallar si aparece antes de tiempo."
          },
          {
            "type": "paragraph",
            "text": "Mirá la secuencia y preguntate:"
          },
          {
            "type": "list",
            "items": [
              "qué necesita saber el alumno antes de esta clase",
              "esta clase prepara algo qué viene después",
              "hay conceptos usados antes de ser explicados",
              "hay repeticiones que podrían unirse",
              "hay saltos bruscos de dificultad."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si una clase depende de otra, el orden debería hacerlo evidente. Si dos clases explican casí lo mismo, quizás una necesita recorte. Si un módulo se siente aislado, revisá si pertenece a este curso o a otro."
          }
        ]
      },
      {
        "heading": "Revisá materiales mencionados y disponibles",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un error frecuente es nombrar un material durante la clase y olvidarse de dejarlo disponible. Para el alumno, eso rompe confianza. No sabe si se perdió algo o si el curso está incompleto."
          },
          {
            "type": "paragraph",
            "text": "Hacé una lista de todos los recursos mencionados:"
          },
          {
            "type": "list",
            "items": [
              "archivos",
              "lecturas",
              "plantillas",
              "ejercicios",
              "enlaces",
              "consignas",
              "ejemplos descargables."
            ]
          },
          {
            "type": "paragraph",
            "text": "Después revisa si están, si tienen nombre claro y si se entiende cuando usarlos."
          },
          {
            "type": "paragraph",
            "text": "Un material sin función también puede distraer. Si no aporta a la clase o al módulo, no hace falta incluirlo."
          }
        ]
      },
      {
        "heading": "Revisá instrucciones desde la mirada del alumno",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Quién crea el curso conoce el mapa completo. El alumno no."
          },
          {
            "type": "paragraph",
            "text": "Por eso conviene revisar las instrucciones con menos contexto:"
          },
          {
            "type": "list",
            "items": [
              "se entiende qué hacer primero",
              "se entiende cómo avanzar",
              "se entiende qué entregar, mirar o practicar",
              "se entiende cuanto esfuerzo aproximado requiere",
              "se entiende qué hacer si una actividad parece difícil."
            ]
          },
          {
            "type": "paragraph",
            "text": "No necesitás explicar de más. Necesitás eliminar ambigüedades qué pueden frenar."
          },
          {
            "type": "paragraph",
            "text": "Una consigna clara suele decir qué hay que hacer, con qué recurso, para qué objetivo y qué resultado se espera."
          }
        ]
      },
      {
        "heading": "Revisá calidad mínima de audio y video",
        "blocks": [
          {
            "type": "paragraph",
            "text": "No busques perfección. Busca que nada impida aprender."
          },
          {
            "type": "paragraph",
            "text": "En cada clase, revisá:"
          },
          {
            "type": "list",
            "items": [
              "el audio se entiende sin esfuerzo",
              "no hay ruidos constantes que cansen",
              "la imagen permite seguir gestos o recursos",
              "los cortes no eliminan información importante",
              "el inicio y el cierre no quedan abruptos."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si el contenido es bueno, no lo frenes por detalles menores. Pero si el audio cansa o la explicación se corta en un punto clave, corregilo antes de publicar."
          }
        ]
      },
      {
        "heading": "Revisá coherencia de nombres y temas",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Los nombres orientan. Un módulo llamado de una forma y una clase que promete otra cosa confunden más de lo que parece."
          },
          {
            "type": "paragraph",
            "text": "Antes de publicar, revisá:"
          },
          {
            "type": "list",
            "items": [
              "títulos de módulos",
              "títulos de clases",
              "nombres de materiales",
              "orden visible del recorrido",
              "consistencia entre tema y contenido."
            ]
          },
          {
            "type": "paragraph",
            "text": "Los títulos no tienen que ser creativos. Tienen que ayudar al alumno a ubicarse."
          }
        ]
      },
      {
        "heading": "Hace una pasada completa como estudiante",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La última revisión debería ser lineal. Entrá al recorrido como si fueras alumno y avanza desde el inicio."
          },
          {
            "type": "paragraph",
            "text": "No busques mejorar todo. Marcá solo lo qué puede afectar comprensión, confianza o continuidad."
          },
          {
            "type": "paragraph",
            "text": "Checklist final:"
          },
          {
            "type": "list",
            "items": [
              "la promesa coincide con el contenido",
              "el orden tiene sentido",
              "los materiales están disponibles",
              "las instrucciones se entienden",
              "audio y video no bloquean",
              "los títulos orientan",
              "el cierre del curso deja claro qué hacer después."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si algo no afecta al alumno, puede esperar. Si lo afecta, corregilo antes de publicar."
          }
        ]
      }
    ]
  },
  "que-tener-en-cuenta-antes-de-inscribirte-online": {
    "slug": "que-tener-en-cuenta-antes-de-inscribirte-online",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Inscribirte en una formación online no debería depender solo de que el tema te interese. Antes de comprometer tiempo, dinero y energía, conviene revisar si la propuesta encaja con el objetivo, el nivel y la forma real de estudiar."
          },
          {
            "type": "paragraph",
            "text": "Una buena decisión de inscripción empieza antes del pago. Empieza cuando mirás la formación con preguntas concretas, no solo con entusiasmo."
          }
        ]
      },
      {
        "heading": "Revisá qué objetivo promete",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El primer filtro es simple: que dice que vas a lograr."
          },
          {
            "type": "paragraph",
            "text": "Un curso puede tener un temario atractivo y aun así no dejar claro para qué sirve. Si la promesa es demasiado amplia, como \"aprender todo sobre el tema\", probablemente falte recorte. Si la promesa es concreta, es más fácil evaluar si te sirve."
          },
          {
            "type": "paragraph",
            "text": "Buscá respuestas a estas preguntas:"
          },
          {
            "type": "list",
            "items": [
              "qué voy a poder entender, hacer o decidir al terminar",
              "para qué nivel está pensado",
              "qué conocimientos previos supone",
              "qué parte del tema deja afuera."
            ]
          },
          {
            "type": "paragraph",
            "text": "Lo qué queda afuera también importa. Ninguna formación seria cubre todo. Si no hay límites, es difícil saber qué esperar."
          }
        ]
      },
      {
        "heading": "Entende la modalidad antes de empezar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "\"Online\" puede significar muchas cosas. Puede ser asincrónico, con clases grabadas. Puede tener encuentros en vivo. Puede combinar materiales, actividades y evaluaciones. Puede requerir seguimiento semanal o permitir avance más libre."
          },
          {
            "type": "paragraph",
            "text": "No alcanza con saber que se cursa por internet. Tenés que entender cómo se cursa."
          },
          {
            "type": "paragraph",
            "text": "Antes de inscribirte, revisá:"
          },
          {
            "type": "list",
            "items": [
              "si las clases son grabadas, en vivo o mixtas",
              "si hay fechas o ritmo sugerido",
              "si hay actividades obligatorias",
              "si hay instancias de evaluación",
              "si vas a necesitar descargar o preparar materiales",
              "cuanto tiempo real demanda por semana."
            ]
          },
          {
            "type": "paragraph",
            "text": "La flexibilidad ayuda, pero no significa ausencia de esfuerzo. Un curso asincrónico también necesita agenda."
          }
        ]
      },
      {
        "heading": "Mirá si hay práctica suficiente para el objetivo",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Si el objetivo es aplicar, no alcanza con mirar clases. Necesitás alguna forma de practicar, revisar casos, responder preguntas, resolver actividades o contrastar lo aprendido con situaciónes reales."
          },
          {
            "type": "paragraph",
            "text": "Esto no significa que todos los cursos tengan que ser prácticos en el mismo nivel. Un curso introductorio puede enfocarse más en base conceptual. Un curso avanzado puede pedir más aplicación."
          },
          {
            "type": "paragraph",
            "text": "La pregunta es si la modalidad coincide con lo que necesitás."
          },
          {
            "type": "paragraph",
            "text": "Si querés explorar un tema, tal vez alcanza con una formación clara y bien ordenada. Si querés usar una herramienta, cambiar una práctica o mejorar una decisión profesional, deberías buscar más que exposición."
          }
        ]
      },
      {
        "heading": "Pregunta qué tipo de soporte necesitás",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El soporte no siempre significa tener a alguien respondiendo todo en tiempo real. Puede ser una explicación clara, consignas bien escritas, materiales ordenados, evaluaciones útiles o canales definidos para dudas."
          },
          {
            "type": "paragraph",
            "text": "Lo importante es no asumir soporte que la propuesta no ofrece."
          },
          {
            "type": "paragraph",
            "text": "Antes de inscribirte, preguntate:"
          },
          {
            "type": "list",
            "items": [
              "necesito acompañamiento cercano o puedo avanzar solo",
              "entiendo cómo resolver dudas",
              "hay criterios para saber si voy bien",
              "la información del curso reduce incertidumbre o me deja adivinando."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si sos principiante en el tema, la claridad de soporte pesa más. Si ya tenés experiencia, quizás necesitás menos acompañamiento y más profundidad."
          }
        ]
      },
      {
        "heading": "Calcula el costo real de cursar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El precio no es el unico costo. También está el tiempo, la atención y la continuidad que vas a necesitar."
          },
          {
            "type": "paragraph",
            "text": "Un curso puede parecer accesible y terminar siendo caro si no podés sostenerlo. También puede parecer demandante y valer la pena si encaja con un objetivo importante."
          },
          {
            "type": "paragraph",
            "text": "Hacé una cuenta simple:"
          },
          {
            "type": "list",
            "items": [
              "cuantas horas por semana puedo dedicar",
              "cuantas semanas puedo sostener ese ritmo",
              "qué voy a dejar de hacer para estudiar",
              "qué pasa si una semana me atráso."
            ]
          },
          {
            "type": "paragraph",
            "text": "Si no podés responder nada de eso, todavía no estás evaluando la formación completa. Estás mirando solo la inscripción."
          }
        ]
      },
      {
        "heading": "Señales de alerta antes de inscribirte",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Algunas señales no significan que el curso sea malo, pero sí que conviene mirar más de cerca:"
          },
          {
            "type": "list",
            "items": [
              "promete resultados enormes sin explicar el recorrido",
              "no dice para qué nivel está pensado",
              "el temario parece largo, pero no muestra progresion",
              "no queda claro cómo se evalúa o practica",
              "hablá mucho de beneficios y poco de esfuerzo requerido",
              "no explica que necesitás saber antes."
            ]
          },
          {
            "type": "paragraph",
            "text": "Una formación seria no tiene que responder todo en exceso, pero sí debería darte información suficiente para decidir."
          }
        ]
      },
      {
        "heading": "Inscribite cuando objetivo, modalidad y tiempo esten alineados",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La mejor pregunta final es está: puedo explicar por qué este curso me conviene ahora."
          },
          {
            "type": "paragraph",
            "text": "Si la respuesta incluye el objetivo, el nivel, la modalidad y el tiempo que podés dedicar, estás decidiendo con criterio."
          },
          {
            "type": "paragraph",
            "text": "Si la respuesta es solo \"me interesa el tema\", tal vez necesites mirar un poco más antes de inscribirte."
          }
        ]
      }
    ]
  },
  "transformar-experiencia-profesional-en-propuesta-formativa": {
    "slug": "transformar-experiencia-profesional-en-propuesta-formativa",
    "sections": [
      {
        "heading": "Introducción",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Tener experiencia profesional no alcanza para armar una buena formación. Hay que decidir qué parte de esa experiencia puede aprender otra persona, en qué orden y con qué práctica."
          },
          {
            "type": "paragraph",
            "text": "El riesgo no es saber poco. El riesgo es querer volcar todo sin convertirlo en recorrido."
          }
        ]
      },
      {
        "heading": "Separá experiencia, criterio y procedimiento",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La experiencia profesional suele mezclar muchas capas:"
          },
          {
            "type": "list",
            "items": [
              "cosas que hiciste",
              "decisiones que tomaste",
              "errores qué aprendiste a evitar",
              "criterios que hoy usás casí sin pensarlo",
              "pasos que repetis en la práctica."
            ]
          },
          {
            "type": "paragraph",
            "text": "Para enseñar, conviene separar esas capas."
          },
          {
            "type": "paragraph",
            "text": "La experiencia da contexto. El criterio ayuda a decidir. El procedimiento muestra cómo actuar."
          },
          {
            "type": "paragraph",
            "text": "Si solo contás experiencia, el alumno escucha una historia. Si solo das procedimiento, puede aplicar pasos sin entender. Si explicás criterio, empieza a aprender cómo pensar el problema."
          }
        ]
      },
      {
        "heading": "Elegí un problema real del alumno",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Una propuesta formativa clara no empieza con \"todo lo que se\". Empieza con un problema que el alumno necesita resolver."
          },
          {
            "type": "paragraph",
            "text": "Por ejemplo:"
          },
          {
            "type": "list",
            "items": [
              "no sabe planificar una clase",
              "no sabe evaluar si un curso es serio",
              "no sabe organizar su estudio",
              "no sabe preparar una grabación mínima",
              "no sabe convertir conocimiento en una secuencia."
            ]
          },
          {
            "type": "paragraph",
            "text": "El problema elegido funciona como filtro. Lo que ayuda a resolverlo entra. Lo qué no, queda para otra propuesta."
          },
          {
            "type": "paragraph",
            "text": "Sin ese filtro, la experiencia profesional se expande demasiado."
          }
        ]
      },
      {
        "heading": "Convertí experiencia en objetivos observables",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Un objetivo observable dice qué cambió debería producirse en el alumno."
          },
          {
            "type": "paragraph",
            "text": "No es lo mismo:"
          },
          {
            "type": "list",
            "items": [
              "\"compartir mi experiencia en formación digital\""
            ]
          },
          {
            "type": "paragraph",
            "text": "que:"
          },
          {
            "type": "list",
            "items": [
              "\"ayudar al alumno a definir objetivos, módulos y materiales antes de grabar un curso\"."
            ]
          },
          {
            "type": "paragraph",
            "text": "El segundo objetivo permite diseñar clases, ejemplos y actividades. El primero solo describe una intención."
          },
          {
            "type": "paragraph",
            "text": "Para convertir experiencia en objetivo, completá:"
          },
          {
            "type": "paragraph",
            "text": "\"Al terminar, el alumno debería poder...\""
          },
          {
            "type": "paragraph",
            "text": "Si no podés completar la frase con una acción o decisión concreta, todavía falta recorte."
          }
        ]
      },
      {
        "heading": "Ordená una progresion de aprendizaje",
        "blocks": [
          {
            "type": "paragraph",
            "text": "El orden de la experiencia no siempre es el orden del aprendizaje."
          },
          {
            "type": "paragraph",
            "text": "Quizás vos aprendiste por ensayo, errores, trabajo y años de práctica. El alumno necesita una secuencia más cuidada."
          },
          {
            "type": "paragraph",
            "text": "Una progresion simple puede ser:"
          },
          {
            "type": "ordered-list",
            "items": [
              "entender el problema",
              "conocer los conceptos necesarios",
              "ver un ejemplo",
              "practicar con guía",
              "revisar errores frecuentes",
              "aplicar con más autonomía."
            ]
          },
          {
            "type": "paragraph",
            "text": "No todos los cursos necesitan todos esos pasos, pero la lógica ayuda: primero construir base, después criterio, después acción."
          }
        ]
      },
      {
        "heading": "Traduce conocimiento tácito",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Muchas veces, lo más valioso de la experiencia profesional está en decisiones que ya hacés automáticamente."
          },
          {
            "type": "paragraph",
            "text": "Por ejemplo:"
          },
          {
            "type": "list",
            "items": [
              "saber cuando un curso está demasiado amplio",
              "notar que una consigna va a confundir",
              "elegir qué ejemplo conviene mostrar primero",
              "detectar si una clase está cargada de más."
            ]
          },
          {
            "type": "paragraph",
            "text": "Eso es conocimiento tácito. Para enseñarlo, hay que volverlo visible."
          },
          {
            "type": "paragraph",
            "text": "Preguntá:"
          },
          {
            "type": "list",
            "items": [
              "qué miro para decidir",
              "que señales me alertan",
              "qué errores evitaría",
              "que comparación ayuda a verlo",
              "qué haría primero en un caso real."
            ]
          },
          {
            "type": "paragraph",
            "text": "Ahí suele estar el valor formativo."
          }
        ]
      },
      {
        "heading": "Definí práctica y evidencia de avance",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Si querés que el alumno incorpore criterio, necesita hacer algo con el contenido."
          },
          {
            "type": "paragraph",
            "text": "La práctica puede ser pequeña:"
          },
          {
            "type": "list",
            "items": [
              "revisar una clase",
              "escribir un objetivo",
              "ordenar módulos",
              "comparar dos propuestas",
              "completar una checklist",
              "detectar errores en un caso."
            ]
          },
          {
            "type": "paragraph",
            "text": "También necesitás alguna evidencia de avance. No necesariamente una nota. Puede ser una producción, una decisión mejor fundamentada o una revisión más precisa."
          },
          {
            "type": "paragraph",
            "text": "La pregunta es: cómo sabría el alumno que aprendió algo."
          }
        ]
      },
      {
        "heading": "La propuesta no tiene que contar toda la trayectoria",
        "blocks": [
          {
            "type": "paragraph",
            "text": "La trayectoria sostiene el criterio, pero no debería ocupar el centro."
          },
          {
            "type": "paragraph",
            "text": "El centro es el recorrido del alumno."
          },
          {
            "type": "paragraph",
            "text": "Usí la experiencia para elegir buenos problemas, ejemplos reales, errores frecuentes y decisiones importantes. No para demostrar todo lo que hiciste."
          },
          {
            "type": "paragraph",
            "text": "Una propuesta formativa clara nace cuando la experiencia deja de ser relato y se convierte en camino para otra persona."
          }
        ]
      },
      {
        "heading": "Una pregunta para empezar",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Escribí una frase:"
          },
          {
            "type": "paragraph",
            "text": "\"Mi experiencia puede ayudar a alguien a...\""
          },
          {
            "type": "paragraph",
            "text": "Después completala con un problema concreto y una acción observable."
          },
          {
            "type": "paragraph",
            "text": "Si la frase queda clara, ya tenés el comienzo de una propuesta formativa. Si queda amplia, no falta experiencia. Falta recorte."
          }
        ]
      }
    ]
  },
};

export const getBlogDetailBySlug = (slug: string) => blogDetails[slug];
