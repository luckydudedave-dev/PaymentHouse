/**
 * Realtime Firestore subscription hook. Firebase is imported inside the effect (client only).
 * In preview mode (no Firebase config) it returns the sample data instead.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { Firestore } from "firebase/firestore";
import { isDemoMode } from "@/lib/firebase/config";
import { friendlyFirebaseError } from "@/lib/firebase/errors";

type FsModule = typeof import("firebase/firestore");
export type Subscribe<T> = (fs: FsModule, db: Firestore, emit: (v: T) => void, fail: (e: unknown) => void) => () => void;
export type Live<T> = { data: T | undefined; loading: boolean; error: string | null };

export function useLive<T>(key: string | null, subscribe: Subscribe<T>, demo: () => T): Live<T> {
  const subRef = useRef(subscribe);
  subRef.current = subscribe;
  const demoData = useMemo(() => (isDemoMode && key ? demo() : undefined), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const [state, setState] = useState<{ key: string | null; data?: T; error?: string }>({ key: null });

  useEffect(() => {
    if (!key || isDemoMode) return;
    let unsub = () => {};
    let cancelled = false;
    (async () => {
      const [fs, { firestore }] = await Promise.all([import("firebase/firestore"), import("@/lib/firebase/client")]);
      if (cancelled) return;
      unsub = subRef.current(
        fs,
        firestore(),
        (data) => setState({ key, data }),
        (e) => setState({ key, error: friendlyFirebaseError(e) }),
      );
    })().catch((e) => setState({ key, error: friendlyFirebaseError(e) }));
    return () => {
      cancelled = true;
      unsub();
    };
  }, [key]);

  if (!key) return { data: undefined, loading: false, error: null };
  if (isDemoMode) return { data: demoData, loading: false, error: null };
  if (state.key !== key) return { data: undefined, loading: true, error: null };
  return { data: state.data, loading: false, error: state.error ?? null };
}

/** Converts Firestore Timestamps (anything with toMillis) to epoch millis, recursively. */
export function plain<T>(id: string, raw: Record<string, unknown>): T {
  const conv = (v: unknown): unknown => {
    if (v && typeof v === "object") {
      if ("toMillis" in v && typeof (v as { toMillis: unknown }).toMillis === "function") return (v as { toMillis: () => number }).toMillis();
      if (Array.isArray(v)) return v.map(conv);
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, conv(x)]));
    }
    return v;
  };
  return { id, ...(conv(raw) as object) } as T;
}
