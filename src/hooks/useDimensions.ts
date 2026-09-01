import { useEffect, useState } from "react";

export function useDimensions(
  ref: React.RefObject<HTMLElement | SVGElement | null>
) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateDimensions = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    const debouncedUpdateDimensions = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 250);
    };

    updateDimensions();
    window.addEventListener("resize", debouncedUpdateDimensions);

    return () => {
      window.removeEventListener("resize", debouncedUpdateDimensions);
      clearTimeout(timeoutId);
    };
  }, [ref]);

  return dimensions;
}
