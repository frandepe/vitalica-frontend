import LegalPageLayout from "@/components/Legal/LegalPageLayout";

const TermsAndConditionsPage = () => {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terminos y condiciones"
      intro="Este contenido es un ejemplo breve para definir las condiciones generales de uso de Vitalica. Podes editarlo despues con tus condiciones comerciales y legales definitivas."
      lastUpdated="19 de marzo de 2026"
      sections={[
        {
          title: "1. Aceptacion de los terminos",
          content: (
            <>
              <p>
                Al navegar, registrarse o utilizar Vitalica, el usuario acepta
                estos terminos y condiciones. Si no esta de acuerdo, debe
                abstenerse de utilizar la plataforma.
              </p>
            </>
          ),
        },
        {
          title: "2. Uso de la plataforma",
          content: (
            <>
              <p>
                El usuario se compromete a utilizar la plataforma de manera
                responsable, licita y conforme a la normativa vigente. No esta
                permitido realizar actividades que afecten el funcionamiento del
                sitio o vulneren derechos de terceros.
              </p>
            </>
          ),
        },
        {
          title: "3. Cuentas y acceso",
          content: (
            <>
              <p>
                Cada usuario es responsable de la confidencialidad de sus
                credenciales de acceso y de las acciones realizadas desde su
                cuenta. Vitalica puede suspender cuentas ante un uso indebido o
                incumplimientos.
              </p>
            </>
          ),
        },
        {
          title: "4. Compras y contenido",
          content: (
            <>
              <p>
                Los cursos, materiales y servicios ofrecidos pueden estar sujetos
                a condiciones particulares, precios y disponibilidad. El acceso
                adquirido es personal y no debe compartirse sin autorizacion.
              </p>
            </>
          ),
        },
        {
          title: "5. Modificaciones",
          content: (
            <>
              <p>
                Vitalica puede actualizar estos terminos en cualquier momento.
                Cuando eso ocurra, la version mas reciente quedara publicada en
                esta pagina para su consulta.
              </p>
            </>
          ),
        },
      ]}
    />
  );
};

export default TermsAndConditionsPage;
