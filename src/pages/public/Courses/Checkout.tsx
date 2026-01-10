// /cursos/:slug/pago          → Checkout

import { useParams } from "react-router-dom";

// https://www.coursera.org/payments/checkout?cartId=605944546
// Stripe
// MercadoPago

// ver payments.txt en doc

const Checkout = () => {
  const { courseId } = useParams();
  return <div>Checkout {courseId}</div>;
};

export default Checkout;
