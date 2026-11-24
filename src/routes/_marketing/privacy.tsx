import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/marketing/LegalPage";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_marketing/privacy")({
  head: () => pageMeta("Privacy policy", "How PaymentHouse collects, uses and protects your personal data."),
  component: () => (
    <LegalPage title="Privacy Policy" updated="November 2026">
      <p>This policy explains what personal data PaymentHouse collects and how we use it. This is template text — have it reviewed by a qualified lawyer before launch.</p>
      <h2>Information we collect</h2>
      <p>Account details (name, email, phone, country), identity documents you submit for verification, transaction records, and security data such as login time, IP address and device.</p>
      <h2>How we use it</h2>
      <p>To operate your account, process transactions, verify identity, prevent fraud, meet legal obligations and provide support.</p>
      <h2>Sharing</h2>
      <p>We share data only with service providers that help us run PaymentHouse, and with authorities where required by law. We never sell your personal data.</p>
      <h2>Security & retention</h2>
      <p>Data is encrypted in transit and at rest. We keep records for as long as required by financial regulations.</p>
      <h2>Your rights</h2>
      <p>You can request access, correction or deletion of your data by emailing privacy@paymenthouse.com.</p>
    </LegalPage>
  ),
});
