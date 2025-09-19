// useUbication.ts
import { useState, useMemo } from "react";
import jsonData from "@/utils/localidades.json";

export const useUbication = () => {
  const [selectedProvincia, setSelectedProvincia] = useState("");

  // Opciones de provincias únicas
  const provinciasOptions = useMemo(() => {
    const nombres = jsonData.localidades.map((l) => l.provincia.nombre);
    return Array.from(new Set(nombres)).map((prov) => ({
      value: prov,
      label: prov,
    }));
  }, []);

  // Opciones de ciudades filtradas según la provincia seleccionada
  const ciudadesOptions = useMemo(() => {
    if (!selectedProvincia) return [];
    return jsonData.localidades
      .filter((l) => l.provincia.nombre === selectedProvincia)
      .map((l) => ({
        value: `${l.localidad_censal.nombre}, ${selectedProvincia}`,
        label: l.localidad_censal.nombre,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedProvincia]);

  return {
    selectedProvincia,
    setSelectedProvincia,
    provinciasOptions,
    ciudadesOptions,
  };
};
