import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { generateCertificateHTML } from "@/templates/certificate.template";
import { CertificateDownloadButton } from "@/components/Buttons/CertificateDownloadButton";
import { getCertificateByEnrollmentId } from "@/api/courseProgressEndpoints";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";

interface CertificateData {
  studentName: string;
  courseName: string;
  instructorName: string;
  issuedBy: string | null;
  finalExamPassedAt: Date;
  enrollmentId: string;
}

const CertificatePage = () => {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const [data, setData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);

  const getCertificate = async () => {
    try {
      if (!enrollmentId) return;
      const res = await getCertificateByEnrollmentId(enrollmentId);
      setData(res.data);
      console.log("res", res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCertificate();
  }, [enrollmentId]);

  if (loading) return <GlobalLoading text="Buscando certificado..." />;
  if (!data)
    return (
      // TODO: Ponerle un poco mas de onda a esto
      <div className="flex items-center justify-center h-screen">
        Certificado no encontrado
      </div>
    );

  const html = generateCertificateHTML({
    ...data,
    enrollmentId: enrollmentId!,
    issuedAt: new Date(data.finalExamPassedAt).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=144x144&data=${window.location.origin}/certificado/${enrollmentId}`,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 gap-6">
      <div className="flex items-center justify-between w-[1122px]">
        <div>
          <h1 className="text-lg font-medium text-gray-800">Tu certificado</h1>
          <p className="text-sm text-gray-400">
            Podés descargarlo o imprimirlo
          </p>
        </div>
        <CertificateDownloadButton {...data} enrollmentId={enrollmentId!} />
      </div>

      <iframe
        srcDoc={html}
        style={{ width: 1122, height: 794, border: "none" }}
        title="Certificado de aprobación"
      />
    </div>
  );
};

export default CertificatePage;
