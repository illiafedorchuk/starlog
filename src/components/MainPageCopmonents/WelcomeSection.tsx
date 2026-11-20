import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { EASE, revealContainer, revealItem } from "../../lib/motion";

const START_HREF = "#start";

/** Each headline line rises from behind a mask, like text emerging from the planet. */
const lineReveal: Variants = {
  hidden: { y: "110%" },
  visible: { y: 0, transition: { duration: 1.1, ease: EASE } },
};

export function WelcomeSection() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Scroll-linked values bypass React state, so scrolling never re-renders.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const pointerEvents = useTransform(
    opacity,
    (o): "none" | "auto" => (o < 0.1 ? "none" : "auto"),
  );
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const exitStyle = reduceMotion
    ? undefined
    : { scale, opacity, pointerEvents };

  return (
    <section
      ref={ref}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-x-clip px-6 pb-16 pt-20 text-center"
    >
      <motion.div
        style={exitStyle}
        className="relative flex flex-col items-center"
        variants={revealContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Aurora glow for depth behind the headline */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[60vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(234,176,92,0.14),rgba(102,191,192,0.08)_45%,transparent_70%)] blur-2xl"
        />

        {/* pl compensates for the trailing letter-spacing so the text looks centered */}
        <motion.p
          variants={revealItem}
          className="pl-[0.5em] text-xs font-medium uppercase tracking-[0.5em] text-[var(--secondary)] md:text-sm"
        >
          Starlog
        </motion.p>

        <h1 className="mt-6 font-display text-[clamp(2.5rem,8vw,7rem)] font-light leading-[1.05] tracking-tight text-[#eaf2f6]">
          <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
            <motion.span variants={lineReveal} className="inline-block">
              Every thought —
            </motion.span>
          </span>
          <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
            <motion.span
              variants={lineReveal}
              className="inline-block font-medium text-aurora"
            >
              a new star
            </motion.span>
          </span>
        </h1>

        <motion.p
          variants={revealItem}
          className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-white/70 md:text-xl"
        >
          Write short notes. AI senses the mood and the theme—and lights them
          up in your own personal sky.
        </motion.p>

        {/* The wrapper animates in; the link keeps its own hover transforms */}
        <motion.div variants={revealItem} className="mt-12">
          <a
            href={START_HREF}
            className="group inline-flex items-center gap-3 rounded-full bg-[var(--primary)] px-9 py-4 text-lg font-medium text-black transition-[transform,box-shadow] duration-300 hover:shadow-[0_0_40px_var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-safe:hover:scale-[1.04] motion-safe:active:scale-95"
          >
            Start now
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-5 w-5 fill-none stroke-current stroke-2 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue: fades in late, disappears as soon as you scroll */}
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { opacity: cueOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="pl-[0.4em] text-[10px] uppercase tracking-[0.4em] text-white/40">
            Scroll
          </span>
          <span className="relative block h-10 w-px overflow-hidden bg-white/20">
            <motion.span
              className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-transparent to-white"
              animate={reduceMotion ? undefined : { y: ["-100%", "250%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}