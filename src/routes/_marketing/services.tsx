import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowRight, ArrowUpFromLine, Building2, Check, LineChart, Send, Users } from "lucide-react";
import { PageHeader } from "@/components/marketing/PageHeader";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_marketing/services")({
  head: () => pageMeta("Products & services", "Crypto deposits, instant transfers, wallet and US bank withdrawals, and portfolio tracking."),
  component: ServicesPage,
});

const SERVICES = [
  {
    icon: ArrowDownToLine,
    title: "Crypto & bank deposits",
    text: "Get a dedicated address for every coin and network, with a QR code and clear minimums. Or fund with ACH or wire from any US bank.",
    points: ["8 coins, 12+ networks", "QR codes & copy-to-clipboard", "ACH and wire instructions"],
  },
  {
    icon: Send,
    title: "Send to anyone",
    text: "Pay another PaymentHouse user instantly by email, or send to any external wallet address.",
    points: ["Free internal transfers", "Fee shown before you confirm", "PIN / 2FA protection"],
  },
  {
    icon: ArrowUpFromLine,
    title: "Withdraw your way",
    text: "Withdraw to your own crypto wallet or directly to a US checking or savings account.",
    points: ["Saved addresses & banks", "Live status tracking", "Funds held safely while processing"],
  },
  {
    icon: LineChart,
    title: "Portfolio tracking",
    text: "See your total USD value, per-asset balances and allocation, updated with live market prices.",
    points: ["Live CoinGecko pricing", "Allocation chart", "Full history with CSV export"],
  },
  {
    icon: Building2,
    title: "US banking rails",
    text: "Move between crypto and dollars without leaving PaymentHouse, with reference codes that match every transfer.",
    points: ["Routing & account details", "Unique reference codes", "1–3 business day settlement"],
  },
  {
    icon: Users,
    title: "For teams & businesses",
    text: "Pay contractors and partners globally in stablecoins with clear records for every payment.",
    points: ["Bulk-friendly workflows", "Exportable statements", "Dedicated account manager"],
  },
];

function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="Everything you need to move crypto"
        description="Deposit, send, withdraw and track — all from one secure account."
      >
        <Button asChild variant="hero" size="xl">
          <Link to="/register">
            Open an account <ArrowRight />
          </Link>
        </Button>
      </PageHeader>
      <section className="py-24">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {SERVICES.map((s) => (
            <article key={s.title} className="rounded-2xl border bg-card p-8 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-xl font-semibold">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.text}</p>
              <ul className="mt-5 space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" /> {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
