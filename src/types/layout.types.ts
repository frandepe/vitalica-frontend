import type { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}
