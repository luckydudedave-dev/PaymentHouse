
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/services", label: "Products" },
  { to: "/coins", label: "Coins" },
  { to: "/pricing", label: "Pricing" },
  { to: "/security", label: "Security" },
  { to: "/contact", label: "Support" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const auth = useAuth();

  // Determine the correct dashboard route.
  const isAdmin =
    auth.role === "admin" || auth.role === "subadmin";

  const dashboardPath = isAdmin ? "/admin" : "/dashboard";

  // Determine the correct dashboard button label.
  const dashboardLabel = isAdmin
    ? "Admin Dashboard"
    : "Dashboard";

  // Check whether the visitor is logged in.
  const isLoggedIn = auth.status === "signed_in";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors",
        scrolled
          ? "border-navy-border bg-navy/95 backdrop-blur"
          : "border-transparent bg-navy",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6">

        {/* Website logo */}
        <Link
          to="/"
          aria-label="PaymentHouse home"
          onClick={() => setOpen(false)}
        >
          <Logo tone="light" />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-navy-muted transition-colors hover:text-navy-foreground"
              activeProps={{
                className: "text-navy-foreground",
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Desktop authentication buttons */}
        <div className="hidden items-center gap-2 lg:flex">
          {isLoggedIn ? (
            <Button asChild variant="hero">
              <Link to={dashboardPath}>
                {dashboardLabel}
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost-light">
                <Link to="/login">
                  Log in
                </Link>
              </Button>

              <Button asChild variant="hero">
                <Link to="/register">
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {open && (
        <div className="border-t border-navy-border bg-navy lg:hidden">
          <nav
            aria-label="Mobile"
            className="container-page flex flex-col gap-1 py-4"
          >
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-navy-muted hover:bg-navy-elevated hover:text-navy-foreground"
              >
                {n.label}
              </Link>
            ))}

            {/* Logged-in users see their dashboard button */}
            {isLoggedIn ? (
              <div className="mt-3">
                <Button
                  asChild
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  <Link
                    to={dashboardPath}
                    onClick={() => setOpen(false)}
                  >
                    {dashboardLabel}
                  </Link>
                </Button>
              </div>
            ) : (
              /* Logged-out visitors see Login and Get Started */
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  asChild
                  variant="outline-light"
                  size="lg"
                >
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                  >
                    Log in
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="hero"
                  size="lg"
                >
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                  >
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
