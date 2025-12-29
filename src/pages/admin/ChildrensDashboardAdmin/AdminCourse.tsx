import { getCourseById, updateFeedbackCourse } from "@/api";
import { GlobalLoading } from "@/components/GlobalLoading";
import { ICourse } from "@/types/course.types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormattedDate } from "@/hooks/useFormattedDate";
import { Badge } from "@/components/ui/badge";
import { QuizList } from "@/components/Quizzes/QuizList";
import { Info } from "@/components/CardsAnimated/Info";
import { formatDuration } from "@/utils/formatDuration";
import { formatPrice } from "@/utils/formatPrice";
import { t } from "@/utils/translations";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AppModal } from "@/components/AppModal";
import { FeedbackCourse } from "@/components/Admin/FeedbackCourse";
import { FeedbackFormValues } from "@/types/admin.types";
import { useToast } from "@/components/ui/toast";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

const AdminCourse = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState<ICourse | null>(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const res = await getCourseById(id);
        if (res.success && res.data) {
          setCourse(res.data as ICourse);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleSubmitFeedback = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await updateFeedbackCourse({
        courseId: course!.id,
        status: data.status,
        reviewerNotes: data.reviewerNotes,
        revewedBy: data.revewedBy,
      });

      if (response.success) {
        showToast("Feedback guardado correctamente", "success", "bottom-right");

        // 🔄 actualizar estado local del curso
        setCourse((prev) =>
          prev
            ? {
                ...prev,
                status: data.status,
                reviewerNotes: data.reviewerNotes,
                reviewedBy: data.revewedBy,
              }
            : prev
        );
      } else {
        showToast(
          response.message || "Error al guardar el feedback",
          "error",
          "bottom-right"
        );
      }
    } catch (error) {
      console.error(error);
      showToast(
        "Error inesperado al guardar el feedback",
        "error",
        "bottom-right"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <GlobalLoading text="Cargando curso..." />;
  if (!course) return <p>No se encontró el curso</p>;

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex gap-6">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-64 h-36 object-cover rounded border border-border"
        />

        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-semibold">{course.title}</h1>
          <p className="text-sm text-gray-600">{course.description}</p>

          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="info">{t("statusCourse", course.status)}</Badge>
            <Badge variant="outline">
              {course.level && t("courseLevel", course.level)}
            </Badge>
            <Badge>
              {course.specialty && t("courseSpecialty", course.specialty)}
            </Badge>
          </div>

          <div className="text-xs text-gray-500">
            Creado: {useFormattedDate(course.createdAt)} · Actualizado:{" "}
            {useFormattedDate(course.updatedAt)}
          </div>
        </div>
      </div>

      {course.muxPlaybackId && (
        <div className="text-xs bg-white p-3 border border-slate-400 rounded space-y-2">
          <p>
            <strong>Video promocional – Mux Playback ID:</strong>{" "}
            {course.muxPlaybackId}
          </p>

          <div className="flex gap-3">
            <a
              href={`https://stream.mux.com/${course.muxPlaybackId}.m3u8`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline font-medium"
            >
              ▶ Ver video
            </a>

            <a
              href={`https://image.mux.com/${course.muxPlaybackId}/thumbnail.jpg`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 underline"
            >
              🖼 Ver thumbnail
            </a>
          </div>
        </div>
      )}

      {/* INFO */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <Info
          label="Precio"
          value={`${formatPrice(course.price)} ${course.currency}`}
        />
        <Info
          label="Duración"
          value={`${formatDuration(course.duration)} min`}
        />
        <Info label="Alumnos" value={course.totalStudents} />
        <Info
          label="Rating"
          value={`${course.avgRating} (${course.ratingCount})`}
        />
      </div>

      {course.tags && course.tags.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">Tags</h2>
          <div className="flex gap-2 flex-wrap">
            {course.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </section>
      )}
      <Separator className="mb-8" />
      {course.requirementsAndMaterials && (
        <section>
          <h2 className="font-semibold mb-2">Requisitos y Materiales</h2>
          <div className="flex gap-2 flex-wrap">
            {course.requirementsAndMaterials}
          </div>
        </section>
      )}
      <Separator className="mb-8" />
      {/* MODULES */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Módulos</h2>

        {course.modules &&
          course.modules.map((module) => (
            <div
              key={module.id}
              className="border border-slate-400 rounded-lg p-4 space-y-4"
            >
              <h3 className="font-semibold">
                Módulo {module.order}: {module.title}
              </h3>

              {/* LESSONS */}
              <div className="space-y-3">
                <h4 className="font-medium">Lecciones</h4>

                {module.lessons &&
                  module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="border border-border rounded p-3 bg-gray-50 space-y-2"
                    >
                      <div className="flex justify-between text-sm font-medium">
                        <span>
                          {lesson.order}. {lesson.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          {lesson.type} {lesson.isFree && "(Gratis)"}
                        </span>
                      </div>

                      {/* CONTENT */}
                      {lesson.type === "content" && lesson.content && (
                        <div
                          className="prose prose-sm max-w-none bg-white p-3 border border-slate-400 rounded"
                          dangerouslySetInnerHTML={{ __html: lesson.content }}
                        />
                      )}

                      {/* VIDEO */}
                      {lesson.type === "videoFile" && (
                        <div className="text-xs bg-white p-3 border border-slate-400 rounded space-y-2">
                          <p>
                            <strong>Lección en video – Mux Playback ID:</strong>{" "}
                            {lesson.muxPlaybackId || "NO DEFINIDO"}
                          </p>

                          {lesson.muxPlaybackId && (
                            <div className="flex gap-3">
                              <a
                                href={`https://stream.mux.com/${lesson.muxPlaybackId}.m3u8`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline font-medium"
                              >
                                ▶ Ver video
                              </a>

                              <a
                                href={`https://image.mux.com/${lesson.muxPlaybackId}/thumbnail.jpg`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 underline"
                              >
                                🖼 Ver thumbnail
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {/* MATERIALS */}
                      {lesson.lessonMaterial &&
                        lesson.lessonMaterial.length > 0 && (
                          <div className="text-xs space-y-1">
                            <p className="font-medium">Material adicional:</p>
                            {lesson.lessonMaterial.map((m) => (
                              <div
                                key={m.id}
                                className="bg-white border rounded px-2 py-1"
                              >
                                {m.type} · {m.key}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
              </div>

              {/* MODULE QUIZZES */}
              {module.quizzes && module.quizzes.length > 0 && (
                <QuizList title="Quizzes del módulo" quizzes={module.quizzes} />
              )}
            </div>
          ))}
      </section>

      {/* FINAL QUIZZES */}
      {course.quizzes && course.quizzes.length > 0 && (
        <QuizList title="Examen final del curso" quizzes={course.quizzes} />
      )}

      {course.revewedBy && (
        <Alert variant="info">
          <h2 className="font-semibold mb-2">
            Última respuesta del administrador
          </h2>
          <div className="flex gap-2 flex-wrap">{course.revewedBy}</div>
          <div className="flex gap-2 flex-wrap">{course.reviewerNotes}</div>
        </Alert>
      )}
      <Button
        variant="secondary"
        className="flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        Responder al instructor
      </Button>
      <AppModal
        open={open}
        onOpenChange={setOpen}
        title="Evaluación del módulo"
      >
        <FeedbackCourse
          course={course}
          onSubmit={handleSubmitFeedback}
          isSubmitting={isSubmitting}
          adminEmail={user.email}
        />
      </AppModal>
    </div>
  );
};

export default AdminCourse;
