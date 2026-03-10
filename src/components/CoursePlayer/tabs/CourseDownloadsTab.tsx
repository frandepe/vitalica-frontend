import { DownloadMaterial } from "@/components/Download/DownloadMaterial";

interface MaterialItem {
  key: string;
  originalName: string;
}

interface CourseDownloadsTabProps {
  materials: MaterialItem[];
}

export function CourseDownloadsTab({ materials }: CourseDownloadsTabProps) {
  return <DownloadMaterial materials={materials} />;
}
