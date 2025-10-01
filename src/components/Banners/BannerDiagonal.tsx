export default function BannerDiagonal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="py-12 sm:py-16 lg:py-24 relative overflow-hidden">
      {/* Decorative elements - hidden on mobile */}
      <div className="hidden lg:block absolute top-20 right-20 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full"></div>
      <div className="hidden lg:block absolute top-32 right-32 w-2 h-2 sm:w-3 sm:h-3 bg-secondary rounded-sm rotate-45"></div>
      <div className="hidden lg:block absolute top-40 right-16 w-1 h-6 sm:w-2 sm:h-8 bg-primary/80"></div>
      <div className="hidden lg:block absolute top-48 right-24 w-4 h-1 sm:w-6 sm:h-2 bg-green-500"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Inputs de Precio y Duración */}
          <div className="text-center lg:text-left">
            {children}
            <p className="text-sm text-slate-500">
              Ponele precio y tiempo a tu creación
            </p>
          </div>

          {/* Card visual decorativa */}
          <div className="relative mt-8 lg:mt-0 hidden lg:block">
            <div className="relative bg-gray-900 rounded-xl sm:rounded-2xl p-6 shadow-2xl transform rotate-6 sm:rotate-12 hover:rotate-0 transition-transform duration-300 max-w-sm mx-auto lg:max-w-none">
              {/* Header */}
              <div className="text-white mb-3 sm:mb-4">
                <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                  Nuevo curso
                </div>
                <div className="text-xs text-gray-500">Emergencias médicas</div>
              </div>

              {/* Pixelated pattern */}
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                {Array.from({ length: 48 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 sm:w-3 sm:h-3 ${
                      Math.random() > 0.7
                        ? Math.random() > 0.5
                          ? "bg-primary"
                          : Math.random() > 0.5
                          ? "bg-secondary"
                          : "bg-secondary/70"
                        : "bg-gray-800"
                    }`}
                  />
                ))}
              </div>

              {/* Info placeholder */}
              <div className="flex justify-between items-center text-white text-xs sm:text-sm">
                <div>
                  <div className="mb-1">Precio: $199</div>
                  <div className="text-gray-400 text-xs">
                    Duración: 8h 30min
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-1">Alumnos: 14</div>
                  <div className="text-gray-400 text-xs">Estado: Online</div>
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg rotate-45"></div>
            <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-4 h-4 sm:w-6 sm:h-6 bg-secondary rounded-full"></div>
            <div className="hidden sm:block absolute top-1/2 -right-8 w-4 h-12 bg-primary-light"></div>

            {/* Scattered pixels */}
            <div className="hidden sm:block absolute top-8 right-8 w-2 h-2 bg-primary"></div>
            <div className="hidden sm:block absolute bottom-12 left-8 w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="hidden sm:block absolute top-16 left-12 w-2 h-6 bg-secondary-light"></div>
          </div>
        </div>

        {/* Logos de confianza */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-12 opacity-60">
            {[
              "Mercado Pago",
              "Cuenta DNI",
              "Tarjeta Naranja",
              "Débito/crédito",
              "+",
            ].map((company, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gray-400 rounded"></div>
                <span className="text-gray-600 font-medium text-sm sm:text-base">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
