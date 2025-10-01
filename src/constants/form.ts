export enum Specialty {
  CPR, // Reanimación cardiopulmonar (BLS)
  DEA, // Uso de desfibrilador
  FIRST_AID, // Primeros Auxilios generales
  PSYCHOLOGICAL_FIRST_AID, // Primeros Auxilios Psicológicos
  CHILD_CARE, // Primeros Auxilios en Niños
  ELDERLY_CARE, // Primeros Auxilios en Adultos Mayores
  FIRST_AID_PETS, // Primeros Auxilios para Mascotas
  TRAUMA, // Manejo de trauma
  HEMORRHAGE, // Control de hemorragias
  FRACTURES, // Fracturas y lesiones óseas
  SPINAL_INJURY, // Lesiones de columna
  BURNS, // Quemaduras
  ENVIRONMENTAL_EMERGENCIES, // Ahogamiento, hipotermia, golpe de calor
  TOXICOLOGY, // Intoxicaciones y tóxicos
  OBSTETRICS, // Emergencias obstétricas
  NEONATAL, // Reanimación neonatal
  PEDIATRICS, // Emergencias pediátricas
  CARDIAC_ARREST_ADVANCED, // Soporte Vital Avanzado (ACLS)
  TRAUMA_LIFE_SUPPORT, // Soporte Vital en Trauma (PHTLS/ATLS)
  AIRWAY, // Manejo avanzado de vías aéreas
  SHOCK, // Shock y estado crítico
  BURNS_ADVANCED, // Quemaduras avanzadas
  DISASTER_RESPONSE, // Atención en desastres y múltiples víctimas
  INFECTIOUS_DISEASE, // Emergencias infecciosas y epidemias
  PALS, // Soporte Vital Pediátrico Avanzado
  ACLS, // Soporte Vital Avanzado Adultos
  BLS, // Soporte Vital Básico
  HEIMLICH, // Maniobra de desobstrucción
  WILDERNESS_MEDICINE, // Medicina en entornos remotos
  RESCUE_ACUATIC, // Rescate acuático
  HAZMAT, // Materiales peligrosos
  ELECTROCUTION, // Emergencias eléctricas
  TRANSPORTATION_EVACUATION, // Movilización y transporte de pacientes
}

export enum Levels {
  BASIC,
  INTERMEDIATE,
  ADVANCED,
}

function toTitleCase(str: string) {
  return str
    .toLowerCase() // pasamos todo a minúsculas
    .split("_") // separamos por guion bajo
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalizamos primera letra
    .join(" "); // unimos con espacio
}

export const descriptionCourseLimit = 5000;

// Luego en el map:
export const specialties = Object.keys(Specialty)
  .filter((key) => isNaN(Number(key)))
  .map((key, index) => ({
    id: index + 1,
    value: key,
    label: toTitleCase(key), // usa la función para formato Title Case
  }));

export const levels = Object.keys(Levels)
  .filter((key) => isNaN(Number(key)))
  .map((key, index) => ({
    id: index + 1,
    value: key,
    label: toTitleCase(key),
  }));
