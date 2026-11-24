import { cn } from "@/lib/utils";
import { COIN_BY_SYMBOL } from "@/lib/coins";

/** Tinted circle with the coin's ticker initials; hue comes from the coin catalog. */
export function CoinAvatar({ symbol, className }: { symbol: string; className?: string }) {
  const hue = COIN_BY_SYMBOL[symbol]?.hue ?? 265;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
        className,
      )}
      style={{
        backgroundColor: `oklch(0.94 0.05 ${hue})`,
        color: `oklch(0.45 0.16 ${hue})`,
      }}
    >
      {symbol.slice(0, 4)}
    </span>
  );
}
