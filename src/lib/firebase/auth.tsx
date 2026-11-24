/**
 * Auth state for the whole app. Firebase is loaded inside an effect, so server rendering
 * never touches it. Role comes from the verified ID-token custom claim (`role`), which only
 * Cloud Functions / the Admin SDK can set.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isDemoMode } from "./config";
import { logActivity } from "./functions";
import { DEMO_UID } from "@/lib/data/demo";
import type { Role } from "@/lib/data/types";

export type AuthUser = { uid: string; email: string; displayName: string; emailVerified: boolean };
type AuthState = {
  status: "loading" | "signed_out" | "signed_in";
  demo: boolean;
  user: AuthUser | null;
  role: Role;
  isStaff: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshClaims: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function staffRole(role: Role) {
  return role === "admin" || role === "subadmin";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthState["status"]>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<Role>("user");

  useEffect(() => {
    if (isDemoMode) {
      setUser({ uid: DEMO_UID, email: "alex@example.com", displayName: "Alex Morgan", emailVerified: true });
      setRole("admin");
      setStatus("signed_in");
      return;
    }
    let unsub = () => {};
    let cancelled = false;
    (async () => {
      const [{ onIdTokenChanged }, { firebaseAuth }] = await Promise.all([import("firebase/auth"), import("./client")]);
      if (cancelled) return;
      unsub = onIdTokenChanged(firebaseAuth(), async (u) => {
        if (!u) {
          setUser(null);
          setRole("user");
          setStatus("signed_out");
          return;
        }
        const token = await u.getIdTokenResult();
        const claim = token.claims["role"];
        setRole(claim === "admin" || claim === "subadmin" ? claim : "user");
        setUser({ uid: u.uid, email: u.email ?? "", displayName: u.displayName ?? "", emailVerified: u.emailVerified });
        setStatus("signed_in");
      });
    })().catch(() => setStatus("signed_out"));
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  const signOut = useCallback(async () => {
    if (isDemoMode) return;
    logActivity("logout");
    const [{ signOut: fbSignOut }, { firebaseAuth }] = await Promise.all([import("firebase/auth"), import("./client")]);
    await fbSignOut(firebaseAuth());
  }, []);

  const refreshClaims = useCallback(async () => {
    if (isDemoMode) return;
    const { firebaseAuth } = await import("./client");
    await firebaseAuth().currentUser?.getIdToken(true);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ status, demo: isDemoMode, user, role, isStaff: staffRole(role), isAdmin: role === "admin", signOut, refreshClaims }),
    [status, user, role, signOut, refreshClaims],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/** After sign-in: log the login server-side (IP + device) and pick the landing page by role. */
export async function afterSignIn(): Promise<"/admin" | "/dashboard"> {
  logActivity("login");
  const { firebaseAuth } = await import("./client");
  const token = await firebaseAuth().currentUser?.getIdTokenResult();
  const r = token?.claims["role"];
  return r === "admin" || r === "subadmin" ? "/admin" : "/dashboard";
}
