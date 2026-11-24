import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/marketing/PageHeader";
import { FaqList, FAQS } from "@/components/marketing/FaqList";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_marketing/faq")({
  head: () => pageMeta("FAQ", "Answers to common questions about PaymentHouse deposits, transfers, withdrawals, fees and security."),
  component: FaqPage,
});

const MORE = [
  { q: "Can I withdraw to a US bank account?", a: "Yes. Add your bank name, routing number, account number and account type, and withdraw via ACH or wire. Bank withdrawals require a verified account." },
  { q: "What happens if a withdrawal is rejected?", a: "Funds are held while a withdrawal is reviewed. If it's rejected, the full amount is returned to your balance immediately and you'll get a notification with the reason." },
  { q: "Can I send money to someone without an account?", a: "You can send crypto to any external wallet address. To use free instant transfers, the recipient needs a PaymentHouse account." },
];

function FaqPage() {
  return (
    <>
      <PageHeader eyebrow="Help center" title="Frequently asked questions" description="Everything you need to know about using PaymentHouse." />
      <section className="py-20">
        <div className="container-page max-w-3xl">
          <FaqList items={[...FAQS, ...MORE]} />
          <div className="mt-12 rounded-2xl bg-surface p-8 text-center">
            <h2 className="text-xl font-semibold">Still have questions?</h2>
            <p className="mt-2 text-muted-foreground">Our support team is here 24/7.</p>
            <Button asChild className="mt-5" variant="hero">
              <Link to="/contact">Contact support</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
