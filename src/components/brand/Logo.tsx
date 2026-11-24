import { cn } from "@/lib/utils";

/** House + shield brand mark. Uses currentColor for the house, primary for the shield. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={cn("h-9 w-9", className)}>
      <rect width="40" height="40" rx="10" className="fill-primary" />
      <path
        d="M20 8.5 9.5 16.4V30a1.5 1.5 0 0 0 1.5 1.5h18a1.5 1.5 0 0 0 1.5-1.5V16.4L20 8.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        className="text-primary-foreground"
      />
      <path
        d="M20 15.5c2 1.3 3.8 1.8 5.5 1.9v4.1c0 3.5-2.4 5.9-5.5 6.9-3.1-1-5.5-3.4-5.5-6.9v-4.1c1.7-.1 3.5-.6 5.5-1.9Z"
        className="fill-primary-foreground"
      />
      <path
        d="m17.6 21.7 1.7 1.7 3.2-3.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
    </svg>
  );
}

/** Wordmark: mark + "PaymentHouse". `tone="light"` for dark backgrounds. */
export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cn(
          "text-lg font-bold tracking-tight",
          tone === "light" ? "text-navy-foreground" : "text-foreground",
        )}
      >
        Payment<span className="text-primary">House</span>
      </span>
    </span>
  );
}
