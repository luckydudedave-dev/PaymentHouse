import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp } from "lucide-react";
import { COINS } from "@/lib/coins";
import { formatUsd, pricesQuery } from "@/lib/prices";
import { CoinAvatar } from "@/components/common/CoinAvatar";
import { cn } from "@/lib/utils";

/** Infinite scrolling live price band (CoinGecko). */
export function PriceTicker() {
  const { data, isError } = useQuery(pricesQuery);
  const items = [...COINS, ...COINS];

  return (
    <div
      className="relative overflow-hidden border-y border-navy-border bg-navy-elevated py-3"
      aria-label="Live crypto prices"
    >
      <div className="flex w-max animate-marquee gap-10 pr-10 hover:[animation-play-state:paused]">
        {items.map((c, i) => {
          const p = data?.[c.symbol];
          const up = (p?.usd_24h_change ?? 0) >= 0;
          return (
            <div key={`${c.symbol}-${i}`} className="flex items-center gap-3 text-sm" aria-hidden={i >= COINS.length}>
              <CoinAvatar symbol={c.symbol} className="h-7 w-7 text-[9px]" />
              <span className="font-semibold text-navy-foreground">{c.symbol}</span>
              <span className="tabular-nums text-navy-muted">
                {p ? formatUsd(p.usd) : isError ? "—" : "Loading…"}
              </span>
              {p && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 tabular-nums text-xs font-semibold",
                    up ? "text-success" : "text-destructive",
                  )}
                >
                  {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {p.usd_24h_change.toFixed(2)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
