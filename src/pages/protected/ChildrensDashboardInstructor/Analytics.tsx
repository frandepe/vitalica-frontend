import { AnalyticsData } from "@/components/instructor/AnalyticsData";
import { MarketingDashboard } from "@/components/instructor/AnalyticsData2";

export const Analytics = () => {
  const sampleCta = {
    text: "Manage your activities and team members",
    buttonText: "See All",
    onButtonClick: () => alert("'See All' button clicked!"),
  };

  const sampleTeamActivities = {
    totalHours: 16.5,
    stats: [
      { label: "Productive", value: 45, color: "bg-green-400" },
      { label: "Middle", value: 25, color: "bg-lime-300" },
      { label: "Break", value: 15, color: "bg-yellow-300" },
      { label: "Idle", value: 15, color: "bg-slate-800 dark:bg-slate-700" },
    ],
  };

  const sampleTeam = {
    memberCount: 235,
    members: [
      {
        id: "1",
        name: "Olivia Martin",
        avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      },
      {
        id: "2",
        name: "Jackson Lee",
        avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      },
      {
        id: "3",
        name: "Isabella Nguyen",
        avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026302d",
      },
      {
        id: "4",
        name: "William Kim",
        avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      },
    ],
  };
  return (
    <div>
      <div className="flex flex-col xl:flex-row justify-between">
        <AnalyticsData />
        <MarketingDashboard
          teamActivities={sampleTeamActivities}
          team={sampleTeam}
          cta={sampleCta}
          onFilterClick={() => alert("Filter clicked!")}
        />
      </div>
      <section>
        <div className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="sr-only">Tailark in stats</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="space-y-0.5 md:text-center">
                <div className="text-primary text-4xl font-bold">90+</div>
                <p className="text-muted-foreground">Integrations</p>
              </div>
              <div className="space-y-0.5 md:text-center">
                <div className="text-primary text-4xl font-bold">56%</div>
                <p className="text-muted-foreground">Productivity Boost</p>
              </div>
              <div className="col-span-2 border-t pt-4 md:border-l md:border-t-0 md:pl-12 md:pt-0">
                <p className="text-muted-foreground text-balance text-lg">
                  Our platform continues to grow with developers and businesses
                  using productivity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
