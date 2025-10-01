"use client";

import { SearchNav } from "@/components/Search/SearchNav";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import DropdownMenuNotifications from "@/components/user/DropdownMenuNotifications";
import DropdownMenuProfile from "@/components/user/DropdownMenuProfile";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { Menu } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export function Navbar() {
  const navigationItems = [
    {
      title: "Product",
      description: "Managing a small business today is already tough.",
      items: [
        { title: "Reports", href: "/reports" },
        { title: "Statistics", href: "/statistics" },
        { title: "Dashboards", href: "/dashboards" },
        { title: "Recordings", href: "/recordings" },
      ],
    },
    {
      title: "Company",
      description: "Managing a small business today is already tough.",
      items: [
        { title: "About us", href: "/about" },
        { title: "Fundraising", href: "/fundraising" },
        { title: "Investors", href: "/investors" },
        { title: "Contact us", href: "/contact" },
      ],
    },
  ];

  const showNavbar = useHideOnScroll(50);
  const user = null;

  return (
    <header
      className={`w-full z-40 fixed top-0 left-0 bg-background ${
        showNavbar ? "translate-y-0 shadow-md" : "-translate-y-full"
      }`}
    >
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
        {/* NAV DESKTOP */}
        <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
          <NavigationMenu className="flex justify-start items-start">
            <NavigationMenuList className="flex justify-start gap-4 flex-row">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className="font-medium text-sm">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="!w-[450px] p-4 bg-background">
                    <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                      <div className="flex flex-col h-full justify-between">
                        <div className="flex flex-col">
                          <p className="text-base">{item.title}</p>
                          <p className="text-muted-foreground text-sm">
                            {item.description}
                          </p>
                        </div>
                        <Button size="sm" className="mt-10">
                          Book a call today
                        </Button>
                      </div>
                      <div className="flex flex-col text-sm h-full justify-end">
                        {item.items?.map((subItem) => (
                          <NavigationMenuLink
                            href={subItem.href}
                            key={subItem.title}
                            className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
                          >
                            <span>{subItem.title}</span>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <SearchNav />
        </div>

        {/* LOGO */}
        <div className="flex lg:justify-center">
          <p className="font-semibold">TWBlocks</p>
        </div>

        {/* USER AREA */}
        {user ? (
          <div className="flex justify-end w-full gap-4">
            <Button variant="ghost" className="hidden md:inline">
              Ver demo
            </Button>
            <div className="border-r hidden md:inline"></div>
            <Button variant="outline">Iniciar sesión</Button>
            <Button>Regístrate</Button>
          </div>
        ) : (
          <div className="flex justify-end w-full gap-4">
            <DropdownMenuNotifications />
            <DropdownMenuProfile />
          </div>
        )}

        {/* MOBILE MENU → Drawer */}
        <div className="flex w-12 shrink lg:hidden items-end justify-end">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost">
                <Menu className="w-5 h-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-6">
              <div className="flex flex-col gap-8">
                {navigationItems.map((item) => (
                  <div key={item.title}>
                    <p className="text-lg font-medium mb-2">{item.title}</p>
                    <div className="flex flex-col gap-2">
                      {item.items?.map((subItem) => (
                        <a
                          key={subItem.title}
                          href={subItem.href}
                          className="flex justify-between items-center py-2 px-2 rounded hover:bg-muted"
                        >
                          <span className="text-muted-foreground">
                            {subItem.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
                <SearchNav />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
