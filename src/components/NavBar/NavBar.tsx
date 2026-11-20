import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface NavBarProps {
  onLogin?: () => void;
}

export function NavBar({ onLogin }: NavBarProps) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <motion.header
      data-scrolled={scrolled}
      initial={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300 data-[scrolled=true]:border-white/10 data-[scrolled=true]:bg-black/40 data-[scrolled=true]:backdrop-blur-md"
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12"
      >
        <a
          href="/"
          aria-label="Starlog home"
          className="rounded font-display text-base font-semibold tracking-[0.25em] text-[#eaf2f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:text-lg"
        >
          STARLOG
        </a>

        <button
          type="button"
          onClick={onLogin}
          className="cursor-pointer rounded-full border border-white/30 px-5 py-1.5 text-sm text-white/80 transition-colors duration-300 hover:border-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-95"
        >
          Login
        </button>
      </nav>
    </motion.header>
  );
}