import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCoursePurchaseOrder,
  createMercadoPagoCheckout,
  getCoursePurchaseSellability,
  type CoursePurchaseOrderResponse,
  type CoursePurchaseSellabilityResponse,
  type MercadoPagoCheckoutResponse,
} from "@/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Checkout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isInitialized } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sellability, setSellability] =
    useState<CoursePurchaseSellabilityResponse | null>(null);
  const [order, setOrder] = useState<CoursePurchaseOrderResponse | null>(null);
  const [checkout, setCheckout] = useState<MercadoPagoCheckoutResponse | null>(
    null,
  );

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
    return orderResponse.data;
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
      window.location.assign(checkoutResponse.data.checkoutUrl);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Error al iniciar el checkout de Mercado Pago.",
      );
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Preparando checkout</h1>
        <p className="mt-3 text-sm text-neutral-600">
          Validando si el curso puede venderse dentro del flujo comercial de
          split payment.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
          Checkout Mercado Pago
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-neutral-950">
          Compra del curso
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          El pago se procesa en Mercado Pago Checkout Pro. Podés pagar con
          tarjeta de crédito, tarjeta de débito o saldo disponible en Mercado
          Pago, según los medios habilitados por el proveedor.
        </p>
        <p className="mt-2 text-sm text-neutral-600">
          Vitalica no captura datos de tarjeta en esta pantalla. El acceso al
          curso todavía no se otorga acá: depende de la confirmación final por
          webhook en la siguiente fase.
        </p>

        {!user.id && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Necesitás iniciar sesión para comprar este curso.
          </div>
        )}

        {sellability && (
          <div className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                Estado comercial
              </p>
              <h2 className="mt-2 text-xl font-semibold text-neutral-950">
                {sellability.courseTitle ?? "Curso"}
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                {sellability.currency && sellability.amount
                  ? `${sellability.currency} ${sellability.amount}`
                  : "Precio no disponible"}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm">
              <p className="font-medium text-neutral-900">
                {sellability.isSellable
                  ? "Curso habilitado para iniciar compra"
                  : "Curso no habilitado para compra"}
              </p>
              <p className="mt-2 text-neutral-600">
                {sellability.reasonMessage}
              </p>
              {sellability.existingOrder && (
                <div className="mt-4 space-y-1 text-neutral-600">
                  <p>Orden existente: {sellability.existingOrder.orderId}</p>
                  <p>Estado orden: {sellability.existingOrder.status}</p>
                  <p>Estado acceso: {sellability.existingOrder.accessStatus}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {order && (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-700">
            <p className="font-medium text-neutral-950">Orden comercial lista</p>
            <p className="mt-2">Order ID: {order.orderId}</p>
            <p>Estado: {order.status}</p>
          </div>
        )}

        {checkout && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
            <p className="font-medium">
              Checkout creado. Redirigiendo a Mercado Pago.
            </p>
            <p className="mt-2">Payment ID interno: {checkout.paymentId}</p>
            <p>Preference ID: {checkout.preferenceId}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            onClick={handleStartCheckout}
            disabled={!sellability?.isSellable || submitting || !user.id}
          >
            {submitting
              ? "Redirigiendo a Mercado Pago..."
              : "Continuar a Mercado Pago"}
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
