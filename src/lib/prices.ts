import { queryOptions } from "@tanstack/react-query";
import { COINS } from "./coins";

export type CoinPrice = { usd: number; usd_24h_change: number };
export type PriceMap = Record<string, CoinPrice>;

/** Live prices from CoinGecko's public API, keyed by coin symbol. */
export async function fetchPrices(): Promise<PriceMap> {
  const ids = COINS.map((c) => c.geckoId).join(",");
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
  );
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  const data = (await res.json()) as Record<string, CoinPrice>;
  const out: PriceMap = {};
  for (const c of COINS) {
    const p = data[c.geckoId];
    if (p) out[c.symbol] = p;
  }
  return out;
}

export const pricesQuery = queryOptions({
  queryKey: ["prices"],
  queryFn: fetchPrices,
  refetchInterval: 60_000,
  staleTime: 30_000,
  retry: 1,
});

export function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 1 ? 4 : 2,
  }).format(n);
}
