import type { Metadata } from "next";
import "../globals.css";
import { Web3Provider } from "@/context/Web3Provider";
import DashboardShell from "./DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard – AgentsClan",
  description: "Your AgentsClan dashboard.",
};

export default function DashboardLayout({
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
          <DashboardShell>{children}</DashboardShell>
        </Web3Provider>
      </body>
    </html>
  );
}
