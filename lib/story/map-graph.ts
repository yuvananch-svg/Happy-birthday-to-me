import type { MapPointKey } from "./story-types";

export const mapPoints: Record<MapPointKey, { x: string; y: string }> = {
  start: { x: "50%", y: "58%" },
  anniversaryJunction: { x: "28%", y: "58%" },
  anniversary: { x: "28%", y: "27%" },
  birthdayJunction: { x: "75%", y: "58%" },
  birthday: { x: "75%", y: "25%" },
  childhoodJunction: { x: "18%", y: "58%" },
  childhood: { x: "18%", y: "45%" },
  finalJunction: { x: "50%", y: "58%" },
  finalGate: { x: "50%", y: "35%" }
};

export const mapGraph: Record<MapPointKey, MapPointKey[]> = {
  start: ["anniversaryJunction", "birthdayJunction", "childhoodJunction", "finalJunction"],
  anniversaryJunction: ["start", "anniversary"],
  anniversary: ["anniversaryJunction"],
  birthdayJunction: ["start", "birthday"],
  birthday: ["birthdayJunction"],
  childhoodJunction: ["start", "childhood"],
  childhood: ["childhoodJunction"],
  finalJunction: ["start", "finalGate"],
  finalGate: ["finalJunction"]
};
