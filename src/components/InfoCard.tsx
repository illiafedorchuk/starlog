
import { Feather, Sparkles, Compass } from "lucide-react";

const stickers = {
  Feather,
  Sparkles,
  Compass,
};

interface InfoCardProps {
  children: React.ReactNode;
  title: string;
  footerHeader: string;
  footerText: string;
  color: string;
  sticker: keyof typeof stickers;
}

export function InfoCard({
  children,
  title,
  footerHeader,
  footerText,
  color,
  sticker,
}: InfoCardProps) {
  const Sticker = stickers[sticker];

  return (
    <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_115px] glass rounded-lg px-4 py-5">

      {/* Header */}
      <div
        className="w-full flex justify-between"
        style={{ color }}
      >
        <p className="text-[0.6rem] pb-3 uppercase">
          {title}
        </p>

        <Sticker size={13} />
      </div>

      {/* Main content */}
      <div className="min-h-0 flex flex-col">
        <hr className="w-full border-white/10 my-2 mb-4 shrink-0" />

        <div className="w-full flex-1 min-h-0">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="min-h-0 flex flex-col">
        <hr className="w-full border-white/10 shrink-0" />

        <div className="flex items-center w-full gap-4 py-2 mt-4">
          <span style={{ color }}>
            <Sticker size={18} />
          </span>

          <h2 className="w-full text-md font-medium text-left">
            {footerHeader}
          </h2>
        </div>

        <p className="text-xs px-8 text-[var(--muted-foreground)] tracking-wide">
          {footerText}
        </p>
      </div>
    </div>
  );
}
