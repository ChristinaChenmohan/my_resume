import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { usePressSpot } from "@/lib/material/use-press-spot";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Christina · Chen Mohan" },
      {
        name: "description",
        content:
          "Get in touch with Chen Mohan (Christina) about collaborations, internships or print work.",
      },
      { property: "og:title", content: "Contact — Christina · Chen Mohan" },
      {
        property: "og:description",
        content: "Collaborations, internships and print work enquiries.",
      },
    ],
  }),
  component: Contact,
});

const channels = [
  { k: "Email", v: "christina.chen@example.com", href: "mailto:christina.chen@example.com" },
  { k: "Instagram", v: "@christina.field", href: "#" },
  { k: "Behance", v: "behance.net/christina", href: "#" },
  { k: "Location", v: "Shanghai, China" },
];

function Contact() {
  const press = usePressSpot(0.04, 220);

  return (
    <PageShell
      eyebrow="Contact"
      title="Let's talk about the work."
      intro="Open to collaborations, internships and print commissions. A short note about the project and its timing is plenty to start."
    >
      <dl className="max-w-2xl border-t border-border">
        {channels.map((c) => (
          <div
            key={c.k}
            {...press}
            className="group flex items-baseline justify-between gap-6 border-b border-border py-6"
          >
            <dt className="label-caps text-muted-foreground">{c.k}</dt>
            <dd className="font-display text-xl transition-colors duration-700 group-hover:text-gold md:text-2xl">
              {c.href ? (
                <a href={c.href} className="transition-colors hover:text-gold">
                  {c.v}
                </a>
              ) : (
                c.v
              )}
            </dd>
          </div>
        ))}
      </dl>
    </PageShell>
  );
}
