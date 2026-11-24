import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/marketing/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_marketing/pricing")({
  head: () => pageMeta("Pricing & fees", "Transparent pricing: free deposits, free internal transfers and low withdrawal fees."),
  component: PricingPage,
});

const TIERS = [
  {
    name: "Standard",
    price: "Free",
    desc: "For individuals getting started.",
    features: ["Crypto & bank deposits", "Free internal transfers", "$10,000 daily withdrawal limit", "Email support"],
  },
  {
    name: "Pro",
    price: "Free",
    desc: "Verified accounts with higher limits.",
    features: ["Everything in Standard", "$100,000 daily withdrawal limit", "Priority withdrawals", "24/7 live chat"],
    featured: true,
  },
  {
    name: "Business",
    price: "Custom",
    desc: "For companies moving volume.",
    features: ["Everything in Pro", "Custom limits", "Dedicated account manager", "Volume-based fees"],
  },
];

const FEES = [
  ["Crypto deposit", "Free", "Free"],
  ["US bank deposit (ACH / Wire)", "Free", "Free"],
  ["Send to PaymentHouse user", "Free", "Instant"],
  ["Send to external wallet", "Network fee", "~10–30 min"],
  ["Crypto withdrawal", "0.5% (min. network fee)", "~30 min"],
  ["US bank withdrawal (ACH)", "$2.00", "1–3 business days"],
  ["US bank withdrawal (Wire)", "$15.00", "Same / next day"],
];

function PricingPage() {
  return (
    <>
      <PageHeader eyebrow="Pricing" title="Simple, transparent fees" description="No monthly fees. No hidden spreads. You always see the exact fee before you confirm." />
      <section className="py-24">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-8 shadow-card",
                t.featured && "border-primary shadow-elevated ring-1 ring-primary",
              )}
            >
              {t.featured && <Badge className="absolute -top-3 left-8">Most popular</Badge>}
              <h2 className="text-lg font-semibold">{t.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <p className="mt-6 text-4xl font-extrabold tracking-tight">{t.price}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8" size="lg" variant={t.featured ? "hero" : "outline"}>
                <Link to={t.price === "Custom" ? "/contact" : "/register"}>
                  {t.price === "Custom" ? "Contact sales" : "Get started"}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Fee schedule" title="What each action costs" />
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border bg-card shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-6 py-4">Action</th>
                  <th scope="col" className="px-6 py-4">Fee</th>
                  <th scope="col" className="hidden px-6 py-4 sm:table-cell">Typical time</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {FEES.map(([a, f, t]) => (
                  <tr key={a}>
                    <td className="px-6 py-4 font-medium">{a}</td>
                    <td className="px-6 py-4">{f}</td>
                    <td className="hidden px-6 py-4 text-muted-foreground sm:table-cell">{t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
