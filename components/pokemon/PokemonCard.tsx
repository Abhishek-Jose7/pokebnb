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
    <section className={cn("holo-card rounded-lg border border-[#2a4a6a] bg-[#1e3245]/95 p-5 text-white shadow-card backdrop-blur", className)}>
      {eyebrow ? <p className="mb-2 font-mono text-xs uppercase tracking-widest text-poke-yellow">{eyebrow}</p> : null}
      {title ? <h2 className="mb-4 font-display text-base leading-8 text-white sm:text-lg">{title}</h2> : null}
      {children}
    </section>
  );
}
