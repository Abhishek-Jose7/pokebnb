import { QRTeamScanner } from "@/components/judge/QRTeamScanner";
import { TeamSearchBar } from "@/components/judge/TeamSearchBar";
import { PokemonCard } from "@/components/pokemon/PokemonCard";

export default function JudgeScanPage() {
  return <div className="grid gap-5"><PokemonCard title="Scan Team QR"><QRTeamScanner /></PokemonCard><PokemonCard title="Manual Team Search"><TeamSearchBar /></PokemonCard></div>;
}
