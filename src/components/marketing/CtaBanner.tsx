import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="bg-background py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-cta px-8 py-14 text-center shadow-elevated md:px-16">
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
              Start moving crypto in minutes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
              Open a free account, verify once, and deposit, send or withdraw whenever you need.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="xl" variant="secondary">
                <Link to="/register">
                  Create free account <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline-light">
                <Link to="/contact">Talk to sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
