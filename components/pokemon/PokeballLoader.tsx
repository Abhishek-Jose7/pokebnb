export function PokeballLoader({ label = "Loading encounter..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm font-bold text-poke-yellow">
      <div className="relative h-10 w-10 animate-spin rounded-full border-4 border-poke-black bg-white">
        <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-poke-red" />
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-poke-black" />
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-poke-black bg-white" />
      </div>
      <span>{label}</span>
    </div>
  );
}
