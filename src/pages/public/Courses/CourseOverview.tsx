import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourseBySlug } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import MuxPlayer from "@mux/mux-player-react";
import { ICourse } from "@/types/course.types";
import { t } from "@/utils/translations";
import { formatDuration } from "@/utils/format-duration";
import { formatPrice } from "@/utils/format-price";
import { CourseOverviewTabs } from "@/components/Tabs/CourseOverviewTabs";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";

export default function CourseOverview() {
  const { slug } = useParams();
  const [course, setCourse] = useState<ICourse>();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await getCourseBySlug(slug!);
      setCourse(res.data);
      setLoading(false);
    };

    fetchCourse();
  }, [slug]);

  if (loading || !course) return <GlobalLoading text="Obteniendo curso..." />;

  const totalLessons = course.modules!.reduce(
    (acc: number, module) => acc + (module.lessons?.length ?? 0),
    0,
  );

  const handleBtnCheckout = () => {
    navigate(`/cursos/${course.id}/pago`);
  };

  return (
    <div className="relative bg-neutral-50">
      {/* HERO BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-primary via-primary-light to-primary" />

      <div className="relative mx-auto container px-6 md:px-0">
        <div className="grid gap-16 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}
          <div className="pt-24 text-white">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <Badge className="bg-white/10 text-white">
                  {t("courseSpecialty", course.specialty!)}
                </Badge>
                {course.level && (
                  <Badge
                    variant="outline"
                    className="border-white/30 text-white"
                  >
                    {t("courseLevel", course.level)}
                  </Badge>
                )}
              </div>

              <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-5xl xl:text-6xl">
                {course.title}
              </h1>

              {/* <p className="max-w-xl text-lg text-white/80">
                {course.description}
              </p> */}

              <div className="flex items-center gap-2 text-sm text-white/90">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i <= Math.round(course.avgTheoreticalRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-white/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="opacity-80">
                  {course.avgTheoreticalRating} · {course.totalStudents}{" "}
                  estudiantes
                </span>
              </div>

              {course.muxPromoAssetId && (
                <div className="relative aspect-video xl:max-w-3xl overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl ring-1 ring-white/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MuxPlayer
                      playbackId={course.muxPlaybackId}
                      className="w-full h-full mux-custom"
                      metadata={{
                        video_id: course.muxPlaybackId,
                        video_title: `Video promocional del curso ${course.id}`,
                        viewer_user_id: user.id.toString(),
                      }}
                      accentColor="#20ab9f"
                    />
                  </div>
                </div>
              )}
              <div className="lg:hidden">
                {course.price! > 0 ? (
                  <div className="space-y-1">
                    <p className="text-4xl font-semibold text-black">
                      {course.currency} ${formatPrice(course.price)}
                    </p>
                    <p className="text-sm text-neutral-500">
                      Pago único · Acceso de por vida
                    </p>
                  </div>
                ) : (
                  <p className="text-2xl font-semibold text-black mb-2">
                    Curso gratuito
                  </p>
                )}

                <Button
                  onClick={handleBtnCheckout}
                  size="lg"
                  className="w-full text-base"
                >
                  Inscribirme ahora
                </Button>

                {course.price! > 0 && (
                  <p className="text-center text-xs text-neutral-500">
                    Garantía de devolución de 7 días
                  </p>
                )}
              </div>
            </div>
            <section className="pt-32 pb-24 space-y-16 text-neutral-900">
              <CourseOverviewTabs {...course} />
            </section>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:block">
            <div className="sticky top-0 pt-24">
              <Card className="rounded-3xl shadow-2xl bg-background">
                <CardContent className="space-y-6 p-8">
                  {course.thumbnailUrl && (
                    <img
                      src={course.thumbnailUrl}
                      className="rounded-lg"
                      alt={course.title}
                    />
                  )}
                  <div className="space-y-1">
                    {course.price! > 0 ? (
                      <p className="text-4xl font-semibold">
                        {course.currency} ${formatPrice(course.price)}
                      </p>
                    ) : (
                      <p className="text-2xl font-semibold text-black">
                        Curso gratuito
                      </p>
                    )}
                    {course.price! > 0 && (
                      <p className="text-sm text-neutral-500">
                        Pago único · Acceso de por vida
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleBtnCheckout}
                    size="lg"
                    className="w-full text-base"
                  >
                    Inscribirme ahora
                  </Button>

                  {course.price! > 0 && (
                    <p className="text-center text-xs text-neutral-500">
                      Garantía de devolución de 7 días
                    </p>
                  )}

                  <Separator />

                  <ul className="space-y-3 text-sm">
                    {course.level && (
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                        <span>{t("courseLevel", course.level)}</span>
                      </li>
                    )}
                    {course.duration && (
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                        <span>
                          {formatDuration(course.duration)} horas de contenido
                        </span>
                      </li>
                    )}
                    <li className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                      <span>{totalLessons} lecciones on-demand</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                      <span>Acceso desde cualquier dispositivo</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// /cursos/:slug/inscripcion   → Enroll // no creo que se implemente esto
