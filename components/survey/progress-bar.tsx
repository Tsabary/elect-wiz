/** Visual progress bar; the textual progress ("4 of 8") is announced separately. */
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div aria-hidden="true" className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
      <div
        className="bg-foreground h-full rounded-full transition-[width]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
