import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/basic-dropdown";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  CreditCard,
  Crown,
  GraduationCap,
  LogOut,
  Settings,
  Sparkles,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMedia } from "@/hooks/useMedia";
import { useAuth } from "@/hooks/useAuth";
import RoleBadge from "./RoleBadge";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMedia();

  if (isMobile) {
    // Drawer en mobile
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <img
            src={user?.avatarUrl || "/Placeholders/no-image-profile.jpg"}
            alt="User avatar"
            className="h-10 w-10 rounded-full border-2 border-border hover:border-primary transition-colors cursor-pointer"
          />
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh] flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Mi cuenta</DrawerTitle>
          </DrawerHeader>

          <div className="flex items-center gap-3 p-4 border-b">
            <img
              src={user?.avatarUrl || "/Placeholders/no-image-profile.jpg"}
              alt="User avatar"
              className="h-12 w-12 rounded-full"
            />
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.email}
              </p>
              <div className="flex items-center gap-1">
                <Crown className="h-3 w-3 text-amber-500" />
                <p className="text-xs text-muted-foreground">Instructor</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {!user.onboarding?.hasCompletedOnboarding && (
              <button
                onClick={() => navigate("/primeros-pasos")}
                className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-accent"
              >
                <Sparkles className="h-4 w-4" fill="#72d0ba" />
                Cómo empezar
              </button>
            )}
            <button
              onClick={() => navigate("/perfil")}
              className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-accent"
            >
              <UserCircle className="h-4 w-4" />
              Perfil
            </button>

            <button className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-accent">
              <CreditCard className="h-4 w-4" />
              Billing
            </button>
            <button
              className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-accent"
              onClick={() => navigate("/mis-cursos")}
            >
              <GraduationCap className="h-4 w-4" />
              Mis cursos
            </button>
            <button className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-accent">
              <Settings className="h-4 w-4" />
              Settings
            </button>
            {user?.role === "INSTRUCTOR" && (
              <button
                className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-accent"
                onClick={() => navigate("/perfil/panel-administrativo")}
              >
                <Settings className="h-4 w-4" />
                Panel de Instructor
              </button>
            )}
            {user?.role === "ADMIN" && (
              <button className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-accent">
                <Settings
                  className="h-4 w-4"
                  onClick={() => navigate("/admin/panel-administrativo")}
                />
                Panel de administrador
              </button>
            )}
          </div>

          {/* Footer fijo */}
          <button
            className="flex items-center gap-2 w-full px-4 py-3 text-left text-red-500 hover:bg-accent border-t"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </DrawerContent>
      </Drawer>
    );
  }

  // 👉 Dropdown en desktop
  return (
    <Dropdown>
      <DropdownTrigger className="cursor-pointer">
        <img
          src={user?.avatarUrl || "/Placeholders/no-image-profile.jpg"}
          alt="User avatar"
          className="h-10 w-10 rounded-full object-cover border-2 border-border hover:border-primary transition-colors cursor-pointer"
        />
      </DropdownTrigger>
      <DropdownContent align="end" className="w-64 bg-background">
        {/* Profile Section */}
        <div className="flex items-center gap-3 p-3">
          <img
            src={user?.avatarUrl || "/Placeholders/no-image-profile.jpg"}
            alt="User avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.email}
            </p>
            <RoleBadge role={user?.role} createdAt={user?.createdAt} />
          </div>
        </div>
        <DropdownSeparator />

        {/* Menu Items */}
        {!user.onboarding?.hasCompletedOnboarding && (
          <DropdownItem
            className="gap-2 bg-muted hover:bg-primary-light"
            onClick={() => navigate("/primeros-pasos")}
          >
            <Sparkles className="h-4 w-4" fill="#72d0ba" />
            Cómo empezar
          </DropdownItem>
        )}
        <DropdownItem className="gap-2" onClick={() => navigate("/perfil")}>
          <UserCircle className="h-4 w-4" />
          Perfil
        </DropdownItem>
        <DropdownItem className="gap-2">
          <CreditCard className="h-4 w-4" />
          Billing
        </DropdownItem>
        <DropdownItem className="gap-2" onClick={() => navigate("/mis-cursos")}>
          <GraduationCap className="h-4 w-4" />
          Mis cursos
        </DropdownItem>
        {user?.role === "INSTRUCTOR" && (
          <DropdownItem
            className="gap-2"
            onClick={() => navigate("/perfil/panel-administrativo")}
          >
            <Settings className="h-4 w-4" />
            Panel de Instructor
          </DropdownItem>
        )}
        {user?.role === "ADMIN" && (
          <DropdownItem
            className="gap-2"
            onClick={() => navigate("/admin/panel-administrativo")}
          >
            <Settings className="h-4 w-4" />
            Panel de Administrador
          </DropdownItem>
        )}
        <DropdownSeparator />
        <DropdownItem className="gap-2" destructive onClick={logout}>
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}
