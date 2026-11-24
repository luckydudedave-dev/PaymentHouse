
import { Outlet, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  CreditCard,
  History,
  LayoutDashboard,
  Settings,
} from "lucide-react";

import {
  AppShell,
  ScreenLoader,
  useGuard,
  type NavItem,
} from "@/components/app/AppShell";

const NAV: NavItem[] = [
  {
    to: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    to: "/dashboard/convert",
    label: "Convert",
    icon: ArrowLeftRight,
  },
  {
    to: "/dashboard/billing",
    label: "Billing",
    icon: CreditCard,
  },
  {
    to: "/dashboard/billing-history",
    label: "Billing History",
    icon: History,
  },
  {
    to: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
];

/** Signed-in user area. Client-only: auth state lives in the browser. */
export const Route = createFileRoute("/dashboard")({
  ssr: false,
  component: DashboardLayout,
});

function DashboardLayout() {
  const allowed = useGuard("user");

  if (!allowed) {
    return <ScreenLoader />;
  }

  return (
    <AppShell items={NAV} area="user">
      <Outlet />
    </AppShell>
  );
}
