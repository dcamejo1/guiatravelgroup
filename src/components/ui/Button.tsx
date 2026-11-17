import type { ComponentProps } from "react";
import { Link } from "@/lib/i18n/navigation";

type Variant = "primary" | "outline" | "outline-light" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-[background-color,color,border-color,transform] duration-300 ease-soft active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Coral is reserved for the one primary action on screen.
  primary: "bg-coral text-ocean hover:bg-coral-deep",
  outline:
    "border border-ocean/25 text-ocean hover:border-ocean hover:bg-ocean hover:text-ivory",
  "outline-light":
    "border border-ivory/50 text-ivory hover:border-ivory hover:bg-ivory hover:text-ocean",
  ghost: "text-ocean underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-[0.9375rem]",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className = "",
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

type Shared = { variant?: Variant; size?: Size };

export function Button({
  variant,
  size,
  className,
  ...props
}: Shared & ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: Shared & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props} />
  );
}

/** For links that leave the site, such as WhatsApp. */
export function ButtonAnchor({
  variant,
  size,
  className,
  ...props
}: Shared & ComponentProps<"a">) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}
