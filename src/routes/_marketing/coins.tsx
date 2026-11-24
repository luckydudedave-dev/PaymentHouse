import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/marketing/PageHeader";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { CoinAvatar } from "@/components/common/CoinAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { COINS } from "@/lib/coins";
import { formatUsd, pricesQuery } from "@/lib/prices";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_marketing/coins")({
  head: () => pageMeta("Supported coins", "Live prices and supported networks for BTC, ETH, USDT, USDC, BNB, SOL, XRP and LTC."),
  component: CoinsPage,
});

function CoinsPage() {
  const { data, isLoading, isError } = useQuery(pricesQuery);

  return (
    <>
      <PageHeader
        eyebrow="Supported coins"
        title="Live prices & networks"
        description="Deposit and withdraw the world's most used digital assets. Prices update every minute."
      />
      <section className="py-20">
        <div className="container-page">
          {isError && (
            <p role="alert" className="mb-4 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
              Live prices are temporarily unavailable. Please try again shortly.
            </p>
          )}
          <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-surface text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">Asset</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Price</th>
                    <th scope="col" className="px-6 py-4 font-semibold">24h</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Networks</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {COINS.map((c) => {
                    const p = data?.[c.symbol];
                    const up = (p?.usd_24h_change ?? 0) >= 0;
                    return (
                      <tr key={c.symbol} className="transition-colors hover:bg-surface/60">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <CoinAvatar symbol={c.symbol} />
                            <div>
                              <p className="font-semibold">{c.name}</p>
                              <p className="text-xs text-muted-foreground">{c.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold tabular-nums">
                          {isLoading ? <Skeleton className="h-4 w-20" /> : p ? formatUsd(p.usd) : "—"}
                        </td>
                        <td className={cn("px-6 py-4 font-semibold tabular-nums", up ? "text-success" : "text-destructive")}>
                          {isLoading ? <Skeleton className="h-4 w-12" /> : p ? `${up ? "+" : ""}${p.usd_24h_change.toFixed(2)}%` : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {c.networks.map((n) => (
                              <Badge key={n} variant="info">{n}</Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Price data provided by CoinGecko.</p>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
