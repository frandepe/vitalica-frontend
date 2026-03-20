import LegalPageLayout from "@/components/Legal/LegalPageLayout";

const PrivacyPolicyPage = () => {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Politicas de privacidad"
      intro="Este texto es un ejemplo simple para explicar de forma general como Vitalica podria recopilar, usar y proteger la informacion de sus usuarios. Podes reemplazarlo despues por tu version final."
      lastUpdated="19 de marzo de 2026"
      sections={[
        {
          title: "1. Informacion que recopilamos",
          content: (
            <>
              <p>
                Podemos solicitar datos basicos como nombre, correo
                electronico, telefono y cualquier informacion que el usuario
                decida cargar al registrarse, comprar un curso o contactarse con
                nosotros.
              </p>
              <p>
                Tambien podemos recopilar informacion tecnica, como direccion
                IP, dispositivo, navegador y datos de uso dentro de la
                plataforma, con el objetivo de mejorar la experiencia.
              </p>
            </>
          ),
        },
        {
          title: "2. Uso de la informacion",
          content: (
            <>
              <p>
                La informacion recopilada puede utilizarse para crear cuentas,
                gestionar compras, responder consultas, enviar comunicaciones
                importantes y mejorar nuestros servicios.
              </p>
              <p>
                En algunos casos tambien podriamos usarla para enviar novedades
                o contenido promocional, siempre de acuerdo con la normativa
                aplicable.
              </p>
            </>
          ),
        },
        {
          title: "3. Proteccion de los datos",
          content: (
            <>
              <p>
                Tomamos medidas razonables para proteger la informacion personal
                frente a accesos no autorizados, perdida, alteracion o
                divulgacion indebida.
              </p>
              <p>
                Sin embargo, ningun sistema es completamente infalible, por lo
                que no podemos garantizar una seguridad absoluta.
              </p>
            </>
          ),
        },
        {
          title: "4. Derechos del usuario",
          content: (
            <>
              <p>
                El usuario puede solicitar el acceso, correccion o eliminacion
                de sus datos personales cuando corresponda, asi como realizar
                consultas sobre el tratamiento de su informacion.
              </p>
              <p>
                Para ejercer estos derechos, puede comunicarse a traves de los
                canales de contacto publicados en la plataforma.
              </p>
            </>
          ),
        },
      ]}
    />
  );
};

export default PrivacyPolicyPage;
