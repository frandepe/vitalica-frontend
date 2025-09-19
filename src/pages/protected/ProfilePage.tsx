import { FeaturesSectionWithCardGradient } from "@/components/FeaturesSectionWithCardGradient";

import Avatar from "@/components/user/Avatar";
import ProfileBg from "@/components/user/ProfileBg";

import ShareProfile from "@/components/ShareProfile";
import { Separator } from "@/components/ui/separator";
import { PromoteInstructor } from "@/components/Banners/PromoteInstructor";
import { NotificationConfig } from "@/components/notifications/NotificationConfig";
import { BasicInformationForm } from "@/components/user/Forms/BasicInformationForm";

import { Activity, CalendarHeart, RefreshCw, UserCheck } from "lucide-react";
import { AnimatedGradientDemo } from "@/components/CardsAnimated/DemoCardsAnimatedGradient";

const isInstructor = false;

const grid = [
  {
    title: "Perfil público",
    description: "Accede a tu perfil público y compártelo con otros.",
    modalContent: <ShareProfile />,
  },
  {
    title: "Notificaciones",
    description: "Gestiona tus preferencias de notificación.",
    modalContent: <NotificationConfig />,
  },
];

const features = [
  {
    icon: CalendarHeart,
    title: "Último acceso",
    description: "Fecha y hora de tu último inicio de sesión.",
    date: "17/09/2025 21:00",
  },
  {
    icon: UserCheck,
    title: "Cuenta creada",
    description: "Fecha en la que se creó tu cuenta de usuario.",
    date: "05/06/2023 10:30",
  },
  {
    icon: RefreshCw,
    title: "Última actualización",
    description:
      "Última vez que se modificó tu información de perfil o datos importantes.",
    date: "12/09/2025 14:45",
  },
  {
    icon: Activity,
    title: "Actividad reciente",
    description:
      "Resumen de acciones recientes que realizaste dentro de la plataforma.",
    date: "Hoy 21:00",
  },
];

const ProfilePage = () => {
  return (
    <div className="container mx-auto">
      <ProfileBg defaultImage="https://originui.com/profile-bg.jpg" />
      <Avatar defaultImage="https://originui.com/avatar-72-01.jpg" />
      <div className="px-6 pb-6 pt-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Columna de formularios */}
            <BasicInformationForm />

            {/* Columna de cards */}
            <div className="flex-1">
              <FeaturesSectionWithCardGradient grid={grid} />
            </div>
          </div>

          <Separator className="my-10" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto relative">
            <div className="absolute inset-0 isolate z-0 contain-strict">
              <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[70%] translate-y-[30%] rounded-full bg-[rgba(109,218,124,0.5)] opacity-50 blur-[80px]"></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#d1d5db33_1px,transparent_1px),linear-gradient(to_bottom,#d1d5db33_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="border border-green-100 rounded-xl p-6 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md  hover:bg-green-50/40 transition"
              >
                {/* Icono */}
                <div className="p-3 rounded-lg bg-green-100 text-primary w-max">
                  <feature.icon size={22} />
                </div>

                {/* Contenido */}
                <div className="flex-1 flex flex-col justify-start">
                  <h3 className="text-base font-semibold text-gray-900 truncate">
                    {feature.title}
                  </h3>
                  <span className="text-xs text-green-700 mt-1">
                    {feature.date}
                  </span>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-10" />

          <div>
            {isInstructor ? (
              <PromoteInstructor />
            ) : (
              <div>
                <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl text-center">
                  Accede a tu panel de instructor
                </h2>
                <p className="mx-auto my-6 max-w-2xl text-lg text-gray-500 text-center">
                  Gestiona tus cursos, revisa tus métricas y administra tu
                  contenido de manera rápida y sencilla
                </p>
                <AnimatedGradientDemo />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
