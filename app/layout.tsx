import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: "../public/Pokemon Solid.ttf",
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: "../public/Pokemon Hollow.ttf",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BITNBUILD",
  description: "A game-inspired hackathon experience for builders, designers, and founders.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#cc0000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
