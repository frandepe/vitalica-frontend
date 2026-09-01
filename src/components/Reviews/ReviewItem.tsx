import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ReviewItemProps } from "@/types/reviews.types";
import { OptimizedAvatarImage } from "@/components/user/OptimizedAvatarImage";

export const ReviewItem = ({ review }: ReviewItemProps) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const diff = review.rating - i;
    if (diff >= 1) return "full";
    if (diff >= 0.5) return "half";
    return "empty";
  });

  return (
    <div className="flex flex-col gap-2 border-b border-border pb-4">
      <div className="flex items-center gap-3">
        <OptimizedAvatarImage
          source={review.user?.avatarUrl}
          fallbackSource="/Placeholders/no-image-profile.jpg"
          displaySize={40}
          alt={review.user?.name || "Usuario"}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-foreground">
            {review.user?.name || "Usuario Anónimo"}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(review.createdAt), {
              addSuffix: true,
              locale: es,
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {stars.map((type, idx) => (
          <Star
            key={idx}
            className={`h-4 w-4 ${
              type === "full"
                ? "text-amber-500"
                : type === "half"
                  ? "text-amber-500/50"
                  : "text-gray-300"
            }`}
            fill="currentColor"
          />
        ))}
      </div>

      {review.comment && (
        <p className="text-sm text-muted-foreground">{review.comment}</p>
      )}
    </div>
  );
};
