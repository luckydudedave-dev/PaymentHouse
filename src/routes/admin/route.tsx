import { Outlet, createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { AppShell, ScreenLoader, useGuard, type NavItem } from "@/components/app/AppShell";

const NAV: NavItem[] = [{ to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true }];

/** Staff-only console. Client-only; Firestore rules + Cloud Functions enforce access. */
export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminLayout,
});

function AdminLayout() {
  const allowed = useGuard("staff");
  if (!allowed) return <ScreenLoader label="Checking admin access…" />;
  return (
    <AppShell items={NAV} area="staff">
      <Outlet />
    </AppShell>
  );
}
