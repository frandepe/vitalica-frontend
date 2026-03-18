import { useEffect, useMemo, useState } from "react";
import { Check, Sparkles, Star } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseBySlug, getCoursePurchaseSellability } from "@/api";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";
import { CourseOverviewTabs } from "@/components/Tabs/CourseOverviewTabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import type { CoursePurchaseSellabilityResponse } from "@/api";
import { ICourse } from "@/types/course.types";
import { formatDuration } from "@/utils/format-duration";
import { formatPrice } from "@/utils/format-price";
import {
  getStudentCommerceCopy,
  resolveStudentCommerceState,
} from "@/utils/commerce-journey";
import { t } from "@/utils/translations";

const commerceBadgeTone: Record<
  string,
  "success" | "warning" | "destructive" | "outline" | "info"
> = {
  ALREADY_PURCHASED: "success",
  CHECKOUT_INITIATED: "info",
  PAYMENT_PENDING: "warning",
  PAYMENT_REJECTED: "destructive",
  PAYMENT_EXPIRED: "outline",
  MANUAL_REVIEW: "outline",
  NOT_PURCHASED: "outline",
};

export default function CourseOverview() {
  const { slug } = useParams();
  const [course, setCourse] = useState<ICourse>();
  const [loading, setLoading] = useState(true);
  const [commerceLoading, setCommerceLoading] = useState(false);
  const [sellability, setSellability] =
    useState<CoursePurchaseSellabilityResponse | null>(null);
  const [commerceError, setCommerceError] = useState<string | null>(null);
  const { user, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await getCourseBySlug(slug!);
      setCourse(res.data);
      setLoading(false);
    };

    fetchCourse();
  }, [slug]);

  useEffect(() => {
    const fetchSellability = async () => {
      if (!course || !isInitialized) {
        return;
      }

      if (!user.id || Number(course.price ?? 0) <= 0) {
        setSellability(null);
        setCommerceError(null);
        setCommerceLoading(false);
        return;
      }

      setCommerceLoading(true);
      setCommerceError(null);

      const response = await getCoursePurchaseSellability(course.id);

      if (!response.success || !response.data) {
        setCommerceError(
          response.message ||
            "No se pudo obtener el estado comercial del curso.",
        );
        setSellability(null);
        setCommerceLoading(false);
        return;
      }

      setSellability(response.data);
      setCommerceLoading(false);
    };

    fetchSellability();
  }, [course, isInitialized, user.id]);

  const totalLessons =
    course?.modules?.reduce(
      (acc: number, module) => acc + (module.lessons?.length ?? 0),
      0,
    ) ?? 0;

  const commerceState = useMemo(
    () => resolveStudentCommerceState({ sellability, orderStatus: null }),
    [sellability],
  );
  const commerceCopy = getStudentCommerceCopy(commerceState);

  if (loading || !course) return <GlobalLoading text="Obteniendo curso..." />;

  const isPaidCourse = Number(course.price ?? 0) > 0;
  const commerceTone = commerceBadgeTone[commerceState] ?? "outline";
  const checkoutHref = sellability?.existingOrder
    ? `/cursos/${course.id}/pago?orderId=${sellability.existingOrder.orderId}`
    : `/cursos/${course.id}/pago`;

  const handleCommerceAction = () => {
    if (!isPaidCourse) {
      navigate(`/cursos/${course.id}/pago`);
      return;
    }

    if (commerceState === "ALREADY_PURCHASED") {
      navigate(`/mis-cursos/${course.slug}`);
      return;
    }

    navigate(checkoutHref);
  };

  const commercePanel = (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Badge variant={commerceTone} size="sm">
          {commerceCopy.badge}
        </Badge>
        {sellability?.existingOrder ? (
          <span className="text-xs font-medium text-neutral-500">
            Orden {sellability.existingOrder.orderId.slice(-6)}
          </span>
        ) : null}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-neutral-950">
          {commerceCopy.title}
        </h3>
        <p className="text-sm leading-6 text-neutral-600">
          {commerceCopy.description}
        </p>
      </div>

      {commerceLoading ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-500">
          Consultando tu estado comercial actual.
        </div>
      ) : null}

      {commerceError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {commerceError}
        </div>
      ) : null}

      {sellability?.existingOrder ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
          <p className="font-medium text-neutral-950">Compra existente</p>
          <p className="mt-2">
            Estado orden:{" "}
            {t(
              "sellabilityExistinOrderStatus",
              sellability.existingOrder.status,
            )}
          </p>
          <p>
            Estado acceso:{" "}
            {t(
              "sellabilityExistinOrderAccessStatus",
              sellability.existingOrder.accessStatus,
            )}
          </p>
        </div>
      ) : null}

      <Button
        onClick={handleCommerceAction}
        size="lg"
        className="w-full text-base"
        disabled={commerceState === "MANUAL_REVIEW"}
      >
        {commerceCopy.actionLabel}
      </Button>

      {isPaidCourse ? (
        <p className="text-center text-xs text-neutral-500">
          El acceso se habilita recién cuando Mercado Pago confirma el pago por
          webhook.
        </p>
      ) : null}
    </div>
  );

  return (
    <div className="relative bg-neutral-50">
      <div className="absolute top-0 left-0 h-[600px] w-full bg-gradient-to-br from-primary via-primary-light to-primary" />

      <div className="relative mx-auto container px-6 md:px-0">
        <div className="grid gap-16 lg:grid-cols-[1fr_380px]">
          <div className="pt-24 text-white">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <Badge className="bg-white/10 text-white">
                  {t("courseSpecialty", course.specialty!)}
                </Badge>
                {course.level ? (
                  <Badge
                    variant="outline"
                    className="border-white/30 text-white"
                  >
                    {t("courseLevel", course.level)}
                  </Badge>
                ) : null}
              </div>

              <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-5xl xl:text-6xl">
                {course.title}
              </h1>

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

              {course.muxPromoAssetId ? (
                <div className="relative aspect-video overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl ring-1 ring-white/10 xl:max-w-3xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MuxPlayer
                      playbackId={course.muxPlaybackId}
                      className="h-full w-full mux-custom"
                      metadata={{
                        video_id: course.muxPlaybackId,
                        video_title: `Video promocional del curso ${course.id}`,
                        viewer_user_id: user.id.toString(),
                      }}
                      accentColor="#20ab9f"
                    />
                  </div>
                </div>
              ) : null}

              <div className="lg:hidden rounded-3xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-xl">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    {isPaidCourse ? (
                      <div className="space-y-1">
                        <p className="text-4xl font-semibold text-black">
                          {course.currency} ${formatPrice(course.price)}
                        </p>
                        <p className="text-sm text-neutral-500">
                          Pago único · Acceso de por vida
                        </p>
                      </div>
                    ) : (
                      <p className="text-2xl font-semibold text-black">
                        Curso gratuito
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>

                {commercePanel}
              </div>
            </div>

            <section className="space-y-16 pb-24 pt-32 text-neutral-900">
              <CourseOverviewTabs {...course} />
            </section>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-0 pt-24">
              <Card className="rounded-3xl bg-background shadow-2xl">
                <CardContent className="space-y-6 p-8">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      className="rounded-lg"
                      alt={course.title}
                    />
                  ) : null}

                  <div className="space-y-1">
                    {isPaidCourse ? (
                      <p className="text-4xl font-semibold">
                        {course.currency} ${formatPrice(course.price)}
                      </p>
                    ) : (
                      <p className="text-2xl font-semibold text-black">
                        Curso gratuito
                      </p>
                    )}
                    {isPaidCourse ? (
                      <p className="text-sm text-neutral-500">
                        Pago único · Acceso de por vida
                      </p>
                    ) : null}
                  </div>

                  {commercePanel}

                  <Separator />

                  <ul className="space-y-3 text-sm">
                    {course.level ? (
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                        <span>{t("courseLevel", course.level)}</span>
                      </li>
                    ) : null}
                    {course.duration ? (
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                        <span>
                          {formatDuration(course.duration)} horas de contenido
                        </span>
                      </li>
                    ) : null}
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
