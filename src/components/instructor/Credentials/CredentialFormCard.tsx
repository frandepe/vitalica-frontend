import ImagesUpload from "@/components/Uploads/ImagesUpload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DateTimePicker from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InstructorCredentialForm } from "@/types/instructor.types";
import { Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { getCredentialOption } from "./credential-options";
import {
  credentialRequiresImage,
  isDateCredential,
  isExperienceCredential,
} from "./credential-utils";
import type { ImageState } from "./types";

type CredentialFormCardProps = {
  index: number;
  onRemove: () => void;
  images: ImageState;
  onImagesChange: (images: ImageState) => void;
};

type CredentialFormValues = {
  credentials: InstructorCredentialForm[];
};

const CredentialFormCard = ({
  index,
  onRemove,
  images,
  onImagesChange,
}: CredentialFormCardProps) => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CredentialFormValues>();

  const type = watch(`credentials.${index}.type`);
  const noExpiration = watch(`credentials.${index}.noExpiration`);
  const currentlyActive = watch(`credentials.${index}.currentlyActive`);
  const option = getCredentialOption(type);
  const requiresImage = credentialRequiresImage(type);

  return (
    <div className="rounded-lg border bg-background p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center">
            <img
              src={option.iconSrc}
              alt=""
              className="h-10 w-10 object-contain"
            />
          </span>
          <div>
            <h3 className="font-semibold">{option.label}</h3>
            <p className="text-sm text-muted-foreground">
              Credencial {index + 1}
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" onClick={onRemove}>
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </div>

      <input type="hidden" {...register(`credentials.${index}.id`)} />
      <input type="hidden" {...register(`credentials.${index}.type`)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(type === "PROFESSIONAL_DEGREE" ||
          type === "INSTRUCTOR_CERTIFICATION" ||
          type === "COMPLEMENTARY_TRAINING") && (
          <div className="space-y-2">
            <Label>
              {type === "PROFESSIONAL_DEGREE"
                ? "Titulo profesional"
                : type === "INSTRUCTOR_CERTIFICATION"
                  ? "Nombre de la certificacion"
                  : "Nombre de la formacion"}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register(`credentials.${index}.title`, {
                required: "Este campo es obligatorio",
              })}
              placeholder={
                type === "PROFESSIONAL_DEGREE"
                  ? "Medico, enfermero, tecnico..."
                  : type === "INSTRUCTOR_CERTIFICATION"
                    ? "Instructor de RCP, Primeros Auxilios..."
                    : "ACLS, PHTLS, trauma..."
              }
            />
            {errors.credentials?.[index]?.title && (
              <p className="text-destructive text-sm">
                {errors.credentials[index]?.title?.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label>
            {isExperienceCredential(type)
              ? "Institucion"
              : type === "PROFESSIONAL_LICENSE"
                ? "Organismo / colegio"
                : "Institucion / entidad"}
            {(type === "PROFESSIONAL_LICENSE" ||
              type === "INSTRUCTOR_CERTIFICATION" ||
              isExperienceCredential(type)) && (
              <span className="text-destructive"> *</span>
            )}
          </Label>
          <Input
            {...register(`credentials.${index}.organization`, {
              required:
                type === "PROFESSIONAL_LICENSE" ||
                type === "INSTRUCTOR_CERTIFICATION" ||
                isExperienceCredential(type)
                  ? "Este campo es obligatorio"
                  : false,
            })}
            placeholder={
              isExperienceCredential(type)
                ? "Hospital, ambulancia, instituto..."
                : "ACES, Cruz Roja, universidad..."
            }
          />
          {errors.credentials?.[index]?.organization && (
            <p className="text-destructive text-sm">
              {errors.credentials[index]?.organization?.message}
            </p>
          )}
        </div>

        {type === "PROFESSIONAL_LICENSE" && (
          <>
            <div className="space-y-2">
              <Label htmlFor={`professional-license-number-${index}`}>
                Numero de matricula{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`professional-license-number-${index}`}
                type="text"
                autoComplete="off"
                inputMode="text"
                {...register(`credentials.${index}.credentialNumber`, {
                  required: "Este campo es obligatorio",
                })}
                placeholder="MN 123456"
              />
              {errors.credentials?.[index]?.credentialNumber && (
                <p className="text-destructive text-sm">
                  {errors.credentials[index]?.credentialNumber?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Jurisdiccion <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register(`credentials.${index}.jurisdiction`, {
                  required: "Este campo es obligatorio",
                })}
                placeholder="Nacional, CABA, Buenos Aires..."
              />
              {errors.credentials?.[index]?.jurisdiction && (
                <p className="text-destructive text-sm">
                  {errors.credentials[index]?.jurisdiction?.message}
                </p>
              )}
            </div>
          </>
        )}

        {(type === "INSTRUCTOR_CERTIFICATION" ||
          type === "COMPLEMENTARY_TRAINING") && (
          <div className="space-y-2">
            <Label htmlFor={`professional-credential-id-${index}`}>
              ID / numero de credencial
            </Label>
            <Input
              id={`professional-credential-id-${index}`}
              type="text"
              autoComplete="off"
              inputMode="text"
              {...register(`credentials.${index}.credentialNumber`)}
              placeholder="ABC-123"
            />
          </div>
        )}

        {isExperienceCredential(type) && (
          <div className="space-y-2">
            <Label>
              Funcion / area <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register(`credentials.${index}.roleOrArea`, {
                required: "Este campo es obligatorio",
              })}
              placeholder={
                type === "PROFESSIONAL_EXPERIENCE"
                  ? "Emergencias, terapia, rescate..."
                  : "Instructor, capacitador, docente..."
              }
            />
            {errors.credentials?.[index]?.roleOrArea && (
              <p className="text-destructive text-sm">
                {errors.credentials[index]?.roleOrArea?.message}
              </p>
            )}
          </div>
        )}

        {isDateCredential(type) && (
          <>
            <div className="space-y-2">
              <Label>
                Fecha de emision
                {type === "INSTRUCTOR_CERTIFICATION" && (
                  <span className="text-destructive"> *</span>
                )}
              </Label>
              <Controller
                name={`credentials.${index}.issuedAt`}
                control={control}
                rules={{
                  required:
                    type === "INSTRUCTOR_CERTIFICATION"
                      ? "Este campo es obligatorio"
                      : false,
                }}
                render={({ field: dateField }) => (
                  <DateTimePicker
                    showTime={false}
                    value={dateField.value ? new Date(dateField.value) : null}
                    onChange={(val) =>
                      dateField.onChange(val?.toISOString() || null)
                    }
                  />
                )}
              />
              {errors.credentials?.[index]?.issuedAt && (
                <p className="text-destructive text-sm">
                  {errors.credentials[index]?.issuedAt?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Fecha de vencimiento</Label>
              <Controller
                name={`credentials.${index}.expiresAt`}
                control={control}
                render={({ field: dateField }) =>
                  noExpiration ? (
                    <Input value="No tiene vencimiento" disabled />
                  ) : (
                    <DateTimePicker
                      showTime={false}
                      value={dateField.value ? new Date(dateField.value) : null}
                      onChange={(val) =>
                        dateField.onChange(val?.toISOString() || null)
                      }
                    />
                  )
                }
              />
              <div className="flex items-center gap-2 pt-1">
                <Controller
                  name={`credentials.${index}.noExpiration`}
                  control={control}
                  render={({ field: checkboxField }) => (
                    <Checkbox
                      checked={checkboxField.value}
                      onCheckedChange={(checked) => {
                        checkboxField.onChange(Boolean(checked));
                        if (checked) {
                          setValue(`credentials.${index}.expiresAt`, null);
                        }
                      }}
                    />
                  )}
                />
                <Label>No tiene vencimiento</Label>
              </div>
            </div>
          </>
        )}

        {type === "PROFESSIONAL_DEGREE" && (
          <>
            <div className="space-y-2">
              <Label>Fecha de emision / egreso</Label>
              <Controller
                name={`credentials.${index}.issuedAt`}
                control={control}
                render={({ field: dateField }) => (
                  <DateTimePicker
                    showTime={false}
                    value={dateField.value ? new Date(dateField.value) : null}
                    onChange={(val) =>
                      dateField.onChange(val?.toISOString() || null)
                    }
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`professional-degree-registry-${index}`}>
                Numero / registro si aplica
              </Label>
              <Input
                id={`professional-degree-registry-${index}`}
                type="text"
                autoComplete="off"
                inputMode="text"
                {...register(`credentials.${index}.credentialNumber`)}
                placeholder="Opcional"
              />
            </div>
          </>
        )}

        {isExperienceCredential(type) && (
          <>
            <div className="space-y-2">
              <Label>
                Fecha de inicio <span className="text-destructive">*</span>
              </Label>
              <Controller
                name={`credentials.${index}.startDate`}
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                render={({ field: dateField }) => (
                  <DateTimePicker
                    showTime={false}
                    value={dateField.value ? new Date(dateField.value) : null}
                    onChange={(val) =>
                      dateField.onChange(val?.toISOString() || null)
                    }
                  />
                )}
              />
              {errors.credentials?.[index]?.startDate && (
                <p className="text-destructive text-sm">
                  {errors.credentials[index]?.startDate?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Fecha de fin
                {!currentlyActive && (
                  <span className="text-destructive"> *</span>
                )}
              </Label>
              <Controller
                name={`credentials.${index}.endDate`}
                control={control}
                rules={{
                  required: !currentlyActive
                    ? "Este campo es obligatorio"
                    : false,
                }}
                render={({ field: dateField }) =>
                  currentlyActive ? (
                    <Input value="Actualidad" disabled />
                  ) : (
                    <DateTimePicker
                      showTime={false}
                      value={dateField.value ? new Date(dateField.value) : null}
                      onChange={(val) =>
                        dateField.onChange(val?.toISOString() || null)
                      }
                    />
                  )
                }
              />
              <div className="flex items-center gap-2 pt-1">
                <Controller
                  name={`credentials.${index}.currentlyActive`}
                  control={control}
                  render={({ field: checkboxField }) => (
                    <Checkbox
                      checked={checkboxField.value}
                      onCheckedChange={(checked) => {
                        checkboxField.onChange(Boolean(checked));
                        if (checked) {
                          setValue(`credentials.${index}.endDate`, null);
                        }
                      }}
                    />
                  )}
                />
                <Label>Actualmente activo</Label>
              </div>
              {errors.credentials?.[index]?.endDate && (
                <p className="text-destructive text-sm">
                  {errors.credentials[index]?.endDate?.message}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="space-y-2">
        <Label>Descripcion / aclaraciones</Label>
        <Textarea
          {...register(`credentials.${index}.description`)}
          placeholder="Agrega detalles relevantes para la revision"
        />
      </div>

      <div className="space-y-2">
        <Label>
          Documentacion respaldatoria
          {requiresImage && <span className="text-destructive"> *</span>}
        </Label>
        <ImagesUpload
          value={images.existing}
          onChange={onImagesChange}
          multiple={false}
          maxFiles={1}
        />
      </div>
    </div>
  );
};

export default CredentialFormCard;
