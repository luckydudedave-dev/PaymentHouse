/** Supported assets. `geckoId` is the CoinGecko API id used for live prices. */
export type Coin = {
  symbol: string;
  name: string;
  geckoId: string;
  networks: string[];
  /** Brand hue (oklch hue angle) used for the coin's avatar tint. */
  hue: number;
};

export const COINS: Coin[] = [
  { symbol: "BTC", name: "Bitcoin", geckoId: "bitcoin", networks: ["Bitcoin"], hue: 60 },
  { symbol: "ETH", name: "Ethereum", geckoId: "ethereum", networks: ["ERC-20"], hue: 275 },
  { symbol: "USDT", name: "Tether", geckoId: "tether", networks: ["TRC-20", "ERC-20", "BEP-20"], hue: 165 },
  { symbol: "USDC", name: "USD Coin", geckoId: "usd-coin", networks: ["ERC-20", "Solana", "Base"], hue: 250 },
  { symbol: "BNB", name: "BNB", geckoId: "binancecoin", networks: ["BEP-20"], hue: 85 },
  { symbol: "SOL", name: "Solana", geckoId: "solana", networks: ["Solana"], hue: 300 },
  { symbol: "XRP", name: "XRP", geckoId: "ripple", networks: ["XRP Ledger"], hue: 240 },
  { symbol: "LTC", name: "Litecoin", geckoId: "litecoin", networks: ["Litecoin"], hue: 255 },
];

export const COIN_BY_SYMBOL = Object.fromEntries(COINS.map((c) => [c.symbol, c]));
