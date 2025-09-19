import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUbication } from "@/hooks/useUbication";

interface UbicationSelectProps {
  selectedCiudad?: string;
  onSelectCiudad: (value: string) => void;
}

export const UbicationSelect: React.FC<UbicationSelectProps> = ({
  selectedCiudad,
  onSelectCiudad,
}) => {
  const {
    selectedProvincia,
    setSelectedProvincia,
    provinciasOptions,
    ciudadesOptions,
  } = useUbication();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Select Provincia */}
      <div className="flex-1">
        <Label>Provincia</Label>
        <Select
          value={selectedProvincia}
          onValueChange={(val) => {
            setSelectedProvincia(val);
            onSelectCiudad(""); // reset ciudad al cambiar provincia
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una provincia" />
          </SelectTrigger>
          <SelectContent>
            {provinciasOptions.map((prov) => (
              <SelectItem key={prov.value} value={prov.value}>
                {prov.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Select Ciudad */}
      <div className="flex-1">
        <Label>Ciudad</Label>
        <Select
          value={selectedCiudad}
          onValueChange={onSelectCiudad}
          disabled={!selectedProvincia || ciudadesOptions.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                !selectedProvincia
                  ? "Selecciona una provincia primero"
                  : ciudadesOptions.length === 0
                  ? "Cargando ciudades..."
                  : "Selecciona una ciudad"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {ciudadesOptions.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
