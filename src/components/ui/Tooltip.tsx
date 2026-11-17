"use client";

import { useId, useState, type ReactNode } from "react";

/** A quiet "i" that reveals a short note on hover, focus or tap. */
export function Tooltip({
  label,
  children,
}: {
  /** Accessible name of the trigger, e.g. "More about transport". */
  label: string;
  children: ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="grid size-5 place-items-center rounded-full border border-ocean/30 font-display text-xs italic text-muted transition-colors hover:border-ocean hover:text-ocean"
      >
        i
      </button>
      <span
        id={id}
        role="tooltip"
        className={`absolute bottom-full left-1/2 z-20 mb-2 w-60 -translate-x-1/2 rounded-md bg-ocean px-3.5 py-2.5 text-xs leading-relaxed text-ivory shadow-lg transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {children}
      </span>
    </span>
  );
}
