import type { Student } from "../data/students";

const TITLES: Record<string, string> = {
  English: "English Champion",
  Maths: "Maths Brain",
  Urdu: "Silent Assassin",
  Chemistry: "Chemistry Wizard",
  Computer: "Computer Mode",
  "All subjects": "All-Rounder",
  Sports: "Sports Ace",
  Sleeping: "Sleep Champion",
  Jokes: "Class Comedian",
  "General knowledge": "Walking Google",
  Patience: "Server Down",
};

export function photoSrc(roll: string): string {
  return `/students/${roll}.jpg`;
}

export function funTitle(s: Pick<Student, "talent" | "skills">): string {
  if (TITLES[s.talent]) return TITLES[s.talent];
  const best = [...s.skills].sort((a, b) => b[1] - a[1])[0];
  if (best && TITLES[best[0]]) return TITLES[best[0]];
  return `${s.talent} Star`;
}

export function barTone(pct: number): "high" | "mid" | "low" {
  if (pct >= 80) return "high";
  if (pct >= 50) return "mid";
  return "low";
}

export function uniqueTalents(list: Student[]): string[] {
  return [...new Set(list.map((s) => s.talent))].sort((a, b) => a.localeCompare(b));
}

export const RING = 2 * Math.PI * 38;
