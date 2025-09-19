import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        {/* Panel izquierdo - Información de la marca */}
        <section className="hidden md:block flex-1 relative p-4">
          <div
            className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center"
            style={{
              backgroundImage: `url(${"/Banners/banner2.jpg"})`,
            }}
          ></div>
        </section>

        {/* Panel derecho - Formularios de autenticación */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
