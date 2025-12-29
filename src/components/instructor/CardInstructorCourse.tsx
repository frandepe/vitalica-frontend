import React, { useState } from "react";
import { Star, Users, MoreHorizontal, Share2, Info } from "lucide-react";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "../ui/basic-dropdown";
import { AppModal } from "../AppModal";
import ShareCourse from "../ShareCourse";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { ICourse } from "@/types/course.types";
import { t } from "@/utils/translations";
import { formatPrice } from "@/utils/formatPrice";
import { formatDuration } from "@/utils/formatDuration";
import { Separator } from "../ui/separator";

export const CardInstructorCourse: React.FC<ICourse> = ({
  id,
  title,
  thumbnailUrl,
  specialty,
  level,
  duration,
  price,
  currency = "ARS",
  avgRating,
  ratingCount,
  totalStudents,
  status,
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isPublished = status === "PUBLISHED";
  const canEdit = status === "DRAFT" || status === "NEEDS_CORRECTION";

  // const handleEditCourse = async (id: string) => {
  //   const res = await createDraftB(id)
  //    navigate(`/perfil/editar-curso/${res.data.draftId}`)
  // }

  return (
    <>
      <div className="relative flex w-full gap-4 rounded-xl border border-border bg-white p-3">
        {/* Imagen */}
        <div className="h-32 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
          <img
            src={thumbnailUrl || "/Placeholders/no-image-course.png"}
            alt={title || "Curso sin título"}
            className="h-full w-full object-cover"
          />
        </div>

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
                      <DropdownItem onClick={() => navigate(`/curso/${id}`)}>
                        Ver curso
                      </DropdownItem>
                    )}

                    {isPublished && (
                      <DropdownItem
                      // onClick={() => handleEditCourse(id)}
                      >
                        Editar
                      </DropdownItem>
                    )}
                    <DropdownItem
                      onClick={() => navigate(`/estado-curso/${id}`)}
                    >
                      Ver estado
                    </DropdownItem>

                    {isPublished && <DropdownItem>Editar</DropdownItem>}
                    {isPublished && (
                      <DropdownItem>
                        Solicitar Rollback <Info size={15} />
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
                  <span>{avgRating}</span>
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
              {currency} ${formatPrice(price) || "0"}
            </div>

            {!isPublished && (
              <Button
                variant="outline"
                onClick={() =>
                  navigate(
                    canEdit
                      ? `/perfil/editar-curso/${id}`
                      : `/estado-curso/${id}`
                  )
                }
              >
                {canEdit ? "Seguir editando" : "Ver estado"}
              </Button>
            )}
            {isPublished && (
              <Button
                variant="outline"
                onClick={() => navigate(`/curso/${id}`)}
              >
                Ver curso
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal compartir */}
      <AppModal open={open} onOpenChange={() => setOpen(!open)} title={title}>
        <ShareCourse
          courseUrl={`https://www.vitalica.com/micurso/${id}`}
          titleCourse={title || "Curso sin título"}
        />
      </AppModal>
    </>
  );
};
