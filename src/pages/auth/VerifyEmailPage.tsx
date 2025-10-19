import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { confirmVerification } from "@/api";
import { InvalidToken } from "@/components/auth/InvalidToken";
import { ExpiredToken } from "@/components/auth/ExpiredToken";
import { Confirm } from "@/components/auth/Confirm";

const VerifyEmailPage = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (success || error) return;
    if (!token) {
      setError("No hay token de verificación");
      return;
    }

    const res = await confirmVerification(token);
    console.log("reess", res);
    setSuccess(res?.message);
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, []);

  if (success === "Token inválido") return <InvalidToken />;
  if (success === "El token ha expirado") return <ExpiredToken />;
  if (success === "Email verificado") return <Confirm />;

  return null;
};

export default VerifyEmailPage;
