import { MOODS, type Entry, type Mood } from "../types";

export interface Star {
  id: string;
  mood: Mood;
  /** Position inside the sky, in percent (0–100). */
  x: number;
  y: number;
  /** Diameter in px. */
  size: number;
  /** Twinkle cycle length and start offset, in seconds. */
  twinkle: number;
  delay: number;
}

const CHART_COLORS = 7;

/** One color per mood, computed once. */
export const MOOD_COLOR = Object.fromEntries(
  MOODS.map((mood, i) => [mood, `var(--chart-${(i % CHART_COLORS) + 1})`]),
) as Record<Mood, string>;

// Tiny seeded PRNG: the same entry id always yields the same star.
function hashString(str: string): number {
  let h = 2166136261; // FNV-1a
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RADIUS_X = 44;
const RADIUS_Y = 41;

export function toStar(entry: Entry): Star {
  const id = String(entry.id);
  const rand = mulberry32(hashString(id));

  // Elliptical layout, denser toward the centre, like a small galaxy.
  const angle = rand() * Math.PI * 2;
  const radius = Math.pow(rand(), 0.65);

  return {
    id,
    mood: entry.mood,
    x: 50 + Math.cos(angle) * radius * RADIUS_X,
    y: 50 + Math.sin(angle) * radius * RADIUS_Y,
    size: 5 + rand() * 8,
    twinkle: 2.5 + rand() * 3,
    delay: rand() * 3,
  };
}

export function countByMood(stars: readonly Star[]): Record<Mood, number> {
  const counts = Object.fromEntries(MOODS.map((m) => [m, 0])) as Record<Mood, number>;
  for (const star of stars) counts[star.mood] += 1;
  return counts;
}