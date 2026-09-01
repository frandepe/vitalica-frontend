import { useState, useEffect } from "react";

/**
 * Hook para detectar scroll hacia arriba o abajo
 * @param offset número de px desde donde empezar a ocultar (opcional, default: 50)
 */
export function useHideOnScroll(offset = 50) {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > offset) {
        // Scroll hacia abajo → ocultar
        setShow(false);
      } else {
        // Scroll hacia arriba → mostrar
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, offset]);

  return show;
}
