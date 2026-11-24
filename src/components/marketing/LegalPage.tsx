import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHeader title={title} description={`Last updated ${updated}`} />
      <section className="py-16">
        <article className="container-page max-w-3xl space-y-6 text-[15px] leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground">
          {children}
        </article>
      </section>
    </>
  );
}
