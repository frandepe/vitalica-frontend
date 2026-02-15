import { ActionSearchBar } from "@/components/ui/action-search-bar";
import {
  HeartHandshake,
  BriefcaseMedical,
  Zap,
  Ambulance,
  Bandage,
} from "lucide-react";

function SearchNav() {
  const allActions = [
    {
      id: "1",
      label: "RCP",
      icon: <HeartHandshake className="h-4 w-4 text-red-500" />,
      description: "Cursos",
      short: "",
      end: "Explorar",
      redirect: "/buscar/?search=rcp",
    },
    {
      id: "2",
      label: "Primeros Auxilios",
      icon: <BriefcaseMedical className="h-4 w-4 text-emerald-500" />,
      description: "Cursos",
      end: "Explorar",
      redirect: "/buscar?search=primeros+auxilios",
    },
    {
      id: "3",
      label: "DEA",
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
      description: "Desfibrilación",
      end: "Ver cursos",
      redirect: "/buscar?search=dea",
    },
    {
      id: "4",
      label: "Emergencias Médicas",
      icon: <Ambulance className="h-4 w-4 text-blue-500" />,
      description: "Formación",
      end: "Explorar",
      redirect: "/buscar?search=emergencias",
    },
    {
      id: "5",
      label: "Trauma Prehospitalario",
      icon: <Bandage className="h-4 w-4 text-orange-500" />,
      description: "Atención inicial",
      end: "Aprender",
      redirect: "/buscar?search=trauma+prehospitalario",
    },
  ];

  return <ActionSearchBar actions={allActions} />;
}

export { SearchNav };
