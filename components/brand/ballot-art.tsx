import { cn } from "@/lib/utils";

/**
 * The site's picture: a ballot slip rising out of the blue voting envelope.
 * The slip carries a question mark, never a list's letters, so the picture
 * stands for the choice and for no party. Decorative: hidden from assistive
 * technology.
 *
 * Sized in `em`: set the font size on it (or a parent) to scale the drawing.
 */
export function BallotArt({
  className,
  animate = false,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative h-[15em] w-[13em] shrink-0 select-none",
        className,
      )}
    >
      {/* Drawn the same way round in both directions. */}
      <div dir="ltr" className="absolute inset-0">
        {/* The envelope's back and open flap. */}
        <div className="absolute inset-x-0 bottom-0 h-[7.2em] rotate-3 rounded-[0.2em] bg-[oklch(0.33_0.17_263)]" />
        <div
          className="absolute inset-x-[0.2em] bottom-[6.6em] h-[3.4em] origin-bottom rotate-3 bg-[oklch(0.33_0.17_263)]"
          style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }}
        />
        {/* A blank slip behind, and the slip in hand. */}
        <div className="bg-paper absolute start-[4.4em] top-[1.6em] h-[9.4em] w-[6.8em] rotate-[9deg] rounded-[0.12em] border border-neutral-800/70" />
        <div
          className={cn(
            "absolute start-[2.5em] top-0 h-[10.4em] w-[7.4em]",
            animate && "slip-rise",
          )}
        >
          <div className="bg-paper flex size-full -rotate-6 flex-col items-center rounded-[0.12em] border-[0.09em] border-neutral-900 pt-[0.7em] text-black shadow-[0_0.5em_1.2em_-0.5em_rgb(10_20_50/0.45)]">
            <span className="font-sans text-[5.4em] leading-none font-black">?</span>
            <span className="mt-[0.5em] h-[0.16em] w-[3.6em] bg-neutral-900/80" />
            <span className="mt-[0.3em] h-[0.16em] w-[2.4em] bg-neutral-900/80" />
          </div>
        </div>
        {/* The envelope's front, over the slip. */}
        <div className="bg-primary absolute inset-x-0 bottom-0 h-[6.6em] rotate-3 overflow-hidden rounded-[0.2em] shadow-[0_0.9em_1.4em_-0.9em_rgb(10_20_50/0.6)]">
          <svg
            viewBox="0 0 130 66"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
          >
            <path
              d="M0 0 L65 34 L130 0"
              fill="none"
              stroke="rgb(255 255 255 / 0.28)"
              strokeWidth="1.2"
            />
          </svg>
          <div className="absolute start-[0.9em] bottom-[0.8em] flex flex-col gap-[0.22em]">
            <span className="h-[0.2em] w-[2.6em] bg-white/85" />
            <span className="h-[0.2em] w-[2.6em] bg-white/85" />
          </div>
        </div>
      </div>
    </div>
  );
}
