import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { isFirebaseConfigured } from "@/lib/firebase/config";

/** Split layout for login / register / reset: form on the left, brand panel on the right. */
export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link to="/" aria-label="PaymentHouse home" className="w-fit">
          <Logo />
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          {!isFirebaseConfigured && (
            <p role="status" className="mt-6 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
              Firebase isn't connected yet, so sign-in is disabled. It will work as soon as the
              Firebase web config is added.
            </p>
          )}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
      <aside className="relative hidden overflow-hidden bg-hero lg:flex lg:flex-col lg:justify-center lg:px-16">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative max-w-md">
          <ShieldCheck className="h-10 w-10 text-primary-glow" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-navy-foreground">
            Your crypto, protected and always within reach.
          </h2>
          <ul className="mt-8 space-y-4 text-navy-muted">
            {[
              "Deposit 8 major coins or US dollars",
              "Free instant transfers between users",
              "Withdraw to your wallet or US bank",
              "Every login and change recorded",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export function FormField({ id, label, error, children, hint }: { id: string; label: string; error?: string | undefined; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        {hint}
      </div>
      {children}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
