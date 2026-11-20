import { memo, useId, useMemo, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { MOODS, type Entry, type Mood } from "../../types";
import { revealContainer, revealItem } from "../../lib/motion";
import { MOOD_COLOR, countByMood, toStar, type Star } from "../../lib/sky";

type PreviewPageProps = {
  entries: Entry[];
};

/* ---------- Motion ---------- */

const skyContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } },
};

const starReveal: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 180, damping: 14 },
  },
};

/* ---------- Star ---------- */

type StarState = "idle" | "lit" | "dim";

const STATE_CLASS: Record<StarState, string> = {
  idle: "",
  lit: "scale-125",
  dim: "scale-75 opacity-20",
};

const getStarState = (star: Star, selected: Mood | null): StarState =>
  selected === null ? "idle" : star.mood === selected ? "lit" : "dim";

interface StarDotProps {
  star: Star;
  state: StarState;
  reduceMotion: boolean;
}

/**
 * Three layers, one job each:
 * outer  = position + filter state (CSS transition)
 * middle = "lighting up" entrance (variants from the parent)
 * inner  = the glowing dot with its own twinkle loop
 */
const StarDot = memo(function StarDot({ star, state, reduceMotion }: StarDotProps) {
  const color = MOOD_COLOR[star.mood];

  return (
    <span
      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-500 ${STATE_CLASS[state]}`}
      style={{ left: `${star.x}%`, top: `${star.y}%` }}
    >
      <motion.span variants={starReveal} className="block">
        <motion.span
          className="block rounded-full"
          style={{
            width: star.size,
            height: star.size,
            background: color,
            boxShadow: `0 0 ${star.size * 1.6}px ${star.size * 0.3}px ${color}`,
          }}
          initial={reduceMotion ? false : { opacity: 0.65, scale: 0.9 }}
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.65, 1, 0.65], scale: [0.9, 1.1, 0.9] }
          }
          transition={{
            duration: star.twinkle,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.span>
    </span>
  );
});

/* ---------- Legend ---------- */

interface MoodLegendProps {
  counts: Record<Mood, number>;
  selected: Mood | null;
  onToggle: (mood: Mood) => void;
}

function MoodLegend({ counts, selected, onToggle }: MoodLegendProps) {
  return (
    <div
      role="group"
      aria-label="Filter stars by mood"
      className="flex flex-wrap justify-center gap-2.5"
    >
      {MOODS.map((mood) => {
        const color = MOOD_COLOR[mood];
        return (
          <button
            key={mood}
            type="button"
            aria-pressed={selected === mood}
            disabled={counts[mood] === 0}
            onClick={() => onToggle(mood)}
            style={{ "--mood": color } as CSSProperties}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors duration-300 hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-40 aria-pressed:border-[var(--mood)] aria-pressed:bg-white/10 aria-pressed:text-white"
          >
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: color, boxShadow: `0 0 10px ${color}` }}
            />
            <span className="capitalize">{mood}</span>
            <span className="tabular-nums text-white/40">{counts[mood]}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Section ---------- */

export function PreviewPage({ entries }: PreviewPageProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const headingId = useId();

  // Derived, not stored: new entries show up, and positions never change.
  const stars = useMemo(() => entries.map(toStar), [entries]);
  const counts = useMemo(() => countByMood(stars), [stars]);
  const constellation = useMemo(
    () =>
      selectedMood
        ? stars.filter((s) => s.mood === selectedMood).sort((a, b) => a.x - b.x)
        : [],
    [stars, selectedMood],
  );

  const total = stars.length;
  const moodsUsed = MOODS.filter((m) => counts[m] > 0).length;
  const toggleMood = (mood: Mood) =>
    setSelectedMood((current) => (current === mood ? null : mood));

  return (
    <section
      aria-labelledby={headingId}
      className="relative px-6 py-24 md:px-16 md:py-32"
    >
      <motion.div
        className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
        variants={revealContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          id={headingId}
          variants={revealItem}
          className="font-display text-[clamp(2rem,5vw,3.75rem)] font-extrabold uppercase leading-[1.05] tracking-tight text-[#eaf2f6]"
        >
          This is what <span className="text-aurora">your sky</span> looks like
        </motion.h2>

        <motion.p
          variants={revealItem}
          className="mt-5 max-w-md text-lg text-[var(--secondary)] md:text-xl"
        >
          Tap a mood to see its stars light up.
        </motion.p>

        <motion.div variants={revealItem} className="mt-10">
          <MoodLegend counts={counts} selected={selectedMood} onToggle={toggleMood} />
        </motion.div>

        <motion.div variants={revealItem} className="mt-8 w-full">
          <div className="glass relative h-[clamp(22rem,65dvh,38rem)] w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_80px_-24px_rgba(102,191,192,0.35)]">
            {/* Ambient aurora glow + vignette; the page starfield shows through the glass */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(102,191,192,0.12),transparent_55%),radial-gradient(ellipse_at_75%_80%,rgba(234,176,92,0.10),transparent_55%)] shadow-[inset_0_0_90px_rgba(0,0,0,0.55)]"
            />

            {/* Constellation: connects the stars of the selected mood */}
            <AnimatePresence>
              {selectedMood && constellation.length > 1 && (
                <motion.svg
                  key={selectedMood}
                  aria-hidden
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <polyline
                    points={constellation.map((s) => `${s.x},${s.y}`).join(" ")}
                    fill="none"
                    strokeWidth={1}
                    strokeOpacity={0.55}
                    strokeDasharray="3 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ stroke: MOOD_COLOR[selectedMood] }}
                  />
                </motion.svg>
              )}
            </AnimatePresence>

            <motion.div
              aria-hidden
              variants={skyContainer}
              className="absolute inset-0"
            >
              {stars.map((star) => (
                <StarDot
                  key={star.id}
                  star={star}
                  state={getStarState(star, selectedMood)}
                  reduceMotion={reduceMotion}
                />
              ))}
            </motion.div>

            {total === 0 && (
              <p className="absolute inset-0 grid place-items-center px-6 text-white/50">
                Your sky is still empty.
              </p>
            )}
          </div>
        </motion.div>

        <motion.p
          variants={revealItem}
          aria-live="polite"
          className="mt-5 text-sm text-white/50"
        >
          {total === 0 ? (
            "No entries yet"
          ) : selectedMood ? (
            <>
              Showing {counts[selectedMood]}{" "}
              <span className="capitalize text-white">{selectedMood}</span>{" "}
              {counts[selectedMood] === 1 ? "star" : "stars"} of {total} ·{" "}
              <button
                type="button"
                onClick={() => setSelectedMood(null)}
                className="rounded underline underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Show all
              </button>
            </>
          ) : (
            <>
              {total} {total === 1 ? "entry" : "entries"} across {moodsUsed}{" "}
              {moodsUsed === 1 ? "mood" : "moods"}
            </>
          )}
        </motion.p>
      </motion.div>
    </section>
  );
}