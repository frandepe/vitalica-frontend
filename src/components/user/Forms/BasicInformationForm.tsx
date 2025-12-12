import { useForm } from "react-hook-form";
import {
  Form,
  FormItem as FormItemAlias,
  FormControl as FormControlAlias,
  FormField as FormFieldAlias,
} from "@/components/ui/form";
import { TooltipIconButton } from "@/components/TooltipIconButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import countries from "@/utils/countries.json";
import { useToast } from "@/components/ui/toast";
import { useIntervalClick } from "@/hooks/useIntervalClick";

interface UpdateProfileProps {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  phoneCountryCode: string;
}

export const BasicInformationForm = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const { timer, isResendDisabled, setIsResendDisabled, setTimer } =
    useIntervalClick();

  const form = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneCountryCode: user?.phoneCountryCode || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting, errors },
  } = form;

  const phoneNumber = watch("phoneNumber");
  const phoneCountryCode = watch("phoneCountryCode");

  const onSubmit = async (data: UpdateProfileProps) => {
    try {
      await updateUser(data);
      showToast(
        "Se han actualizado los datos de tu perfil",
        "success",
        "bottom-right"
      );
      setIsResendDisabled(true);
      setTimer(20);
    } catch (error) {
      showToast(
        "Error al actualizar datos. Vuelva a intentarlo más tarde",
        "error",
        "bottom-right"
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Nombre */}
        <div className="space-y-2">
          <Label>
            Nombre <span className="text-red-700">*</span>
          </Label>
          <Input
            placeholder="Matt"
            type="text"
            {...register("firstName", {
              required: "El nombre es obligatorio",
              minLength: {
                value: 2,
                message: "El nombre debe tener al menos 2 caracteres",
              },
              maxLength: {
                value: 25,
                message: "El nombre no puede tener más de 25 caracteres",
              },
              pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: "El nombre solo puede contener letras y espacios",
              },
            })}
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        {/* Apellido */}
        <div className="space-y-2">
          <Label>
            Apellido <span className="text-red-700">*</span>
          </Label>
          <Input
            placeholder="Welsh"
            type="text"
            {...register("lastName", {
              required: "El apellido es obligatorio",
              minLength: {
                value: 2,
                message: "El apellido debe tener al menos 2 caracteres",
              },
              maxLength: {
                value: 25,
                message: "El apellido no puede tener más de 25 caracteres",
              },
              pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: "El apellido solo puede contener letras y espacios",
              },
            })}
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm">{errors.lastName.message}</p>
          )}
        </div>

        {/* Código de país + Teléfono */}
        <div>
          <Label className="flex items-center">
            Teléfono
            <TooltipIconButton
              tooltip="Este campo se usa solo con fines administrativos, no será mostrado en tu perfil"
              side="top"
            >
              <Info className="h-4 w-4" />
            </TooltipIconButton>
          </Label>

          <div className="flex gap-2">
            {/* Select país */}
            <div className="w-1/3">
              <FormFieldAlias
                control={control}
                name="phoneCountryCode"
                rules={{
                  validate: (value) => {
                    if (value && !phoneNumber)
                      return "Debes ingresar un número si seleccionas un código de país";
                    return true;
                  },
                }}
                render={({ field }) => (
                  <FormItemAlias>
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      <FormControlAlias>
                        <SelectTrigger>
                          <SelectValue placeholder="+XX" />
                        </SelectTrigger>
                      </FormControlAlias>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <div className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.code}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItemAlias>
                )}
              />
            </div>

            {/* Input teléfono */}
            <div className="w-2/3">
              <Input
                placeholder="1123456789"
                type="text"
                {...register("phoneNumber", {
                  pattern: {
                    value: /^\d{8,15}$/,
                    message:
                      "El número de teléfono debe tener entre 8 y 15 dígitos",
                  },
                  validate: (value) => {
                    if (value && !phoneCountryCode)
                      return "Debes seleccionar un código de país si ingresas un número";
                    return true;
                  },
                })}
              />
            </div>
          </div>

          {/* Mensajes de error */}
          {(errors.phoneNumber || errors.phoneCountryCode) && (
            <p className="text-red-600 text-sm mt-1">
              {errors.phoneNumber?.message || errors.phoneCountryCode?.message}
            </p>
          )}
        </div>

        {/* Botón */}
        <div className="space-y-2">
          <Button
            type="submit"
            variant="outline"
            className="w-full h-10 bg-transparent"
            disabled={isResendDisabled || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin w-4 h-4" />
                Guardando...
              </div>
            ) : isResendDisabled ? (
              `Reanuda en ${timer} segundos`
            ) : (
              "Guardar configuración básica"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
