import { Outlet } from "react-router-dom";
import { useState } from "react";

const PublicLayout = () => {
  const user = null; // Simula el estado de autenticación del usuario; reemplaza con tu lógica real
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const publicNavItems: any[] = [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/services" },
    { label: "Acerca de", href: "/about" },
    { label: "Contacto", href: "/contact" },
  ];

  const userNavItems: any[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Perfil", href: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <span className="text-primary-foreground font-bold text-lg">
                    L
                  </span>
                </div>
                <span className="text-xl font-bold text-foreground">Logo</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {publicNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* User Menu / Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  {userNavItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground">
                      Hola,{" "}
                    </span>
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <a
                    href="/auth/login"
                    className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Iniciar sesión
                  </a>
                  <a
                    href="/auth/register"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Registrarse
                  </a>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-muted-foreground hover:text-foreground p-2 rounded-md"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
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
      <footer className="bg-card border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <span className="text-primary-foreground font-bold text-lg">
                    L
                  </span>
                </div>
                <span className="text-xl font-bold text-foreground">Logo</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                Descripción de tu empresa o aplicación. Aquí puedes agregar
                información relevante sobre tus servicios.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Enlaces</h3>
              <ul className="space-y-2">
                {publicNavItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>email@ejemplo.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Calle Principal</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Tu Empresa. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
