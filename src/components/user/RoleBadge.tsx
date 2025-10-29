import { Crown, Star, Sparkles } from "lucide-react";
import { Temporal } from "@js-temporal/polyfill";

interface UserBadgeProps {
  role: string;
  createdAt: string | Date;
}

const RoleBadge: React.FC<UserBadgeProps> = ({ role, createdAt }) => {
  const createdDate =
    typeof createdAt === "string"
      ? Temporal.PlainDate.from(createdAt.split("T")[0])
      : Temporal.PlainDate.from(createdAt.toISOString().split("T")[0]);

  const today = Temporal.Now.plainDateISO();

  const daysSinceCreation = today.since(createdDate).total({ unit: "days" });

  let statusLabel = "";
  let Icon: React.ElementType | null = null;
  let iconColor = "text-muted-foreground";

  if (role === "INSTRUCTOR") {
    Icon = Crown;
    iconColor = "text-amber-500";
    statusLabel = "Instructor";
  } else if (daysSinceCreation <= 30) {
    Icon = Sparkles;
    iconColor = "text-green-500";
    statusLabel = "Usuario nuevo";
  } else if (daysSinceCreation <= 180) {
    Icon = Star;
    iconColor = "text-blue-500";
    statusLabel = "Usuario medio";
  } else {
    Icon = Star;
    iconColor = "text-gray-500";
    statusLabel = "Usuario veterano";
  }

  return (
    <div className="flex items-center gap-1">
      {Icon && <Icon className={`h-3 w-3 ${iconColor}`} />}
      <p className="text-xs text-muted-foreground">{statusLabel}</p>
    </div>
  );
};

export default RoleBadge;
