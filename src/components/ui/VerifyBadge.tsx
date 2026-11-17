import { site } from "@/content/site";

/** Marks content a human still has to confirm. Only visible in demo mode. */
export function VerifyBadge({ label }: { label: string }) {
  if (!site.demo) return null;
  return (
    <span className="ml-2 inline-block rounded-full border border-coral/60 px-2 py-0.5 align-middle text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-coral-deep">
      {label}
    </span>
  );
}
