import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

interface InputPasswordProps {
  value?: string; // valor controlado desde RHF
  onChange?: (value: string) => void; // callback de cambio
  onBlur?: () => void;
  name?: string;
  showConfirm?: boolean; // si queremos mostrar confirmación
  onConfirmChange?: (value: string) => void; // callback para confirmar
}

export function InputPassword({
  value,
  onChange,
  onBlur,
  name,
  showConfirm = false,
  onConfirmChange,
}: InputPasswordProps) {
  const [internalPassword, setInternalPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  // si viene valor controlado, lo usamos
  const password = value ?? internalPassword;

  useEffect(() => {
    if (value !== undefined) setInternalPassword(value);
  }, [value]);

  const toggleVisibility = () => setIsVisible((prev) => !prev);
  const toggleConfirmVisibility = () => setIsConfirmVisible((prev) => !prev);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalPassword(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(e.target.value);
    if (onConfirmChange) onConfirmChange(e.target.value);
  };

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "Al menos 8 caracteres" },
      { regex: /[0-9]/, text: "Al menos 1 número" },
      { regex: /[a-z]/, text: "Al menos 1 letra minúscula" },
      { regex: /[A-Z]/, text: "Al menos 1 letra mayúscula" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(
    () => strength.filter((r) => r.met).length,
    [strength]
  );

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Ingrese una contraseña";
    if (score <= 2) return "Contraseña débil";
    if (score === 3) return "Contraseña media";
    return "Contraseña fuerte";
  };

  const passwordsMatch = confirm.length > 0 && password === confirm;

  return (
    <div className="min-w-[300px] space-y-4">
      {/* Campo contraseña */}
      <div className="space-y-2">
        <Label htmlFor={name || "password"}>Contraseña</Label>
        <div className="relative">
          <Input
            id={name || "password"}
            name={name}
            className="pe-9"
            placeholder="Ingrese una contraseña"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            onBlur={onBlur}
          />
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-ring/70"
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Barra de fuerza */}
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label="Password strength"
      >
        <div
          className={`h-full ${getStrengthColor(
            strengthScore
          )} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 4) * 100}%` }}
        />
      </div>

      <p className="text-sm font-medium text-foreground">
        {getStrengthText(strengthScore)}. Debe contener:
      </p>

      <ul className="space-y-1.5" aria-label="Password requirements">
        {strength.map((req, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {req.met ? (
              <Check size={16} className="text-emerald-500" />
            ) : (
              <X size={16} className="text-muted-foreground/80" />
            )}
            <span
              className={`text-xs ${
                req.met ? "text-emerald-600" : "text-muted-foreground"
              }`}
            >
              {req.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Confirmar contraseña */}
      {showConfirm && (
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirmar contraseña</Label>
          <div className="relative">
            <Input
              id="confirm"
              className={`pe-9 ${
                confirm.length > 0 && !passwordsMatch
                  ? "border border-red-700"
                  : ""
              }`}
              placeholder="Repita la contraseña"
              type={isConfirmVisible ? "text" : "password"}
              value={confirm}
              onChange={handleConfirmChange}
              aria-invalid={confirm.length > 0 && !passwordsMatch}
            />
            <button
              type="button"
              onClick={toggleConfirmVisibility}
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-ring/70"
            >
              {isConfirmVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
