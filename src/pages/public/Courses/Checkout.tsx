// /cursos/:slug/pago          → Checkout

import { upsertCourseProgress } from "@/api/courseProgressEndpoints";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

// https://www.coursera.org/payments/checkout?cartId=605944546
// Stripe
// MercadoPago

// ver payments.txt en doc

const Checkout = () => {
  const { courseId } = useParams();
  const handlePay = async () => {
    const res = await upsertCourseProgress(courseId!, 0);
    console.log("res", res);

    if (res.success) {
      // redirigir a la vista del curso
      alert("Compra exitosa, redirigiendo al curso...");
    } else {
      // mostrar error
      alert("Error en la compra: " + res.message);
    }
  };
  return (
    <div>
      <Button onClick={handlePay}>Comprar (crear progreso)</Button>
    </div>
  );
};

export default Checkout;
