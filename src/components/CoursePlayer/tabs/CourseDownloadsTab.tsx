import { DownloadMaterial } from "@/components/Download/DownloadMaterial";

interface MaterialItem {
  id: string;
  key: string;
  originalName: string;
  sizeBytes: number;
  type: string;
}

interface CourseDownloadsTabProps {
  materials: MaterialItem[];
}

export function CourseDownloadsTab({ materials }: CourseDownloadsTabProps) {
  return <DownloadMaterial materials={materials} />;
}
