import { createFileRoute } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import { PageShell } from "@/components/PageShell";
import { useMaterial } from "@/lib/material/material-context";

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
      <CourseNetwork />
    </PageShell>
  );
}

/**
 * The courses are drawn as a knowledge network carved into the material
 * sheet: a continuous groove spine with chain links between raised
 * medallion nodes. Hovering a node slowly bulges the material around it.
 */
function CourseNetwork() {
  const material = useMaterial();

  const pressNode = (strength: number) => (e: MouseEvent<HTMLLIElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    // Press centred on the medallion (56px wide → centre at +28px).
    material.pressAt(r.left + 28, r.top + 28, 230, strength);
  };

  return (
    <div className="relative">
      {/* Continuous groove spine carved into the sheet. */}
      <div aria-hidden className="groove-line absolute bottom-4 left-[27px] top-4" />

      <ol className="relative">
        {courses.map((course, i) => (
          <li
            key={course.title}
            onMouseEnter={pressNode(0.055)}
            onMouseLeave={pressNode(0)}
            className="group relative pb-16 last:pb-0"
          >
            <div className="relative flex items-start gap-6 md:gap-10">
              {/* Raised medallion node. */}
              <div className="relative z-[1] flex size-14 shrink-0 items-center justify-center rounded-full">
                <span className="node-medallion size-full">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Short groove branching from the spine into the entry. */}
              <div
                aria-hidden
                className="groove-line-h absolute left-14 top-7 w-8 opacity-60 transition-opacity duration-1000 group-hover:opacity-100"
              />

              <div className="pt-2 md:pt-3">
                <p className="label-caps text-muted-foreground">{course.term}</p>
                <h3 className="text-engraved mt-2 font-display text-2xl transition-colors duration-700 group-hover:text-gold md:text-3xl">
                  {course.title}
                </h3>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
                  {course.note}
                </p>
              </div>
            </div>

            {/* Chain links bridging the gap to the next node. */}
            {i < courses.length - 1 && (
              <div aria-hidden className="absolute bottom-0 left-0 h-16 w-14">
                <svg viewBox="0 0 56 64" className="size-full" fill="none">
                  <g className="chain-link">
                    <rect
                      x="18"
                      y="5"
                      width="20"
                      height="13"
                      rx="6.5"
                      transform="rotate(45 28 11.5)"
                    />
                    <rect
                      x="18"
                      y="29"
                      width="20"
                      height="13"
                      rx="6.5"
                      transform="rotate(45 28 35.5)"
                    />
                  </g>
                </svg>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
