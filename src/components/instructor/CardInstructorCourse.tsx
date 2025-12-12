import React, { useState } from "react";
import { Star, Users, MoreHorizontal, Share2 } from "lucide-react";
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

  return (
    <>
      <div className="flex w-full items-center rounded-xl bg-white transition-all duration-200 p-2 border border-border">
        {/* Imagen */}
        <div className="w-40 h-32 flex-shrink-0">
          <img
            src={thumbnailUrl || "/Placeholders/no-image-course.png"}
            alt={title || "Curso sin título"}
            className="h-full w-full object-cover rounded-lg"
          />
        </div>

        {/* Contenido */}
        <div className="flex flex-col flex-1 p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              {/* Nombre del curso siempre visible */}
              <h3 className="text-lg font-semibold line-clamp-1">
                {title || "Curso sin título"}
              </h3>

              {/* Badge de incompleto si querés mantenerlo */}
              {!isPublished && (
                <Badge
                  variant="destructive"
                  appearance="light"
                  className="w-fit text-xs mt-1"
                >
                  Curso incompleto
                </Badge>
              )}
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 text-slate-500">
              <Share2
                className="h-5 w-5 cursor-pointer"
                onClick={() => setOpen(true)}
              />

              <Dropdown>
                <DropdownTrigger className="cursor-pointer">
                  <MoreHorizontal className="h-5 w-5 cursor-pointer" />
                </DropdownTrigger>

                <DropdownContent align="end" className="bg-background">
                  {isPublished && (
                    <DropdownItem onClick={() => navigate(`/curso/${id}`)}>
                      Ver curso
                    </DropdownItem>
                  )}

                  <DropdownItem
                    onClick={() => navigate(`/perfil/editar-curso/${id}`)}
                  >
                    Editar
                  </DropdownItem>

                  <DropdownItem className="text-red-700">Eliminar</DropdownItem>
                </DropdownContent>
              </Dropdown>
            </div>
          </div>

          {/* Info extra */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
            <Badge
              variant={specialty ? "primary" : "outline"}
              appearance="light"
            >
              {specialty || "Sin especialidad"}
            </Badge>

            <Badge variant={level ? "warning" : "outline"} appearance="light">
              {level || "Sin nivel"}
            </Badge>

            {duration ? (
              <Badge variant="outline" appearance="light">
                {Math.floor(duration / 60)}h {duration % 60}m
              </Badge>
            ) : (
              <Badge variant="outline" appearance="light">
                Duración no definida
              </Badge>
            )}
          </div>

          {/* Stats */}
          {isPublished && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{avgRating}</span>
                <span className="text-slate-400">({ratingCount})</span>
              </div>

              <div className="flex items-center gap-1 text-sm text-slate-600">
                <Users className="h-4 w-4" />
                <span>{totalStudents}</span>
              </div>
            </div>
          )}

          {/* Precio */}
          <div className="mt-2 text-right font-semibold text-primary">
            {currency} ${price || "0"}
          </div>

          {/* Botón si NO está publicado */}
          {!isPublished && (
            <Button
              onClick={() => navigate(`/perfil/editar-curso/${id}`)}
              className="max-w-max"
              variant="outline"
            >
              Seguir editando
            </Button>
          )}
        </div>
      </div>

      {/* Modal compartir */}
      <AppModal open={open} onOpenChange={() => setOpen(!open)} title={title}>
        <ShareCourse
          courseUrl={`www.vitalica.com/micurso/${id}`}
          key={id}
          titleCourse={title || "Curso sin título"}
        />
      </AppModal>
    </>
  );
};
