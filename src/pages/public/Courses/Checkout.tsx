import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  RefreshCw,
  WalletCards,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  createCoursePurchaseOrder,
  createMercadoPagoCheckout,
  getCommercialOrderStatus,
  getCoursePurchaseSellability,
  syncCommercialOrderAfterRedirect,
  type CommercialOrderStatusResponse,
  type CoursePurchaseOrderResponse,
  type CoursePurchaseSellabilityResponse,
} from "@/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import {
  getStudentCommerceCopy,
  isTerminalStudentCommerceState,
  resolveStudentCommerceState,
  type StudentCommerceState,
} from "@/utils/commerce-journey";
import { formatPrice } from "@/utils/format-price";
import { Separator } from "@/components/ui/separator";

const POLLING_INTERVAL_MS = 4000;

const statusToneMap: Record<
  StudentCommerceState,
  "success" | "warning" | "destructive" | "outline" | "info"
> = {
  NOT_PURCHASED: "outline",
  CHECKOUT_INITIATED: "info",
  PAYMENT_PENDING: "warning",
  PAYMENT_APPROVED: "success",
  PAYMENT_REJECTED: "destructive",
  PAYMENT_EXPIRED: "outline",
  ALREADY_PURCHASED: "success",
  MANUAL_REVIEW: "outline",
};

const statusLabelMap: Record<StudentCommerceState, string> = {
  NOT_PURCHASED: "Listo para comprar",
  CHECKOUT_INITIATED: "Continuar compra",
  PAYMENT_PENDING: "Estamos confirmando tu pago",
  PAYMENT_APPROVED: "Pago aprobado",
  PAYMENT_REJECTED: "Pago rechazado",
  PAYMENT_EXPIRED: "Podés intentar nuevamente",
  ALREADY_PURCHASED: "Ya tenés acceso",
  MANUAL_REVIEW: "Necesita revisión",
};

const stateDescriptionMap: Record<StudentCommerceState, string> = {
  NOT_PURCHASED:
    "Estás a un paso de acceder al curso. Cuando quieras, podés continuar con el pago.",
  CHECKOUT_INITIATED:
    "Tu compra ya está iniciada. Podés retomar el pago sin volver a empezar.",
  PAYMENT_PENDING:
    "Estamos confirmando tu pago. Esto puede tardar unos segundos.",
  PAYMENT_APPROVED:
    "Tu pago fue aprobado. Estamos terminando de habilitar tu acceso.",
  PAYMENT_REJECTED:
    "No se pudo completar el pago. Podés intentarlo nuevamente.",
  PAYMENT_EXPIRED:
    "El intento anterior ya no está activo. Podés volver a intentarlo cuando quieras.",
  ALREADY_PURCHASED:
    "Tu acceso ya está listo. Podés entrar al curso cuando quieras.",
  MANUAL_REVIEW:
    "Necesitamos revisar este caso antes de continuar con la compra.",
};

