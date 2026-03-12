import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPracticeCertificate } from "@/api";
import { PracticeCertificateDownloadButton } from "@/components/Buttons/PracticeCertificateDownloadButton";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";
import { PracticeCertificate } from "@/types/practice.types";
import { generateCertificateHTML } from "@/templates/certificate.template";

const PracticeCertificatePage = () => {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const [data, setData] = useState<PracticeCertificate | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCertificate = async () => {
    try {
      if (!enrollmentId) return;
      const response = await getPracticeCertificate(enrollmentId);

      if (response.success && response.data) {
        setData(response.data as PracticeCertificate);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificate();
  }, [enrollmentId]);

  if (loading) return <GlobalLoading text="Buscando certificado practico..." />;

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        Certificado practico no encontrado
      </div>
    );
  }

  const html = generateCertificateHTML({
    ...data,
    courseName: data.courseName || "Practica presencial",
    certificateLabel: "Certificado practico",
    completionText:
      "ha completado satisfactoriamente la practica presencial del curso",
    dateLabel: "Fecha de practica",
    issuedAt: new Date(data.practiceCompletedAt).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=144x144&data=${window.location.origin}/certificado-practico/${enrollmentId}`,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 gap-6">
      <div className="flex items-center justify-between w-[1122px]">
        <div>
          <h1 className="text-lg font-medium text-gray-800">
            Tu certificado practico
          </h1>
          <p className="text-sm text-gray-400">
            Puedes descargarlo o imprimirlo
          </p>
        </div>
        <PracticeCertificateDownloadButton {...data} enrollmentId={enrollmentId!} />
      </div>

      <iframe
        srcDoc={html}
        style={{ width: 1122, height: 794, border: "none" }}
        title="Certificado practico"
      />
    </div>
  );
};

export default PracticeCertificatePage;
