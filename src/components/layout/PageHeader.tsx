import type { ReactNode } from "react";

/** The opening block of a text-led page: eyebrow, large title, optional intro. */
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="shell pb-14 pt-36 lg:pb-20 lg:pt-48">
      <p className="eyebrow text-lagoon">{eyebrow}</p>
      <h1 className="display mt-4 max-w-5xl text-5xl md:text-7xl lg:text-8xl">
        {title}
      </h1>
      {children && (
        <div className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
          {children}
        </div>
      )}
    </header>
  );
}