const Checkout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isInitialized } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sellability, setSellability] =
    useState<CoursePurchaseSellabilityResponse | null>(null);
  const [order, setOrder] = useState<CoursePurchaseOrderResponse | null>(null);
  const [orderStatus, setOrderStatus] =
    useState<CommercialOrderStatusResponse | null>(null);

  const requestedOrderId = searchParams.get("orderId");
  const paymentReturn = searchParams.get("payment_return");
  const redirectPaymentId = searchParams.get("payment_id");
  const redirectCollectionId = searchParams.get("collection_id");
  const redirectMerchantOrderId = searchParams.get("merchant_order_id");
  const lookupOrderId =
    requestedOrderId ?? sellability?.existingOrder?.orderId ?? null;

  useEffect(() => {
    if (!paymentReturn) {
      return;
    }
  }, [
    paymentReturn,
    requestedOrderId,
    redirectPaymentId,
    redirectCollectionId,
    redirectMerchantOrderId,
    searchParams,
  ]);

  useEffect(() => {
    const fetchSellability = async () => {
      if (!courseId) {
        setError("No se encontró el curso para iniciar la compra.");
        setLoading(false);
        return;
      }

      if (!isInitialized) {
        return;
      }

      if (!user.id) {
        setError("Necesitás iniciar sesión para continuar con la compra.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const response = await getCoursePurchaseSellability(courseId);

      if (!response.success || !response.data) {
        setError(
          response.message ||
            "No se pudo validar si el curso está habilitado para compra.",
        );
        setLoading(false);
        return;
      }

      setSellability(response.data);
      setLoading(false);
    };

    fetchSellability();
  }, [courseId, isInitialized, user.id]);

  useEffect(() => {
    if (!requestedOrderId && sellability?.existingOrder?.orderId) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("orderId", sellability.existingOrder.orderId);
      setSearchParams(nextParams, { replace: true });
    }
  }, [requestedOrderId, searchParams, sellability, setSearchParams]);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!lookupOrderId || !isInitialized || !user.id) {
        return;
      }

      setOrderLoading(true);
      const response = await getCommercialOrderStatus(lookupOrderId);

      if (!response.success || !response.data) {
        setOrderLoading(false);
        setError(
          response.message ||
            "No se pudo obtener el estado actual de la compra.",
        );
        return;
      }

      setOrderStatus(response.data);
      setOrderLoading(false);
    };

    fetchOrderStatus();
  }, [lookupOrderId, isInitialized, user.id]);

  const studentState = useMemo(
    () => resolveStudentCommerceState({ sellability, orderStatus }),
    [sellability, orderStatus],
  );

  useEffect(() => {
    if (!lookupOrderId || !paymentReturn || !isInitialized || !user.id) {
      return;
    }

    const runRedirectSync = async () => {
      const response = await syncCommercialOrderAfterRedirect(lookupOrderId, {
        paymentId: redirectPaymentId,
        collectionId: redirectCollectionId,
        merchantOrderId: redirectMerchantOrderId,
      });

      if (!response.success) {
        return;
      }

      const refreshed = await getCommercialOrderStatus(lookupOrderId);
      if (refreshed.success && refreshed.data) {
        setOrderStatus(refreshed.data);
      }
    };

    void runRedirectSync();
  }, [
    lookupOrderId,
    paymentReturn,
    isInitialized,
    user.id,
    redirectPaymentId,
    redirectCollectionId,
    redirectMerchantOrderId,
  ]);

  useEffect(() => {
    if (!lookupOrderId || !paymentReturn || !isInitialized || !user.id) {
      return;
    }

    if (isTerminalStudentCommerceState(studentState)) {
      return;
    }

    const intervalId = window.setInterval(async () => {
      const response = await getCommercialOrderStatus(lookupOrderId);

      if (response.success && response.data) {
        setOrderStatus(response.data);
      }
    }, POLLING_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [lookupOrderId, paymentReturn, isInitialized, user.id, studentState]);

  const commerceCopy = getStudentCommerceCopy(studentState);
  const effectiveOrderId =
    orderStatus?.orderId ??
    requestedOrderId ??
    sellability?.existingOrder?.orderId ??
    order?.orderId ??
    null;
  const courseSlug = orderStatus?.courseSlug;
  const canGoToCourse = studentState === "ALREADY_PURCHASED" && courseSlug;
  const courseTitle =
    sellability?.courseTitle ?? orderStatus?.courseTitle ?? "Curso";
  const coursePrice =
    sellability?.currency && sellability.amount
      ? `${sellability.currency} ${formatPrice(sellability.amount)}`
      : "Precio no disponible";

  const syncOrderSearchParam = (orderId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("orderId", orderId);
    setSearchParams(nextParams, { replace: true });
  };

  const ensureOrder = async () => {
    if (order) {
      return order;
    }

    if (!courseId) {
      throw new Error("No se encontró el curso para crear la compra.");
    }

    const orderResponse = await createCoursePurchaseOrder(courseId);

    if (!orderResponse.success || !orderResponse.data) {
      throw new Error(
        orderResponse.message || "No se pudo preparar la compra.",
      );
    }

    setOrder(orderResponse.data);
    syncOrderSearchParam(orderResponse.data.orderId);
    return orderResponse.data;
  };

  const refreshOrderStatus = async () => {
    if (!effectiveOrderId) {
      return;
    }

    setOrderLoading(true);
    const response = await getCommercialOrderStatus(effectiveOrderId);

    if (!response.success || !response.data) {
      setOrderLoading(false);
      setError(
        response.message || "No se pudo actualizar el estado de la compra.",
      );
      return;
    }

    setOrderStatus(response.data);
    setOrderLoading(false);
  };

  const handleStartCheckout = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const currentOrder = await ensureOrder();
      const checkoutResponse = await createMercadoPagoCheckout(
        currentOrder.orderId,
      );

      if (!checkoutResponse.success || !checkoutResponse.data) {
        throw new Error(
          checkoutResponse.message ||
            "No se pudo iniciar el pago en este momento.",
        );
      }

      syncOrderSearchParam(currentOrder.orderId);
      window.location.assign(checkoutResponse.data.checkoutUrl);
    } catch (checkoutError) {
      const message =
        checkoutError instanceof Error
          ? checkoutError.message
          : "Error al iniciar el pago.";

      setError(message);
      showToast(`No se pudo iniciar la compra. ${message}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrimaryAction = async () => {
    if (!user.id) {
      navigate("/auth/login");
      return;
    }

    if (canGoToCourse) {
      navigate(`/mis-cursos/${courseSlug}`);
      return;
    }

    if (studentState === "PAYMENT_PENDING") {
      await refreshOrderStatus();
      return;
    }

    if (studentState === "PAYMENT_APPROVED") {
      await refreshOrderStatus();
      return;
    }

    if (studentState === "MANUAL_REVIEW") {
      return;
    }

    await handleStartCheckout();
  };

  const returnPanel = useMemo(() => {
    if (!paymentReturn) {
      return null;
    }

    if (studentState === "ALREADY_PURCHASED") {
      return {
        icon: CheckCircle2,
        tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
        title: "Ya está todo listo",
        description: "Tu compra fue confirmada y ya podés entrar al curso.",
      };
    }

    if (studentState === "PAYMENT_APPROVED") {
      return {
        icon: CheckCircle2,
        tone: "border-sky-200 bg-sky-50 text-sky-800",
        title: "Pago aprobado",
        description:
          "Ya recibimos la confirmación. Estamos terminando de habilitar tu acceso.",
      };
    }

    if (studentState === "PAYMENT_PENDING" || paymentReturn === "pending") {
      return {
        icon: Clock3,
        tone: "border-amber-200 bg-amber-50 text-amber-800",
        title: "Estamos confirmando tu pago",
        description:
          "Esto puede tardar unos segundos. En cuanto esté listo, vas a poder seguir.",
      };
    }

    if (studentState === "PAYMENT_REJECTED" || paymentReturn === "failure") {
      return {
        icon: XCircle,
        tone: "border-rose-200 bg-rose-50 text-rose-800",
        title: "No se pudo completar el pago",
        description: "Podés intentarlo nuevamente cuando quieras.",
      };
    }

    if (studentState === "PAYMENT_EXPIRED") {
      return {
        icon: AlertTriangle,
        tone: "border-stone-200 bg-stone-100 text-stone-700",
        title: "Podés intentarlo nuevamente",
        description:
          "El intento anterior ya no está activo. Si querés, podés volver a pagar.",
      };
    }

    return {
      icon: RefreshCw,
      tone: "border-sky-200 bg-sky-50 text-sky-800",
      title: "Estamos revisando tu compra",
      description:
        "En unos segundos te mostramos el estado actualizado para que sigas sin complicaciones.",
    };
  }, [paymentReturn, studentState]);

  const primaryLabel = canGoToCourse
    ? "Ir al curso"
    : studentState === "PAYMENT_PENDING" || studentState === "PAYMENT_APPROVED"
      ? "Verificar estado"
      : studentState === "PAYMENT_REJECTED" ||
          studentState === "PAYMENT_EXPIRED"
        ? "Intentar nuevamente"
        : studentState === "CHECKOUT_INITIATED"
          ? "Continuar compra"
          : commerceCopy.actionLabel;

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[32px] border border-stone-200 bg-white px-8 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-950 text-white">
            <WalletCards className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-stone-950">
            Preparando tu compra
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600">
            Estamos revisando la información para mostrarte el siguiente paso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-[32px] border-stone-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-stone-200 bg-gradient-to-br from-primary to-primary/80 px-8 py-8 text-white">
                <div className="flex items-start gap-4">
                  <div className="rounded-[22px] bg-white/10 p-3.5">
                    <WalletCards className="h-5 w-5" />
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/55">
                      Compra segura
                    </p>
                    <h1 className="text-3xl font-semibold">
                      Finalizá tu compra
                    </h1>
                    <p className="max-w-2xl text-sm leading-6 text-white/72">
                      Acá vas a ver qué está pasando con tu compra y qué podés
                      hacer ahora.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-8">
                <Badge variant={statusToneMap[studentState]} size="sm">
                  {statusLabelMap[studentState]}
                </Badge>

                {returnPanel ? (
                  <div
                    className={`rounded-[28px] border p-5 ${returnPanel.tone}`}
                  >
                    <div className="flex items-start gap-3">
                      <returnPanel.icon className="mt-0.5 h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-semibold">{returnPanel.title}</p>
                        <p className="mt-2 text-sm leading-6">
                          {returnPanel.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="py-6">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
                    Estado de tu compra
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-stone-950">
                    {commerceCopy.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
                    {stateDescriptionMap[studentState] ??
                      commerceCopy.description}
                  </p>
                </div>

                {error ? (
                  <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-700">
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3 pt-1">
                  <Button
                    onClick={handlePrimaryAction}
                    disabled={
                      submitting ||
                      orderLoading ||
                      studentState === "MANUAL_REVIEW"
                    }
                    size="lg"
                    className="min-w-48"
                  >
                    {submitting ? "Abriendo pago..." : primaryLabel}
                  </Button>

                  {/* <Button
                    variant="outline"
                    size="lg"
                    onClick={refreshOrderStatus}
                    disabled={!effectiveOrderId || orderLoading}
                  >
                    {orderLoading ? "Actualizando..." : "Actualizar"}
                  </Button> */}

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      if (courseSlug) {
                        navigate(`/cursos/${courseSlug}`);
                        return;
                      }

                      navigate(-1);
                    }}
                  >
                    Volver
                  </Button>
                </div>

                {(studentState === "PAYMENT_PENDING" ||
                  studentState === "PAYMENT_APPROVED") && (
                  <p className="text-sm leading-6 text-stone-500">
                    Si no ves cambios enseguida, podés actualizar esta pantalla
                    en unos segundos.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[32px] border-stone-200 bg-[#fcfbf7] shadow-sm">
            <CardContent className="space-y-6 p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
                  Resumen
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-stone-950">
                  {courseTitle}
                </h3>
                <p className="mt-2 text-sm text-stone-600">{coursePrice}</p>
              </div>
              <Separator />
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
                  Estado
                </p>
                <p className="mt-3 text-lg font-semibold text-stone-950">
                  {statusLabelMap[studentState]}
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {studentState === "ALREADY_PURCHASED"
                    ? "Tu compra está lista y ya podés entrar al curso."
                    : studentState === "PAYMENT_APPROVED"
                      ? "Ya recibimos la confirmación del pago."
                      : studentState === "PAYMENT_PENDING"
                        ? "Estamos esperando la confirmación final del pago."
                        : studentState === "PAYMENT_REJECTED"
                          ? "Podés volver a intentarlo cuando quieras."
                          : studentState === "PAYMENT_EXPIRED"
                            ? "El intento anterior terminó y podés empezar de nuevo."
                            : "Podés avanzar cuando quieras."}
                </p>
              </div>

              <div className="space-y-4 text-sm text-stone-700">
                <div>
                  <p className="text-stone-500">Curso</p>
                  <p className="mt-1 font-medium text-stone-950">
                    {courseTitle}
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Precio</p>
                  <p className="mt-1 font-medium text-stone-950">
                    {coursePrice}
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Modalidad de pago</p>
                  <p className="mt-1 font-medium text-stone-950">
                    Pago único en 1 cuota
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Acceso</p>
                  <p className="mt-1 font-medium text-stone-950">
                    {studentState === "ALREADY_PURCHASED"
                      ? "Disponible ahora"
                      : studentState === "PAYMENT_APPROVED"
                        ? "Se habilita en unos segundos"
                        : "Se habilita cuando se confirme el pago"}
                  </p>
                </div>
              </div>

              {studentState === "PAYMENT_PENDING" ? (
                <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  Estamos revisando tu pago para mostrarte el resultado apenas
                  quede confirmado.
                </div>
              ) : null}

              {canGoToCourse ? (
                <Button
                  className="w-full justify-between"
                  onClick={() => navigate(`/mis-cursos/${courseSlug}`)}
                >
                  Ir al curso
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
