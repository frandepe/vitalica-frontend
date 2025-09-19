import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/basic-dropdown";
import { CreditCard, Crown, LogOut, Settings, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DropdownMenuProfile() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center">
      <Dropdown>
        <DropdownTrigger className="cursor-pointer">
          <img
            src="https://patrickprunty.com/icon.webp"
            alt="User avatar"
            className="h-10 w-10 rounded-full border-2 border-border hover:border-primary transition-colors"
          />
        </DropdownTrigger>
        <DropdownContent align="end" className="w-64 bg-background">
          {/* Profile Section */}
          <div className="flex items-center gap-3 p-3">
            <img
              src="https://patrickprunty.com/icon.webp"
              alt="User avatar"
              className="h-10 w-10 rounded-full"
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                patrick@example.com
              </p>
              <div className="flex items-center gap-1">
                <Crown className="h-3 w-3 text-amber-500" />
                <p className="text-xs text-muted-foreground">Instructor</p>
              </div>
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
          <DropdownItem className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem className="gap-2" destructive>
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
