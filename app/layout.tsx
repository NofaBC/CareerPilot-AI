import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareerPilot AI™ – Autonomous Job Hunt Agent",
  description: "Autonomous Job Hunt Agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen text-slate-100 antialiased bg-gradient-radial from-slate-900 via-slate-950 to-slate-950`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
