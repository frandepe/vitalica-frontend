import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShieldCheck,
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
  type MercadoPagoCheckoutResponse,
} from "@/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import {
  getStudentCommerceCopy,
  isTerminalStudentCommerceState,
  resolveStudentCommerceState,
  type StudentCommerceState,
} from "@/utils/commerce-journey";

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

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
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
  const [checkout, setCheckout] = useState<MercadoPagoCheckoutResponse | null>(
    null,
  );

  const requestedOrderId = searchParams.get("orderId");
  const paymentReturn = searchParams.get("payment_return");
  const redirectPaymentId = searchParams.get("payment_id");
  const redirectCollectionId = searchParams.get("collection_id");
  const redirectMerchantOrderId = searchParams.get("merchant_order_id");
  const lookupOrderId = requestedOrderId ?? sellability?.existingOrder?.orderId ?? null;

  useEffect(() => {
    if (!paymentReturn) {
      return;
    }

    console.log("[MP redirect params]", {
      orderId: requestedOrderId,
      paymentReturn,
      paymentId: redirectPaymentId,
      collectionId: redirectCollectionId,
      merchantOrderId: redirectMerchantOrderId,
      status: searchParams.get("status"),
      externalReference: searchParams.get("external_reference"),
      allQueryParams: Object.fromEntries(searchParams.entries()),
    });
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
      syncOrderSearchParam(sellability.existingOrder.orderId);
    }
  }, [requestedOrderId, sellability]);

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
            "No se pudo obtener el estado actual de la orden comercial.",
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
      console.log("[MP redirect sync]", {
        orderId: lookupOrderId,
        paymentId: redirectPaymentId,
        collectionId: redirectCollectionId,
        merchantOrderId: redirectMerchantOrderId,
      });

      const response = await syncCommercialOrderAfterRedirect(lookupOrderId, {
        paymentId: redirectPaymentId,
        collectionId: redirectCollectionId,
        merchantOrderId: redirectMerchantOrderId,
      });

      console.log("[MP redirect sync response]", response);

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
      throw new Error("No se encontró el curso para crear la orden.");
    }

    const orderResponse = await createCoursePurchaseOrder(courseId);

    if (!orderResponse.success || !orderResponse.data) {
      throw new Error(
        orderResponse.message ||
          "No se pudo crear o recuperar la orden comercial.",
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
        response.message ||
          "No se pudo refrescar el estado de la orden comercial.",
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
            "No se pudo crear el checkout de Mercado Pago.",
        );
      }

      setCheckout(checkoutResponse.data);
      syncOrderSearchParam(currentOrder.orderId);
      console.log("[MP checkout redirect]", {
        orderId: currentOrder.orderId,
        paymentId: checkoutResponse.data.paymentId,
        checkoutUrl: checkoutResponse.data.checkoutUrl,
        checkoutUrlSource: checkoutResponse.data.checkoutUrlSource,
        sandboxCheckoutUrl: checkoutResponse.data.sandboxCheckoutUrl,
        collectorId: checkoutResponse.data.checkoutDiagnostics.collectorId,
        marketplace: checkoutResponse.data.checkoutDiagnostics.marketplace,
        marketplaceFee: checkoutResponse.data.checkoutDiagnostics.marketplaceFee,
        tokenSource: checkoutResponse.data.checkoutDiagnostics.tokenSource,
      });
      window.location.assign(checkoutResponse.data.checkoutUrl);
    } catch (checkoutError) {
      const message =
        checkoutError instanceof Error
          ? checkoutError.message
          : "Error al iniciar el checkout de Mercado Pago.";

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
        title: "Pago aprobado",
        description:
          "Mercado Pago ya confirmó la compra. El acceso al curso depende del procesamiento del webhook, y en esta orden ya quedó resuelto.",
      };
    }

    if (studentState === "PAYMENT_APPROVED") {
      return {
        icon: CheckCircle2,
        tone: "border-sky-200 bg-sky-50 text-sky-800",
        title: "Pago aprobado, acceso en sincronización",
        description:
          "Mercado Pago ya marcó la operación como aprobada. Si todavía no ves el curso habilitado, esperá unos segundos y refrescá el estado de la orden.",
      };
    }

    if (studentState === "PAYMENT_PENDING" || paymentReturn === "pending") {
      return {
        icon: Clock3,
        tone: "border-amber-200 bg-amber-50 text-amber-800",
        title: "Pago pendiente de confirmación",
        description:
          "Volviste desde Mercado Pago, pero la orden todavía no llegó a un estado terminal. Vamos consultando el estado real por unos segundos.",
      };
    }

    if (studentState === "PAYMENT_REJECTED" || paymentReturn === "failure") {
      return {
        icon: XCircle,
        tone: "border-rose-200 bg-rose-50 text-rose-800",
        title: "Pago no aprobado",
        description:
          "El intento actual no se confirmó. Podés reintentar sin crear una orden nueva innecesaria.",
      };
    }

    if (studentState === "PAYMENT_EXPIRED") {
      return {
        icon: AlertTriangle,
        tone: "border-slate-200 bg-slate-100 text-slate-700",
        title: "Compra expirada o abandonada",
        description:
          "La orden ya no quedó activa. Si querés continuar, vas a poder relanzar el checkout reutilizando la orden cuando corresponda.",
      };
    }

    return {
      icon: RefreshCw,
      tone: "border-sky-200 bg-sky-50 text-sky-800",
      title: "Volviste desde Mercado Pago",
      description:
        "Estamos sincronizando el estado real de la compra antes de mostrarte el siguiente paso.",
    };
  }, [paymentReturn, studentState]);

  const primaryLabel =
    canGoToCourse
      ? "Ir al curso"
      : studentState === "PAYMENT_PENDING" ||
          studentState === "PAYMENT_APPROVED"
        ? "Actualizar estado"
        : studentState === "PAYMENT_REJECTED" ||
            studentState === "PAYMENT_EXPIRED"
          ? "Reintentar pago"
          : studentState === "CHECKOUT_INITIATED"
            ? "Continuar compra"
            : commerceCopy.actionLabel;

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Preparando checkout</h1>
        <p className="mt-3 text-sm text-neutral-600">
          Validando el estado comercial del curso y la orden vigente.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-[28px] border-neutral-200 shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-neutral-200 bg-neutral-950 px-8 py-7 text-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <WalletCards className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/60">
                      Checkout Mercado Pago
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold">
                      Journey comercial del alumno
                    </h1>
                  </div>
                </div>
                <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70">
                  Esta pantalla inicia la compra, recibe el retorno desde Mercado
                  Pago y muestra el estado comercial real sin otorgar acceso desde
                  frontend.
                </p>
              </div>

              <div className="space-y-6 p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={statusToneMap[studentState]} size="sm">
                    {commerceCopy.badge}
                  </Badge>
                  {effectiveOrderId ? (
                    <Badge variant="outline" size="sm">
                      Orden {effectiveOrderId}
                    </Badge>
                  ) : null}
                  {paymentReturn ? (
                    <Badge variant="outline" size="sm">
                      Retorno Mercado Pago: {paymentReturn}
                    </Badge>
                  ) : null}
                </div>

                {returnPanel ? (
                  <div className={`rounded-3xl border p-5 ${returnPanel.tone}`}>
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

                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
                    Estado actual
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-neutral-950">
                    {commerceCopy.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                    {commerceCopy.description}
                  </p>
                </div>

                {error ? (
                  <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}

                {checkout ? (
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
                    <p className="font-semibold">
                      Checkout creado. Redirigiendo a Mercado Pago.
                    </p>
                    <p className="mt-2">Payment ID interno: {checkout.paymentId}</p>
                    <p>Preference ID: {checkout.preferenceId}</p>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
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
                    {submitting ? "Redirigiendo a Mercado Pago..." : primaryLabel}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={refreshOrderStatus}
                    disabled={!effectiveOrderId || orderLoading}
                  >
                    {orderLoading ? "Actualizando..." : "Refrescar orden"}
                  </Button>

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
                    Volver al curso
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[28px] border-neutral-200 shadow-sm">
            <CardContent className="space-y-5 p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
                  Resumen comercial
                </p>
                <h3 className="mt-2 text-xl font-semibold text-neutral-950">
                  {sellability?.courseTitle ?? orderStatus?.courseTitle ?? "Curso"}
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  {sellability?.currency && sellability.amount
                    ? `${sellability.currency} ${sellability.amount}`
                    : "Precio no disponible"}
                </p>
              </div>

              <Separator />

              <div className="space-y-4 text-sm text-neutral-700">
                <div>
                  <p className="text-neutral-500">Resolución comercial</p>
                  <p className="mt-1 font-medium text-neutral-950">
                    {sellability?.orderResolution ?? "No disponible"}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">Estado de la orden</p>
                  <p className="mt-1 font-medium text-neutral-950">
                    {orderStatus?.orderStatus ??
                      sellability?.existingOrder?.status ??
                      "Sin orden"}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">Estado del acceso</p>
                  <p className="mt-1 font-medium text-neutral-950">
                    {orderStatus?.accessStatus ??
                      sellability?.existingOrder?.accessStatus ??
                      "Sin dato"}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">Último pago</p>
                  <p className="mt-1 font-medium text-neutral-950">
                    {orderStatus?.latestPaymentStatus ?? "Sin pago registrado"}
                  </p>
                  {orderStatus?.latestPaymentStatusDetail ? (
                    <p className="mt-1 text-xs text-neutral-500">
                      {orderStatus.latestPaymentStatusDetail}
                    </p>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-neutral-200 shadow-sm">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-950">
                    Sin acceso concedido desde frontend
                  </p>
                  <p className="text-sm text-neutral-600">
                    El curso sólo se habilita cuando el webhook actualiza la orden.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4 text-sm text-neutral-700">
                <div>
                  <p className="text-neutral-500">Orden comercial</p>
                  <p className="mt-1 font-medium text-neutral-950">
                    {effectiveOrderId ?? "Se crea o reutiliza al continuar"}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">Último intento de pago</p>
                  <p className="mt-1 font-medium text-neutral-950">
                    {formatDateTime(orderStatus?.lastPaymentAttemptAt)}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">Pago aprobado en</p>
                  <p className="mt-1 font-medium text-neutral-950">
                    {formatDateTime(orderStatus?.paidAt)}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">Acceso otorgado en</p>
                  <p className="mt-1 font-medium text-neutral-950">
                    {formatDateTime(orderStatus?.accessGrantedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">Expiración</p>
                  <p className="mt-1 font-medium text-neutral-950">
                    {formatDateTime(orderStatus?.expiresAt)}
                  </p>
                </div>
              </div>

              {studentState === "PAYMENT_PENDING" ? (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Seguimos consultando el estado real de la orden cada pocos
                  segundos hasta que Mercado Pago confirme el resultado final.
                </div>
              ) : null}

              {canGoToCourse ? (
                <Button
                  variant="outline"
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
