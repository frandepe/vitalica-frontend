import { useState, useEffect } from "react";

/**
 * Hook para que un elemento esté debajo de un offset y se "pegue" al top
 * solo cuando scroleamos hacia abajo, y vuelva cuando scroleamos hacia arriba
 */
export function useStickyTop(initialTop = 80) {
  const [top, setTop] = useState(initialTop);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > lastScrollY) {
        // Scrolling down → pegar al top
        setTop(0);
      } else {
        // Scrolling up → volver a posición original
        setTop(initialTop);
      }

      setLastScrollY(scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, initialTop]);

  return top;
}
