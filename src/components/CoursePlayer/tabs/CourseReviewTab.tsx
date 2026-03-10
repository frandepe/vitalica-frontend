import { GiveReview } from "@/components/Reviews/GiveReview";

interface CourseReviewTabProps {
  courseId: string;
  percentage: number;
}

export function CourseReviewTab({
  courseId,
  percentage,
}: CourseReviewTabProps) {
  return <GiveReview courseId={courseId} percentage={percentage} />;
}
