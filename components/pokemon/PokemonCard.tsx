import { cn } from "@/lib/utils/cn";

export function PokemonCard({
  title,
  eyebrow,
  children,
  className,
}: {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("holo-card rounded-lg border border-border bg-card p-5 shadow-card", className)}>
      {eyebrow ? <p className="mb-2 font-mono text-xs uppercase tracking-widest text-poke-yellow">{eyebrow}</p> : null}
      {title ? <h2 className="mb-4 font-display text-sm leading-7 text-white">{title}</h2> : null}
      {children}
    </section>
  );
}
