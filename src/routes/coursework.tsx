import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/coursework")({
  head: () => ({
    meta: [
      { title: "Coursework — Christina · Chen Mohan" },
      {
        name: "description",
        content:
          "Studio courses, briefs and studies from Christina's design education, with what each one taught her.",
      },
      { property: "og:title", content: "Coursework — Christina · Chen Mohan" },
      {
        property: "og:description",
        content: "Studio courses and briefs from Christina's design education.",
      },
    ],
  }),
  component: Coursework,
});

const courses = [
  {
    term: "2023 · Autumn",
    title: "Typographic Systems",
    note: "Built a modular grid for a 96-page journal; learned that hierarchy is mostly restraint.",
  },
  {
    term: "2024 · Spring",
    title: "Material & Light Studies",
    note: "Photographic studies of paper, linen and glass under changing daylight.",
  },
  {
    term: "2024 · Autumn",
    title: "Spatial Narrative",
    note: "A small exhibition route designed around a single sightline.",
  },
  {
    term: "2025 · Spring",
    title: "Brand & Editorial Identity",
    note: "Complete identity for a fictional botanical archive, from mark to print system.",
  },
  {
    term: "2025 · Autumn",
    title: "Interaction Fundamentals",
    note: "Prototyping motion as a way of guiding attention rather than decorating it.",
  },
];

function Coursework() {
  return (
    <PageShell
      eyebrow="Coursework"
      title="Studio work, term by term."
      intro="Each course is listed with the brief and the one lesson that stayed with me afterwards."
    >
      <ol className="border-t border-border">
        {courses.map((c, i) => (
          <li
            key={c.title}
            className="group grid gap-3 border-b border-border py-8 md:grid-cols-[6rem_14rem_1fr] md:items-baseline md:gap-8"
          >
            <span className="label-caps text-gold">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="label-caps text-muted-foreground">{c.term}</p>
              <h3 className="mt-2 font-display text-2xl transition-colors group-hover:text-gold">
                {c.title}
              </h3>
            </div>
            <p className="leading-relaxed text-muted-foreground">{c.note}</p>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
