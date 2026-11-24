/** Calls PaymentHouse Cloud Functions (functions/src/index.ts). All money moves go through here. */
import { functionsRegion, isDemoMode } from "./config";

export class DemoModeError extends Error {
  constructor() {
    super("Preview mode — connect Firebase to submit real requests.");
  }
}

export type FnName =
  | "createDepositRequest" | "adminApproveDeposit" | "createWithdrawalRequest" | "adminProcessWithdrawal"
  | "adminFundUser" | "adminPlaceWithdrawal" | "sendInternalTransfer" | "adminUpdateUserStatus"
  | "setUserRole" | "logActivity" | "submitKyc" | "setTransactionPin" | "adminUpdateSettings" | "adminLogAction";

export async function callFn<Res = unknown>(name: FnName, data: Record<string, unknown>): Promise<Res> {
  if (isDemoMode) throw new DemoModeError();
  const [{ getFunctions, httpsCallable }, { firebaseApp }] = await Promise.all([
    import("firebase/functions"),
    import("./client"),
  ]);
  const fn = httpsCallable<Record<string, unknown>, Res>(getFunctions(firebaseApp(), functionsRegion), name);
  const res = await fn(data);
  return res.data;
}

/** Fire-and-forget activity log (login, logout, password change …). Never blocks the UI. */
export function logActivity(action: string, metadata?: Record<string, unknown>) {
  if (isDemoMode) return;
  callFn("logActivity", { action, ...(metadata ? { metadata } : {}) }).catch(() => undefined);
}
