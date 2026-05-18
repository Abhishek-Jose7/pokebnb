import { Providers } from "@/components/Providers";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <main className="min-h-screen">{children}</main>
    </Providers>
  );
}
