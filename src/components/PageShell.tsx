import type { ReactNode } from "react";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1100px] px-6 py-20 md:px-10 md:py-28">
        <p className="label-caps text-gold">{eyebrow}</p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] md:text-7xl">{title}</h1>
        <div className="rule-diamond mt-8" />
        {intro && (
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
        )}
        <div className="mt-16">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
