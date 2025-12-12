export enum Specialty {
  CPR,
  DEA,
  FIRST_AID,
  PSYCHOLOGICAL_FIRST_AID,
  CHILD_CARE,
  ELDERLY_CARE,
  FIRST_AID_PETS,
  TRAUMA,
  HEMORRHAGE,
  FRACTURES,
  SPINAL_INJURY,
  BURNS,
  ENVIRONMENTAL_EMERGENCIES,
  TOXICOLOGY,
  OBSTETRICS,
  NEONATAL,
  PEDIATRICS,
  CARDIAC_ARREST_ADVANCED,
  TRAUMA_LIFE_SUPPORT,
  AIRWAY,
  SHOCK,
  BURNS_ADVANCED,
  DISASTER_RESPONSE,
  INFECTIOUS_DISEASE,
  PALS,
  ACLS,
  BLS,
  HEIMLICH,
  WILDERNESS_MEDICINE,
  RESCUE_ACUATIC,
  HAZMAT,
  ELECTROCUTION,
  TRANSPORTATION_EVACUATION,
}

export enum Levels {
  BASIC,
  INTERMEDIATE,
  ADVANCED,
}

export const paymentMethods = {
  PAYPAL: "PAYPAL",
  MERCADO_PAGO: "MERCADO_PAGO",
  BANK_TRANSFER: "BANK_TRANSFER",
} as const;

// -------------------------------
// Traducciones a español
// -------------------------------

export const SpecialtyLabels: Record<keyof typeof Specialty, string> = {
  CPR: "Reanimación cardiopulmonar (RCP)",
  DEA: "Uso de desfibrilador (DEA)",
  FIRST_AID: "Primeros Auxilios",
  PSYCHOLOGICAL_FIRST_AID: "Primeros Auxilios Psicológicos",
  CHILD_CARE: "Atención de niños",
  ELDERLY_CARE: "Atención de adultos mayores",
  FIRST_AID_PETS: "Primeros Auxilios para mascotas",
  TRAUMA: "Trauma",
  HEMORRHAGE: "Control de hemorragias",
  FRACTURES: "Fracturas",
  SPINAL_INJURY: "Lesiones de columna",
  BURNS: "Quemaduras",
  ENVIRONMENTAL_EMERGENCIES: "Emergencias ambientales",
  TOXICOLOGY: "Toxicología",
  OBSTETRICS: "Emergencias obstétricas",
  NEONATAL: "Reanimación neonatal",
  PEDIATRICS: "Emergencias pediátricas",
  CARDIAC_ARREST_ADVANCED: "Paro cardíaco avanzado (ACLS)",
  TRAUMA_LIFE_SUPPORT: "Soporte vital en trauma",
  AIRWAY: "Manejo de vía aérea",
  SHOCK: "Shock",
  BURNS_ADVANCED: "Quemaduras avanzadas",
  DISASTER_RESPONSE: "Respuesta a desastres",
  INFECTIOUS_DISEASE: "Enfermedades infecciosas",
  PALS: "Soporte vital pediátrico (PALS)",
  ACLS: "Soporte vital avanzado (ACLS)",
  BLS: "Soporte vital básico (BLS)",
  HEIMLICH: "Maniobra de Heimlich",
  WILDERNESS_MEDICINE: "Medicina en zonas remotas",
  RESCUE_ACUATIC: "Rescate acuático",
  HAZMAT: "Materiales peligrosos (HAZMAT)",
  ELECTROCUTION: "Electrocución",
  TRANSPORTATION_EVACUATION: "Transporte y evacuación",
};

export const LevelLabels: Record<keyof typeof Levels, string> = {
  BASIC: "Básico",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
};

export const descriptionCourseLimit = 5000;

// -------------------------------
// Listas finales para selects
// -------------------------------

export const specialties = Object.keys(Specialty)
  .filter((key) => isNaN(Number(key)))
  .map((key, index) => ({
    id: index + 1,
    value: key,
    label: SpecialtyLabels[key as keyof typeof Specialty],
  }));

export const levels = Object.keys(Levels)
  .filter((key) => isNaN(Number(key)))
  .map((key, index) => ({
    id: index + 1,
    value: key,
    label: LevelLabels[key as keyof typeof Levels],
  }));
