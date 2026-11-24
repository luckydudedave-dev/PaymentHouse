import { createFileRoute } from "@tanstack/react-router";
import { Globe2, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/marketing/PageHeader";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_marketing/about")({
  head: () => pageMeta("About us", "PaymentHouse makes investing, sending and receiving crypto simple, transparent and secure."),
  component: AboutPage,
});

const VALUES = [
  { icon: ShieldCheck, title: "Security first", text: "Every product decision starts with protecting customer funds and data." },
  { icon: Sparkles, title: "Radical clarity", text: "Fees, statuses and timelines are shown up-front. No surprises." },
  { icon: HeartHandshake, title: "Human support", text: "Real specialists, available around the clock." },
  { icon: Globe2, title: "Built for everyone", text: "From first-time investors to global businesses in 120+ countries." },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About PaymentHouse"
        title="Making digital money feel dependable"
        description="We started PaymentHouse because moving crypto shouldn't feel risky or confusing. Today we help hundreds of thousands of people invest, get paid and send money worldwide."
      />
      <section className="py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <SectionHeading
            align="left"
            eyebrow="Our mission"
            title="One trusted home for your crypto and your dollars"
          />
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              PaymentHouse brings deposits, transfers, withdrawals and portfolio tracking into a
              single, secure account — with US bank rails built in, so getting in and out of
              crypto is as easy as using your bank app.
            </p>
            <p>
              Behind the scenes, every balance change is written to an immutable ledger and every
              account action is logged. That's how we keep the platform transparent for you and
              accountable for us.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionHeading eyebrow="What we value" title="Principles we build by" />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border bg-card p-7 shadow-card">
                <v.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
