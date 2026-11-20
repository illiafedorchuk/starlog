import { Feather, Sparkles } from "lucide-react";

export default function FirstCard() {
  return (
    <div className="w-full flex place-content-center">
      {/* Card */}
      <div className="bg-white/5 p-4 rotate-[-3deg] rounded-sm border-l border-[var(--chart-1)] mt-7">
        {/* Header */}
        <div className="flex items-center justify-between text-[var(--muted-foreground)]">
          <span className="text-[0.55rem] uppercase">Dear universe.</span>
          <Feather size={12} />
        </div>

        {/* Content */}
        <p
          className="max-w-[90%] py-5 text-m leading-relaxed tracking-wider

"
        >
          Took the long way home. The sky was pink, and for once, I wasn’t in a
          hurry.
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-[var(--muted-foreground)]">
          <span className="text-[0.55rem] ">A little more present.</span>
          <Sparkles size={8} />
        </div>
      </div>
    </div>
  );
}
