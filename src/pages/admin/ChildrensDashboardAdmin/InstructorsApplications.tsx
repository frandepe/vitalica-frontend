import { getInstructorApplications } from "@/api/adminEndpoints";
import { InstructorApplicationAccordion } from "@/components/Accordion/InstructorApplicationAccordion";
import { InstructorApplication } from "@/types/instructor.types";
import { useEffect, useState } from "react";

const InstructorsApplications = () => {
  const [applicationsData, setApplicationsData] = useState<
    InstructorApplication[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getApplication = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getInstructorApplications();

      if (!response.success) {
        setApplicationsData([]);
        setErrorMessage(
          response.message || "No se pudieron cargar las aplicaciones",
        );
        return;
      }

      setApplicationsData((response.data as InstructorApplication[]) || []);
    } catch (error) {
      console.error("Error fetching instructor application:", error);
      setApplicationsData([]);
      setErrorMessage("No se pudieron cargar las aplicaciones");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void getApplication();
  }, []);

  if (isLoading) {
    return <p>Cargando aplicaciones...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (applicationsData.length === 0) {
    return <p>No hay aplicaciones registradas</p>;
  }

  return (
    <div className="min-h-screen">
      <InstructorApplicationAccordion projects={applicationsData} />
    </div>
  );
};

export default InstructorsApplications;
