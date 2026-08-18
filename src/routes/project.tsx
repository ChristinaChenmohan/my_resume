import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { usePressSpot } from "@/lib/material/use-press-spot";

export const Route = createFileRoute("/project")({
  head: () => ({
    meta: [
      { title: "Projects — Christina · Chen Mohan" },
      {
        name: "description",
        content:
          "Self-initiated and studio projects by Christina: editorial systems, exhibition design and photographic series.",
      },
      { property: "og:title", content: "Projects — Christina · Chen Mohan" },
      {
        property: "og:description",
        content: "Editorial systems, exhibition design and photographic series.",
      },
    ],
  }),
  component: Projects,
});

const projects = [
  {
    year: "2025",
    title: "Field Notes",
    kind: "Photographic series",
    body: "Forty frames shot at dusk in a rapeseed field, printed as a soft-bound volume with uncoated paper and gold foil folios.",
  },
  {
    year: "2025",
    title: "Botanical Archive",
    kind: "Identity & editorial",
    body: "A full identity for a fictional seed archive: wordmark, specimen labels, and a catalogue built on a five-column grid.",
  },
  {
    year: "2024",
    title: "One Sightline",
    kind: "Exhibition design",
    body: "A 40 m² room organised around a single corridor view, where each turn reveals exactly one object.",
  },
  {
    year: "2024",
    title: "Slow Interface",
    kind: "Interaction study",
    body: "A reading app prototype exploring how deliberate pacing and typography lower reading anxiety.",
  },
];

function Projects() {
  const press = usePressSpot(0.045, 210);

  return (
    <PageShell
      eyebrow="Project"
      title="Selected projects."
      intro="Four pieces that best describe how I work: research first, then form, then a long edit."
    >
      <div className="grid gap-px bg-border sm:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.title}
            {...press}
            className="group bg-background/70 p-8 transition-colors backdrop-blur-[2px] md:p-10"
          >
            <div className="flex items-baseline justify-between">
              <p className="label-caps text-gold">{p.kind}</p>
              <p className="label-caps text-muted-foreground">{p.year}</p>
            </div>
            <h3 className="mt-6 font-display text-3xl transition-colors group-hover:text-gold md:text-4xl">
              {p.title}
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">{p.body}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
