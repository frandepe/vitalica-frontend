import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

import {
  ChartPie,
  FileCheck,
  FileQuestion,
  Loader,
  Settings,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";

import { Separator } from "@/components/ui/separator";
import { CirclesImg } from "@/components/Banners/HeaderBanner";
import mask01 from "@/assets/Masks/mask-06.svg";
import banner1 from "/Banners/pago.jpg";
import banner2 from "/Banners/dinero.jpg";
import { Button } from "@/components/ui/button";
import { ProgressCard } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/toast";
import { Form } from "@/components/ui/form";
import { useIntervalClick } from "@/hooks/useIntervalClick";
import {
  InstructorProfile as IInstructorProfile,
  PayoutMethod,
} from "@/types/instructor.types";
import { UbicationSelect } from "@/components/Instructor/Forms/Profile/UbicationSelect";
import SpecialtyChecks from "@/components/Instructor/Forms/Profile/SpecialtyChecks";
import { MercadoPagoConnect } from "@/components/Buttons/MercadoPagoConnect";
import { useSearchParams } from "react-router-dom";

export default function InstructorProfile() {
  const [searchParams] = useSearchParams();
  const { user, instructor, upsertInstructorProfile, hasMercadoPagoConnected } =
    useAuth();
  const { showToast } = useToast();
  const [editingLocation, setEditingLocation] = useState(false);
  const [cityAndState, setCityAndState] = useState("");
  const { timer, isResendDisabled, setIsResendDisabled, setTimer } =
    useIntervalClick();

  const form = useForm<IInstructorProfile>({
    defaultValues: {
      headline: "",
      bio: "",
      specialties: [],

      payoutMethod: PayoutMethod.MERCADO_PAGO,

      currency: "ARS",
      country: "AR",

      state: "",
      city: "",
      zipCode: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { isSubmitting, errors },
  } = form;

  const stateValue = watch("state");
  const cityValue = watch("city");
  // ================================
  // GET — Cargar perfil existente
  // ================================
  useEffect(() => {
    if (!instructor) return;

    reset(instructor);
  }, [instructor, reset]);

  useEffect(() => {
    if (searchParams.get("mp") === "connected") {
      showToast("Mercado Pago conectado correctamente", "success");
    }
  }, []);

  // ================================
  // UPSERT — Crear o actualizar
  // ================================
  const onSubmit = async (data: IInstructorProfile) => {
    try {
      const payload = {
        ...data,
        // La ciudad viene como "Ciudad, Provincia"
        city: cityAndState.split(",")[0]?.trim() || data.city,
        state: cityAndState.split(",")[1]?.trim() || data.state,
      };

      await upsertInstructorProfile(payload);

      showToast(
        "Se han actualizado los datos de tu perfil",
        "success",
        "bottom-right",
      );

      setIsResendDisabled(true);
      setTimer(20);
    } catch (error) {
      showToast(
        "Error al actualizar datos. Vuelva a intentarlo más tarde",
        "error",
        "bottom-right",
      );
    }
  };

  const profileSteps = [
    { name: "Foto de perfil", completed: Boolean(user.avatarUrl) },
    {
      name: "Información básica",
      completed: Boolean(user.firstName && user.lastName && user.phoneNumber),
    },
    {
      name: "Información de instructor",
      completed: Boolean(watch("headline") && Boolean(watch("bio"))),
    },
    {
      name: "Especialidades de instructor",
      completed: watch("specialties")?.length > 0,
    },
    { name: "Método de pago", completed: hasMercadoPagoConnected },
  ];

  const progress = Math.round(
    (profileSteps.filter((s) => s.completed).length / profileSteps.length) *
      100,
  );

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        id="instructor-information-form"
      >
        <h3 className="text-2xl mt-6 flex gap-2 align-center">
          <Settings className="text-gray-700" /> Configura tu perfil de
          Instructor
        </h3>
        <div className="flex gap-8 flex-col lg:flex-row">
          <div>
            {/* Headline */}
            <div className="mb-4">
              <Label htmlFor={`headline`}>Título profesional</Label>

              <Input
                {...register("headline", {
                  maxLength: {
                    value: 120,
                    message: "El titular no puede tener más de 120 caracteres",
                  },
                })}
                placeholder="Ej: Instructor certificado en atención prehospitalaria"
                maxLength={120}
              />

              {errors.headline && (
                <p className="text-red-600 text-sm">
                  {errors.headline.message}
                </p>
              )}

              <p className="text-xs text-primary">
                {120 - (watch("headline")?.length || 0)} caracteres restantes
              </p>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <Label htmlFor={`bio`}>Biografía</Label>
              <Textarea
                {...register("bio")}
                placeholder="Escribe brevemente tu biografía..."
                maxLength={2000}
                // defaultValue={20}
              />

              <p className="text-xs text-primary">
                {2000 - (watch("bio")?.length || 0)} caracteres restantes
              </p>
            </div>

            {/* Ubicación */}
            <div className="mb-4 xl:w-[500px]">
              {!editingLocation && stateValue && cityValue ? (
                <div
                  onClick={() => setEditingLocation(true)}
                  className="relative grid grid-cols-1 md:grid-cols-2 gap-3 cursor-pointer group"
                >
                  {/* Inputs visibles */}
                  <Input
                    type="text"
                    value={stateValue}
                    disabled
                    className="input pointer-events-none"
                  />
                  <Input
                    type="text"
                    value={cityValue}
                    disabled
                    className="input pointer-events-none"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center text-sm font-medium text-white/70 pointer-events-none">
                    Modificar ubicación
                  </div>
                </div>
              ) : (
                // Si está editando → mostrar el selector completo
                <UbicationSelect onSelectCiudad={setCityAndState} />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`zip`}>Código Postal</Label>
              <Input
                {...register("zipCode")}
                id={`zip`}
                placeholder="Ej: 1900"
              />
            </div>
          </div>

          {/* Progress */}
          <div className="w-full items-center justify-center mt-6 bg-background flex-1">
            <ProgressCard
              title="Progreso del perfil"
              value={progress}
              status={progress === 100 ? "Completado" : "En progreso"}
              progress={progress}
              icon={<ChartPie size={20} />}
              profileSteps={profileSteps}
              description={
                <>
                  Has completado el{" "}
                  <span className="font-semibold text-primary">
                    {progress}%
                  </span>{" "}
                  de tu perfil.
                </>
              }
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Specialties */}
        <h3 className="text-2xl mb-6">¿Cuáles son tus especialidades?</h3>

        <SpecialtyChecks
          control={control}
          name="specialties"
          rules={{
            validate: (value: string[]) =>
              value && value.length > 0
                ? true
                : "Debés elegir al menos una especialidad",
          }}
        />

        {errors.specialties && (
          <p className="text-red-600 text-sm mt-1">
            {errors.specialties.message as string}
          </p>
        )}

        <Alert
          icon={FileCheck}
          variant="warning"
          title="Revisión de especialidades"
        >
          Para obtener el estado de Instructor Verificado en Vitalica, primero
          tenés que completar tu perfil con tu título profesional y las
          especialidades que querés enseñar. Un administrador revisará esos
          datos para confirmar que coincidan con la documentación que ya
          enviaste (certificados, matrículas y credenciales profesionales). La
          revisión suele demorar solo unas horas. Si todo está correcto, tu
          cuenta será marcada como instructor verificado, lo que le asegura a
          los usuarios que están aprendiendo con alguien cuya formación y
          especialidades fueron validadas. En caso de encontrar datos
          incorrectos o inconsistencias en la información cargada, se te
          notificará directamente desde la plataforma para que puedas
          corregirlos. Si los datos no coinciden con la documentación enviada,
          el perfil no será verificado.
        </Alert>

        <Separator className="my-6" />

        {/* Payment */}
        <div className="flex justify-start">
          <CirclesImg
            className="hidden lg:block"
            maskSrc={mask01}
            imgCircles={banner1}
          />
          {hasMercadoPagoConnected ? (
            <div>
              <h3 className="text-2xl mb-6">¡Mercado Pago conectado!</h3>
              <p className="mb-4">
                Ya tenés tu cuenta de Mercado Pago conectada. Esto significa que
                tus alumnos podrán comprar tus cursos y el dinero se acreditará
                automáticamente en tu cuenta de Mercado Pago, descontando la
                comisión de la plataforma.
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                Vitalica no retiene tu dinero ni realiza pagos manuales. La
                conexión es segura y se realiza directamente con Mercado Pago.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl mb-6">Método de pago</h3>
              <p className="mb-4">
                Para poder vender tus cursos, necesitás conectar tu cuenta de
                Mercado Pago. Cada vez que un alumno compre uno de tus cursos,
                el dinero se acreditará automáticamente en tu cuenta de Mercado
                Pago, descontando la comisión de la plataforma.
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                Vitalica no retiene tu dinero ni realiza pagos manuales. La
                conexión es segura y se realiza directamente con Mercado Pago.
              </p>
              <MercadoPagoConnect />
            </div>
          )}
          <CirclesImg
            className="hidden 2xl:block"
            maskSrc={mask01}
            imgCircles={banner2}
          />
        </div>

        <Alert
          icon={FileQuestion}
          variant="info"
          title="¿Por qué solicitamos esta información?"
        >
          Esta información nos permite verificar tu identidad y procesar pagos.
        </Alert>

        <Button disabled={isResendDisabled || isSubmitting} className="mb-6">
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader className="animate-spin w-4 h-4" />
              Guardando...
            </div>
          ) : isResendDisabled ? (
            `Guardado ${timer}s`
          ) : (
            "Guardar perfil"
          )}
        </Button>
      </form>
    </Form>
  );
}
