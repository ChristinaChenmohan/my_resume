export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="font-display text-2xl italic text-gold">
          C<span className="not-italic">.</span>
        </p>
        <p className="label-caps text-muted-foreground">Chen Mohan · Christina · 2026</p>
      </div>
    </footer>
  );
}
