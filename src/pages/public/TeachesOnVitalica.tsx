import GlassmorphismHero from "@/components/Hero/GlassmorphismHero";
import ReasonsToTech from "@/components/Sections/ReasonsToTeach";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TeachesOnVitalica = () => {
  const navigate = useNavigate();
  return (
    <div>
      <GlassmorphismHero />
      {/* <ReasonsSection /> */}
      <ReasonsToTech />
      <motion.div
        className="flex flex-col md:flex-row justify-center items-center gap-4 bg-gradient-to-r from-primary to-primary/80 text-white py-10 px-6 rounded-lg overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Fondo sutil animado */}
        <motion.div
          className="absolute inset-0 bg-white/10 rounded-lg"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Texto */}
        <motion.h3
          className="text-2xl md:text-4xl font-bold relative z-10 text-center md:text-left"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Convertite en instructor ahora
        </motion.h3>

        {/* Botón */}
        <motion.button
          className="relative z-10 px-6 py-2 bg-white text-primary font-semibold rounded-md shadow-md hover:bg-white/90 transition-colors cursor-pointer"
          onClick={() => navigate("/solicitar-ser-instructor")}
          whileTap={{ scale: 0.95 }}
        >
          Unirme
        </motion.button>
      </motion.div>
      <div className="py-20 w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-center font-sans font-bold">
            Sumá talento a Vitálica
          </h1>

          <p className="text-muted-foreground max-w-lg mx-auto my-2 text-sm text-center relative z-10">
            Si conocés a un instructor certificado que quiera dar cursos online,
            podés invitarlo a formar parte de Vitálica. Ingresá su correo y le
            enviaremos la invitación directamente.
          </p>

          <div className="w-full mt-4 relative z-10 flex gap-2">
            <Input
              type="email"
              placeholder="correo@instructor.com"
              className="flex-1"
            />
            <Button
              className="whitespace-nowrap"
              onClick={() => alert("TODO: Logica para enviar invite")}
            >
              Enviar invitación
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachesOnVitalica;

/*
 armar algo tipo https://www.udemy.com/teaching/
1 - Banner veni a enseñar con nosotros (ok)
2 - Razones para empezar
3 - Cómo empezar (crea tu programa, graba tu video, publica tu curso)
4 - Texto que redirija a un blog llamado Por qué enseñar en Vitalica
5 - Banner mas simple pero con el proposito del primero
*/
