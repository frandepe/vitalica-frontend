import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Search,
  UserRoundPen,
  ChartNoAxesCombined,
  BookOpen,
  Star,
  BadgeCheck,
  ArrowLeftFromLine,
  MessageCircle,
  ClipboardCheck,
  LifeBuoy,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getInstructorDashboardCounts } from "@/api";
import { INSTRUCTOR_ROUTES } from "@/constants";
import { useStickyTop } from "@/hooks/useStickyTop";
import { useAuth } from "@/hooks/useAuth";
import { InstructorDashboardCounts } from "@/types/instructor.types";

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badgeCountKey?: keyof InstructorDashboardCounts;
}

const navigationItems: NavigationItem[] = [
  {
    id: "panel-administrativo",
    name: "Penel administrativo",
    icon: BarChart3,
    href: INSTRUCTOR_ROUTES.DASHBOARD,
  },
  {
    id: "perfil-de-instructor",
    name: "Perfil",
    icon: UserRoundPen,
    href: INSTRUCTOR_ROUTES.PROFILE,
  },
  {
    id: "especialidades",
    name: "Especialidades",
    icon: BadgeCheck,
    href: INSTRUCTOR_ROUTES.SPECIALTIES,
  },
  {
    id: "analiticas",
    name: "Analiticas",
    icon: ChartNoAxesCombined,
    href: INSTRUCTOR_ROUTES.ANALYTICS,
  },
  {
    id: "cursos",
    name: "Cursos gestionados",
    icon: BookOpen,
    href: INSTRUCTOR_ROUTES.COURSES,
    badgeCountKey: "managedCourses",
  },
  {
    id: "resenas",
    name: "Reseñas y Calificaciones",
    icon: Star,
    href: INSTRUCTOR_ROUTES.REVIEWS,
    badgeCountKey: "reviews",
  },
  {
    id: "practicas",
    name: "Prácticas",
    icon: ClipboardCheck,
    href: INSTRUCTOR_ROUTES.PRACTICES,
    badgeCountKey: "practices",
  },
  {
    id: "mensajes",
    name: "Mensajes",
    icon: MessageCircle,
    href: INSTRUCTOR_ROUTES.MESSAGES,
  },
  {
    id: "soporte",
    name: "Soporte",
    icon: LifeBuoy,
    href: INSTRUCTOR_ROUTES.SUPPORT,
  },
];

