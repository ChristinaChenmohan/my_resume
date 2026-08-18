import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import heroField from "@/assets/hero-field.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Christina — Chen Mohan" },
      {
        name: "description",
        content:
          "Chen Mohan (Christina) is a university student majoring in Artificial Intelligence, documenting her personal and professional growth.",
      },
      { property: "og:title", content: "About Christina — Chen Mohan" },
      {
        property: "og:description",
        content: "Welcome to my world. The story and focus behind Christina's practice.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <SiteNav overlay />

      <section className="relative flex min-h-screen items-center justify-center px-6 py-32 md:px-10">
        <img
          src={heroField}
          alt="A woman in a flowing golden dress running through a field of rapeseed flowers"
          width={1672}
          height={941}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-paper/25" />

        <article className="about-card relative mx-auto w-full max-w-[640px] rounded-lg px-8 py-14 text-center md:px-16 md:py-20">
          <div className="fade-up flex items-center justify-center gap-3">
            <Sparkles className="size-3.5 text-gold" />
            <span className="label-caps text-gold">Welcome to my world!</span>
          </div>

          <h1 className="fade-up mt-5 font-display text-7xl font-light text-gold md:text-8xl lg:text-9xl">
            About
          </h1>

          <div className="rule-diamond-center fade-up mx-auto mt-8" style={{ animationDelay: "120ms" }} />

          <div
            className="fade-up mt-10 space-y-6 text-base leading-relaxed text-foreground/85 md:text-lg"
            style={{ animationDelay: "220ms" }}
          >
            <p>
              Welcome to my world! My name is Chen Mohan—you can call me Christian. I am a
              university student majoring in Artificial Intelligence, equipped with skills in
              professional coding, project architecture and development, and UI design, alongside a
              broad range of other capabilities.
            </p>
            <p>
              This space documents the milestones of my personal and professional growth.
              <br />
              I am still on the journey…
            </p>
          </div>

          <div className="fade-up mt-12" style={{ animationDelay: "320ms" }}>
            <Link
              to="/"
              className="label-caps group inline-flex items-center gap-4 rounded-full border border-gold px-8 py-3.5 text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
            >
              Back home
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <DecorativeBranch className="pointer-events-none absolute -right-2 bottom-0 w-28 text-gold/25 md:-right-6 md:w-40" />
        </article>
      </section>
    </div>
  );
}

function DecorativeBranch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M60 240c0-60 20-100 40-140M60 240c-10-50-30-90-50-130M60 220c25-30 45-70 50-110M60 200c-20-25-35-60-40-95M70 160c8-12 18-22 30-28M50 140c-10-12-20-22-32-30M80 120c10-10 22-18 36-22M40 100c-12-10-22-22-30-36"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="92" cy="62" r="2" fill="currentColor" />
      <circle cx="108" cy="92" r="1.5" fill="currentColor" />
      <circle cx="18" cy="74" r="2" fill="currentColor" />
      <circle cx="8" cy="104" r="1.5" fill="currentColor" />
      <circle cx="78" cy="42" r="1.5" fill="currentColor" />
      <circle cx="28" cy="34" r="2" fill="currentColor" />
    </svg>
  );
}
