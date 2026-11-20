import {
  useId,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { revealContainer, revealItem } from "../../lib/motion";
import { useDraft } from "../../hooks/useDraft";

const MAX_LENGTH = 2000;
const GLOW_FULL_AT = 160; // characters until the star is fully lit
const DEFAULT_STAR = "#eaf2f6";

const MOODS = [
  { id: "calm", label: "Calm", color: "#66bfc0" },
  { id: "joyful", label: "Joyful", color: "#eab05c" },
  { id: "grateful", label: "Grateful", color: "#b3b98f" },
  { id: "heavy", label: "Heavy", color: "#8b9cf0" },
  { id: "restless", label: "Restless", color: "#e87f6b" },
] as const;

type MoodId = (typeof MOODS)[number]["id"];

const PROMPTS = [
  "Today I…",
  "Something small that made me smile…",
  "Right now I’m feeling…",
  "I keep thinking about…",
];

export interface NewEntry {
  text: string;
  mood: MoodId | null;
}

interface StartNowProps {
  /** Persist the entry. Reject to show an error and keep the draft. */
  onCreateEntry: (entry: NewEntry) => Promise<void> | void;
}

type Status = "idle" | "submitting" | "error" | "done";

/** Cross-fades its children whenever `id` changes. */
function Swap({ id, children }: { id: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={id}
        className="block"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35 }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}

/** The "first star": dim while the page is empty, brighter as you write. */
function GhostStar({
  glow,
  color,
  lit,
}: {
  glow: number;
  color: string;
  lit: boolean;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-9 w-9 md:h-10 md:w-10"
      initial={false}
      animate={{
        color,
        opacity: 0.3 + glow * 0.7,
        scale: lit ? [1, 1.6, 1.25] : 0.9 + glow * 0.3,
        filter: `drop-shadow(0 0 ${4 + glow * 18}px ${color})`,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      <path
        fill="currentColor"
        d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"
      />
    </motion.svg>
  );
}

export function StartNow({ onCreateEntry }: StartNowProps) {
  const [text, setText] = useDraft("starlog:first-entry");
  const [moodId, setMoodId] = useState<MoodId | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [today] = useState(() =>
    new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date()),
  );
  const [placeholder] = useState(
    () => PROMPTS[Math.floor(Math.random() * PROMPTS.length)],
  );
  const textareaId = useId();
  const hintId = useId();

  const trimmed = text.trim();
  const isSubmitting = status === "submitting";
  const isDone = status === "done";
  const canSubmit = trimmed.length > 0 && !isSubmitting;
  const glow = isDone ? 1 : Math.min(trimmed.length / GLOW_FULL_AT, 1);
  const starColor = MOODS.find((m) => m.id === moodId)?.color ?? DEFAULT_STAR;

  const submit = async () => {
    if (!canSubmit) return;
    setStatus("submitting");
    try {
      await onCreateEntry({ text: trimmed, mood: moodId });
      setText("");
      setStatus("done");
    } catch {
      setStatus("error"); // keep the draft so nothing is lost
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void submit();
    }
  };

  const writeAnother = () => {
    setMoodId(null);
    setStatus("idle");
  };

  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-x-clip px-6 py-24 md:px-16">
      {/* Soft dark halo so the starfield never competes with the text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,8,14,0.75),transparent_65%)]"
      />

      <motion.div
        className="relative flex w-full max-w-2xl flex-col items-center gap-5 text-center"
        variants={revealContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        <motion.div variants={revealItem}>
          <GhostStar glow={glow} color={starColor} lit={isDone} />
        </motion.div>

        <motion.p
          variants={revealItem}
          className="text-xs uppercase tracking-[0.35em] text-[var(--secondary)] md:tracking-[0.5em]"
        >
          {today}
        </motion.p>

        <motion.h2
          variants={revealItem}
          className="font-display text-[clamp(2.25rem,7vw,5rem)] font-extrabold uppercase leading-[1.05] tracking-tight text-[#eaf2f6]"
        >
          <Swap id={isDone ? "done" : "empty"}>
            {isDone ? (
              <>
                Your first star is <span className="text-aurora">lit</span>.
              </>
            ) : (
              <>
                The sky is <span className="text-aurora">still empty</span>.
              </>
            )}
          </Swap>
        </motion.h2>

        <motion.p
          variants={revealItem}
          aria-live="polite"
          className="text-lg text-[var(--secondary)] md:text-xl"
        >
          <Swap id={isDone ? "done" : "empty"}>
            {isDone
              ? "Keep writing and watch your sky grow."
              : "Write the first entry."}
          </Swap>
        </motion.p>

        <motion.div variants={revealItem} className="mt-4 w-full">
          <AnimatePresence mode="wait" initial={false}>
            {isDone ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <button
                  type="button"
                  onClick={writeAnother}
                  className="rounded-full border border-white/30 px-6 py-2.5 text-sm text-white/80 transition-colors duration-300 hover:border-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  Write another entry
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="group relative w-full rounded-3xl bg-white/10 p-px"
              >
                {/* Aurora border that fades in while the card has focus */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#eab05c]/70 via-white/10 to-[#66bfc0]/70 opacity-0 transition-opacity duration-500 group-focus-within:opacity-100"
                />

                <div className="glass relative flex flex-col gap-5 rounded-[calc(1.5rem-1px)] p-5 text-left md:p-6">
                  <fieldset className="min-w-0">
                    <legend className="mb-3 text-xs uppercase tracking-[0.25em] text-white/40">
                      How does it feel? · optional
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {MOODS.map((m) => (
                        <label
                          key={m.id}
                          className="relative cursor-pointer"
                          style={{ "--mood": m.color } as CSSProperties}
                        >
                          <input
                            type="radio"
                            name="mood"
                            value={m.id}
                            checked={moodId === m.id}
                            onChange={() => setMoodId(m.id)}
                            disabled={isSubmitting}
                            className="peer sr-only"
                          />
                          <span className="flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/60 transition-colors hover:border-white/30 hover:text-white peer-checked:border-[var(--mood)] peer-checked:bg-white/10 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-white/70">
                            <span
                              aria-hidden
                              className="h-2 w-2 rounded-full bg-[var(--mood)]"
                            />
                            {m.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <label htmlFor={textareaId} className="sr-only">
                    Your first entry
                  </label>
                  <textarea
                    id={textareaId}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={MAX_LENGTH}
                    readOnly={isSubmitting}
                    aria-describedby={hintId}
                    aria-invalid={status === "error"}
                    placeholder={placeholder}
                    className="max-h-72 min-h-32 w-full resize-none bg-transparent text-base leading-relaxed text-white caret-[var(--primary)] [field-sizing:content] placeholder:text-white/35 focus:outline-none md:min-h-40 md:text-lg"
                  />

                  {status === "error" && (
                    <p role="alert" className="text-sm text-red-300">
                      Couldn’t save your entry. Your text is still here, so try
                      again.
                    </p>
                  )}

                  <div className="flex flex-col-reverse gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p id={hintId} className="text-sm text-white/40">
                      <span className="hidden sm:inline">
                        ⌘/Ctrl + Enter to save
                      </span>
                      {text.length > MAX_LENGTH * 0.75 && (
                        <span className="tabular-nums sm:ml-3">
                          {text.length}/{MAX_LENGTH}
                        </span>
                      )}
                    </p>

                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3 text-base font-medium text-black transition-[transform,box-shadow,opacity] duration-300 hover:shadow-[0_0_32px_var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-safe:hover:scale-[1.03] motion-safe:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:scale-100 sm:w-auto"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden
                        className="h-4 w-4 fill-current"
                      >
                        <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
                      </svg>
                      {isSubmitting ? "Saving…" : "Light your first star"}
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}