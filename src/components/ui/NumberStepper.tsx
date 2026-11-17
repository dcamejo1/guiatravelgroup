"use client";

/** A − / + control for small whole numbers such as travelers or nights. */
export function NumberStepper({
  label,
  value,
  min = 0,
  max = 99,
  onChange,
  decreaseLabel,
  increaseLabel,
  size = "md",
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
  size?: "sm" | "md";
}) {
  const button = `grid place-items-center rounded-full border border-ocean/25 text-lg leading-none transition-colors hover:border-ocean hover:bg-ocean hover:text-ivory disabled:pointer-events-none disabled:opacity-30 ${
    size === "sm" ? "size-8" : "size-10"
  }`;
  return (
    <div role="group" aria-label={label} className="flex items-center gap-3">
      <button
        type="button"
        className={button}
        aria-label={decreaseLabel}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <output
        aria-live="polite"
        className={`text-center font-display tabular-nums ${size === "sm" ? "w-6 text-lg" : "w-8 text-2xl"}`}
      >
        {value}
      </output>
      <button
        type="button"
        className={button}
        aria-label={increaseLabel}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
