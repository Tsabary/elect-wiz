import { cn } from "@/lib/utils";

/** Visual progress bar; the textual progress ("4 of 8") is announced separately. */
export function ProgressBar({ value, max }: { value: number; max: number }) {
  // One segment per question, filled up to the current one.
  return (
    <div aria-hidden="true" className="flex w-full gap-1">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={cn("h-1.5 flex-1 rounded-full", i < value ? "bg-primary" : "bg-foreground/15")}
        />
      ))}
    </div>
  );
}
