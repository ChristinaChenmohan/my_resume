import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Christina — Chen Mohan" },
      {
        name: "description",
        content:
          "Chen Mohan (Christina) is a design student documenting her growth through coursework, projects and competitions.",
      },
      { property: "og:title", content: "About Christina — Chen Mohan" },
      {
        property: "og:description",
        content: "The story, values and focus behind Christina's design practice.",
      },
    ],
  }),
  component: About,
});

const facts = [
  { k: "Name", v: "Chen Mohan (Christina)" },
  { k: "Focus", v: "Visual & spatial design" },
  { k: "Based in", v: "Shanghai, China" },
  { k: "Working since", v: "2022" },
];

function About() {
  return (
    <PageShell
      eyebrow="About"
      title="A quiet record of growing up through design."
      intro="This site documents the personal growth journey of Chen Mohan—also known as Christina. It gathers coursework, self-initiated projects and competition experience into one place, in the order they happened."
    >
      <div className="grid gap-16 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            I care about work that feels unhurried: warm materials, generous white space, and
            typography that carries the tone before a single image loads. Most of what I make starts
            from observation—a field at dusk, the weight of paper, the way people move through a
            room.
          </p>
          <p>
            Design school gave me the vocabulary; competitions gave me the deadlines. Between the
            two, my practice settled into a rhythm of research, sketching, and slow refinement until
            the idea can stand on its own.
          </p>
          <p>
            The pages that follow are honest rather than polished. Some projects worked, some
            didn't, and the notes explain which is which.
          </p>
        </div>

        <dl className="h-fit border-t border-border">
          {facts.map((f) => (
            <div key={f.k} className="flex justify-between gap-6 border-b border-border py-5">
              <dt className="label-caps text-muted-foreground">{f.k}</dt>
              <dd className="text-right font-display text-xl">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </PageShell>
  );
}
