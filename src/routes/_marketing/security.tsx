import { createFileRoute } from "@tanstack/react-router";
import { Eye, FileLock2, Fingerprint, KeyRound, Lock, ServerCog, ShieldCheck, Snowflake } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/marketing/PageHeader";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_marketing/security")({
  head: () => pageMeta("Security", "How PaymentHouse protects your funds: 2FA, cold storage, encryption, immutable ledgers and audit logs."),
  component: SecurityPage,
});

const ITEMS = [
  { icon: KeyRound, title: "Two-factor authentication", text: "Add a second step to sign-ins and money movements so a stolen password is never enough." },
  { icon: Snowflake, title: "Cold storage", text: "The majority of customer assets are kept offline in geographically distributed vaults." },
  { icon: Lock, title: "Encryption everywhere", text: "TLS in transit and AES-256 at rest for personal data and documents." },
  { icon: FileLock2, title: "Immutable ledger", text: "Every balance change is written to an append-only ledger that cannot be edited or deleted." },
  { icon: Eye, title: "Audit logs", text: "Every login (time, IP, device) and every staff action is recorded with before/after values." },
  { icon: ServerCog, title: "Server-side controls", text: "Balances can only change through verified server processes — never from a browser." },
  { icon: Fingerprint, title: "Identity verification", text: "KYC checks keep bad actors out and unlock higher limits for verified customers." },
  { icon: ShieldCheck, title: "Withdrawal review", text: "Funds are held safely while withdrawals are reviewed and refunded instantly if rejected." },
];

function SecurityPage() {
  return (
    <>
      <PageHeader eyebrow="Security" title="Your money, protected at every layer" description="We combine proven banking controls with modern crypto custody so you can transact with confidence." />
      <section className="py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Our safeguards" title="Defense in depth" />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ITEMS.map((i) => (
              <div key={i.title} className="rounded-2xl border bg-card p-6 shadow-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <i.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{i.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface py-20">
        <div className="container-page max-w-3xl text-center">
          <h2 className="text-2xl font-bold">Found a vulnerability?</h2>
          <p className="mt-3 text-muted-foreground">
            We welcome responsible disclosure. Email{" "}
            <a className="font-medium text-primary underline-offset-4 hover:underline" href="mailto:security@paymenthouse.com">
              security@paymenthouse.com
            </a>{" "}
            and our security team will respond within 24 hours.
          </p>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
