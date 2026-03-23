// Car unlock system — cars earned through coding success
export interface UnlockableCar {
  id: string;
  name: string;
  bodyColor: string;
  accentColor: string;
  glowColor: string;
  requiredLevel: number;
  requiredWins: number;
  description: string;
  speed: number;
  boost: number;
  handling: number;
}

export const CARS: UnlockableCar[] = [
  {
    id: "starter", name: "BYTE RUNNER", bodyColor: "#0a0a2a", accentColor: "#00f0ff",
    glowColor: "#00f0ff", requiredLevel: 0, requiredWins: 0,
    description: "Your first ride. Reliable and ready to race.",
    speed: 60, boost: 50, handling: 70,
  },
  {
    id: "syntax", name: "SYNTAX BLADE", bodyColor: "#1a0030", accentColor: "#aa44ff",
    glowColor: "#aa44ff", requiredLevel: 3, requiredWins: 5,
    description: "Sleek purple machine. Unlocked by mastering basics.",
    speed: 70, boost: 60, handling: 75,
  },
  {
    id: "turbo", name: "TURBO COMPILER", bodyColor: "#002a1a", accentColor: "#00ff88",
    glowColor: "#00ff88", requiredLevel: 5, requiredWins: 15,
    description: "Green lightning. Compiles speed from clean code.",
    speed: 80, boost: 75, handling: 65,
  },
  {
    id: "flame", name: "STACK FLAME", bodyColor: "#2a1000", accentColor: "#ff6600",
    glowColor: "#ff6600", requiredLevel: 8, requiredWins: 30,
    description: "Burns through challenges like a hot function call.",
    speed: 85, boost: 80, handling: 70,
  },
  {
    id: "phantom", name: "NULL PHANTOM", bodyColor: "#0a0a0a", accentColor: "#ff0066",
    glowColor: "#ff0066", requiredLevel: 12, requiredWins: 50,
    description: "Invisible to errors. The ghost of clean code.",
    speed: 90, boost: 85, handling: 80,
  },
  {
    id: "quantum", name: "QUANTUM RACER", bodyColor: "#000a2a", accentColor: "#4488ff",
    glowColor: "#4488ff", requiredLevel: 15, requiredWins: 75,
    description: "Exists in all lanes simultaneously.",
    speed: 92, boost: 88, handling: 85,
  },
  {
    id: "nova", name: "SUPERNOVA X", bodyColor: "#1a1a00", accentColor: "#ffcc00",
    glowColor: "#ffcc00", requiredLevel: 20, requiredWins: 100,
    description: "The legendary golden racer. Ultimate coding mastery.",
    speed: 95, boost: 95, handling: 90,
  },
];

export const getUnlockedCars = (level: number, wins: number): UnlockableCar[] =>
  CARS.filter(c => c.requiredLevel <= level && c.requiredWins <= wins);

export const isCarUnlocked = (carId: string, level: number, wins: number): boolean => {
  const car = CARS.find(c => c.id === carId);
  return car ? car.requiredLevel <= level && car.requiredWins <= wins : false;
};
