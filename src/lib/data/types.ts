/** Shapes of the Firestore documents (timestamps converted to epoch millis on read). */
export type Role = "user" | "admin" | "subadmin";
export type UserStatus = "pending_verification" | "active" | "suspended" | "restricted" | "closed";
export type KycStatus = "none" | "pending" | "approved" | "rejected";
export type TxType = "deposit" | "withdrawal" | "transfer_in" | "transfer_out" | "admin_credit" | "admin_debit";
export type TxStatus = "pending" | "processing" | "completed" | "rejected" | "failed";
export type Method = "crypto" | "bank" | "internal" | "admin";

export type BankDetails = {
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: "checking" | "savings";
  holderName: string;
};

export type SavedAddress = { id: string; label: string; asset: string; network: string; address: string };
export type SavedBank = BankDetails & { id: string; label: string };

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  role: Role;
  status: UserStatus;
  kycStatus: KycStatus;
  kycFiles?: string[];
  tier?: string;
  requirePin?: boolean;
  balances?: Record<string, number>;
  locked?: Record<string, number>;
  notifications?: { email: boolean; product: boolean };
  savedAddresses?: SavedAddress[];
  savedBanks?: SavedBank[];
  createdAt: number | null;
  lastLoginAt: number | null;
};

export type Asset = { symbol: string; balance: number; locked: number };

export type Transaction = {
  id: string;
  uid: string;
  userEmail?: string;
  type: TxType;
  asset: string;
  amount: number;
  usdValue: number;
  fee: number;
  status: TxStatus;
  method: Method;
  network?: string;
  address?: string;
  bankDetails?: BankDetails;
  txHash?: string;
  reference?: string;
  counterparty?: string;
  note?: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
};

/** Deposit / withdrawal review queue item; shares its id with the matching transaction. */
export type MoneyRequest = {
  id: string;
  uid: string;
  userEmail: string;
  userName: string;
  asset: string;
  amount: number;
  fee: number;
  method: "crypto" | "bank";
  network?: string;
  address?: string;
  bankDetails?: BankDetails;
  txHash?: string;
  reference?: string;
  status: TxStatus;
  reviewedBy?: string;
  note?: string;
  createdAt: number;
  updatedAt: number;
};

export type ActivityLog = {
  id: string;
  uid: string;
  action: string;
  ip: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
};

export type AdminLog = {
  id: string;
  adminId: string;
  adminEmail: string;
  targetUid: string | null;
  action: string;
  before: unknown;
  after: unknown;
  note: string;
  createdAt: number;
};

export type PlatformSettings = {
  /** wallets[symbol][network] = company deposit address */
  wallets: Record<string, Record<string, string>>;
  bank: {
    bankName: string;
    accountName: string;
    routingNumber: string;
    accountNumber: string;
    swift: string;
    bankAddress: string;
    instructions: string;
  };
  fees: {
    /** % of amount charged on crypto and bank withdrawals */
    withdrawalPercent: number;
    /** flat fee per asset, in that asset */
    withdrawalFlat: Record<string, number>;
    internalTransferPercent: number;
  };
  limits: { minDepositUsd: number; minWithdrawalUsd: number; dailyWithdrawalUsd: number };
  enabledAssets: string[];
  maintenanceMode: boolean;
};

export type Ticket = {
  id: string;
  uid: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  status: "open" | "resolved";
  reply?: string;
  createdAt: number;
};

export type AppNotification = { id: string; title: string; body: string; read: boolean; createdAt: number };
