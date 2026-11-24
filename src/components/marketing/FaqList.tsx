import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQS = [
  {
    q: "What is PaymentHouse?",
    a: "PaymentHouse is a crypto investment and payments platform. You can deposit crypto or US dollars, send funds to other users or external wallets, track your portfolio and withdraw to a wallet or US bank account.",
  },
  {
    q: "Which coins are supported?",
    a: "We support BTC, ETH, USDT, USDC, BNB, SOL, XRP and LTC across their most popular networks. See the Supported Coins page for networks and minimums.",
  },
  {
    q: "How long do deposits take?",
    a: "Crypto deposits are credited once they receive enough network confirmations and pass review — usually within 30 minutes. US bank deposits (ACH/Wire) typically arrive in 1–3 business days.",
  },
  {
    q: "What are the fees?",
    a: "Deposits are free. Internal transfers between PaymentHouse users are free. Withdrawals carry a small network or processing fee shown before you confirm. See Pricing for the full table.",
  },
  {
    q: "Is my account secure?",
    a: "Accounts are protected with email verification, optional two-factor authentication, encrypted data, and a full log of every login and account action. The majority of funds are held in cold storage.",
  },
  {
    q: "Do I need to verify my identity?",
    a: "You can explore the platform right after sign-up. Identity verification (KYC) is required before higher limits and bank withdrawals are unlocked.",
  },
];

export function FaqList({ items = FAQS }: { items?: { q: string; a: string }[] }) {
  return (
    <Accordion type="single" collapsible className="divide-y rounded-2xl border bg-card px-6 shadow-card">
      {items.map((f, i) => (
        <AccordionItem key={f.q} value={`item-${i}`} className="border-0">
          <AccordionTrigger className="py-5 text-base font-semibold hover:no-underline">{f.q}</AccordionTrigger>
          <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
