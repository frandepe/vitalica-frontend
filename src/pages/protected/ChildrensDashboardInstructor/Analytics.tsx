import { AnalyticsData } from "@/components/instructor/AnalyticsData";
import { MarketingDashboard } from "@/components/instructor/AnalyticsData2";

export default function Analytics() {
  const sampleCta = {
    text: "Cuando tus cursos tengan actividad, vas a ver el detalle completo acá.",
    buttonText: "Ver cursos",
    onButtonClick: () => alert("Todavía no hay cursos con actividad."),
  };

  const sampleTeamActivities = {
    totalHours: 0,
    stats: [
      { label: "Clases", value: 0, color: "bg-green-400" },
      { label: "Prácticas", value: 0, color: "bg-lime-300" },
      { label: "Evaluaciones", value: 0, color: "bg-yellow-300" },
      { label: "Pendiente", value: 0, color: "bg-slate-800 dark:bg-slate-700" },
    ],
  };

  const sampleTeam = {
    memberCount: 0,
    members: [],
  };
  return (
    <div>
      <div className="flex flex-col xl:flex-row justify-between">
        <AnalyticsData />
        <MarketingDashboard
          title="Actividad de tus cursos"
          teamActivities={sampleTeamActivities}
          team={sampleTeam}
          cta={sampleCta}
          onFilterClick={() => alert("Todavía no hay datos para filtrar.")}
        />
      </div>
      <section>
        <div className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="sr-only">Resumen de analíticas del instructor</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="space-y-0.5 md:text-center">
                <div className="text-primary text-4xl font-bold">0</div>
                <p className="text-muted-foreground">Cursos publicados</p>
              </div>
              <div className="space-y-0.5 md:text-center">
                <div className="text-primary text-4xl font-bold">0%</div>
                <p className="text-muted-foreground">Finalización promedio</p>
              </div>
              <div className="col-span-2 border-t pt-4 md:border-l md:border-t-0 md:pl-12 md:pt-0">
                <p className="text-muted-foreground text-balance text-lg">
                  Este panel va a mostrar el rendimiento de tus cursos cuando
                  empieces a recibir alumnos, avances y valoraciones dentro de
                  Vitalica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
