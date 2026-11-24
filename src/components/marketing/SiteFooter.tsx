import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

const COLUMNS = [
  {
    title: "Products",
    links: [
      { to: "/services", label: "Services" },
      { to: "/coins", label: "Supported coins" },
      { to: "/pricing", label: "Pricing & fees" },
      { to: "/security", label: "Security" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About us" },
      { to: "/contact", label: "Contact" },
      { to: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/terms", label: "Terms of service" },
      { to: "/privacy", label: "Privacy policy" },
    ],
  },
] as const;

const SOCIAL = [
  { icon: Twitter, label: "X / Twitter", href: "https://x.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
  { icon: Github, label: "GitHub", href: "https://github.com" },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy text-navy-muted">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo tone="light" />
          <p className="mt-4 text-sm leading-relaxed">
            Invest, send and receive crypto with confidence. Built for individuals and businesses
            that need a dependable way to move digital money.
          </p>
          <div className="mt-6 flex gap-2">
            {SOCIAL.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-navy-border text-navy-muted transition-colors hover:text-navy-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-navy-foreground">{col.title}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-navy-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-navy-border">
        <div className="container-page space-y-3 py-8 text-xs leading-relaxed">
          <p>
            <strong className="text-navy-foreground">Risk disclaimer:</strong> Cryptocurrency
            prices are highly volatile and can go down as well as up. You may lose some or all of
            the money you invest. Past performance is not a guide to future results. Only invest
            what you can afford to lose.
          </p>
          <p>© {new Date().getFullYear()} PaymentHouse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
