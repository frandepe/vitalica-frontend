export interface IApplyInstructor {
  dniNumber: string;
  dniCountry: string;
  certificateType: string;
  issuedBy: string;
  enrollmentNumber: string;
  urlDni: string;
  urlCertificate: string[];
  issueDate?: string;
  expiryDate?: string;
}
