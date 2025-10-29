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
import { CreditCard, Crown, LogOut, Settings, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMedia } from "@/hooks/useMedia";
import { useAuth } from "@/hooks/useAuth";
import RoleBadge from "./RoleBadge";

export default function ProfileMenu() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMedia();

  if (isMobile) {
    // 👉 Drawer en mobile
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <img
            src={user?.avatarUrl || "https://patrickprunty.com/icon.webp"}
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
              src={user?.avatarUrl || "https://patrickprunty.com/icon.webp"}
              alt="User avatar"
              className="h-12 w-12 rounded-full"
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
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
            <button className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-accent">
              <Settings className="h-4 w-4" />
              Settings
            </button>
            {user?.role === "INSTRUCTOR" && (
              <button className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-accent">
                <Settings
                  className="h-4 w-4"
                  onClick={() => navigate("/perfil/panel-administrativo")}
                />
                Panel de Instructor
              </button>
            )}
          </div>

          {/* Footer fijo */}
          <button className="flex items-center gap-2 w-full px-4 py-3 text-left text-red-500 hover:bg-accent border-t">
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
          src={user?.avatarUrl || "https://patrickprunty.com/icon.webp"}
          alt="User avatar"
          className="h-10 w-10 rounded-full border-2 border-border hover:border-primary transition-colors"
        />
      </DropdownTrigger>
      <DropdownContent align="end" className="w-64 bg-background">
        {/* Profile Section */}
        <div className="flex items-center gap-3 p-3">
          <img
            src={user?.avatarUrl || "https://patrickprunty.com/icon.webp"}
            alt="User avatar"
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">{user?.email}</p>
            <RoleBadge role={user?.role} createdAt={user?.createdAt} />
          </div>
        </div>
        <DropdownSeparator />

        {/* Menu Items */}
        <DropdownItem className="gap-2" onClick={() => navigate("/perfil")}>
          <UserCircle className="h-4 w-4" />
          Perfil
        </DropdownItem>
        <DropdownItem className="gap-2">
          <CreditCard className="h-4 w-4" />
          Billing
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
        <DropdownSeparator />
        <DropdownItem className="gap-2" destructive>
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}
