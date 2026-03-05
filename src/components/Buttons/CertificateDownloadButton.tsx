import { Button } from "@/components/ui/button";
import { generateCertificateHTML } from "@/templates/certificate.template";
import { FileDown } from "lucide-react";

interface Props {
  studentName: string;
  courseName: string;
  instructorName: string;
  issuedBy: string | null;
  finalExamPassedAt: Date;
  enrollmentId: string;
}

export const CertificateDownloadButton = ({
  studentName,
  courseName,
  instructorName,
  issuedBy,
  finalExamPassedAt,
  enrollmentId,
}: Props) => {
  const handleDownload = () => {
    const newWindow = window.open("", "", "width=1200,height=850");
    if (!newWindow) return;

    newWindow.document.write(
      generateCertificateHTML({
        studentName,
        courseName,
        instructorName,
        issuedBy,
        enrollmentId,
        issuedAt: new Date(finalExamPassedAt).toLocaleDateString("es-AR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=144x144&data=${window.location.origin}/certificado/${enrollmentId}`,
      }),
    );

    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <FileDown className="mr-2 h-4 w-4" />
      <span>Descargar certificado</span>
    </Button>
  );
};
