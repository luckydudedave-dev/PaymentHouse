/** Read hooks for every dashboard screen. Writes go through Cloud Functions (callFn). */
import { useQuery } from "@tanstack/react-query";
import type { QueryConstraint } from "firebase/firestore";
import { pricesQuery } from "@/lib/prices";
import { useLive, plain } from "./live";
import * as demo from "./demo";
import { DEFAULT_SETTINGS } from "./assets";
import type {
  ActivityLog, AdminLog, AppNotification, Asset, MoneyRequest, PlatformSettings, Ticket, Transaction, UserProfile,
} from "./types";

export function useProfile(uid: string | undefined) {
  return useLive<UserProfile | null>(
    uid ? `profile:${uid}` : null,
    (fs, db, emit, fail) => fs.onSnapshot(fs.doc(db, "users", uid!), (s) => emit(s.exists() ? { ...plain<UserProfile>(s.id, s.data()), uid: s.id } : null), fail),
    () => (uid === demo.DEMO_UID ? demo.demoProfile() : demo.demoUsers().find((u) => u.uid === uid) ?? null),
  );
}

export function useAssets(uid: string | undefined) {
  return useLive<Asset[]>(
    uid ? `assets:${uid}` : null,
    (fs, db, emit, fail) =>
      fs.onSnapshot(
        fs.collection(db, "wallets", uid!, "assets"),
        (s) => emit(s.docs.map((d) => ({ symbol: d.id, balance: Number(d.data()["balance"] ?? 0), locked: Number(d.data()["locked"] ?? 0) }))),
        fail,
      ),
    () => {
      if (uid === demo.DEMO_UID) return demo.demoAssets();
      const u = demo.demoUsers().find((x) => x.uid === uid);
      return Object.entries(u?.balances ?? {}).map(([symbol, balance]) => ({ symbol, balance, locked: 0 }));
    },
  );
}

/** Transactions for one user (uid) or the whole platform (uid = "all", staff only). */
export function useTransactions(uid: string | undefined, max = 500) {
  return useLive<Transaction[]>(
    uid ? `tx:${uid}:${max}` : null,
    (fs, db, emit, fail) => {
      const cons: QueryConstraint[] = [fs.orderBy("createdAt", "desc"), fs.limit(max)];
      if (uid !== "all") cons.unshift(fs.where("uid", "==", uid));
      return fs.onSnapshot(fs.query(fs.collection(db, "transactions"), ...cons), (s) => emit(s.docs.map((d) => plain<Transaction>(d.id, d.data()))), fail);
    },
    () => {
      const all = demo.demoTransactions();
      return uid === "all" || uid === demo.DEMO_UID ? all : all.slice(0, 3).map((t) => ({ ...t, uid: uid! }));
    },
  );
}

export function useRequests(kind: "deposit" | "withdrawal", uid?: string) {
  const col = kind === "deposit" ? "depositRequests" : "withdrawalRequests";
  return useLive<MoneyRequest[]>(
    `${col}:${uid ?? "all"}`,
    (fs, db, emit, fail) => {
      const cons: QueryConstraint[] = [fs.orderBy("createdAt", "desc"), fs.limit(300)];
      if (uid) cons.unshift(fs.where("uid", "==", uid));
      return fs.onSnapshot(fs.query(fs.collection(db, col), ...cons), (s) => emit(s.docs.map((d) => plain<MoneyRequest>(d.id, d.data()))), fail);
    },
    () => (kind === "deposit" ? demo.demoDepositRequests() : demo.demoWithdrawalRequests()),
  );
}

export function useUsers(enabled = true) {
  return useLive<UserProfile[]>(
    enabled ? "users:all" : null,
    (fs, db, emit, fail) =>
      fs.onSnapshot(fs.query(fs.collection(db, "users"), fs.orderBy("createdAt", "desc"), fs.limit(1000)), (s) => emit(s.docs.map((d) => ({ ...plain<UserProfile>(d.id, d.data()), uid: d.id }))), fail),
    () => demo.demoUsers(),
  );
}

export function useActivity(uid?: string) {
  return useLive<ActivityLog[]>(
    `activity:${uid ?? "all"}`,
    (fs, db, emit, fail) => {
      const cons: QueryConstraint[] = [fs.orderBy("createdAt", "desc"), fs.limit(200)];
      if (uid) cons.unshift(fs.where("uid", "==", uid));
      return fs.onSnapshot(fs.query(fs.collection(db, "activityLogs"), ...cons), (s) => emit(s.docs.map((d) => plain<ActivityLog>(d.id, d.data()))), fail);
    },
    () => demo.demoActivity(),
  );
}

export function useAdminLogs(targetUid?: string) {
  return useLive<AdminLog[]>(
    `adminLogs:${targetUid ?? "all"}`,
    (fs, db, emit, fail) => {
      const cons: QueryConstraint[] = [fs.orderBy("createdAt", "desc"), fs.limit(500)];
      if (targetUid) cons.unshift(fs.where("targetUid", "==", targetUid));
      return fs.onSnapshot(fs.query(fs.collection(db, "adminLogs"), ...cons), (s) => emit(s.docs.map((d) => plain<AdminLog>(d.id, d.data()))), fail);
    },
    () => demo.demoAdminLogs(),
  );
}

export function useSettings() {
  const live = useLive<PlatformSettings>(
    "settings",
    (fs, db, emit, fail) =>
      fs.onSnapshot(fs.doc(db, "settings", "platform"), (s) => {
        const d = (s.data() ?? {}) as Partial<PlatformSettings>;
        emit({ ...DEFAULT_SETTINGS, ...d, bank: { ...DEFAULT_SETTINGS.bank, ...d.bank }, fees: { ...DEFAULT_SETTINGS.fees, ...d.fees }, limits: { ...DEFAULT_SETTINGS.limits, ...d.limits } });
      }, fail),
    () => demo.demoSettings(),
  );
  return live;
}

export function useTickets(uid?: string) {
  return useLive<Ticket[]>(
    `tickets:${uid ?? "all"}`,
    (fs, db, emit, fail) => {
      const cons: QueryConstraint[] = [fs.orderBy("createdAt", "desc"), fs.limit(200)];
      if (uid) cons.unshift(fs.where("uid", "==", uid));
      return fs.onSnapshot(fs.query(fs.collection(db, "tickets"), ...cons), (s) => emit(s.docs.map((d) => plain<Ticket>(d.id, d.data()))), fail);
    },
    () => (uid ? demo.demoTickets().filter((t) => t.uid === uid) : demo.demoTickets()),
  );
}

export function useNotifications(uid: string | undefined) {
  return useLive<AppNotification[]>(
    uid ? `notif:${uid}` : null,
    (fs, db, emit, fail) =>
      fs.onSnapshot(fs.query(fs.collection(db, "notifications", uid!, "items"), fs.orderBy("createdAt", "desc"), fs.limit(30)), (s) => emit(s.docs.map((d) => plain<AppNotification>(d.id, d.data()))), fail),
    () => demo.demoNotifications(),
  );
}

/** symbol → USD price, from the live CoinGecko feed. */
export function usePriceMap() {
  const q = useQuery(pricesQuery);
  const map: Record<string, number> = {};
  const change: Record<string, number> = {};
  for (const [k, v] of Object.entries(q.data ?? {})) {
    map[k] = v.usd;
    change[k] = v.usd_24h_change;
  }
  return { prices: map, change, loading: q.isLoading };
}
