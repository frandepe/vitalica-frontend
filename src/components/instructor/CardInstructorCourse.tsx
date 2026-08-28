import React, { useState } from "react";
import { Star, Users, MoreHorizontal, Share2, Loader2 } from "lucide-react";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "../ui/basic-dropdown";
import { UniversalModal } from "../UniversalModal";
import ShareCourse from "../Share/ShareCourse";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { ICourse } from "@/types/course.types";
import { t } from "@/utils/translations";
import { formatPrice } from "@/utils/format-price";
import { formatDuration } from "@/utils/format-duration";
import { Separator } from "../ui/separator";
import { createOrGetCourseDraft } from "@/api";
import { INSTRUCTOR_ROUTES } from "@/constants";

export const CardInstructorCourse: React.FC<ICourse> = ({
  id,
  slug,
  title,
  thumbnailUrl,
  specialty,
  level,
  duration,
  price,
  currency = "ARS",
  avgTheoreticalRating,
  ratingCount,
  totalStudents,
  status,
  versions,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isPublished = status === "PUBLISHED";

  const canEdit = status === "DRAFT" || status === "NEEDS_CORRECTION";

  // 🔑 Versiones realmente editables (NUNCA archived)
  const editableStatuses = ["DRAFT", "NEEDS_CORRECTION"];

  const editableVersion = versions?.find((v) =>
    editableStatuses.includes(v.status),
  );

  // 🔒 Versiones bloqueadas (SUBMITTED, UNDER_REVIEW)
  const hasLockedVersion = versions?.some((v) =>
    ["SUBMITTED", "UNDER_REVIEW"].includes(v.status),
  );

  const handleEditCourse = async (courseId: string) => {
    if (loading) return;

    try {
      setLoading(true);

      // 1️⃣ Si ya hay una versión editable → ir a esa
      if (editableVersion) {
        navigate(`${INSTRUCTOR_ROUTES.EDIT_COURSE}/${editableVersion.id}`);
        return;
      }

      // 2️⃣ Si no hay → crear u obtener draft desde el publicado
      const res = await createOrGetCourseDraft(courseId);
      const draftId = res.data.draftId;

      navigate(`${INSTRUCTOR_ROUTES.EDIT_COURSE}/${draftId}`);
    } catch (error) {
      console.error("Error al crear/obtener draft", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex w-full gap-4 rounded-xl border border-border bg-white p-3">
        {/* Imagen */}
        <div className="w-40 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 aspect-[4/3]">
          <img
            src={thumbnailUrl || "/Placeholders/no-image-course.png"}
            alt={title || "Curso sin título"}
            className="h-full w-full object-cover object-center"
          />
        </div>
        {/* <div className="relative h-32 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
          <img
            src={thumbnailUrl || "/Placeholders/no-image-course.png"}
            className="absolute inset-0 h-full w-full object-cover blur-md scale-110"
            alt=""
          />
          <img
            src={thumbnailUrl || "/Placeholders/no-image-course.png"}
            alt={title || "Curso sin título"}
            className="relative h-full w-full object-contain"
          />
        </div> */}

        {/* Contenido */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <Badge variant="info" appearance="light">
                  {t("statusCourse", status)}
                </Badge>

                <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
                  {title || "Curso sin título"}
                </h3>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 text-slate-500">
                {isPublished && (
                  <Share2
                    className="h-5 w-5 cursor-pointer hover:text-slate-700"
                    onClick={() => setOpen(true)}
                  />
                )}

                <Dropdown>
                  <DropdownTrigger className="cursor-pointer">
                    <MoreHorizontal className="h-5 w-5 hover:text-slate-700" />
                  </DropdownTrigger>

                  <DropdownContent align="end" className="bg-background">
                    {isPublished && (
                      <DropdownItem onClick={() => navigate(`/vista-previa/${slug}`)}>
                        Vista previa como alumno
                      </DropdownItem>
                    )}

                    <DropdownItem
                      onClick={() => navigate(`/estado-curso/${id}`)}
                    >
                      Ver estado
                    </DropdownItem>

                    {isPublished && !hasLockedVersion && (
                      <DropdownItem
                        disabled={loading}
                        onClick={() => handleEditCourse(id)}
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Editar"
                        )}
                      </DropdownItem>
                    )}

                    {isPublished && (
                      <DropdownItem className="text-red-600">
                        Eliminar
                      </DropdownItem>
                    )}
                  </DropdownContent>
                </Dropdown>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              {specialty && (
                <Badge variant="primary">
                  {t("courseSpecialty", specialty)}
                </Badge>
              )}

              {level && (
                <Badge variant="warning">{t("courseLevel", level)}</Badge>
              )}

              <Badge variant="outline">
                {duration
                  ? `${formatDuration(duration)} hs`
                  : "Duración no definida"}
              </Badge>
            </div>

            {/* Stats */}
            {isPublished && (
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{avgTheoreticalRating}</span>
                  <span className="text-slate-400">({ratingCount})</span>
                </div>

                <Separator orientation="vertical" />

                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{totalStudents}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3">
            <div className="text-lg font-semibold text-primary">
              {Number(price) === 0
                ? "Clase gratuita"
                : `${currency} $${formatPrice(price)}`}
            </div>

            {!isPublished && (
              <Button
                variant="outline"
                onClick={() =>
                  navigate(
                    canEdit
                      ? `${INSTRUCTOR_ROUTES.EDIT_COURSE}/${id}`
                      : `/estado-curso/${id}`,
                  )
                }
              >
                {canEdit ? "Seguir editando" : "Ver estado"}
              </Button>
            )}

            {isPublished && (
              <Button
                variant="outline"
                onClick={() => navigate(`/vista-previa/${slug}`)}
              >
                Vista previa como alumno
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal compartir */}
      <UniversalModal
        open={open}
        onOpenChange={() => setOpen(!open)}
        title={title}
      >
        <ShareCourse
          courseUrl={`https://www.vitalica.com.ar/cursos/${id}`}
          titleCourse={title || "Curso sin título"}
        />
      </UniversalModal>
    </>
  );
};
