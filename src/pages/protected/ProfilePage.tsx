import Avatar from "@/components/user/Avatar";
import ProfileBg from "@/components/user/ProfileBg";

import ShareProfile from "@/components/Share/ShareProfile";
import { Separator } from "@/components/ui/separator";
import { PromoteInstructor } from "@/components/Banners/PromoteInstructor";
import { NotificationConfig } from "@/components/notifications/NotificationConfig";
import { BasicInformationForm } from "@/components/user/Forms/BasicInformationForm";

import { AnimatedGradientDemo } from "@/components/CardsAnimated/DemoCardsAnimatedGradient";
import { useAuth } from "@/hooks/useAuth";
import { FeaturesSectionWithCardGradient } from "@/components/user/FeaturesSectionWithCardGradient";
import { Achievements } from "@/components/Achievements/Achievements";
import { useAchievements } from "@/hooks/useAchievements";

const ProfilePage = () => {
  const { user } = useAuth();
  const isUser = user.role === "USER";
  const isInstructor = user.role === "INSTRUCTOR";
  const showsAchievements = isUser || isInstructor;
  const achievements = useAchievements(showsAchievements);

  const grid = [
    {
      title: "Perfil público",
      description: "Accede a tu perfil público y compártelo con otros.",
      modalContent: <ShareProfile slug={user.slug} />,
    },
    {
      title: "Notificaciones",
      description: "Gestiona tus preferencias de notificación.",
      modalContent: <NotificationConfig />,
    },
  ];

  return (
    <div className="container mx-auto">
      <ProfileBg />
      <Avatar
        defaultImage={user?.avatarUrl || "/Placeholders/no-image-profile.jpg"}
      />
      <div className="px-6 pb-6 pt-4">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 h-1/2 lg:h-full">
              <BasicInformationForm />
            </div>

            <div className="flex-1 h-1/2 lg:h-full">
              <FeaturesSectionWithCardGradient grid={grid} />
            </div>
          </div>

          {showsAchievements && (
            <>
              <Separator className="my-20 bg-gray-800" />
              <Achievements
                data={achievements.data}
                isLoading={achievements.isLoading}
                error={achievements.error}
                onRetry={achievements.retry}
              />
            </>
          )}

          {(isUser || isInstructor) && (
            <>
              <Separator className="my-20 bg-gray-800" />
              {isUser ? (
                <PromoteInstructor />
              ) : (
                <div>
                  <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl text-center">
                    Accedé a tu panel de instructor
                  </h2>
                  <p className="mx-auto my-6 max-w-2xl text-lg text-gray-500 text-center">
                    Gestioná tus cursos, revisá tus métricas y administrá tu
                    contenido de manera rápida y sencilla
                  </p>
                  <AnimatedGradientDemo />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
