import { Feather } from "lucide-react";

export default function SecondCard() {
  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between text-[var(--muted-foreground)]">
        <span className="text-[0.55rem] uppercase">EMOTIONAL SIGNATURE</span>
        <Feather size={12} />
      </div>
      {/* Spectrum Wave (31 equalizer bars) */}
      <div className="steps-spectrum w-full" aria-hidden="true">
        {Array.from({ length: 31 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <div className="flex flex-row place-content-between mt-8">
        <p className=" text-2xl  font-display text-[var(--chart-2)]">Peace</p>
        <p className="text-[0.55rem] text-[var(--muted-foreground)]">
          Quiet. Grounded. Present.
        </p>
      </div>
      <hr className="w-full border-white/10 mt-8" />
      <ul
        className="flex flex-row gap-5 text-[var(--muted-foreground)] text-[0.7rem] tracking-wide list-disc
pl-3 mt-1"
      >
        <li>Gratitude</li>
        <li>Growth</li>
        <li>Everyday life</li>
      </ul>
    </div>
  );
}
