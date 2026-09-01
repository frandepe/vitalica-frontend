import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  cancelPracticeRequest,
  createPracticeRequest,
  getPracticeInstructors,
  getPracticeRequestById,
} from "@/api";
import { StudentPracticeOverviewCard } from "@/components/Practice/StudentPracticeOverviewCard";
import { StudentPracticeRequestModal } from "@/components/Practice/StudentPracticeRequestModal";
import type { PracticeRequestFormValues } from "@/components/Practice/StudentPracticeRequestModal";
import { StudentPracticeRequestState } from "@/components/Practice/StudentPracticeRequestState";
import { useToast } from "@/components/ui/toast";
import type {
  PracticeInstructor,
  PracticeProgressInfo,
  PracticeRequestStudentView,
} from "@/types/practice.types";
import { useNavigate } from "react-router-dom";
import { getStatusCopy } from "./student-practice-panel.helpers";

interface StudentPracticePanelProps {
  practice?: PracticeProgressInfo;
  reloadPractice: (options?: { silent?: boolean }) => Promise<void>;
  onGoToReviews?: () => void;
}

export function StudentPracticePanel({
  practice,
  reloadPractice,
  onGoToReviews,
}: StudentPracticePanelProps) {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [request, setRequest] = useState<PracticeRequestStudentView | null>(
    null,
  );
  const [requestLoading, setRequestLoading] = useState(
    Boolean(practice?.latestPracticeRequestId),
  );
  const [instructors, setInstructors] = useState<PracticeInstructor[]>([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PracticeRequestFormValues>({
    defaultValues: {
      studentWhatsapp: "",
      studentEmail: "",
      studentMessage: "",
    },
  });

  useEffect(() => {
    if (!practice?.latestPracticeRequestId) {
      setRequest(null);
      setRequestLoading(false);
      return;
    }

    const latestPracticeRequestId = practice.latestPracticeRequestId;
    let cancelled = false;
    setRequestLoading(true);

    const load = async () => {
      const response = await getPracticeRequestById(latestPracticeRequestId);

      if (cancelled) return;

      if (response.success && response.data) {
        setRequest(response.data as PracticeRequestStudentView);
      }

      setRequestLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [practice?.latestPracticeRequestId]);

  useEffect(() => {
    if (!requestModalOpen || instructors.length > 0) return;

    let cancelled = false;
    setInstructorsLoading(true);

    const load = async () => {
      const response = await getPracticeInstructors();

      if (!cancelled && response.success && Array.isArray(response.data)) {
        setInstructors(response.data as PracticeInstructor[]);
      }

      if (!cancelled) {
        setInstructorsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [instructors.length, requestModalOpen]);

  const selectedInstructor = useMemo(
    () => instructors.find((item) => item.id === selectedInstructorId) ?? null,
    [instructors, selectedInstructorId],
  );

  if (!practice?.requiresPractice) return null;

  const status = getStatusCopy(practice);

  const handleOpenRequestModal = () => {
    setRequestModalOpen(true);
  };

  const handleViewCertificate = () => {
    navigate(`/certificado-practico/${practice.enrollmentId}`);
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedInstructor) {
      showToast("Selecciona un instructor", "error", "top-right");
      return;
    }

    setSubmitting(true);
    const response = await createPracticeRequest({
      enrollmentId: practice.enrollmentId,
      instructorId: selectedInstructor.id,
      contactMethod: selectedInstructor.contactMethod,
      studentWhatsapp: values.studentWhatsapp.trim() || undefined,
      studentEmail: values.studentEmail.trim() || undefined,
      studentMessage: values.studentMessage.trim() || undefined,
    });

    if (!response.success || !response.data) {
      showToast(
        response.message ?? "No se pudo crear la solicitud de practica",
        "error",
        "top-right",
      );
      setSubmitting(false);
      return;
    }

    setRequest(response.data as PracticeRequestStudentView);
    reset();
    setSelectedInstructorId("");
    setRequestModalOpen(false);
    await reloadPractice({ silent: true });
    showToast("Solicitud de practica creada", "success", "top-right");
    setSubmitting(false);
  });

  const onCancel = async () => {
    if (!request) return;

    setCancelling(true);
    const response = await cancelPracticeRequest(request.id);

    if (!response.success || !response.data) {
      showToast(
        response.message ?? "No se pudo cancelar la solicitud",
        "error",
        "top-right",
      );
      setCancelling(false);
      return;
    }

    setRequest(response.data as PracticeRequestStudentView);
    await reloadPractice({ silent: true });
    showToast("Solicitud cancelada", "success", "top-right");
    setCancelling(false);
  };

  return (
    <div className="space-y-5">
      <StudentPracticeOverviewCard
        practice={practice}
        status={status}
        onOpenRequestModal={handleOpenRequestModal}
        onViewCertificate={handleViewCertificate}
      />

      <StudentPracticeRequestState
        practiceUnlockedAt={practice.practiceUnlockedAt}
        requestLoading={requestLoading}
        request={request}
        cancelling={cancelling}
        onOpenRequestModal={handleOpenRequestModal}
        onCancel={onCancel}
        onGoToReviews={onGoToReviews}
      />

      <StudentPracticeRequestModal
        open={requestModalOpen}
        onOpenChange={setRequestModalOpen}
        instructorsLoading={instructorsLoading}
        instructors={instructors}
        selectedInstructorId={selectedInstructorId}
        selectedInstructor={selectedInstructor}
        control={control}
        errors={errors}
        submitting={submitting}
        onSelectInstructor={setSelectedInstructorId}
        onSubmit={onSubmit}
      />
    </div>
  );
}
