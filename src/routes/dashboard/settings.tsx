import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, Panel, KeyValue } from "@/components/app/ui";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAuth } from "@/lib/firebase/auth";
import { useProfile } from "@/lib/data/hooks";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => pageMeta("Settings", "Manage your PaymentHouse profile."),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const { data: p } = useProfile(user?.uid);
  return (
    <>
      <PageTitle title="Settings" description="Your profile and verification status." />
      <Panel title="Profile">
        <KeyValue
          rows={[
            ["Name", p?.name || "—"],
            ["Email", p?.email || user?.email || "—"],
            ["Phone", p?.phone || "—"],
            ["Country", p?.country || "—"],
            ["Account status", <StatusBadge key="s" status={p?.status ?? "pending_verification"} />],
            ["Identity check", <StatusBadge key="k" status={p?.kycStatus ?? "none"} />],
          ]}
        />
      </Panel>
    </>
  );
}
