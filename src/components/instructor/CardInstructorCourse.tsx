import React, { useState } from "react";
import { Star, Users, MoreHorizontal, Share2 } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "../ui/basic-dropdown";
import { AppModal } from "../AppModal";
import ShareCourse from "../ShareCourse";
import { Badge } from "../ui/badge";

interface CardInstructorCourseProps {
  title: string;
  description: string;
  thumbnailUrl?: string;
  specialty: string;
  level: string;
  duration?: number; // minutos
  price: number;
  currency?: string;
  avgRating: number;
  ratingCount: number;
  totalStudents: number;
  className?: string;
}

export const CardInstructorCourse: React.FC<CardInstructorCourseProps> = ({
  title,
  description,
  thumbnailUrl,
  specialty,
  level,
  duration,
  price,
  currency = "ARS",
  avgRating,
  ratingCount,
  totalStudents,
  className,
}) => {
  // Modal único
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "flex w-full items-center rounded-xl bg-white transition-all duration-200",
          className
        )}
      >
        {/* Imagen del curso */}
        <div className="w-40 h-32 flex-shrink-0">
          <img
            src={thumbnailUrl || "/placeholder-course.jpg"}
            alt={title}
            className="h-full w-full object-cover rounded-lg"
          />
        </div>

        {/* Contenido */}
        <div className="flex flex-col flex-1 p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>

            {/* Acciones: compartir + más opciones */}
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
                  <DropdownItem className="gap-2" onClick={() => setOpen(true)}>
                    Ver curso
                  </DropdownItem>
                  <DropdownItem className="gap-2">Editar</DropdownItem>
                  <DropdownItem className="gap-2 text-red-700">
                    Eliminar
                  </DropdownItem>
                </DropdownContent>
              </Dropdown>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-sm text-slate-600 line-clamp-2 mt-1 max-w-60 xl:max-w-none">
            {description}
          </p>

          {/* Info extra */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
            <Badge variant="primary" appearance="light">
              {specialty}
            </Badge>
            <Badge variant="warning" appearance="light">
              {level}
            </Badge>

            {duration && (
              <Badge variant="outline" appearance="light">
                {Math.floor(duration / 60)}h {duration % 60}m
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{avgRating.toFixed(1)}</span>
              <span className="text-slate-400">({ratingCount})</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <Users className="h-4 w-4" />
              <span>{totalStudents}</span>
            </div>
          </div>

          {/* Precio abajo separado */}
          <div className="mt-2 text-right font-semibold text-primary">
            {currency} ${price.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Modal único para esta card */}
      <AppModal open={open} onOpenChange={() => setOpen(!open)} title={title}>
        <ShareCourse
          courseUrl="www.vitalica.com/micurso/asd123"
          key={title}
          titleCourse={title}
        />
      </AppModal>
    </>
  );
};
