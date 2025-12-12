import { getInstructorApplications } from "@/api/adminEndpoints";
import { InstructorApplicationAccordion } from "@/components/Accordion/InstructorApplicationAccordion";
import { InstructorApplication } from "@/types/instructor.types";
import { useEffect, useState } from "react";

const InstructorsApplications = () => {
  const [applicationsData, setApplicationsData] = useState<
    InstructorApplication[] | null
  >(null);
  const getApplication = async () => {
    try {
      // TODO: Optimizar esta consulta, no necesito toda la data
      const response = await getInstructorApplications();
      if (response.success && response.data) {
        setApplicationsData(response.data as InstructorApplication[]);
      }
    } catch (error) {
      console.error("Error fetching instructor application:", error);
    }
  };
  useEffect(() => {
    getApplication();
  }, []);
  console.log("applicationsData", applicationsData);

  if (!applicationsData) {
    return <p>No hay aplicaciones registradas</p>;
  }

  return (
    <div className="min-h-screen">
      <InstructorApplicationAccordion projects={applicationsData} />
    </div>
  );
};

export default InstructorsApplications;
