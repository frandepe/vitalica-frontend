interface CertificateTemplateData {
  studentName: string;
  courseName: string;
  instructorName: string;
  issuedBy: string | null;
  issuedAt: string;
  enrollmentId: string;
  qrUrl: string;
}

export const generateCertificateHTML = ({
  studentName,
  courseName,
  instructorName,
  issuedBy,
  issuedAt,
  enrollmentId,
  qrUrl,
}: CertificateTemplateData): string => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Certificado - ${courseName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      width: 1122px;
      height: 794px;
      font-family: 'Jost', sans-serif;
      background: #fff;
      display: flex;
      align-items: stretch;
      overflow: hidden;
    }

    .sidebar {
      width: 10px;
      background: linear-gradient(180deg, #0f2d3d 0%, #1a5c6e 100%);
      flex-shrink: 0;
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 48px 68px;
      border: 1px solid #dde4e8;
      border-left: none;
      position: relative;
      background: #fff;
    }

    .content::before {
      content: 'VITALICA';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-family: 'Cormorant Garamond', serif;
      font-size: 120px;
      font-weight: 700;
      color: rgba(15, 45, 61, 0.03);
      letter-spacing: 16px;
      pointer-events: none;
      white-space: nowrap;
    }

    .corner {
      position: absolute;
      width: 40px;
      height: 40px;
      border-color: #0f2d3d;
      border-style: solid;
      opacity: 0.2;
    }
    .corner-tl { top: 18px; left: 18px; border-width: 1.5px 0 0 1.5px; }
    .corner-tr { top: 18px; right: 18px; border-width: 1.5px 1.5px 0 0; }
    .corner-bl { bottom: 18px; left: 18px; border-width: 0 0 1.5px 1.5px; }
    .corner-br { bottom: 18px; right: 18px; border-width: 0 1.5px 1.5px 0; }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
    }

    .logo-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 26px;
      font-weight: 700;
      color: #0f2d3d;
      letter-spacing: 4px;
      text-transform: uppercase;
    }

    .logo-tagline {
      font-size: 9.5px;
      color: #7a9aaa;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-top: 4px;
      font-weight: 300;
    }

    .certificate-label { text-align: right; }

    .certificate-label p {
      font-size: 9px;
      color: #aaa;
      letter-spacing: 2.5px;
      text-transform: uppercase;
    }

    .certificate-label span {
      font-size: 10px;
      color: #ccc;
      font-weight: 300;
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, #0f2d3d 0%, transparent 100%);
      margin-bottom: 30px;
      opacity: 0.3;
    }

    .body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .certifies-text {
      font-size: 10px;
      color: #aaa;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .student-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 52px;
      font-weight: 600;
      color: #0f2d3d;
      margin-bottom: 16px;
      line-height: 1.05;
    }

    .completion-text {
      font-size: 12px;
      color: #666;
      font-weight: 300;
      margin-bottom: 6px;
    }

    .course-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 24px;
      font-weight: 500;
      color: #1a5c6e;
      margin-bottom: 22px;
      font-style: italic;
    }

    .meta-item {
      font-size: 11.5px;
      color: #777;
      font-weight: 300;
      margin-bottom: 3px;
    }

    .meta-item strong { color: #333; font-weight: 500; }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 24px;
    }

    .signature-line {
      width: 150px;
      height: 1px;
      background: #0f2d3d;
      margin-bottom: 7px;
      opacity: 0.5;
    }

    .signature-name { font-size: 12px; color: #0f2d3d; font-weight: 500; }

    .signature-role {
      font-size: 9px;
      color: #aaa;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .date-block { text-align: center; }

    .date-label {
      font-size: 9px;
      color: #aaa;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }

    .date-value {
      font-family: 'Cormorant Garamond', serif;
      font-size: 15px;
      color: #0f2d3d;
      font-weight: 500;
    }

    .qr-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }

    .qr-block img { width: 72px; height: 72px; opacity: 0.85; }

    .qr-label {
      font-size: 8px;
      color: #ccc;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="sidebar"></div>
  <div class="content">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="header">
      <div>
        <div class="logo-name">Vitalica</div>
        <div class="logo-tagline">Formación en primeros auxilios</div>
      </div>
      <div class="certificate-label">
        <p>Certificado de aprobación</p>
        <span>N° ${enrollmentId}</span>
      </div>
    </div>

    <div class="divider"></div>

    <div class="body">
      <p class="certifies-text">Este certificado acredita que</p>
      <h1 class="student-name">${studentName}</h1>
      <p class="completion-text">ha completado y aprobado satisfactoriamente el curso online</p>
      <h2 class="course-name">${courseName}</h2>
      <p class="meta-item">Dictado por <strong>${instructorName}</strong></p>
      ${issuedBy ? `<p class="meta-item">Instructor certificado por <strong>${issuedBy}</strong></p>` : ""}
    </div>

    <div class="footer">
      <div>
        <div class="signature-line"></div>
        <div class="signature-name">${instructorName}</div>
        <div class="signature-role">Instructor</div>
      </div>
      <div class="date-block">
        <div class="date-label">Fecha de emisión</div>
        <div class="date-value">${issuedAt}</div>
      </div>
      <div class="qr-block">
        <img src="${qrUrl}" alt="Verificar certificado" />
        <span class="qr-label">Verificar</span>
      </div>
    </div>
  </div>
</body>
</html>
`;
