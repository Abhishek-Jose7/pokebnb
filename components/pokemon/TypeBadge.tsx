import { cn } from "@/lib/utils/cn";

const typeStyles: Record<string, string> = {
  "AI/ML": "bg-purple-600 text-white",
  Web3: "bg-yellow-400 text-slate-950",
  HealthTech: "bg-pink-400 text-slate-950",
  FinTech: "bg-slate-400 text-slate-950",
  EdTech: "bg-green-500 text-white",
  IoT: "bg-sky-500 text-white",
  Cybersecurity: "bg-zinc-800 text-white",
  Sustainability: "bg-lime-500 text-slate-950",
};

const labels: Record<string, string> = {
  "AI/ML": "Dragon",
  Web3: "Electric",
  HealthTech: "Fairy",
  FinTech: "Steel",
  EdTech: "Grass",
  IoT: "Water",
  Cybersecurity: "Dark",
  Sustainability: "Bug",
};

export function TypeBadge({ domain, className }: { domain: string | null | undefined; className?: string }) {
  const key = domain ?? "General";
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase", typeStyles[key] ?? "bg-poke-blue-light text-white", className)}>
      {labels[key] ?? key}
    </span>
  );
}
