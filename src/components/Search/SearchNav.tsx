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
      description: "Nivel Inicial",
      short: "",
      // end: "Explorar",
      redirect: "/buscar?page=1&specialty=CPR",
    },
    {
      id: "2",
      label: "Primeros Auxilios",
      icon: <BriefcaseMedical className="h-4 w-4 text-emerald-500" />,
      description: "Nivel Inicial",

      redirect: "/buscar?page=1&specialty=FIRST_AID",
    },
    {
      id: "3",
      label: "Emergencias Pediátricas",
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
      description: "Pediatría",

      redirect: "/buscar?page=1&specialty=PEDIATRICS",
    },
    {
      id: "4",
      label: "Maniobra de Heimlich",
      icon: <Ambulance className="h-4 w-4 text-blue-500" />,
      description: "Heimlich",

      redirect: "/buscar?page=1&specialty=HEIMLICH",
    },
    {
      id: "5",
      label: "Trauma Prehospitalario",
      icon: <Bandage className="h-4 w-4 text-orange-500" />,
      description: "Atención inicial",

      redirect: "/buscar?search=trauma+prehospitalario",
    },
  ];

  return <ActionSearchBar actions={allActions} />;
}

export { SearchNav };
