import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  Building2,
  CheckCircle2,
  FileLock2,
  Headphones,
  KeyRound,
  LineChart,
  Lock,
  Send,
  ShieldCheck,
  Snowflake,
  Star,
  UserPlus,
  Wallet,
} from "lucide-react";
import heroImg from "@/assets/hero-dashboard.jpg";
import { Button } from "@/components/ui/button";
import { PriceTicker } from "@/components/marketing/PriceTicker";
import { SectionHeading } from "@/components/marketing/PageHeader";
import { FaqList, FAQS } from "@/components/marketing/FaqList";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { CoinAvatar } from "@/components/common/CoinAvatar";
import { Reveal } from "@/components/common/Reveal";
import { COINS } from "@/lib/coins";

export const Route = createFileRoute("/_marketing/")({
  head: () => ({
    meta: [
      { title: "PaymentHouse — Invest, Send and Receive Crypto with Confidence" },
      {
        name: "description",
        content:
          "Deposit, send, withdraw and track BTC, ETH, USDT and more. US bank transfers, 24/7 support and bank-grade security.",
      },
      { property: "og:title", content: "PaymentHouse — Invest, Send and Receive Crypto" },
      {
        property: "og:description",
        content: "A secure crypto investment and payments platform with US bank transfers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const FEATURES = [
  { icon: ArrowDownToLine, title: "Deposit", text: "Fund your account with 8 major coins or a US bank transfer." },
  { icon: Send, title: "Send", text: "Instant, free transfers to any PaymentHouse user — or any external wallet." },
  { icon: ArrowUpFromLine, title: "Withdraw", text: "Cash out to your own wallet or straight to your US bank account." },
  { icon: Building2, title: "US bank transfers", text: "ACH and wire support with clear instructions and reference codes." },
  { icon: LineChart, title: "Portfolio tracking", text: "Live USD value, allocation and history for every asset you hold." },
  { icon: Headphones, title: "24/7 support", text: "Real people ready to help, any time of day, in your dashboard." },
];

const STEPS = [
  { icon: UserPlus, title: "Create your account", text: "Sign up in under two minutes and verify your email." },
  { icon: Wallet, title: "Fund your wallet", text: "Deposit crypto or send a US bank transfer to your account." },
  { icon: Send, title: "Invest, send, withdraw", text: "Track your portfolio and move money whenever you want." },
];

const SECURITY = [
  { icon: KeyRound, title: "Two-factor authentication", text: "Protect sign-ins and withdrawals with a second step." },
  { icon: Snowflake, title: "Cold storage", text: "The majority of customer funds are held offline." },
  { icon: Lock, title: "End-to-end encryption", text: "Data encrypted in transit and at rest." },
  { icon: FileLock2, title: "Audit logs", text: "Every login and account change is recorded and tamper-proof." },
];

const STATS = [
  { value: "250K+", label: "Registered users" },
  { value: "$4.2B", label: "Volume processed" },
  { value: "120+", label: "Countries served" },
  { value: "99.99%", label: "Platform uptime" },
];

const TESTIMONIALS = [
  {
    quote: "Withdrawing to my bank used to take a week elsewhere. With PaymentHouse it landed in two days, with updates all the way.",
    name: "Daniel M.",
    role: "Freelance developer, Texas",
  },
  {
    quote: "I pay my overseas team in USDT every month. Sending is instant and the fees are clear before I confirm.",
    name: "Amara O.",
    role: "Agency founder",
  },
  {
    quote: "The dashboard is clean and the support team actually answers. Exactly what I wanted from a crypto platform.",
    name: "Sophie L.",
    role: "Long-term investor",
  },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div className="container-page relative grid items-center gap-14 pb-20 pt-16 lg:grid-cols-[1fr_1.15fr] lg:pb-28 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-border bg-navy-foreground/5 px-3 py-1 text-xs font-medium text-navy-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Trusted by 250,000+ customers
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy-foreground sm:text-5xl lg:text-6xl">
              Invest, Send and Receive Crypto with{" "}
              <span className="text-gradient-primary">Confidence</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-muted">
              One secure account for Bitcoin, Ethereum, stablecoins and US dollars. Deposit, send
              to anyone, withdraw to your bank and watch your portfolio grow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/register">
                  Get Started — it's free <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline-light" size="xl">
                <Link to="/services">Explore products</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-muted">
              {["No deposit fees", "US bank withdrawals", "2FA protected"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" /> {t}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/20 blur-3xl" />
            <img
              src={heroImg}
              alt="PaymentHouse dashboard showing portfolio balance, chart, assets and recent transactions"
              width={1400}
              height={966}
              className="relative w-full rounded-2xl shadow-elevated"
            />
          </motion.div>
        </div>
        <PriceTicker />
      </section>

      {/* FEATURES */}
      <section className="bg-background py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Everything in one place"
            title="A complete crypto account"
            description="All the tools you need to grow and move digital money — without the complexity."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="group h-full rounded-2xl border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionHeading eyebrow="How it works" title="Up and running in three steps" />
          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-border md:block" />
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1} className="relative text-center">
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <s.icon className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-navy text-[11px] font-bold text-navy-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-muted-foreground">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COINS */}
      <section className="bg-background py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Supported coins"
            title="The assets you actually use"
            description="Deposit and withdraw the most liquid coins across their most popular networks."
          />
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {COINS.map((c) => (
              <div key={c.symbol} className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card">
                <CoinAvatar symbol={c.symbol} className="h-11 w-11" />
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.symbol}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/coins">
                View networks & minimums <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="relative overflow-hidden bg-navy py-24">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="container-page relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-glow">Security & trust</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-foreground md:text-4xl">
              Built like a bank. Designed for crypto.
            </h2>
            <p className="mt-4 text-lg text-navy-muted">
              Every balance change is recorded, every admin action is logged, and your funds never
              move without a verified request.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-8">
              <Link to="/security">
                How we protect you <ShieldCheck />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {SECURITY.map((s) => (
              <div key={s.title} className="rounded-2xl border border-navy-border bg-navy-elevated p-6">
                <s.icon className="h-6 w-6 text-primary-glow" />
                <h3 className="mt-4 font-semibold text-navy-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm text-navy-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gradient-cta py-14">
        <div className="container-page grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-primary-foreground/75">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Customers" title="Loved by people who move money" />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-2xl border bg-card p-7 shadow-card">
                  <div className="flex gap-0.5 text-warning" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed">“{t.quote}”</blockquote>
                  <figcaption className="mt-6">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title="Questions, answered"
              description="Can't find what you're looking for? Our support team is available 24/7."
            />
            <Button asChild variant="outline" className="mt-6">
              <Link to="/faq">See all questions</Link>
            </Button>
          </div>
          <FaqList items={FAQS.slice(0, 5)} />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
