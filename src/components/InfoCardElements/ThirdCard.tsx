import { Feather } from "lucide-react";

export default function ThirdCard() {
  return (
    <div className="w-full h-full min-h-0 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between shrink-0 text-[var(--muted-foreground)]">
        <span className="text-[0.55rem] uppercase">YOUR PERSONAL SKY</span>
        <Feather size={12} />
      </div>

      {/* Constellation */}
      <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 320 190"
          role="img"
          aria-label="A new memory star connecting to the Growth constellation"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-h-[240px] md:max-h-[220px] lg:max-h-[220px]" 
        >
          {/* Background scattered faint stars */}
          <g className="steps-distant-stars">
            {[
              [20, 30],
              [68, 64],
              [285, 24],
              [280, 146],
              [138, 19],
              [28, 153],
              [213, 163],
              [302, 82],
              [117, 150],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1" />
            ))}
          </g>

          {/* Constellation connection lines */}
          <g className="steps-star-lines">
            <path d="M32 121 100 83 165 113 228 54 286 91 M100 83 129 35 M165 113 210 152" />
          </g>

          {/* Fixed constellation stars */}
          {[
            [32, 121],
            [100, 83],
            [129, 35],
            [165, 113],
            [286, 91],
            [210, 152],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === 1 ? 3 : 2}
              className="steps-small-star"
            />
          ))}

          {/* New memory star */}
          <g className="steps-new-star">
            <circle cx="228" cy="54" r="21" className="steps-star-ring" />
            <circle cx="228" cy="54" r="4" />
            <path d="M228 41v26m-13-13h26" />
          </g>
        </svg>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between shrink-0 text-[var(--muted-foreground)] text-[0.55rem]">
        <span>Growth constellation</span>
        <span className="text-[var(--primary)]">+1 memory</span>
      </div>
    </div>
  );
}
