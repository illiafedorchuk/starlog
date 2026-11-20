import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import planet from "../../assets/planet.jpg";

const EASE = [0.22, 1, 0.36, 1] as const;

export function PlanetSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Parallax is tied to this section's own scroll progress,
  // so it no longer depends on the global scroll position.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const planetY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [80, -80],
  );
  const planetRotate = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [-2, 2],
  );

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : 0.16, delayChildren: 0.1 },
    },
  };

  // Each headline line starts "inside" the planet (shifted left, hidden by it)
  // and slides out to its final position.
  const slideOut: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : "-45vw" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reduce ? 0 : 1.4, ease: EASE },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 1, ease: EASE },
    },
  };

  // Put these above the component
  const HALO_MASK =
    "radial-gradient(ellipse 66% 72% at 38% 50%, #000 30%, rgba(0,0,0,.8) 48%, rgba(0,0,0,.45) 64%, rgba(0,0,0,.18) 80%, transparent 100%)";

  const CORE_MASK =
    "radial-gradient(ellipse 58% 64% at 38% 50%, #000 34%, rgba(0,0,0,.85) 50%, rgba(0,0,0,.5) 66%, rgba(0,0,0,.2) 82%, transparent 100%)";

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center overflow-x-clip bg-transparent px-6 md:px-16 lg:px-36 mb-20"
    >
      {/* Planet */}
      <div
        className="pointer-events-none absolute left-[-22vw] top-1/2 z-0 w-[85vw] max-w-[1200px] -translate-y-1/2 opacity-40 lg:z-20 lg:w-[72vw] lg:opacity-100"
        aria-hidden
      >
        {/* Blurred halo: soft, out-of-focus edge */}
        <div
          className="absolute inset-0"
          style={{ WebkitMaskImage: HALO_MASK, maskImage: HALO_MASK }}
        >
          <motion.img
            src={planet}
            alt=""
            width={1024}
            height={1024}
            className="h-full w-full scale-105 select-none blur-2xl"
            style={{ y: planetY, rotate: planetRotate }}
          />
        </div>

        {/* Sharp core: keeps the planet surface detailed */}
        <div
          className="relative"
          style={{ WebkitMaskImage: CORE_MASK, maskImage: CORE_MASK }}
        >
          <motion.img
            src={planet}
            alt="Газовий гігант з кільцями"
            loading="lazy"
            width={1024}
            height={1024}
            className="h-auto w-full select-none"
            style={{ y: planetY, rotate: planetRotate }}
          />
        </div>
      </div>

      {/* Text */}
      <motion.div
        className="relative z-10 ml-auto flex w-full flex-col items-end gap-8 text-right lg:w-[62%]"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        <motion.p
          variants={fadeUp}
          className="text-xs uppercase tracking-[0.5em] text-[var(--secondary)] md:text-sm"
        >
          A sky that grows with you
        </motion.p>

        <h1 className="font-display text-[clamp(3rem,9vw,9rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-[#eaf2f6]">
          <motion.span variants={slideOut} className="block">
            Your
          </motion.span>
          <motion.span variants={slideOut} className="block">
            universe
          </motion.span>
          <motion.span
            variants={slideOut}
            className="block bg-gradient-to-r from-[#eab05c] via-[#b3b98f] to-[#66bfc0] bg-clip-text text-transparent"
          >
            grows
          </motion.span>
          <motion.span variants={slideOut} className="block">
            over time
          </motion.span>
        </h1>

        <motion.p
          variants={fadeUp}
          className="max-w-md text-base leading-relaxed text-white/60 md:text-lg"
        >
          Months of entries become a galaxy of memories. Explore your sky by
          mood, theme, or moment.
        </motion.p>
      </motion.div>
    </section>
  );
}
