import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CircleDollarSign,
  DatabaseZap,
  RefreshCw,
  ShieldAlert,
  WalletCards,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  getCommercialOrderDiagnosticAdmin,
  getCommercialOrdersAdmin,
  getCommercialOrdersRequiringAttentionAdmin,
  repairCommercialOrderAccessAdmin,
} from "@/api";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import type {
  AdminCommerceAttentionItem,
  AdminCommerceOrderDiagnostic,
  AdminCommerceOrderListItem,
} from "@/types/admin.types";

const statusToneMap: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  PAID: "success",
  APPROVED: "success",
  GRANTED: "success",
  PAYMENT_PENDING: "warning",
  PENDING: "warning",
  CHECKOUT_PENDING: "warning",
  PAYMENT_FAILED: "destructive",
  REJECTED: "destructive",
  CANCELLED: "destructive",
  FAILED: "destructive",
  REFUNDED: "secondary",
  RECEIVED: "secondary",
  PROCESSING: "warning",
  PROCESSED: "success",
};

const toneClassMap = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  destructive: "border-rose-200 bg-rose-50 text-rose-800",
  secondary: "border-slate-200 bg-slate-100 text-slate-700",
};

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
};

const formatCurrency = (amount: string, currency: string) => {
  const numericAmount = Number(amount ?? 0);

  if (!Number.isFinite(numericAmount)) {
    return `${amount} ${currency}`;
  }

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

const StatusBadge = ({ value }: { value: string | null | undefined }) => {
  if (!value) {
    return <Badge variant="outline">Sin dato</Badge>;
  }

  const tone = statusToneMap[value] ?? "secondary";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${toneClassMap[tone]}`}
    >
      {value}
    </span>
  );
};

const SectionShell = ({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card className="border-slate-200 bg-white shadow-sm">
    <CardContent className="p-0">
      <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </CardContent>
  </Card>
);

const AdminPayments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOrderId = searchParams.get("orderId");
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [orders, setOrders] = useState<AdminCommerceOrderListItem[]>([]);
  const [attentionOrders, setAttentionOrders] = useState<AdminCommerceAttentionItem[]>([]);
  const [diagnostic, setDiagnostic] = useState<AdminCommerceOrderDiagnostic | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingDiagnostic, setLoadingDiagnostic] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const { showToast } = useToast();

  const fetchOrders = async (nextAttentionOnly = attentionOnly) => {
    setLoadingOrders(true);
    try {
      const [ordersResponse, attentionResponse] = await Promise.all([
        getCommercialOrdersAdmin({
          page: 1,
          limit: 20,
          attentionOnly: nextAttentionOnly,
        }),
        getCommercialOrdersRequiringAttentionAdmin(),
      ]);

      const nextOrders = ordersResponse.success && ordersResponse.data
        ? ordersResponse.data.orders
        : [];
      setOrders(nextOrders);
      setAttentionOrders(attentionResponse.success && attentionResponse.data ? attentionResponse.data : []);

      const nextSelectedOrderId = selectedOrderId && nextOrders.some((order) => order.orderId === selectedOrderId)
        ? selectedOrderId
        : nextOrders[0]?.orderId;

      if (nextSelectedOrderId) {
        setSearchParams({ orderId: nextSelectedOrderId });
      } else {
        setSearchParams({});
        setDiagnostic(null);
      }
    } catch (error) {
      console.error("Error fetching admin commerce orders", error);
      showToast("No se pudieron cargar las órdenes comerciales", "error", "bottom-right");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchDiagnostic = async (orderId: string) => {
    setLoadingDiagnostic(true);
    try {
      const response = await getCommercialOrderDiagnosticAdmin(orderId);

      if (response.success && response.data) {
        setDiagnostic(response.data);
        return;
      }

      setDiagnostic(null);
      showToast(response.message || "No se pudo cargar el diagnóstico", "error", "bottom-right");
    } catch (error) {
      console.error("Error fetching commercial diagnostic", error);
      setDiagnostic(null);
      showToast("No se pudo cargar el diagnóstico comercial", "error", "bottom-right");
    } finally {
      setLoadingDiagnostic(false);
    }
  };

  useEffect(() => {
    fetchOrders(attentionOnly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attentionOnly]);

  useEffect(() => {
    if (selectedOrderId) {
      fetchDiagnostic(selectedOrderId);
    }
  }, [selectedOrderId]);

  const handleSelectOrder = (orderId: string) => {
    setSearchParams({ orderId });
  };

  const handleRepair = async () => {
    if (!diagnostic?.order.id) return;

    setRepairing(true);
    try {
      const response = await repairCommercialOrderAccessAdmin(diagnostic.order.id);

      if (!response.success || !response.data) {
        showToast(response.message || "No se pudo ejecutar la reparación", "error", "bottom-right");
        return;
      }

      showToast(
        response.data.repairAction === "REPAIRED"
          ? "Acceso reparado correctamente"
          : "La orden ya tenía acceso otorgado",
        "success",
        "bottom-right",
      );

      await Promise.all([
        fetchOrders(attentionOnly),
        fetchDiagnostic(diagnostic.order.id),
      ]);
    } catch (error) {
      console.error("Error repairing access", error);
      showToast("No se pudo ejecutar la reparación manual", "error", "bottom-right");
    } finally {
      setRepairing(false);
    }
  };

  const stats = useMemo(() => {
    const approvedOnPage = orders.filter((order) => order.latestPaymentStatus === "APPROVED").length;
    const grantedOnPage = orders.filter((order) => order.accessStatus === "GRANTED").length;

    return [
      {
        label: "Órdenes visibles",
        value: String(orders.length),
        icon: WalletCards,
        tone: "text-slate-700 bg-slate-100",
      },
      {
        label: "Pagos aprobados",
        value: String(approvedOnPage),
        icon: CircleDollarSign,
        tone: "text-emerald-700 bg-emerald-100",
      },
      {
        label: "Accesos otorgados",
        value: String(grantedOnPage),
        icon: BadgeCheck,
        tone: "text-blue-700 bg-blue-100",
      },
      {
        label: "Requieren atención",
        value: String(attentionOrders.length),
        icon: ShieldAlert,
        tone: "text-amber-700 bg-amber-100",
      },
    ];
  }, [attentionOrders.length, orders]);

  if (loadingOrders && orders.length === 0) {
    return <GlobalLoading text="Cargando consola de pagos..." />;
  }

  return (
    <div className="min-h-screen space-y-6 py-8">
      <section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Commerce Operations
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Bitácora administrativa de pagos y órdenes comerciales
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Supervisá el recorrido completo de cada compra: orden, payment, webhooks,
              revenue allocation, enrollment y reparación manual sin tocar el flujo de split.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={attentionOnly ? "secondary" : "outline"}
              size="sm"
              onClick={() => setAttentionOnly((current) => !current)}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              {attentionOnly ? "Ver todas" : "Solo atención"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => fetchOrders(attentionOnly)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refrescar
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/80 bg-white/90 px-4 py-4 shadow-[0_1px_0_rgba(15,23,42,0.03)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <SectionShell
          title="Órdenes"
          subtitle={
            attentionOnly
              ? "Vista filtrada a casos que hoy requieren intervención manual."
              : "Selección rápida de órdenes comerciales recientes."
          }
        >
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No hay órdenes para mostrar con el filtro actual.
              </div>
            ) : (
              orders.map((order) => {
                const isSelected = order.orderId === selectedOrderId;

                return (
                  <button
                    key={order.orderId}
                    type="button"
                    onClick={() => handleSelectOrder(order.orderId)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${
                      isSelected
                        ? "border-blue-300 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{order.courseTitle}</p>
                        <p className="mt-1 text-xs text-slate-500">{order.buyerEmail}</p>
                      </div>
                      <StatusBadge value={order.orderStatus} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <StatusBadge value={order.accessStatus} />
                      <StatusBadge value={order.latestPaymentStatus} />
                      {order.attentionReasons.length > 0 ? (
                        <Badge variant="warning" size="sm">
                          {order.attentionReasons.length} alertas
                        </Badge>
                      ) : (
                        <Badge variant="success" size="sm">
                          Sana
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
                      <div>
                        <p className="uppercase tracking-[0.18em] text-slate-400">Monto</p>
                        <p className="mt-1 font-medium text-slate-800">
                          {formatCurrency(order.grossAmount, order.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.18em] text-slate-400">Actualizada</p>
                        <p className="mt-1 font-medium text-slate-800">
                          {formatDateTime(order.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </SectionShell>

        <div className="space-y-6">
          {loadingDiagnostic ? (
            <GlobalLoading text="Cargando diagnóstico comercial..." />
          ) : !diagnostic ? (
            <SectionShell
              title="Diagnóstico"
              subtitle="Seleccioná una orden para inspeccionar el estado comercial completo."
            >
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                No hay una orden seleccionada.
              </div>
            </SectionShell>
          ) : (
            <>
              <SectionShell
                title="Resumen de orden"
                subtitle="La orden es la fuente de verdad comercial de la compra."
                action={
                  <div className="flex gap-2">
                    {diagnostic.attentionReasons.length > 0 ? (
                      <Badge variant="warning" size="sm">
                        {diagnostic.attentionReasons.length} razones de atención
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        Flujo sano
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleRepair}
                      disabled={repairing || diagnostic.order.accessStatus === "GRANTED"}
                    >
                      <DatabaseZap className="mr-2 h-4 w-4" />
                      {repairing ? "Reparando..." : "Reparar acceso"}
                    </Button>
                  </div>
                }
              >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Order ID</p>
                    <p className="mt-2 break-all font-mono text-xs text-slate-800">{diagnostic.order.id}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Buyer</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{diagnostic.order.buyer.email}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {diagnostic.order.buyer.firstName ?? "Sin nombre"} {diagnostic.order.buyer.lastName ?? ""}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Curso</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {diagnostic.order.course.title ?? diagnostic.order.courseTitleSnapshot}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{diagnostic.order.course.slug}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Snapshot</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {formatCurrency(
                        diagnostic.order.grossAmountSnapshot,
                        diagnostic.order.currencySnapshot,
                      )}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {diagnostic.order.commissionRuleVersion}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <StatusBadge value={diagnostic.order.status} />
                  <StatusBadge value={diagnostic.order.accessStatus} />
                  {diagnostic.attentionReasons.map((reason) => (
                    <Badge key={reason} variant="warning" size="sm">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </SectionShell>

              <div className="grid gap-6 2xl:grid-cols-2">
                <SectionShell title="Payments asociados" subtitle="Intentos persistidos para esta orden.">
                  <div className="space-y-3">
                    {diagnostic.payments.length === 0 ? (
                      <EmptyDiagnosticState label="No hay payments asociados." />
                    ) : (
                      diagnostic.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-mono text-xs text-slate-500">{payment.id}</p>
                              <p className="mt-2 text-sm font-medium text-slate-900">
                                {formatCurrency(payment.amount, payment.currency)}
                              </p>
                            </div>
                            <StatusBadge value={payment.status} />
                          </div>
                          <div className="mt-4 grid gap-2 text-xs text-slate-600">
                            <DetailRow label="Provider status" value={payment.providerStatus ?? "—"} />
                            <DetailRow label="External payment" value={payment.externalPaymentId ?? "—"} />
                            <DetailRow label="Preference" value={payment.externalPreferenceId ?? "—"} />
                            <DetailRow label="Merchant order" value={payment.externalMerchantOrderId ?? "—"} />
                            <DetailRow label="Último cambio" value={formatDateTime(payment.lastStatusAt)} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </SectionShell>

                <SectionShell title="Webhook events" subtitle="Trazabilidad del procesamiento recibido desde Mercado Pago.">
                  <div className="space-y-3">
                    {diagnostic.webhookEvents.length === 0 ? (
                      <EmptyDiagnosticState label="No hay webhooks persistidos para esta orden." />
                    ) : (
                      diagnostic.webhookEvents.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-mono text-xs text-slate-500">{event.providerEventId}</p>
                              <p className="mt-2 text-sm font-medium text-slate-900">{event.providerTopic}</p>
                            </div>
                            <StatusBadge value={event.status} />
                          </div>
                          <div className="mt-4 grid gap-2 text-xs text-slate-600">
                            <DetailRow label="Recibido" value={formatDateTime(event.receivedAt)} />
                            <DetailRow label="Procesado" value={formatDateTime(event.processedAt)} />
                            <DetailRow label="Falla" value={event.failureReason ?? "—"} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </SectionShell>

                <SectionShell title="Revenue allocation" subtitle="Foto contable del split generado al aprobarse el pago.">
                  {!diagnostic.revenueAllocation ? (
                    <EmptyDiagnosticState label="Todavía no existe revenue allocation para esta orden." />
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      <MetricTile
                        label="Bruto"
                        value={formatCurrency(
                          diagnostic.revenueAllocation.grossAmount,
                          diagnostic.revenueAllocation.currency,
                        )}
                      />
                      <MetricTile
                        label="Plataforma"
                        value={formatCurrency(
                          diagnostic.revenueAllocation.platformAmount,
                          diagnostic.revenueAllocation.currency,
                        )}
                      />
                      <MetricTile
                        label="Instructor"
                        value={formatCurrency(
                          diagnostic.revenueAllocation.instructorAmount,
                          diagnostic.revenueAllocation.currency,
                        )}
                      />
                      <MetricTile
                        label="Comisión"
                        value={diagnostic.revenueAllocation.commissionRuleVersion}
                      />
                    </div>
                  )}
                </SectionShell>

                <SectionShell title="Enrollment otorgado" subtitle="Acceso académico generado por la capa comercial.">
                  {!diagnostic.enrollment ? (
                    <EmptyDiagnosticState label="La orden todavía no tiene enrollment vinculado." />
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      <MetricTile label="Enrollment ID" value={diagnostic.enrollment.id} mono />
                      <MetricTile label="Progreso" value={`${diagnostic.enrollment.progress}%`} />
                      <MetricTile
                        label="Inicio"
                        value={formatDateTime(diagnostic.enrollment.startedAt)}
                      />
                      <MetricTile
                        label="Completado"
                        value={diagnostic.enrollment.completed ? "Sí" : "No"}
                      />
                    </div>
                  )}
                </SectionShell>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-3 border-b border-slate-200/80 pb-2 last:border-b-0 last:pb-0">
    <span className="uppercase tracking-[0.16em] text-slate-400">{label}</span>
    <span className="max-w-[60%] text-right font-medium text-slate-800">{value}</span>
  </div>
);

const MetricTile = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
    <p className={`mt-2 text-sm font-medium text-slate-900 ${mono ? "break-all font-mono text-xs" : ""}`}>
      {value}
    </p>
  </div>
);

const EmptyDiagnosticState = ({ label }: { label: string }) => (
  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
    {label}
  </div>
);

export default AdminPayments;
