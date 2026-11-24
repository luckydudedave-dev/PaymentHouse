/**
 * Sample data shown only in preview mode (no Firebase config yet). Built inside functions
 * — never at module scope — so the edge worker never computes it during global init.
 */
import type {
  ActivityLog, AdminLog, AppNotification, Asset, MoneyRequest, PlatformSettings, Ticket, Transaction, UserProfile,
} from "./types";
import { DEFAULT_SETTINGS } from "./assets";

export const DEMO_UID = "demo-user";
const H = 3_600_000;
const D = 24 * H;
const now = () => Date.now();

export function demoProfile(): UserProfile {
  return {
    uid: DEMO_UID, name: "Alex Morgan", email: "alex@example.com", phone: "+1 555 010 2030", country: "United States",
    role: "admin", status: "active", kycStatus: "approved", tier: "standard", requirePin: false,
    balances: { BTC: 0.4821, ETH: 3.215, USDT: 2450, SOL: 18.4, USD: 1200 },
    notifications: { email: true, product: false },
    savedAddresses: [{ id: "a1", label: "Ledger BTC", asset: "BTC", network: "Bitcoin", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" }],
    savedBanks: [{ id: "b1", label: "Chase checking", bankName: "Chase", routingNumber: "021000021", accountNumber: "****4321", accountType: "checking", holderName: "Alex Morgan" }],
    createdAt: now() - 90 * D, lastLoginAt: now() - 2 * H,
  };
}

export function demoAssets(): Asset[] {
  return [
    { symbol: "BTC", balance: 0.4821, locked: 0 },
    { symbol: "ETH", balance: 3.215, locked: 0.1 },
    { symbol: "USDT", balance: 2450, locked: 0 },
    { symbol: "SOL", balance: 18.4, locked: 0 },
    { symbol: "USD", balance: 1200, locked: 0 },
  ];
}

export function demoTransactions(): Transaction[] {
  const rows: [Transaction["type"], string, number, number, Transaction["status"], Transaction["method"], number][] = [
    ["deposit", "BTC", 0.25, 16250, "completed", "crypto", 3 * H],
    ["withdrawal", "ETH", 0.1, 340, "pending", "crypto", 6 * H],
    ["transfer_in", "USDT", 500, 500, "completed", "internal", 1 * D],
    ["deposit", "USD", 1200, 1200, "completed", "bank", 2 * D],
    ["transfer_out", "USDT", 150, 150, "completed", "internal", 3 * D],
    ["deposit", "SOL", 18.4, 2760, "completed", "crypto", 5 * D],
    ["admin_credit", "USDT", 100, 100, "completed", "admin", 8 * D],
    ["withdrawal", "BTC", 0.05, 3250, "rejected", "crypto", 12 * D],
    ["deposit", "ETH", 3.315, 11270, "completed", "crypto", 20 * D],
    ["deposit", "BTC", 0.2821, 18340, "completed", "crypto", 30 * D],
  ];
  return rows.map(([type, asset, amount, usdValue, status, method, ago], i) => ({
    id: `demo-tx-${i + 1}`, uid: DEMO_UID, userEmail: "alex@example.com", type, asset, amount, usdValue,
    fee: type === "withdrawal" ? amount * 0.005 : 0, status, method,
    ...(method === "crypto" ? { network: asset === "ETH" ? "ERC-20" : asset === "SOL" ? "Solana" : "Bitcoin", txHash: `0x${(i + 7).toString(16).repeat(16)}` } : {}),
    ...(method === "internal" ? { counterparty: type === "transfer_in" ? "sam@example.com" : "jordan@example.com" } : {}),
    ...(method === "bank" ? { reference: "PH-7F2K9Q" } : {}),
    createdBy: DEMO_UID, createdAt: now() - ago, updatedAt: now() - ago,
  }));
}

export function demoUsers(): UserProfile[] {
  const base = demoProfile();
  const people: [string, string, UserProfile["status"], UserProfile["kycStatus"], Record<string, number>, number][] = [
    ["Sam Rivera", "sam@example.com", "active", "approved", { BTC: 1.2, USDT: 8000 }, 40],
    ["Jordan Lee", "jordan@example.com", "active", "pending", { ETH: 6.5 }, 20],
    ["Priya Shah", "priya@example.com", "pending_verification", "none", {}, 2],
    ["Chris Novak", "chris@example.com", "suspended", "rejected", { USD: 300 }, 60],
    ["Maria Gomez", "maria@example.com", "active", "approved", { SOL: 120, USDC: 4000 }, 75],
  ];
  return [
    { ...base, role: "user" },
    ...people.map(([name, email, status, kycStatus, balances, days], i) => ({
      uid: `demo-u${i + 2}`, name, email, phone: "+1 555 000 00" + (10 + i), country: "United States",
      role: "user" as const, status, kycStatus, tier: "standard", balances,
      createdAt: now() - days * D, lastLoginAt: now() - (i + 1) * 5 * H,
    })),
  ];
}

function req(i: number, kind: "deposit" | "withdrawal", status: MoneyRequest["status"], asset: string, amount: number, ago: number, method: "crypto" | "bank" = "crypto"): MoneyRequest {
  const u = demoUsers()[i % 5]!;
  return {
    id: `demo-${kind}-${i}`, uid: u.uid, userEmail: u.email, userName: u.name, asset, amount,
    fee: kind === "withdrawal" ? amount * 0.005 : 0, method, status,
    ...(method === "crypto" ? { network: asset === "ETH" ? "ERC-20" : "Bitcoin" } : {}),
    ...(kind === "deposit" && method === "crypto" ? { txHash: `0x${(i + 3).toString(16).repeat(20)}` } : {}),
    ...(kind === "withdrawal" && method === "crypto" ? { address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq" } : {}),
    ...(method === "bank" ? { reference: "PH-" + (1000 + i), ...(kind === "withdrawal" ? { bankDetails: { bankName: "Wells Fargo", routingNumber: "121000248", accountNumber: "****8890", accountType: "checking" as const, holderName: u.name } } : {}) } : {}),
    createdAt: now() - ago, updatedAt: now() - ago,
  };
}

export function demoDepositRequests(): MoneyRequest[] {
  return [req(1, "deposit", "pending", "BTC", 0.15, 2 * H), req(2, "deposit", "pending", "USD", 2500, 5 * H, "bank"), req(3, "deposit", "completed", "ETH", 2, 2 * D)];
}
export function demoWithdrawalRequests(): MoneyRequest[] {
  return [req(0, "withdrawal", "pending", "ETH", 0.1, 6 * H), req(4, "withdrawal", "processing", "USD", 900, 1 * D, "bank"), req(1, "withdrawal", "completed", "BTC", 0.3, 4 * D)];
}

export function demoActivity(): ActivityLog[] {
  return ["login", "deposit_requested", "login", "password_changed", "login"].map((action, i) => ({
    id: `demo-act-${i}`, uid: DEMO_UID, action, ip: `203.0.113.${10 + i}`,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Chrome/131", createdAt: now() - (i * 9 + 2) * H,
  }));
}

export function demoAdminLogs(): AdminLog[] {
  return [
    { id: "l1", adminId: DEMO_UID, adminEmail: "alex@example.com", targetUid: "demo-u2", action: "deposit_approved", before: { status: "pending" }, after: { status: "completed" }, note: "Confirmed on-chain", createdAt: now() - 3 * H },
    { id: "l2", adminId: DEMO_UID, adminEmail: "alex@example.com", targetUid: "demo-u5", action: "user_status_changed", before: { status: "active" }, after: { status: "suspended" }, note: "Chargeback investigation", createdAt: now() - 1 * D },
    { id: "l3", adminId: DEMO_UID, adminEmail: "alex@example.com", targetUid: DEMO_UID, action: "admin_credit", before: { USDT: 2350 }, after: { USDT: 2450 }, note: "Promo bonus", createdAt: now() - 8 * D },
  ];
}

export function demoSettings(): PlatformSettings {
  return {
    ...DEFAULT_SETTINGS,
    wallets: {
      BTC: { Bitcoin: "bc1qdemo0address0replace0in0admin0settings" },
      ETH: { "ERC-20": "0xDEMO000000000000000000000000000000000000" },
      USDT: { "TRC-20": "TDEMOaddressReplaceInAdminSettings00", "ERC-20": "0xDEMO000000000000000000000000000000000000" },
    },
    bank: { ...DEFAULT_SETTINGS.bank, bankName: "Demo Bank N.A.", routingNumber: "000000000", accountNumber: "000123456789", swift: "DEMOUS33", bankAddress: "1 Example Plaza, New York, NY" },
    fees: { withdrawalPercent: 0.5, withdrawalFlat: { BTC: 0.0002, ETH: 0.002, USDT: 1, USD: 5 }, internalTransferPercent: 0 },
  };
}

export function demoTickets(): Ticket[] {
  return [
    { id: "t1", uid: DEMO_UID, email: "alex@example.com", subject: "Withdrawal still pending", category: "withdrawal", message: "My ETH withdrawal has been pending for 6 hours.", status: "open", createdAt: now() - 4 * H },
    { id: "t2", uid: "demo-u3", email: "jordan@example.com", subject: "KYC document question", category: "account", message: "Can I upload a passport instead?", status: "resolved", reply: "Yes, a passport works.", createdAt: now() - 3 * D },
  ];
}

export function demoNotifications(): AppNotification[] {
  return [
    { id: "n1", title: "Deposit confirmed", body: "0.25 BTC was added to your balance.", read: false, createdAt: now() - 3 * H },
    { id: "n2", title: "You received USDT", body: "sam@example.com sent you 500 USDT.", read: true, createdAt: now() - 1 * D },
  ];
}
