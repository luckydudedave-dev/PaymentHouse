import { COINS } from "@/lib/coins";
import type { PlatformSettings } from "./types";

/** Every balance a wallet can hold: the 8 coins plus US dollars (bank deposits/withdrawals). */
export const ASSET_SYMBOLS = [...COINS.map((c) => c.symbol), "USD"] as const;
export const CRYPTO_SYMBOLS = COINS.map((c) => c.symbol);

export function assetName(symbol: string) {
  if (symbol === "USD") return "US Dollar";
  return COINS.find((c) => c.symbol === symbol)?.name ?? symbol;
}

export function networksFor(symbol: string) {
  return COINS.find((c) => c.symbol === symbol)?.networks ?? [];
}

/** USD price per unit; USD itself is 1, stablecoins fall back to 1 while prices load. */
export function unitPrice(symbol: string, prices: Record<string, number>) {
  if (symbol === "USD") return 1;
  const p = prices[symbol];
  if (p !== undefined) return p;
  return symbol === "USDT" || symbol === "USDC" ? 1 : 0;
}

/**
 * Withdrawal fee in the withdrawn asset: flat per-asset fee + percentage of the amount.
 * Mirrors feeFor() in functions/src/index.ts — the server value is the one charged.
 */
export function withdrawalFee(amount: number, symbol: string, fees: PlatformSettings["fees"]) {
  const flat = fees.withdrawalFlat[symbol] ?? 0;
  const pct = (amount * fees.withdrawalPercent) / 100;
  return round8(flat + pct);
}

export function round8(n: number) {
  return Math.round(n * 1e8) / 1e8;
}

export function formatAmount(n: number, symbol: string) {
  const digits = symbol === "USD" || symbol === "USDT" || symbol === "USDC" ? 2 : 8;
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(n)} ${symbol}`;
}

export const DEFAULT_SETTINGS: PlatformSettings = {
  wallets: {},
  bank: {
    bankName: "",
    accountName: "PaymentHouse Inc.",
    routingNumber: "",
    accountNumber: "",
    swift: "",
    bankAddress: "",
    instructions: "Include your PaymentHouse reference code in the transfer memo.",
  },
  fees: { withdrawalPercent: 0.5, withdrawalFlat: {}, internalTransferPercent: 0 },
  limits: { minDepositUsd: 10, minWithdrawalUsd: 20, dailyWithdrawalUsd: 50000 },
  enabledAssets: [...ASSET_SYMBOLS],
  maintenanceMode: false,
};
