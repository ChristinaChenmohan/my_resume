import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/coursework", label: "Coursework" },
  { to: "/project", label: "Project" },
  { to: "/competition", label: "Competition Experience" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30"
          : "sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur"
      }
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 md:px-10">
        <Link
          to="/"
          aria-label="Christina — home"
          className="font-display text-3xl italic leading-none text-gold"
        >
          C<span className="not-italic">.</span>
        </Link>

        <ul className="hidden items-center gap-10 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="label-caps text-foreground/80 transition-colors hover:text-gold [&.active]:text-foreground"
                activeOptions={{ exact: l.to === "/" }}
              >
                <span className="relative inline-block pb-1.5">
                  {l.label}
                  <span className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-border/60 bg-background px-6 py-4 lg:hidden">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                onClick={() => setOpen(false)}
                className="label-caps block py-3 text-foreground/80"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
