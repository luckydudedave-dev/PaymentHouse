
import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/lib/firebase/auth";
import { useNotifications, useProfile } from "@/lib/data/hooks";
import { formatDate } from "@/lib/data/format";
import { cn } from "@/lib/utils";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

/** Full-screen loader used while auth state resolves. */
export function ScreenLoader({
  label = "Loading your account…",
}: {
  label?: string;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-surface"
      role="status"
    >
      <div className="flex flex-col items-center gap-4">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

/** Client-side gate. Real enforcement lives in Firestore rules + Cloud Functions. */
export function useGuard(area: "user" | "staff") {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.status === "signed_out") {
      navigate({ to: "/login" });
    } else if (
      auth.status === "signed_in" &&
      area === "staff" &&
      !auth.isStaff
    ) {
      toast.error("That area is for PaymentHouse staff only.");
      navigate({ to: "/dashboard" });
    }
  }, [auth.status, auth.isStaff, area, navigate]);

  return auth.status === "signed_in" && (area === "user" || auth.isStaff);
}

/** Dashboard sidebar shared by desktop and mobile navigation. */
function SideNav({
  items,
  onNavigate,
  area,
}: {
  items: NavItem[];
  onNavigate?: () => void;
  area: "user" | "staff";
}) {
  const auth = useAuth();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* PaymentHouse logo: returns to public homepage on desktop and mobile */}
      <div className="flex h-16 items-center px-5">
        <Link
          to="/"
          onClick={onNavigate}
          aria-label="Go to PaymentHouse homepage"
        >
          <Logo tone="light" />
        </Link>
      </div>

      {area === "staff" && (
        <p className="mx-5 mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-sidebar-accent px-2.5 py-1 text-xs font-semibold text-sidebar-accent-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          {auth.role === "subadmin" ? "Sub-admin" : "Admin"} console
        </p>
      )}

      <nav
        aria-label="Dashboard"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-3"
      >
        {items.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            onClick={onNavigate}
            activeOptions={{ exact: n.exact ?? false }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{
              className:
                "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary",
            }}
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        {area === "user" && auth.isStaff && (
          <Link
            to="/admin"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent"
          >
            <ShieldCheck className="h-4 w-4" />
            Admin console
          </Link>
        )}

        {area === "staff" && (
          <Link
            to="/dashboard"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent"
          >
            <UserRound className="h-4 w-4" />
            My wallet
          </Link>
        )}
      </div>
    </div>
  );
}

/** User notifications dropdown. */
function Notifications({ uid }: { uid: string }) {
  const { data } = useNotifications(uid);
  const unread = (data ?? []).filter((n) => !n.read);

  const markRead = async () => {
    if (!unread.length) return;

    try {
      const [fs, { firestore }] = await Promise.all([
        import("firebase/firestore"),
        import("@/lib/firebase/client"),
      ]);

      const batch = fs.writeBatch(firestore());

      unread.forEach((n) =>
        batch.update(
          fs.doc(firestore(), "notifications", uid, "items", n.id),
          { read: true },
        ),
      );

      await batch.commit();
    } catch {
      /* preview mode / offline: ignore */
    }
  };

  return (
    <Popover onOpenChange={(o) => !o && markRead()}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Notifications${unread.length ? `, ${unread.length} unread` : ""}`}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unread.length > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <p className="border-b px-4 py-3 text-sm font-semibold">
          Notifications
        </p>

        <div className="max-h-80 overflow-y-auto">
          {(data ?? []).length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              You're all caught up.
            </p>
          )}

          {(data ?? []).map((n) => (
            <div
              key={n.id}
              className={cn(
                "border-b px-4 py-3 last:border-0",
                !n.read && "bg-accent/50",
              )}
            >
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-sm text-muted-foreground">{n.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(n.createdAt)}
              </p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Main dashboard application shell. */
export function AppShell({
  items,
  area,
  children,
}: {
  items: NavItem[];
  area: "user" | "staff";
  children: ReactNode;
}) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data: profile } = useProfile(auth.user?.uid);
  const name =
    profile?.name ||
    auth.user?.displayName ||
    auth.user?.email ||
    "Account";

  const logout = async () => {
    await auth.signOut();
    toast.success("Logged out");
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
        <SideNav items={items} area={area} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-0 p-0">
          <SheetTitle className="sr-only">Menu</SheetTitle>

          <SideNav
            items={items}
            area={area}
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        {auth.demo && (
          <p
            role="status"
            className="bg-warning/15 px-4 py-2 text-center text-xs font-medium sm:text-sm"
          >
            Preview mode — you're seeing sample data. Connect Firebase to use
            real accounts and balances.
          </p>
        )}

        {/* Dashboard top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          {auth.user && <Notifications uid={auth.user.uid} />}

          {/* Account dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {name.slice(0, 1).toUpperCase()}
                </span>

                <span className="hidden max-w-40 truncate text-sm sm:inline">
                  {name}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                {auth.user?.email}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={logout} disabled={auth.demo}>
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Dashboard page content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
