import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { usePressSpot } from "@/lib/material/use-press-spot";

export const Route = createFileRoute("/competition")({
  head: () => ({
    meta: [
      { title: "Competition Experience — Christina · Chen Mohan" },
      {
        name: "description",
        content:
          "Design competitions Christina has entered, the results, and what each deadline taught her.",
      },
      { property: "og:title", content: "Competition Experience — Christina · Chen Mohan" },
      {
        property: "og:description",
        content: "Competitions entered, results earned, lessons kept.",
      },
    ],
  }),
  component: Competition,
});

const entries = [
  {
    year: "2025",
    name: "National Student Poster Biennale",
    result: "Shortlisted",
    note: "A three-poster set on light pollution; the jury pushed me on legibility at distance.",
  },
  {
    year: "2025",
    name: "Young Editorial Design Award",
    result: "Second prize",
    note: "The Field Notes volume, judged on paper choice and sequencing as much as layout.",
  },
  {
    year: "2024",
    name: "City Exhibition Concept Challenge",
    result: "Finalist",
    note: "Team of three, ten days, one sightline. Learned to defend a simple idea out loud.",
  },
  {
    year: "2024",
    name: "Campus Brand Identity Cup",
    result: "First prize",
    note: "My first competition. Won on system thinking rather than on any single artwork.",
  },
];

function Competition() {
  const press = usePressSpot(0.04, 220);

  return (
    <PageShell
      eyebrow="Competition Experience"
      title="Deadlines that taught me the most."
      intro="Competitions are where the work meets other people's judgement. These are the ones worth recording."
    >
      <ul className="border-t border-border">
        {entries.map((e) => (
          <li key={e.name} {...press} className="group border-b border-border py-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="font-display text-2xl transition-colors duration-700 group-hover:text-gold md:text-3xl">
                {e.name}
              </h3>
              <div className="flex items-baseline gap-6">
                <span className="label-caps text-gold">{e.result}</span>
                <span className="label-caps text-muted-foreground">{e.year}</span>
              </div>
            </div>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{e.note}</p>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
