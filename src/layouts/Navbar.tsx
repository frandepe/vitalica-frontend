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
import { Menu, MoveRight, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const navigationItems = [
    {
      title: "Product",
      description: "Managing a small business today is already tough.",
      items: [
        {
          title: "Reports",
          href: "/reports",
        },
        {
          title: "Statistics",
          href: "/statistics",
        },
        {
          title: "Dashboards",
          href: "/dashboards",
        },
        {
          title: "Recordings",
          href: "/recordings",
        },
      ],
    },
    {
      title: "Company",
      description: "Managing a small business today is already tough.",
      items: [
        {
          title: "About us",
          href: "/about",
        },
        {
          title: "Fundraising",
          href: "/fundraising",
        },
        {
          title: "Investors",
          href: "/investors",
        },
        {
          title: "Contact us",
          href: "/contact",
        },
      ],
    },
  ];

  const [isOpen, setOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setShowNavbar(false);
      } else {
        // Scrolling up
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const user = null;

  return (
    <header
      className={`w-full z-40 fixed top-0 left-0 bg-background ${
        showNavbar ? "translate-y-0 shadow-md" : "-translate-y-full"
      }`}
    >
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
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
                            <MoveRight className="w-4 h-4 text-muted-foreground" />
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
        <div className="flex lg:justify-center">
          <p className="font-semibold">TWBlocks</p>
        </div>
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
        <div className="flex w-12 shrink lg:hidden items-end justify-end">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {isOpen && (
            <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    <p className="text-lg">{item.title}</p>

                    {item.items &&
                      item.items.map((subItem) => (
                        <a
                          key={subItem.title}
                          href={subItem.href}
                          className="flex justify-between items-center"
                        >
                          <span className="text-muted-foreground">
                            {subItem.title}
                          </span>
                          <MoveRight className="w-4 h-4 stroke-1" />
                        </a>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
