import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/marketing/LegalPage";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_marketing/terms")({
  head: () => pageMeta("Terms of service", "The terms that govern your use of PaymentHouse."),
  component: () => (
    <LegalPage title="Terms of Service" updated="November 2026">
      <p>These Terms govern your access to and use of PaymentHouse. By creating an account you agree to them. This is template text — have it reviewed by a qualified lawyer before launch.</p>
      <h2>1. Eligibility</h2>
      <p>You must be at least 18 years old and legally able to enter contracts in your jurisdiction. We may require identity verification before enabling certain features.</p>
      <h2>2. Your account</h2>
      <p>You are responsible for keeping your login details secure and for all activity on your account. Notify us immediately of any unauthorized use.</p>
      <h2>3. Deposits, transfers and withdrawals</h2>
      <p>Transactions are subject to review, network confirmations and applicable limits. Crypto sent to an incorrect address or network may be unrecoverable.</p>
      <h2>4. Fees</h2>
      <p>Applicable fees are shown before you confirm each transaction and on our Pricing page.</p>
      <h2>5. Risk</h2>
      <p>Digital assets are volatile. You may lose some or all of your funds. PaymentHouse does not provide investment advice.</p>
      <h2>6. Suspension & termination</h2>
      <p>We may suspend or restrict accounts to comply with law, prevent fraud, or protect customers.</p>
      <h2>7. Contact</h2>
      <p>Questions about these Terms: legal@paymenthouse.com.</p>
    </LegalPage>
  ),
});
