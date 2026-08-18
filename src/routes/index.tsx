import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import heroField from "@/assets/hero-field.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Christina — Chen Mohan · Design Portfolio" },
      {
        name: "description",
        content:
          "The personal growth journey of Chen Mohan, also known as Christina: coursework, projects and competition experience.",
      },
      { property: "og:title", content: "Christina — Chen Mohan · Design Portfolio" },
      {
        property: "og:description",
        content:
          "The personal growth journey of Chen Mohan, also known as Christina: coursework, projects and competition experience.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <SiteNav overlay />

      <section className="relative h-screen min-h-[680px] w-full">
        <img
          src={heroField}
          alt="A woman in a flowing golden dress running through a field of rapeseed flowers"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="hero-veil absolute inset-0" />

        <div className="relative mx-auto flex h-full max-w-[1600px] items-center px-6 md:px-10">
          <div className="ml-auto w-full max-w-2xl pt-24 md:pt-16">
            <h1 className="fade-up font-display text-[clamp(3.75rem,11vw,10rem)] font-light leading-[0.92] tracking-tight text-on-image">
              Christina
            </h1>

            <div className="rule-diamond fade-up mt-6 md:mt-8" style={{ animationDelay: "120ms" }} />

            <div className="fade-up mt-10" style={{ animationDelay: "220ms" }}>
              <h2 className="font-display text-4xl text-on-image">About</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-on-image/85 md:text-lg">
                This documents the personal growth journey of Chen Mohan—also known as
                Christina—covering coursework, projects and competitions.
              </p>

              <Link
                to="/about"
                className="label-caps group mt-10 inline-flex items-center gap-4 rounded-full border border-on-image/60 px-8 py-4 text-on-image transition-colors hover:border-gold-soft hover:text-gold-soft"
              >
                Read more
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
