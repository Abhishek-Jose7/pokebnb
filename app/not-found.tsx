import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div className="max-w-xl rounded-lg border border-border bg-card p-8 shadow-card">
        <Image className="mx-auto" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/142.png" alt="" width={120} height={120} />
        <h1 className="mb-4 font-display text-lg leading-8 text-poke-yellow">Unknown route</h1>
        <p className="mb-6 text-slate-200">You entered the Unknown Dungeon. Here, have an Aerodactyl.</p>
        <Link className="font-bold text-poke-yellow underline" href="/">Return to BITNBUILD</Link>
      </div>
    </main>
  );
}
