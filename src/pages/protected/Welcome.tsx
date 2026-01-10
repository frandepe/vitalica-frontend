// Onboarding básico
// URL: /bienvenida
// Se muestra una sola vez a usuarios nuevos
// Introduce qué es Vitalica y cómo funciona
// No obligatorio, no interactivo
// CTA principal: explorar cursos

const Welcome = () => {
  return (
    <div>
      <h1>Bienvenido a Vitalica</h1>

      <p>
        En Vitalica vas a encontrar formación profesional pensada para aprender
        de forma clara, progresiva y certificada.
      </p>

      <ul>
        <li>Explorá cursos disponibles</li>
        <li>Seguís tu progreso lección por lección</li>
        <li>Obtenés certificados al finalizar</li>
      </ul>

      <div>
        <button>Explorar cursos</button>
      </div>
    </div>
  );
};

export default Welcome;

// Como utilizarlo en un futuro para que el usuario solo vea esta pagina una sola vez:
// Necesitamos crear hasSeenWelcome en la DB

// useEffect(() => {
//   if (!user.hasSeenWelcome) {
//     updateUser({ hasSeenWelcome: true });
//   }
// }, []);

// ✔️ En un guard global post-login

// Ejemplo conceptual:

// if (user && !user.hasSeenWelcome) {
//   navigate("/bienvenida");
// }
