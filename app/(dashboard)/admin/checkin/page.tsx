import { AdminScannerClient } from "./AdminScannerClient";
import { PokemonCard } from "@/components/pokemon/PokemonCard";

export default function CheckinPage() {
  return <PokemonCard title="QR Check-In Scanner" eyebrow="Mobile-first scan station"><AdminScannerClient /></PokemonCard>;
}
