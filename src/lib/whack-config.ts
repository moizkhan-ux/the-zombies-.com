export const WHACK = {
  round: 30,
  maxScore: 300,
  comboX2: 3,
  comboX3: 5,
  comboX4: 8,
  bombChance: 1 / 6,
  bombPenalty: 3,
  bombSafeMs: 5000,
  goldenChance: 1 / 15,
  goldenPoints: 5,
  goldenStayMs: 500,
  countdown: [3, 2, 1, "GO!"] as const,
  countdownStepMs: 700,
  lastSeconds: 5,
  lastSecondsSpeed: 0.75,
  titles: [
    { min: 25, name: "Legend" },
    { min: 20, name: "Sniper" },
    { min: 15, name: "Zombie Hunter" },
    { min: 10, name: "Zombie Bait" },
    { min: 0, name: "Rookie" },
  ],
};

export function titleOf(score: number): string {
  for (const t of WHACK.titles) {
    if (score >= t.min) return t.name;
  }
  return "Rookie";
}

export function comboMult(streak: number): number {
  if (streak >= WHACK.comboX4) return 4;
  if (streak >= WHACK.comboX3) return 3;
  if (streak >= WHACK.comboX2) return 2;
  return 1;
}