export default function DashboardInstructor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("panel-administrativo");
  const [dashboardCounts, setDashboardCounts] =
    useState<InstructorDashboardCounts | null>(null);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const pathToIdMap: Record<string, string> = {
      [INSTRUCTOR_ROUTES.DASHBOARD]: "panel-administrativo",
      [INSTRUCTOR_ROUTES.PROFILE]: "perfil-de-instructor",
      [INSTRUCTOR_ROUTES.SPECIALTIES]: "especialidades",
      [INSTRUCTOR_ROUTES.ANALYTICS]: "analiticas",
      [INSTRUCTOR_ROUTES.COURSES]: "cursos",
      [INSTRUCTOR_ROUTES.REVIEWS]: "resenas",
      [INSTRUCTOR_ROUTES.PRACTICES]: "practicas",
      [INSTRUCTOR_ROUTES.MESSAGES]: "mensajes",
      [INSTRUCTOR_ROUTES.SUPPORT]: "soporte",
    };

    const id =
      pathToIdMap[location.pathname] ??
      (location.pathname.startsWith(`${INSTRUCTOR_ROUTES.EDIT_COURSE}/`)
        ? "cursos"
        : undefined);
    if (id) setActiveItem(id);
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardCounts = async () => {
      const response = await getInstructorDashboardCounts();

      if (!response.success || !response.data || !isMounted) {
        return;
      }

      setDashboardCounts(response.data);
    };

    loadDashboardCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (href: string) => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
    navigate(href);
  };

  const resolvedNavigationItems = useMemo(
    () =>
      navigationItems.map((item) => ({
        ...item,
        badge:
          item.badgeCountKey && dashboardCounts
            ? String(dashboardCounts[item.badgeCountKey])
            : undefined,
      })),
    [dashboardCounts],
  );

  const navbarHeight = 100.8; // px
  const top = useStickyTop(navbarHeight);
  const sidebarHeight = `calc(100vh - ${top}px)`;

  return (
    <div className="flex">
      <button
        onClick={toggleSidebar}
        className="fixed top-8 left-0 z-50 rounded-r-lg border border-slate-100 bg-white p-3 shadow transition-all duration-200 hover:bg-slate-50 md:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        ) : (
          <ChevronRight className="h-5 w-5 text-slate-600" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`
        fixed left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${isCollapsed ? "w-28" : "w-72"}
      `}
        style={{ top, height: sidebarHeight }}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/60 p-5">
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
                <span className="text-base font-bold text-white">I</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-slate-800">
                  Instructor
                </span>
                <span className="text-xs text-slate-500">
                  Panel administrativo
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
              <span className="text-base font-bold text-white">I</span>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className="hidden rounded-md p-1.5 transition-all duration-200 hover:bg-slate-100 md:flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-slate-500" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm placeholder-slate-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-0.5">
            {resolvedNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.href)}
                    className={`
                      group w-full rounded-md px-3 py-2.5 text-left transition-all duration-200
                      ${isCollapsed ? "justify-center px-2" : ""}
                      ${
                        isActive
                          ? "bg-blue-50 text-primary"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                      flex items-center space-x-2.5
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className="flex min-w-[24px] items-center justify-center">
                      <Icon
                        className={`
                          h-4.5 w-4.5 flex-shrink-0
                          ${
                            isActive
                              ? "text-primary"
                              : "text-slate-500 group-hover:text-slate-700"
                          }
                        `}
                      />
                    </div>

                    {!isCollapsed && (
                      <div className="flex w-full items-center justify-between">
                        <span
                          className={`text-sm ${
                            isActive ? "font-medium" : "font-normal"
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.badge !== undefined && (
                          <span
                            className={`
                            rounded-full px-1.5 py-0.5 text-xs font-medium
                            ${
                              isActive
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                            }
                          `}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {isCollapsed && (
                      <div className="invisible absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        {item.name}
                        {item.badge !== undefined && (
                          <span className="ml-1.5 rounded-full bg-slate-700 px-1 py-0.5 text-[10px]">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-x-1 -translate-y-1/2 rotate-45 transform bg-slate-800" />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto border-t border-slate-200">
          <div
            className={`border-b border-slate-200 bg-slate-50/30 ${
              isCollapsed ? "px-2 py-3" : "p-3"
            }`}
          >
            {!isCollapsed ? (
              <div className="flex items-center rounded-md bg-white px-3 py-2 transition-colors duration-200 hover:bg-slate-50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                  <span className="text-sm font-medium text-slate-700">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0) || "AA"}
                  </span>
                </div>
                <div className="ml-2.5 min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>
                <div className="ml-2 h-2 w-2 rounded-full bg-green-500" />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200">
                    <span className="text-sm font-medium text-slate-700">
                      JD
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                </div>
              </div>
            )}
          </div>

          <div className="p-3">
            <button
              onClick={() => navigate("/perfil")}
              className={`
                group w-full rounded-md text-left transition-all duration-200
                cursor-pointer hover:bg-gray-50 hover:text-black-600
                ${
                  isCollapsed
                    ? "justify-center p-2.5"
                    : "space-x-2.5 px-3 py-2.5"
                }
                flex items-center
              `}
              title={isCollapsed ? "Panel de usuario" : undefined}
            >
              <div className="flex min-w-[24px] items-center justify-center">
                <ArrowLeftFromLine className="h-4.5 w-4.5 flex-shrink-0" />
              </div>

              {!isCollapsed && (
                <span className="text-sm">Panel de usuario</span>
              )}

              {isCollapsed && (
                <div className="invisible absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  Panel de usuario
                  <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-x-1 -translate-y-1/2 rotate-45 transform bg-slate-800" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`flex-1 px-4 transition-all duration-300 ${
          !isOpen ? "ml-0" : isCollapsed ? "ml-28" : "ml-72"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
