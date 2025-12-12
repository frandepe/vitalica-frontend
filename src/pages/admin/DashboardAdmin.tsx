import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Search,
  ArrowLeftFromLine,
  Users,
  School,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ScrollToTop } from "@/utils/scroll-top";
import { useStickyTop } from "@/hooks/useStickyTop";

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "panel-administrativo",
    name: "Panel administrativo",
    icon: BarChart3,
    href: "/admin/panel-administrativo",
  },
  {
    id: "usuarios",
    name: "Usuarios",
    icon: Users,
    href: "/admin/usuarios",
  },
  {
    id: "aplicaciones",
    name: "Aplicaciones",
    icon: School,
    href: "/admin/aplicaciones",
  },
];

export default function DashboardAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("panel-administrativo");
  const location = useLocation();

  useEffect(() => {
    const pathToIdMap: Record<string, string> = {
      "/admin/panel-administrativo": "panel-administrativo",
      "/admin/usuarios": "usuarios",
      "/admin/aplicaciones": "aplicaciones",
    };

    const id = pathToIdMap[location.pathname];
    if (id) setActiveItem(id);
  }, [location.pathname]);

  const navigate = useNavigate();

  // Auto-open sidebar on desktop
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

  const navbarHeight = 80; // px
  const top = useStickyTop(navbarHeight);
  const sidebarHeight = `calc(100vh - ${top}px)`;
  return (
    <div className="flex">
      <ScrollToTop />
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-8 left-0 z-50 p-3 rounded-r-lg bg-white shadow border border-slate-100 md:hidden hover:bg-slate-50 transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        ) : (
          <ChevronRight className="h-5 w-5 text-slate-600" />
        )}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 bg-white border-r border-slate-200 z-40 transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${isCollapsed ? "w-28" : "w-72"}
      `}
        style={{ top, height: sidebarHeight }}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 text-base">
                  Admin
                </span>
                <span className="text-xs text-slate-500">
                  Panel administrativo
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center mx-auto shadow-sm">
              <span className="text-white font-bold text-base">I</span>
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-slate-100 transition-all duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-slate-500" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.href)}
                    className={`
                      w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-left transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-blue-50 text-secondary"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                      ${isCollapsed ? "justify-center px-2" : ""}
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className="flex items-center justify-center min-w-[24px]">
                      <Icon
                        className={`
                          h-4.5 w-4.5 flex-shrink-0
                          ${
                            isActive
                              ? "text-secondary"
                              : "text-slate-500 group-hover:text-slate-700"
                          }
                        `}
                      />
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`text-sm ${
                            isActive ? "font-medium" : "font-normal"
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.badge && (
                          <span
                            className={`
                            px-1.5 py-0.5 text-xs font-medium rounded-full
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
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {item.name}
                        {item.badge && (
                          <span className="ml-1.5 px-1 py-0.5 bg-slate-700 rounded-full text-[10px]">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-slate-800 rotate-45" />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section with profile and logout */}
        <div className="mt-auto border-t border-slate-200">
          {/* Profile Section */}
          <div
            className={`border-b border-slate-200 bg-slate-50/30 ${
              isCollapsed ? "py-3 px-2" : "p-3"
            }`}
          >
            {!isCollapsed ? (
              <div className="flex items-center px-3 py-2 rounded-md bg-white hover:bg-slate-50 transition-colors duration-200">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-slate-700 font-medium text-sm">JD</span>
                </div>
                <div className="flex-1 min-w-0 ml-2.5">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    Señor Administrador
                  </p>
                </div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full ml-2"
                  title="Online"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-slate-700 font-medium text-sm">
                      JD
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="p-3">
            <button
              onClick={() => navigate("/")}
              className={`
                w-full flex items-center rounded-md text-left transition-all duration-200 group
                hover:bg-gray-50 hover:text-black-600 cursor-pointer
                ${
                  isCollapsed
                    ? "justify-center p-2.5"
                    : "space-x-2.5 px-3 py-2.5"
                }
              `}
              title={isCollapsed ? "Panel de usuario" : undefined}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <ArrowLeftFromLine className="h-4.5 w-4.5 flex-shrink-0" />
              </div>

              {!isCollapsed && (
                <span className="text-sm">Panel de usuario</span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  Ir al inicio
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-slate-800 rotate-45" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 px-4 ${
          !isOpen ? "ml-0" : isCollapsed ? "ml-28" : "ml-72"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
