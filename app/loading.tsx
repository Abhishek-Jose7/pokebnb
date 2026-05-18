import { PokeballLoader } from "@/components/pokemon/PokeballLoader";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <PokeballLoader />
    </div>
  );
}
