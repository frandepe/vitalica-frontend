import { Button } from "@/components/ui/button";
import type {
  IApplyInstructor,
  InstructorCredentialType,
} from "@/types/instructor.types";
import { credentialOptions } from "@/components/instructor/Credentials/credential-options";
import { emptyCredential } from "@/components/instructor/Credentials/credential-utils";
import CredentialFormCard from "@/components/instructor/Credentials/CredentialFormCard";
import type { ImageState } from "@/components/instructor/Credentials/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

type CredentialsSectionProps = {
  credentialImages: ImageState[];
  setCredentialImages: React.Dispatch<React.SetStateAction<ImageState[]>>;
};

const CredentialsSection = ({
  credentialImages,
  setCredentialImages,
}: CredentialsSectionProps) => {
  const [isChoosingCredential, setIsChoosingCredential] = useState(false);
  const { control } = useFormContext<IApplyInstructor>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "credentials",
    keyName: "fieldId",
  });

  const addCredential = (type: InstructorCredentialType) => {
    append(emptyCredential(type));
    setCredentialImages((current) => [...current, { existing: [], new: [] }]);
    setIsChoosingCredential(false);
  };

  const removeCredential = (index: number) => {
    remove(index);
    setCredentialImages((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const updateCredentialImages = (index: number, images: ImageState) => {
    setCredentialImages((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? images : item)),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Credenciales</h2>
          <p className="text-sm text-muted-foreground">
            Que respalda tu experiencia para ensenar?
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsChoosingCredential((current) => !current)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar credencial
        </Button>
      </div>

      {fields.length === 0 && !isChoosingCredential && (
        <div className="rounded-lg border border-dashed bg-background p-5">
          <p className="text-sm text-muted-foreground">
            Agrega al menos una credencial para que podamos revisar tu
            experiencia profesional, docente o formativa.
          </p>
        </div>
      )}

      {isChoosingCredential && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {credentialOptions.map(({ type, label, description, iconSrc }) => (
            <button
              key={type}
              type="button"
              onClick={() => addCredential(type)}
              className="group rounded-lg border bg-background p-4 text-left transition-colors hover:border-primary/60 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <img
                    src={iconSrc}
                    alt=""
                    className="h-10 w-10 object-contain"
                  />
                </span>
                <span className="space-y-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {label}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {description}
                  </span>
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <CredentialFormCard
            key={field.fieldId}
            index={index}
            images={credentialImages[index] || { existing: [], new: [] }}
            onImagesChange={(images) => updateCredentialImages(index, images)}
            onRemove={() => removeCredential(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CredentialsSection;
