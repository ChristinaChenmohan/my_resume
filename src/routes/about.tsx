import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { MaterialBackground } from "@/lib/material/MaterialBackground";
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

/**
 * About — a single flowing page that starts inside the home photograph and
 * melts down into the warm paper material used across the site. The photo
 * fades out via a bottom mask, the title sits directly on the image, and the
 * story is written straight onto the material sheet (no white card).
 */
function About() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <MaterialBackground>
        <SiteNav overlay />

        {/* ── Photo hero: home-style image fading into the material ── */}
        <section className="relative">
          <div
            className="absolute inset-x-0 top-0 h-[88vh] min-h-[560px] [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_97%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_97%)]"
            aria-hidden="true"
          >
            <img
              src={heroField}
              alt=""
              width={1672}
              height={941}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="hero-veil absolute inset-0" />
          </div>

          {/* Title written directly on the photograph. */}
          <div className="relative mx-auto flex min-h-[88vh] max-w-[1600px] items-center px-6 pt-24 md:px-10">
            <div className="ml-auto w-full max-w-2xl">
              <div className="fade-up flex items-center justify-end gap-3">
                <Sparkles className="size-3.5 text-gold-soft" />
                <span className="label-caps text-gold-soft">Welcome to my world!</span>
              </div>
              <h1 className="fade-up mt-5 text-right font-display text-[clamp(4rem,12vw,9rem)] font-light leading-[0.92] tracking-tight text-on-image">
                About
              </h1>
              <div
                className="rule-diamond fade-up ml-auto mt-6 md:mt-8"
                style={{ animationDelay: "120ms" }}
              />
              <p
                className="fade-up mt-8 max-w-md text-right text-base leading-relaxed text-on-image/90 md:text-lg"
                style={{ animationDelay: "220ms" }}
              >
                The story and focus behind the practice — written directly on the page, no
                boxes, no frames.
              </p>
            </div>
          </div>
        </section>

        {/* ── Story written straight onto the paper material ── */}
        <section className="relative px-6 pb-28 pt-16 md:px-10 md:pt-24">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-7 text-lg leading-relaxed text-ink/90 md:text-xl">
              <p className="fade-up text-engraved">
                My name is Chen Mohan — you can call me Christian. I am a university student
                majoring in Artificial Intelligence, equipped with skills in professional coding,
                project architecture and development, and UI design, alongside a broad range of
                other capabilities.
              </p>
              <p className="fade-up text-engraved" style={{ animationDelay: "120ms" }}>
                This space documents the milestones of my personal and professional growth.
                <br />
                I am still on the journey…
              </p>
            </div>

            <div className="groove-line-h fade-up mt-14 max-w-xs" style={{ animationDelay: "200ms" }} />

            <div className="fade-up mt-12" style={{ animationDelay: "280ms" }}>
              <Link
                to="/"
                className="label-caps group inline-flex items-center gap-4 rounded-full border border-gold px-8 py-3.5 text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
              >
                Back home
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <DecorativeBranch className="pointer-events-none mx-auto mt-16 w-24 text-gold/30 md:w-32" />
          </div>
        </section>
      </MaterialBackground>
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
