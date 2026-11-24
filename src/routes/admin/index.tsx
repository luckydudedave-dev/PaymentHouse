import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, StatCard } from "@/components/app/ui";
import { useRequests, useUsers } from "@/lib/data/hooks";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/admin/")({
  head: () => pageMeta("Admin console", "PaymentHouse platform overview for staff."),
  component: AdminOverview,
});

function AdminOverview() {
  const users = useUsers();
  const deps = useRequests("deposit");
  const wds = useRequests("withdrawal");
  const pending = (l?: { status: string }[]) => (l ?? []).filter((r) => r.status === "pending").length;
  return (
    <>
      <PageTitle title="Admin overview" description="Platform totals and requests waiting for review." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Users" value={users.loading ? "…" : (users.data?.length ?? 0)} />
        <StatCard label="Pending deposits" value={deps.loading ? "…" : pending(deps.data)} />
        <StatCard label="Pending withdrawals" value={wds.loading ? "…" : pending(wds.data)} />
      </div>
    </>
  );
}
