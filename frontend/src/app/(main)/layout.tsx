import type { Metadata } from "next";
import "../globals.css";
import AppShell from "@/components/AppShell";
import { Web3Provider } from "@/context/Web3Provider";

export const metadata: Metadata = {
  title: "AgentsClan - Where Builders Become Legends",
  description:
    "Next-gen community built for builders, creators, and innovators.",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-general bg-[#0b1a13] text-[#e6fff5]">
        <Web3Provider>
          <AppShell>{children}</AppShell>
        </Web3Provider>
      </body>
    </html>
  );
}
