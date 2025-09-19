import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useMedia } from "@/hooks/useMedia";
import { Footer } from "./Footer";

const PublicLayout = () => {
  const user = null; // Simula el estado de autenticación del usuario; reemplaza con tu lógica real
  const isMobile = useMedia();

  const publicNavItems: any[] = [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/services" },
    { label: "Acerca de", href: "/about" },
    { label: "Contacto", href: "/contacto" },
  ];

  const userNavItems: any[] = [
    { label: "Panel administrativo", href: "/panel-administrativo" },
    { label: "Perfil", href: "/perfil" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Navbar />
          </div>

          {/* Mobile Navigation */}
          {isMobile && (
            <div className="md:hidden border-t border-border">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {publicNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    {item.label}
                  </a>
                ))}

                {user ? (
                  <div className="border-t border-border pt-4 mt-4">
                    {userNavItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                    <div className="px-3 py-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        Hola,
                      </p>
                      <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-border pt-4 mt-4 space-y-2">
                    <a
                      href="/auth/login"
                      className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      Iniciar sesión
                    </a>
                    <a
                      href="/auth/register"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 block px-3 py-2 rounded-md text-base font-medium transition-colors text-center"
                    >
                      Registrarse
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
