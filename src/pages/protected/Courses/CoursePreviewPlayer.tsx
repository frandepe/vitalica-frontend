import CoursePlayer from "./CoursePlayer";
import { previewExperienceAdapter } from "@/experiences/previewExperience.adapter";

export default function CoursePreviewPlayer() {
  return <CoursePlayer adapter={previewExperienceAdapter} />;
}
