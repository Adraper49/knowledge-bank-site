// BEGIN FILE: C:\KB\Web\knowledge-bank-site\src\app\layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knowledge Bank",
  description: "Your AI operating system for engines, apps, and universes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
// END FILE
